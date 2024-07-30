import React, { useEffect, useState } from 'react'
import { URL } from '../URLConstant';
import './AdminApr.css';
import { confirmAlert } from "react-confirm-alert";
import Modal from "react-responsive-modal";
import _ from 'lodash';
var Loader = require("react-loader");

function ViewTemplate(props) {

  const [file, setFile] = useState();
  const [template, setTemplateDetail] = useState([]);
  const [fileValidation, setFileValidation] = useState([]);
  const [allowModalForComment, setAllowModalForComment] = useState(false);
  const [allowHtmlfile, setAllowHtmlFile] = useState(false);
  const [allowmodalFieldDetail, setAllowmodalFieldDetail] = useState(false);
  const [AlowModalFilDetaVali, setAlowModalFilDetaVali] = useState(false);
  const [allowRadioChecksOpen, setAllowRadioChecksOpen] = useState(false);
  const [fileddata, SetFieldData] = useState({});
  const [allowFiledData, setAllowFiledData] = useState(false);
  const [allowFileData, setAllowFileData] = useState(false);
  const [validation, setvalidation] = useState({});
  const [validationForFilUpDetail, setValidationForFilUpDetail] = useState({});
  const [allowLoader, setAllowloader] = useState(true);
  const [radioChecks, setRadioChecks] = useState([]);
  const [HoldEachRadioJsontoRender, SetHoldEachRadioJsontoRender] = useState({});
  const [radioCheckValidation, setRadioCheckValidation] = useState({});
  const [searchAbleKey, setSearchAbleKey] = useState([]);
  const [allowSearchAbleKeyModal, setAllowSearchAbleKeyModal] = useState(false);
  const [validateSearchAbleKey, setValidateSearchAbleKey] = useState(false);
  // to allow the custom field modal to render..
  const [openModalToCusField, setOpenModalToCusField] = useState(false);
  // to store the template name,to be used in template approve confirm modal.
  const [templateName, setTemplateName] = useState("");
  // template custom fields to be added..
  const [customFields, setcustomFields] = useState([]);


  //-------------------------------->>> 
  const [rejectedAllFields, setRejectedAllFields] = useState({});
  //-------------------------------->>>

  //const [appOrRejTempInput, setAppRejTempInput] = useState({});
  //const [appOrRejFileInput, setAppRejFileInput] = useState({});
  //const [appOrRejRadioInput, setAppRejRadioInput] = useState({});
  //const [appOrRejSearchkeys, setAppOrRejSearchkeys] = useState({});

  const [selectDropdown, setSelectDropdown] = useState([]);

  const [selectDropdownList, setSelectDropdownList] = useState({});

  const [allowmodalForDrpDwn, setAllowmodalForDrpDwn] = useState(false);

  const [slectDropDownName, setSelectDropDownName] = useState("");

  // to store the dynamic row addition data.
  const [dynamcTable, setDynamicTable] = useState([]);

  //to store the list of repeatable tags 
  const [repetAble, setRepeatAbleTags] = useState(0);

  useEffect(() => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "appliaction/json"
      },
      body: JSON.stringify({
        authToken: sessionStorage.getItem("authToken"),
        templateCode: props.location.state.templateCode
      })
    }

    fetch(URL.tempdataForEdit, options)
      .then(response => (response.json()))
      .then(data => {

        if (data.status === "SUCCESS") {
          setTemplateName(data.templateDetails.templateName);
          setTemplateDetail(data.templateinputFields);
          setFileValidation(data.templateFileFields);
          setRadioChecks(data.radioTypeValues);
          setcustomFields(data.customFieldsArray);
          setDynamicTable(data.dynamicTable);
          for (let key in data.selectDropdown) {
            setSelectDropdownList((oldvalue) => ({
              ...oldvalue,
              [Object.keys(data.selectDropdown[key])[0]]: data.selectDropdown[key][Object.keys(data.selectDropdown[key])[0]]
            }))
          }
          let htmlTemplate = atob(data.htmlFile);

          // parsing the HTML to get the count of repetable block..
          let count = 0;
          const parser = new DOMParser();
          const doc = parser.parseFromString(htmlTemplate, 'text/html');
          const repeatTags = doc.querySelectorAll("repeatTag");

          //iterate over <repeatTag> tags and collect the counts..
          for (let tagKey in repeatTags) {
            if (!isNaN(tagKey)) {
              count++;
            }
            setRepeatAbleTags(count);
          }
          let searchableKeyArr = [];
          for (let key in data.searchAbleListKeys) {
            searchableKeyArr.push(data.searchAbleListKeys[key]);
          }
          for (let key in data.selectDropdown) {
            setSelectDropdown(oldValue => [
              ...oldValue,
              Object.keys(data.selectDropdown[key])[0]
            ])
            setRejectedAllFields(oldValue => ({
              ...oldValue,
              [Object.keys(data.selectDropdown[key])[0]]: true
            }))
          }
          setRejectedAllFields(oldValue => ({
            ...oldValue,
            "searchAbleFieldsValid": true
          }))
          for (let key in data.customFieldsArray) {
            setRejectedAllFields(oldValue => ({
              ...oldValue,
              [data.customFieldsArray[key].inputField]: true
            }))
          }
          setSearchAbleKey(searchableKeyArr);
          if (searchableKeyArr.length !== 0) {
            setValidateSearchAbleKey(true);
          }
          setFile(htmlTemplate);
          setAllowHtmlFile(true);
        }

        else if (data.statusDetails === "Session Expired") {
          confirmAlert({
            message: data.statusDetails,
            buttons: [
              {
                label: "OK",
                className: "confirmBtn",
                onClick: () => {
                  props.history.push("/login");
                },
              },
            ],
          });
        }
        else {
          confirmAlert({
            message: data.statusDetails,
            buttons: [
              {
                label: "OK",
                className: "confirmBtn",
              },
            ],
          });
        }
      })
      .catch(error => {
        console.log(error);
        confirmAlert({
          message: "Technical issues, try again later!",
          buttons: [
            {
              label: "OK",
              className: "confirmBtn",
            },
          ],
        });
      })
  }, [])

  useEffect(() => {
    if (allowHtmlfile) {
      //for the first initial time setting default values..
      for (let key in template) {
        setvalidation(oldValue => ({
          ...oldValue,
          [Object.keys(template[key])[0]]: false
        }))
        setRejectedAllFields(oldValue => ({
          ...oldValue,
          [Object.keys(template[key])[0]]: true
        }))
      }

      for (let key in fileValidation) {
        setValidationForFilUpDetail(oldValue => ({
          ...oldValue,
          [fileValidation[key].inputField]: false
        }))
        setRejectedAllFields(oldValue => ({
          ...oldValue,
          [fileValidation[key].inputField]: true
        }))

      }

      for (let key in radioChecks) {
        setRadioCheckValidation(oldValue => ({
          ...oldValue,
          [Object.keys(radioChecks[key])[0]]: false
        }))
      }
    }
  }, [allowHtmlfile]);

  const creatfieldValiTable = () => {
    if (allowHtmlfile) {
      return (
        <>
          {
            template.map(item => creatSinglefieldValiTable(item))
          }
        </>
      )
    }
  }

  // to create input field with details button to view the detail of each input field validation..
  const creatSinglefieldValiTable = (item) => {
    const key = Object.keys(item);
    return (
      <div key={item[key].inputDescription} className='oneLabelBox'>
        <div className='form-Montroll'>
          <input disabled={true} type='text' name={item[key].inputField} value={item[key].inputField} className='input-Montroll' />
        </div>
        <div className='editFields'>
          <div className='editcss'>
            <button type='button' className='proceedbtnxCss' onClick={e => openModalForInputAndFieldDetails(e, item[key], "inputFieldData")}>Details</button>
          </div>
          <div className='tickMarkcss'>
            <span id={item[key].inputField}></span>
          </div>
        </div>
      </div>
    )
  }

  // to view the file attachment validations, a table is created.
  const createFileUpdDetValdt = () => {
    if (fileValidation.length != 0) {
      return (
        <div >
          <h6 className='form-montrol1z'>File Detail Validation</h6>
          {
            fileValidation.map((posts, index) => (
              <div key={index} className='oneLabelBox'>
                <div className='form-Montroll'>
                  <input disabled={true} value={posts.inputField} className='input-Montroll' />
                </div>
                <div className='editFields'>
                  <div className='editcss'>
                    <button type='button' className='proceedbtnxCss' onClick={e => openModalForInputAndFieldDetails(e, posts, "fileValidation")}>Details</button>
                  </div>
                  <div className='tickMarkcss'>
                    <span id={`${posts.inputField}TickMark`}></span>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      )
    }
  }

  const proceedBack = () => {
    props.history.push("/getTempToApprove")
  }

  const RejectTemplate = () => {
    setAllowModalForComment(true);
  }

  const openSearchAbleKeyModal = (event) => {
    event.preventDefault();
    if (searchAbleKey[0] === '') {
      confirmAlert({
        message: `No searchable fields are present!`,
        buttons: [
          {
            label: "OK",
            className: "confirmBtn",
            onClick: () => {
              return;
            },
          },
        ],
      });
    }
    else {
      setAllowSearchAbleKeyModal(true);
    }
  }

  // To open the modal and to store the key in the usestate for temporary..
  const openModalForInputAndFieldDetails = (e, item, form) => {
    if (form === "inputFieldData") {
      setAllowmodalFieldDetail(true);
      setAllowFiledData(true);
    } else {
      setAlowModalFilDetaVali(true);
      setAllowFileData(true);
    }
    SetFieldData(item);
  }

  //openModelForFileValiDetai
  const openModelForFileValiDetai = (event, index) => {
    SetFieldData(index);
    setOpenModalToCusField(true);
  }

  const openRadioManOptionCheck = (event, RadioJson) => {
    event.preventDefault();
    SetHoldEachRadioJsontoRender(RadioJson);
    setAllowRadioChecksOpen(true);
  }

  const approveSearchAbleKeys = () => {
    document.getElementById("SearchAbleKeyTickMark").style.color = "green";
    document.getElementById("SearchAbleKeyTickMark").className = "fa fa-check";
    setValidateSearchAbleKey(false);
    setRejectedAllFields(
      {
        ...rejectedAllFields,
        "searchAbleFieldsValid": true
      }
    );
    closeTheModal();
  }

  const disApproveSearchAbleKeys = () => {
    document.getElementById("SearchAbleKeyTickMark").style.color = "red";
    document.getElementById("SearchAbleKeyTickMark").className = "fa fa-times";
    setValidateSearchAbleKey(false);
    setRejectedAllFields(
      {
        ...rejectedAllFields,
        "searchAbleFieldsValid": false
      }
    )
    closeTheModal();
  }

  const tickMarkCss = (idName) => {
    document.getElementById(idName).className = "fa fa-check";
    document.getElementById(idName).style.color = "green";
    setvalidation({
      ...validation,
      [idName]: true
    })
    setRejectedAllFields({
      ...rejectedAllFields,
      [idName]: true
    });
    closeTheModal();
  }

  const disApproveMark = (idName) => {
    document.getElementById(idName).className = "fa fa-times";
    document.getElementById(idName).style.color = "red";
    setvalidation({
      ...validation,
      [idName]: true
    })
    setRejectedAllFields({
      ...rejectedAllFields,
      [idName]: false
    });
    closeTheModal();
  }

  const tickMarkCssFilUpDet = (idName) => {
    document.getElementById(`${idName}TickMark`).className = "fa fa-check";
    document.getElementById(`${idName}TickMark`).style.color = "green";
    setValidationForFilUpDetail({
      ...validationForFilUpDetail,
      [idName]: true
    })
    setRejectedAllFields({
      ...rejectedAllFields,
      [idName]: true
    });
    closeTheModal();
  }

  const CancelMarkForDisApprove = (idName) => {
    document.getElementById(`${idName}TickMark`).className = "fa fa-times";
    document.getElementById(`${idName}TickMark`).style.color = "red";
    setValidationForFilUpDetail({
      ...validationForFilUpDetail,
      [idName]: true
    })
    setRejectedAllFields({
      ...rejectedAllFields,
      [idName]: false
    });
    closeTheModal();
  }

  // validation check..
  const approveTemplate = (e) => {
    for (let key in validation) {
      // if (validation[key] === false) {
      //   e.preventDefault();
      //   confirmAlert({
      //     message: `Please check if all fields are approved`,
      //     buttons: [
      //       {
      //         label: "OK",
      //         className: "confirmBtn",
      //       },
      //     ],
      //   })
      //   return;
      // }
    }
    for (let key in validationForFilUpDetail) {
      // if (validationForFilUpDetail[key] === false) {
      //   e.preventDefault();
      //   confirmAlert({
      //     message: `Please check if all fields are approved`,
      //     buttons: [
      //       {
      //         label: "OK",
      //         className: "confirmBtn",
      //       },
      //     ],
      //   })
      //   return;
      // }
    }

    for (let key in radioCheckValidation) {
      // if (radioCheckValidation[key] === false) {
      //   e.preventDefault();
      //   confirmAlert({
      //     message: `Please check if all fields are approved`,
      //     buttons: [
      //       {
      //         label: "OK",
      //         className: "confirmBtn",
      //       },
      //     ],
      //   })
      //   return;
      // }
    }

    if (validateSearchAbleKey) {
      e.preventDefault();
      confirmAlert({
        message: `Please validate the searchable keys before proceeding`,
        buttons: [
          {
            label: "OK",
            className: "confirmBtn",
          },
        ],
      })
      return;
    }
  }

  // to close any of the modal below method is used..
  const closeTheModal = () => {
    setAllowModalForComment(false);
    setAllowmodalFieldDetail(false);
    setAlowModalFilDetaVali(false);
    setAllowRadioChecksOpen(false);
    setAllowSearchAbleKeyModal(false);
    setOpenModalToCusField(false);
    setAllowmodalForDrpDwn(false);
  }

  // when comment is filled and finaly API is called..
  const approveTemplateFinally = (e, prop) => {
    for (let key in rejectedAllFields) {
      if (!rejectedAllFields[key]) {
        confirmAlert({
          message: `Several fields have been rejected, consequently, the template cannot be approved.`,
          buttons: [
            {
              label: "OK",
              className: "confirmBtn"
            }
          ]
        });
        return;
      }
    }


    confirmAlert({
      message: `Do you want to Approve the template ${templateName}`,
      buttons: [
        {
          label: "Confirm",
          className: "confirmBtn",
          onClick: () => {
            setAllowloader(false);
            const options = {
              method: "POST",
              headers: {
                "Content-Type": "appiaction/json"
              },
              body: JSON.stringify({
                authToken: sessionStorage.getItem("authToken"),
                templateCode: props.location.state.templateCode,
                comment: "",
                userIP: sessionStorage.getItem("userIP"),
                status: "1"
              })
            }
            closeTheModal();
            fetch(URL.insertHtmlTempAndFormDetails, options)
              .then((response) => response.json()
                .then((data) => {
                  if (data.status === "SUCCESS") {
                    setAllowloader(true);
                    confirmAlert({
                      message: data.statusDetails,
                      buttons: [
                        {
                          label: "OK",
                          className: "confirmBtn",
                          onClick: () => {
                            props.history.push("/getTempToApprove");
                          },
                        },
                      ],
                    });
                  } else if (data.statusDetails === "Session Expired") {
                    setAllowloader(true);
                    confirmAlert({
                      message: data.statusDetails,
                      buttons: [
                        {
                          label: "OK",
                          className: "confirmBtn",
                          onClick: () => {
                            props.history.push("/login");
                          },
                        },
                      ],
                    });
                  }
                  else {
                    setAllowloader(true);
                    confirmAlert({
                      message: data.statusDetails,
                      buttons: [
                        {
                          label: "OK",
                          className: "confirmBtn",
                        },
                      ],
                    });
                  }
                }))
              .catch(error => {
                console.log(error);
                setAllowloader(true);
                confirmAlert({
                  message: "Technical issue, Try again later!",
                  buttons: [
                    {
                      label: "OK",
                      className: "confirmBtn",
                    },
                  ],
                });
              })
            setAllowloader(true);
          },
        },
        {
          label: "Cancel",
          className: "cancelBtn",
          onClick: () => {
            e.preventDefault();
            return;
          },
        },
      ],
    });
    // }
  }

  // to collect the reason of rejected..
  const rejectTemplate = (e, prop) => {
    let comments = document.getElementById(`${prop}`).value + "";
    if (comments === "") {
      e.preventDefault();
      alert('Kindly provide comments on the reason for rejection.');
    } else {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "appiaction/json"
        },
        body: JSON.stringify({
          authToken: sessionStorage.getItem("authToken"),
          templateCode: props.location.state.templateCode,
          comment: comments,
          userIP: sessionStorage.getItem("userIP"),
          status: "0"
        })
      }
      closeTheModal();
      fetch(URL.insertHtmlTempAndFormDetails, options)
        .then((response) => response.json()
          .then((data) => {
            if (data.status === "SUCCESS") {
              confirmAlert({
                message: data.statusDetails,
                buttons: [
                  {
                    label: "OK",
                    className: "confirmBtn",
                    onClick: () => {
                      props.history.push("/getTempToApprove");
                    },
                  },
                ],
              });
            } else if (data.statusDetails === "Session Expired") {
              confirmAlert({
                message: data.statusDetails,
                buttons: [
                  {
                    label: "OK",
                    className: "confirmBtn",
                    onClick: () => {
                      props.history.push("/login");
                    },
                  },
                ],
              });
            }
            else {
              confirmAlert({
                message: data.statusDetails,
                buttons: [
                  {
                    label: "OK",
                    className: "confirmBtn",
                  },
                ],
              });
            }
          }))
        .catch(error => {
          console.log(error);
          alert("SomeThing Went Wrong PLease Try Again");
        })
    }
  }

  // to create commect section for approval (txt area)
  const createApprovalForm = () => {
    return (
      <>
        <div style={{ height: "100%", width: "100%" }} >
          <textarea type='text' placeholder='maximum 255 characters allowed' maxLength="255" minLength="10" id='commentFromRejAdmin' className='inputCssRT'></textarea>
        </div>
        <div className='Divo6Css'>
          <div className='proceedCancelCss'>
          <button className='cancelbtnxCss' type='button' onClick={closeTheModal}>Cancel</button>
          </div>
          <div className='proceedCancelCss'>
          <button className='proceedbtnX1Css btn btn-success rounded-pill' type='button' onClick={e => approveTemplateFinally(e, "commentFromRejAdmin")} >Add</button>
          </div>
        </div>
      </>

    )
  }

  // to create commect section for rejection (txt area)
  const createRejectForm = () => {
    return (
      <>
        <div style={{ height: "100%", width: "100s%" }} >
          <textarea type='text' maxLength="255" placeholder='maximum 255 characters allowed' minLength="10" id='commentFromAppAdmin' className='inputCssRT'></textarea>
        </div>
        <div className='Divo6Css'>
          <div className='proceedCancelCss'>
            <button className='cancelbtnxCss' type='button' onClick={closeTheModal} >Cancel</button>
          </div>
          <div className='proceedCancelCss'>
            <button className='proceedbtnX1Css btn btn-success rounded-pill' type='button' onClick={e => rejectTemplate(e, "commentFromAppAdmin")} > Add comment </button>
          </div>
        </div>
      </>
    )
  }

  // to create html form by replacing {{ with the yellow backGround..
  const creatHtmlForm = () => {
    if (allowHtmlfile) {
      var sampleText = file;
      sampleText = sampleText.replaceAll("{{jsonObj.", `<span style="background-color: yellow">`)
      sampleText = sampleText.replaceAll("}}", '</span>')
      sampleText = sampleText.replaceAll("##atchmt##", `<span style="background-color: yellow;">`)
      sampleText = sampleText.replaceAll("##", '</span>')
      sampleText = sampleText.replaceAll("#$", `<span style="background-color: yellow;">`)
      sampleText = sampleText.replaceAll("#$", '</span>');
      // removing dynamic-table keys from the template, to avoid showing to end user..
      for (let key in dynamcTable) {
        sampleText = sampleText.replace([Object.keys(dynamcTable[key])[0]], "");
      }
      return (
        <div dangerouslySetInnerHTML={{ __html: sampleText }} />
      )
    }
  }


  // modal to view the input field validation.
  const opnMolToViwinpFilPreview = () => {
    if (allowFiledData) {
      const nameofModel = fileddata;
      let placeHolder = false;
      let description = false;
      let minLength = false;
      let maxLength = false;
      let minRange = false;
      let maxRange = false;
      let customValidation = false;

      if (nameofModel.customValidation === "") {
        customValidation = true;
      }

      if (nameofModel.type === "number") {
        minLength = true;
        maxLength = true;
      }
      else if (nameofModel.type === "date") {
        minLength = true;
        maxLength = true;
        placeHolder = true;
      }
      else {
        minRange = true;
        maxRange = true;
      }

      return (
        <div key={nameofModel.inputField} >
          <div className='Divo4Css'>
            <div className='titleView'>
              <span>Field Name: </span>
            </div>
            <div className='titleName'>
              <span>{nameofModel.inputField}</span>
            </div>
          </div>
          <div className='inputHolderCss'>
            <div className='Divo5Css'>
              <div className='InputName'>
                <span>Label Name: </span>
              </div>
              <div className='inputname1'>
                <input disabled={true} title={nameofModel.label} name='label' id={`${nameofModel.inputField}label`} value={nameofModel.label} autoCapitalize='off' className='inputCss' />
              </div>
            </div>
            <div className='Divo5Css' hidden={placeHolder}>
              <div className='InputName'>
                <span>Place Holder: </span>
              </div>
              <div className='inputname1'>
                <input disabled={true} title={nameofModel.placeHolder} name='placeHolder' id={`${nameofModel.inputField}placeHolder`} value={nameofModel.placeHolder} className='inputCss' />
              </div>
            </div>
            <div className='Divo5Css' hidden={description}>
              <div className='InputName'>
                <span>Field Description: </span>
              </div>
              <div className='inputname1'>
                <input disabled={true} title={nameofModel.inputDescription} name='inputDescription' value={nameofModel.inputDescription} id={`${nameofModel.inputField}inputDescription`} className='inputCss' />
              </div>
            </div>
            <div className='Divo5Css'>
              <div className='InputName'>
                <span>Data Type: </span>
              </div>
              <div className='inputname1'>
                <input name='dataType' disabled={true} value={nameofModel.type} id={`${nameofModel.inputField}dataType`} className='selectdropdown' />
              </div>
            </div>
            <div className='Divo5Css' hidden={minLength}>
              <div className='InputName'>
                <span>Char Min Length: </span>
              </div>
              <div className='inputname1'>
                <input name='minLength' disabled={true} value={nameofModel.minLength} id={`${nameofModel.inputField}minLength`} className='inputCss' />
              </div>
            </div>
            <div className='Divo5Css' hidden={maxLength}>
              <div className='InputName'>
                <span>Char Max Length: </span>
              </div>
              <div className='inputname1'>
                <input disabled={true} value={nameofModel.maxLength} id={`${nameofModel.inputField}maxLength`} className='inputCss' />
              </div>
            </div>
            <div className='Divo5Css' hidden={maxRange}>
              <div className='InputName'>
                <span>Min Range: </span>
              </div>
              <div className='inputname1'>
                <input disabled={true} value={nameofModel.minRange} id={`${nameofModel.inputField}minRange`} className='inputCss' />
              </div>
            </div>
            <div className='Divo5Css' hidden={minRange}>
              <div className='InputName'>
                <span>Max Range: </span>
              </div>
              <div className='inputname1'>
                <input disabled={true} value={nameofModel.maxRange} id={`${nameofModel.inputField}maxRange`} className='inputCss' />
              </div>
            </div>
            <div className='Divo5Css' hidden={customValidation}>
              <div className='InputName'>
                <span>Custom Validation: </span>
              </div>
              <div className='inputname1'>
                <input disabled={true} value={nameofModel.customValidation} id={`${nameofModel.inputField}customValidation`} className='inputCss' />
              </div>
            </div>
            <div className='Divo5Css' >
              <div className='InputName'>
                <span>Mandatory Field: </span>
              </div>
              <div className='inputname1'>
                <input disabled={true} value={(nameofModel.isMandatory === 1) ? "Mandatory" : "Optional"} id={`${nameofModel.inputField}isMandatory`} className='inputCss' />
              </div>
            </div>
          </div>
          <div className='Divo6Css'>
            <div className='proceedCancelCss'>
              <button className='cancelbtnxCss' type='button' onClick={e => disApproveMark(nameofModel.inputField)}>Disapprove</button>
            </div>
            <div className='proceedCancelCss'>
              <button className='proceedbtnX1Css btn btn-success rounded-pill' type='button' onClick={e => tickMarkCss(nameofModel.inputField)}>Approve</button>
            </div>
          </div>
        </div>
      )
    }
  }

  // modal to view the file attachmet field validation.
  const openModelForFileValidation = () => {
    if (allowFileData) {
      let fileValidation = fileddata;
      return (
        <div key={fileValidation.inputField} className='Divo3Css'>
          <div className='Divo4Css'>
            <div className='titleView'>
              <span>Field Name: </span>
            </div>
            <div className='titleName'>
              <span>{fileValidation.inputField}</span>
            </div>
          </div>
          <div className='inputHolderCss'>
            <div className='Divo5Css'>
              <div className='InputName'>
                <span>Label Name: </span>
              </div>
              <div className='inputname1'>
                <input disabled={true} title={fileValidation.fieldLable} name='label' id={`${fileValidation.inputField}label`} value={fileValidation.fieldLable} autoCapitalize='off' className='inputCss' />
              </div>
            </div>
            <div className='Divo5Css'>
              <div className='InputName'>
                <span>Field Description: </span>
              </div>
              <div className='inputname1'>
                <input disabled={true} title={fileValidation.fieldDesc} name='FiledDescription' value={fileValidation.fieldDesc} id={`${fileValidation.inputField}FieldDescription`} className='inputCss' />
              </div>
            </div>
            <div className='Divo5Css'>
              <div className='InputName'>
                <span>Attachment Type: </span>
              </div>
              <div className='inputname1'>
                <input name='AttachmentType' disabled={true} value={fileValidation.attachmentType} id={`${fileValidation.inputField}AttachmentType`} className='selectdropdown' />
              </div>
            </div>
            <div className='Divo5Css'>
              <div className='InputName'>
                <span>Attachment Size: </span>
              </div>
              <div className='inputname1'>
                <input name='attachmentSize' disabled={true} value={`${fileValidation.maxAttachmentSize}KB`} id={`${fileValidation.inputField}AttachmentSize`} className='inputCss' />
              </div>
            </div>
          </div>
          <div className='Divo6Css'>
            <div className='proceedCancelCss'>
              <button className='cancelbtnxCss' type='button' onClick={e => CancelMarkForDisApprove(fileValidation.inputField)}>Disapprove</button>
            </div>
            <div className='proceedCancelCss'>
              <button className='proceedbtnX1Css btn btn-success rounded-pill' type='button' onClick={e => tickMarkCssFilUpDet(fileValidation.inputField)}>Approve</button>
            </div>
          </div>
        </div>
      )
    }
  }

  // to view radio checks validation..
  const createRadioChecks = () => {
    if (radioChecks.length != 0) {
      let radioCheckList = [];
      for (let key in radioChecks) {
        let eachRadiokeys = Object.keys(radioChecks[key]);
        radioCheckList.push(radioChecks[key][eachRadiokeys]);
      }
      return (
        <div >
          <h6 className='form-montrol1z'>Radio Validation</h6>
          {
            radioCheckList.map((posts, index) => (
              <div key={index} className='oneLabelBox'>
                <div className='form-Montroll'>
                  <input disabled={true} value={posts.inputField} className='input-Montroll' />
                </div>
                <div className='editFields'>
                  <div className='editcss'>
                    <button type='button' className='proceedbtnxCss' onClick={e => openRadioManOptionCheck(e, posts)}>Details</button>
                  </div>
                  <div className='tickMarkcss'>
                    <span id={`${posts.inputField}RadioTickMark`}></span>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      )
    }
  }

  const DisapproveTheRadio = (RadioName) => {
    document.getElementById(RadioName + "RadioTickMark").className = "fa fa-times";
    document.getElementById(RadioName + "RadioTickMark").style.color = "red";
    setRadioCheckValidation({
      ...radioCheckValidation,
      [RadioName]: true
    })
    setRejectedAllFields({
      ...rejectedAllFields,
      [RadioName]: false

    })
    closeTheModal();
  }

  const ApproveTheRadio = (RadioName) => {
    document.getElementById(RadioName + "RadioTickMark").className = "fa fa-check";
    document.getElementById(RadioName + "RadioTickMark").style.color = "green";
    setRadioCheckValidation({
      ...radioCheckValidation,
      [RadioName]: true
    })
    setRejectedAllFields({
      ...rejectedAllFields,
      [RadioName]: true
    })
    closeTheModal();
  }

  const CreateRadioChecksTable = () => {
    return (
      <div key="radioCheckList" className='Divo3Css'>
        <div className='inputHolderCss'>
          <div className='Divo5Css'>
            <div className='InputName'>
              <span style={{ fontFamily: "inherit", fontSize: "15px" }}>Radio Name: </span>
            </div>
            <div style={{ paddingTop: "7px" }} className='inputname1'>
              <span>{HoldEachRadioJsontoRender.inputField}</span>
            </div>
          </div>
          <div className='Divo5Css'>
            <div className='InputName'>
              <span style={{ fontFamily: "inherit", fontSize: "15px" }}>Radio Validation: </span>
            </div>
            <div style={{ paddingTop: "7px" }} className='inputname1'>
              <span>{(HoldEachRadioJsontoRender.isMandatory === 0 ? "Optional" : "Mandatory")}</span>
            </div>
          </div>
        </div>
        <div className='Divo6Css'>
          <div className='proceedCancelCss'>
            <button className='cancelbtnxCss' type='button' onClick={e => DisapproveTheRadio(HoldEachRadioJsontoRender.inputField)}>Disapprove</button>
          </div>
          <div className='proceedCancelCss'>
            <button className='proceedbtnX1Css btn btn-success rounded-pill' type='button' onClick={e => ApproveTheRadio(HoldEachRadioJsontoRender.inputField)} >Approve</button>
          </div>
        </div>
      </div>
    )
  }

  const SearchAbleKey = () => {
    if (searchAbleKey.length !== 0) {
      return (
        <div style={{ display: "flex", width: "100%" }}>
          <div style={{ width: "60%" }}>
            <button className='btn btn-link' onClick={e => openSearchAbleKeyModal(e)}>Searchable Fields</button>
          </div>
          <div className='tickMarkcss' style={{ width: "40%", textAlign: "start" }}>
            <span id="SearchAbleKeyTickMark"></span>
          </div>
        </div>
      )
    }
  }


  const createSearchAbleKeys = () => {
    if (searchAbleKey.length !== 0 && searchAbleKey[0] !== '') {
      return (
        <div key="searchAbleKeys" className='Divo3Css'>
          <div style={{ minHeight: "100px", height: "fit-content" }} className='inputHolderCss ScrollBarXz'>
            {
              searchAbleKey.map((searchAbleKey, index) => (
                <span>{index + 1}. {searchAbleKey}<br /></span>
              ))
            }
          </div>
          <div className='Divo6Css'>
            <div className='proceedCancelCss'>
              <button className='cancelbtnxCss' type='button' onClick={e => disApproveSearchAbleKeys(e)}>Disapprove</button>
            </div>
            <div className='proceedCancelCss'>
              <button className='proceedbtnX1Css btn btn-success rounded-pill' type='button' onClick={e => approveSearchAbleKeys(e)} >Approve</button>
            </div>
          </div>
        </div>
      )
    }
  }

  // to render approve or disapprove for custom fields.
  const customFildAppAndDisApproved = (event, CustomFieldIDvalue, reason) => {
    if (reason === "approved") {
      document.getElementById(`${CustomFieldIDvalue}customTickMarkID`).style.color = "green";
      document.getElementById(`${CustomFieldIDvalue}customTickMarkID`).className = "fa fa-check";
      setRejectedAllFields({
        ...rejectedAllFields,
        [CustomFieldIDvalue]: true
      });
    }
    else {
      document.getElementById(`${CustomFieldIDvalue}customTickMarkID`).style.color = "red";
      document.getElementById(`${CustomFieldIDvalue}customTickMarkID`).className = "fa fa-times";
      setRejectedAllFields({
        ...rejectedAllFields,
        [CustomFieldIDvalue]: false
      });
    }
    closeTheModal();
  }

  // to render approve or disapprove for select dropDown.
  const SelDrpDwnAppAndDisApproved = (event, selectDrpDwnKey, reason) => {
    if (reason === "approved") {
      document.getElementById(`${selectDrpDwnKey}SelectDropDown`).style.color = "green";
      document.getElementById(`${selectDrpDwnKey}SelectDropDown`).className = "fa fa-check";
      setRejectedAllFields({
        ...rejectedAllFields,
        [selectDrpDwnKey]: true
      });
    }
    else {
      document.getElementById(`${selectDrpDwnKey}SelectDropDown`).style.color = "red";
      document.getElementById(`${selectDrpDwnKey}SelectDropDown`).className = "fa fa-times";
      setRejectedAllFields({
        ...rejectedAllFields,
        [selectDrpDwnKey]: false
      });
    }
    closeTheModal();
  }

  // used to create custom field modal data..
  const createCustomFieldModal = () => {
    if (openModalToCusField) {

      let placeHolder = false;
      let minLength = false;
      let maxLength = false;
      let minRange = false;
      let maxRange = false;
      let customValidation = false;
      if (customFields[fileddata].customValidation === "") {
        customValidation = true;
      }
      if (customFields[fileddata].type === "number") {
        minLength = true;
        maxLength = true;
      }
      else if (customFields[fileddata].type === "date") {
        minLength = true;
        maxLength = true;
        placeHolder = true;
      }
      else {
        minRange = true;
        maxRange = true;
      }

      return (
        <div key="openModalForCustFieldDetail" className='Divo3Css'>
          <div className='inputHolderCss' style={{ paddingTop: "10px", paddingBottom: "0px" }}>
            <div className='Divo5Css'>
              <div className='InputName'>
                <span>Custom Field Key: </span>
              </div>
              <div className='inputname1' style={{ paddingTop: "1px" }}>
                <input disabled={true} value={`${customFields[fileddata].inputField}`.substring(7, `${customFields[fileddata].inputField}`.length)} name='label' id="customFieldHeaderID" autoCapitalize='off' className='inputCss' />
              </div>
            </div>
            <div className='Divo5Css'>
              <div className='InputName'>
                <span>Label Name: </span>
              </div>
              <div className='inputname1'>
                <input disabled={true} value={customFields[fileddata].label} name='label' id="customLabelName" autoCapitalize='off' className='inputCss' />
              </div>
            </div>
            <div className='Divo5Css' id="customPlaceHolderBody" hidden={placeHolder}>
              <div className='InputName'>
                <span>Place Holder: </span>
              </div>
              <div className='inputname1'>
                <input disabled={true} value={customFields[fileddata].placeHolder} name='placeHolder' id="customPlaceHolder" className='inputCss' />
              </div>
            </div>
            <div className='Divo5Css'>
              <div className='InputName'>
                <span>Field Desc: </span>
              </div>
              <div className='inputname1'>
                <input disabled={true} value={customFields[fileddata].inputDescription} name='inputDescription' id="customInputDescription" className='inputCss' />
              </div>
            </div>
            <div className='Divo5Css'>
              <div className='InputName'>
                <span>Data Type: </span>
              </div>
              <div className='inputname1'>
                <input disabled={true} value={customFields[fileddata].type} name='inputDescription' id="customInputDescription" className='inputCss' />
              </div>
            </div>
            <div className='Divo5Css' id="customMinlengthBody" hidden={minLength}>
              <div className='InputName'>
                <span>Char Min Length: </span>
              </div>
              <div className='inputname1'>
                <input disabled={true} value={customFields[fileddata].minLength} name='minLength' id="customMinlength" className='inputCss' />
              </div>
            </div>
            <div className='Divo5Css' id="customMaxLengthBody" hidden={maxLength}>
              <div className='InputName'>
                <span>Char Max Length: </span>
              </div>
              <div className='inputname1'>
                <input disabled={true} value={customFields[fileddata].maxLength} id="customMaxLength" className='inputCss' />
              </div>
            </div>
            <div className='Divo5Css' id="customMinRangeBody" hidden={maxRange}>
              <div className='InputName'>
                <span>Min range: </span>
              </div>
              <div className='inputname1'>
                <input disabled={true} value={customFields[fileddata].minRange} id="customMinRange" className='inputCss' />
              </div>
            </div>
            <div className='Divo5Css' id="customMaxRangeBody" hidden={minRange}>
              <div className='InputName'>
                <span>Max range: </span>
              </div>
              <div className='inputname1'>
                <input disabled={true} value={customFields[fileddata].maxRange} id="customMaxRange" className='inputCss' />
              </div>
            </div>
            <div className='Divo5Css' hidden={customValidation}>
              <div className='InputName'>
                <span>Validation Key: </span>
              </div>
              <div className='inputname1'>
                <input disabled={true} value={customFields[fileddata].customValidation} id="customMaxRange" className='inputCss' />
              </div>
            </div>
            <div className='Divo5Css'>
              <div className='InputName'>
                <span>Mandatory Field: </span>
              </div>
              <div className='inputname1' style={{ paddingTop: "1px" }}>
                <input disabled={true} value={customFields[fileddata].isMandatory === 1 ? "Yes" : "No"} id="customMaxRange" className='inputCss' />
              </div>
            </div>
            <div className='Divo5Css'>
              <div className='InputName'>
                <span>Searchable Key: </span>
              </div>
              <div className='inputname1' style={{ paddingTop: "1px" }}>
                <input disabled={true} value={customFields[fileddata].SearchAbleKey} id="customMaxRange" className='inputCss' />
              </div>
            </div>
            <div className='Divo5Css'>
              <div className='InputName' style={{ paddingTop: "3px" }}>
                <span>Who Should Fill: </span>
              </div>
              <div className='inputname1' style={{ paddingTop: "5px" }}>
                <label> <input type='radio' checked={customFields[fileddata].customerFilled} id='customerFilled' name='customerFill' style={{ width: "20px", height: "14px" }} /></label><span style={{ fontFamily: "FontAwesome" }}>End User</span>
                <label> <input type='radio' checked={customFields[fileddata].templateGroupFilled} id='templateOwnerFilled' name='templateOwnerFill' style={{ width: "20px", height: "14px" }} /></label><span style={{ fontFamily: "FontAwesome" }}>Template owner</span>
              </div>
            </div>
          </div>
          <div className='Divo6Css'>
            <div className='proceedCancelCss'>
              <button className='cancelbtnxCss' type='button' onClick={e => customFildAppAndDisApproved(e, customFields[fileddata].inputField, " disApproved")}>Disapprove</button>
            </div>
            <div className='proceedCancelCss'>
              <button className='proceedbtnX1Css btn btn-success rounded-pill' type='button' onClick={e => customFildAppAndDisApproved(e, customFields[fileddata].inputField, "approved")}>Approve</button>
            </div>
          </div>
        </div>
      )
    }
  }

  // used to create custom field table 
  const customFieldData = () => {
    if (customFields.length != 0) {
      return (
        <div className='FormCssz'>
          <h6 className='form-montrol1z'>Custom Field Details</h6>
          {
            customFields.map((posts, index) => (
              <div key={index} className='oneLabelBox'>
                <div className='form-Montroll'>
                  <input disabled={true} name={`${posts.inputField}Name`} id={`${posts.inputField}FormID`} value={`${posts.inputField}`.substring(7, `${posts.inputField}`.length)} className='input-Montroll' />
                </div>
                <div className='editFields'>
                  <div className='editcss'>
                    <button type='button' className='proceedbtnxCss' onClick={e => openModelForFileValiDetai(e, index)}>Details</button>
                  </div>
                  <div className='tickMarkcss'>
                    <span id={`${posts.inputField}customTickMarkID`}></span>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      )

    }
  }

  const openModelForSelectDrpDwn = (event, value) => {
    setAllowmodalForDrpDwn(true);
    setSelectDropDownName(value);
  }

  return (
    <>
      <Loader
        loaded={allowLoader}
        lines={13}
        radius={20}
        corners={1}
        rotate={0}
        direction={1}
        color="#000"
        speed={1}
        trail={60}
        shadow={false}
        hwaccel={false}
        className="spinner loader"
        zIndex={2e9}
        top="50%"
        left="50%"
        scale={1.0}
        loadedClassName="loadedContent"
      />
      <div className='proceedbackXYZ'>
        <div>
          <button type='button' onClick={proceedBack} className=' btn btn-warning rounded-pill btn btn-secondary dangerbutton1x '>Back</button>
        </div>

        <div>
          <button type='button' onClick={RejectTemplate} className=' btn btn-danger rounded-pill '>Reject</button>
        </div>

        <div className='proceedCssv'>
          <button type='button' onClick={e => approveTemplateFinally(e, "commentFromRejAdmin")} className='btn btn-success rounded-pill'>Approve</button>
        </div>
      </div>
      <div className='mainclassz'>
        <div className='contentCssz'>
          <div className='greyBackCssz ScrollBarXz'>
            <div className='whiteBackCssz'>
              {
                creatHtmlForm()
              }
            </div>
          </div>
        </div>
        <div className='MainFormCssz'>
          <div className='FormBorderCssz ScrollBarXz'>
            <div style={{ marginBottom: "20px" }}>
              <h6 className='form-montrol1z'>Field Validation</h6>
              {
                // input field validation
                creatfieldValiTable()
              }
            </div>
            {
              // file attachment validation
              createFileUpdDetValdt()
            }
            {
              // radio checks validation
              createRadioChecks()
            }
            {
              // to render the custom field datas.
              customFieldData()
            }
            {
              // to render searchAble keys.
              SearchAbleKey()
            }
            {
              //Select option dropdown
              selectDropdown.length !== 0 ? < >
                <h6 className='form-montrol1z'>Dropdown</h6>
                {
                  selectDropdown.map((posts, index) => (
                    <div key={index} className='oneLabelBox'>
                      <div className='form-Montroll'>
                        <input disabled={true} name={posts} id={posts} value={posts} className='input-Montroll' />
                      </div>
                      <div className='editFields'>
                        <div className='editcss'>
                          <button type='button' className='proceedbtnxCss' onClick={e => openModelForSelectDrpDwn(e, posts)}>Details</button>
                        </div>
                        <div className='tickMarkcss'>
                          <span id={`${posts}SelectDropDown`}></span>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </> : <></>
            }
            {
              dynamcTable.length !== 0 && (
                <>
                  <div style={{ marginTop: "25px" }} >
                    < >
                      <h6 className='form-montrol1z'>HTML Tables</h6>
                    </>
                    {
                      dynamcTable.map((data, index) => (
                        <>
                          <div key={Object.keys(data)[0]} className='oneLabelBox' style={{ marginBottom: "0px" }}>
                            <div key={Object.keys(data)[0]} className='form-Montroll'>
                              <input type='text' disabled={true} value={Object.keys(data)[0]} id={index} className='input-Montroll' />
                            </div>
                          </div>
                          <div style={{ marginBottom: "8px" }}>
                            <div style={{ display: "flex" }}>
                              <div style={{ display: "flex", marginBottom: "5px" }}>
                                <div style={{ paddingTop: "2px" }}><input checked={data[Object.keys(data)[0]] === 1 ? true : false} type='checkBox' name={Object.keys(data)[0]} />
                                </div><div style={{ marginRight: "8px", marginLeft: "3px" }}>Allow additional rows</div>
                              </div>
                            </div>
                            <div style={{ display: ((data).hasOwnProperty('tableName') ? "flex" : "none") }}>
                              <div style={{ marginLeft: "16px", marginRight: "3px", color: "green" }}><span>Table Name - </span></div>
                              <div><span>{data["tableName"]}</span></div>
                            </div>
                            <div class="dotted-line"></div>
                          </div>
                        </>
                      ))
                    }
                  </div>
                </>
              )
            }
            {
              repetAble.length !== 0 && (
                <div className='part2Css'>
                  <div className='mainHeading' >
                    <span key="htmltableHead">Reptable blocks</span>
                  </div>
                  <div id='repeatableHeading' >Total count: <div id='repeatCount'>{repetAble}</div> </div>
                </div>
              )
            }
          </div>
        </div>
      </div>
      <Modal onClose={closeTheModal} open={allowModalForComment} center={true} closeOnOverlayClick={false}>
        <div className='WholeContent'>
          <div style={{ marginBottom: "30px" }} className='headingOfModal'>
            <span >Reject reason </span>
            <span></span>
          </div>
          <form>
            {createRejectForm()}
          </form>
        </div>
      </Modal>
      <Modal onClose={closeTheModal} open={allowmodalFieldDetail} center={true} closeOnOverlayClick={false}>
        <div className='WholeContent'>
          <div className='headingOfModalXCss'>
            <span style={{ fontSize: "22px" }}>Field Details</span>
          </div>
          <form>
            {opnMolToViwinpFilPreview()}
          </form>
        </div>

      </Modal>
      <Modal onClose={closeTheModal} open={AlowModalFilDetaVali} center={true} closeOnOverlayClick={false}>
        <div className='WholeContent'>
          <div className='headingOfModalXCss'>
            <span style={{ fontSize: "22px" }}>Attachment Validation Details</span>
          </div>
          <form>
            {openModelForFileValidation()}
          </form>
        </div>
      </Modal>
      <Modal onClose={closeTheModal} open={allowRadioChecksOpen} center={true} closeOnOverlayClick={false}>
        <div className='WholeContent'>
          <div className='headingOfModalXCss'>
            <span style={{ fontSize: "22px" }}>Radio Button Details</span>
          </div>
          <form>
            {CreateRadioChecksTable()}
          </form>
        </div>
      </Modal>
      <Modal onClose={closeTheModal} open={allowSearchAbleKeyModal} center={true} closeOnOverlayClick={false}>
        <div className='WholeContent'>
          <div className='headingOfModalXCss'>
            <span style={{ fontSize: "22px" }}>List of searchable fields</span>
          </div>
          <form>
            {createSearchAbleKeys()}
          </form>
        </div>
      </Modal>
      <Modal onClose={closeTheModal} open={openModalToCusField} center={true} closeOnOverlayClick={false}>
        <div className='WholeContent'>
          <div className='headingOfModalXCss'>
            <span style={{ fontSize: "22px" }}>Custom Field Details</span>
          </div>
          <form>
            {createCustomFieldModal()}
          </form>
        </div>
      </Modal>
      <Modal onClose={closeTheModal} open={allowmodalForDrpDwn} center={true} closeOnOverlayClick={false}>
        <div className='WholeContent'>
          <div className='headingOfModalXcss'>
            <span style={{ fontSize: "22px" }}>Dropdown List</span>
          </div>
          <div className='Divo4Css'>
            <div className='titleView' style={{ fontSize: "15px", width: "34%" }}>
              <span>Dropdown Name: </span>
            </div>
            <div className='titleName' style={{ fontSize: "15px" }}>
              <span>{slectDropDownName}</span>
            </div>
          </div>
          <form>
            <div key="openModalForCustFieldDetail" className='Divo3Css'>
              <div className='inputHolderCss' style={{ paddingTop: "10px", paddingBottom: "0px" }}>

                <div className='ScrollBarForApproveTemp'>
                  {
                    slectDropDownName.length !== 0 ? selectDropdownList[slectDropDownName].map((posts, index) => ((
                      <div key={index} style={{ display: "flex" }}>
                        <div style={{ marginRight: '2px' }}>
                          {index + 1}.
                        </div>
                        <div style={{ paddingRight: "10px" }}>
                          {posts}
                        </div>
                      </div>
                    )))
                      : <></>
                  }
                </div>
              </div>
              <div className='Divo6Css'>
                <div className='proceedCancelCss'>
                  <button className='cancelbtnxCss' type='button' onClick={e => SelDrpDwnAppAndDisApproved(e, slectDropDownName, " disApproved")}>Disapprove</button>
                </div>
                <div className='proceedCancelCss'>
                  <button className='proceedbtnX1Css btn btn-success rounded-pill' type='button' onClick={e => SelDrpDwnAppAndDisApproved(e, slectDropDownName, "approved")}>Approve</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </Modal>
    </>
  )
}

export default ViewTemplate