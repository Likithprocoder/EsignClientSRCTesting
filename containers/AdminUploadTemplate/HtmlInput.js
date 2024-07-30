import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import parse from "html-react-parser";
import { memo } from 'react';
import './HtmlUpload.css';
import $, { event } from "jquery";
import Modal from "react-responsive-modal";
import { URL } from '../URLConstant';
import { confirmAlert } from 'react-confirm-alert';

var Loader = require('react-loader');

function HtmlInput1(props) {

    const [htmlText, setHtmlText] = useState(null);

    const [valid, setValid] = useState(false);

    const [valid1, setValid1] = useState(false);

    const [loader, setLoader] = useState(false);

    const [input, setinput] = useState({});

    // const [html, setHtml] = useState();

    const [allowmodal, setAllowModal] = useState(false);

    const [allowmodalfordoc, setallowmodalfordoc] = useState(false);

    const [nameofModel, setNameOfModel] = useState('');

    const [finalValidation, setFinalValidation] = useState({});

    const [htmlFile, setHtmlFile] = useState({});

    const [inputs, setInputs] = useState({});

    const [inputsfileAttachment, setInputsfileAttachment] = useState({});

    const [allowHtmlfile, setAllowHtmlFile] = useState(false);

    const [templateAttachments, setTemplateAttachments] = useState({});

    const [group, setGroup] = useState([]);

    const [allowGroup, setAllowGroup] = useState(false);

    const [allowValiKeysToCreate, setallowValiKeysToCreate] = useState(false);

    const [ValidationKeyData, setValidationKey] = useState([]);

    const [allowModalToRender, setAllowModalToRender] = useState({});

    const [filedSuubmission, setFieldSubmission] = useState(false);

    const [finalValidationforDocu, setFinalValidationforDocu] = useState({});

    // used to allow a particular field when html form is created to collect radio buttons.
    const [allowAftHtmlFile, setAllowAftHtmlFile] = useState(false);

    const [allowAftHtmlFileTwo, setallowAftHtmlFileTwo] = useState(true);

    const [allowAftRadioCrt, setallowAftRadioCrt] = useState({});

    // to collect radio type valodation..
    const [radioTypeValues, setradioTypeValues] = useState({});

    // to make a list of radioName initially.
    const [radioTypLst, setRadioTypLst] = useState({});

    //to collect the radio names and render in the UI..
    // const [radioList, setRadioList] = useState({});

    //used to collect the searchable fields.
    const [searchAbleKeys, setSearchAbleKeys] = useState({});

    // status flag used to do operation based on from which page the process is done.
    const [statusFlag, setStatusFlag] = useState("0");

    // to store the templateCode 
    const [oldTemplateCode, setOldTemplateCode] = useState("");

    // to store the custom Field Header details.
    const [custField, setCustField] = useState([]);

    // used to store the attachment size for temporary.
    const [fileSize, setFileSize] = useState();

    // to open modal of custom fields
    const [openCustFieldModal, setOpenCustFieldModal] = useState(false);

    // to store the index of the custom field for temporary.
    const [customFieldindex, setCustomFieldIndex] = useState();

    // to store the custom fields as searchAble or not.
    const [customFieldSearch, setcustomFieldSearch] = useState([]);

    // to collect the dropDown inputs.
    const [customDropdown, setCustomDropdown] = useState({});

    const [allowmodalForDrpDwn, setAllowmodalForDrpDwn] = useState(false);

    const [dropDwnName, setDropDwnName] = useState('');

    // to count the variables 
    const [searchAbleKeyCount, setSearchAbleKeyCount] = useState(null);

    // tables read from the HTML table and to render.
    const [htmlTables, setHTMLTables] = useState([]);

    // to store all the tables present in the template..
    const [tablesInHTML, setTablesInHTML] = useState({});

    //to store the list of repeatable tags 
    const [repetAble, setRepeatAbleTags] = useState(0);

    const [tempdat, settempDat] = useState({
        templateName: '',
        // templateCode: '',
        templateDescp: '',
        group: '',
        subGroup: '',
        KYC_verified: ''
    })

    useEffect(() => {
        const options = {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                authToken: sessionStorage.getItem("authToken")
            })
        }

        fetch(URL.getAllTemplateGrps, options)
            .then(response => (response.json()))
            .then(data => {
                if (data.status === "SUCCESS") {
                    setGroup(data.details);
                    setAllowGroup(true);
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
                                className: "confirmBtn"
                            },
                        ],
                    });
                }

            })
            .catch(error => {
                console.log(error);
                confirmAlert({
                    message: `Something went wrong. please try again!`,
                    buttons: [
                        {
                            label: "OK",
                            className: "confirmBtn",
                        },
                    ],
                });
            })

        fetch(URL.getValidationKeys, options)
            .then(response => (response.json()))
            .then(data => {
                if (data.status === "success") {
                    setValidationKey(data.data);
                    setallowValiKeysToCreate(true);
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
                                className: "confirmBtn"
                            },
                        ],
                    });
                }

            })
            .catch(error => {

                confirmAlert({
                    message: `Something went wrong. please try again!`,
                    buttons: [
                        {
                            label: "OK",
                            className: "confirmBtn",
                        },
                    ],
                });
            })

        setLoader(false);
        let contants = null;
        const file = props.location.state.htmlFile[0];
        setHtmlFile(file);
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onloadend = function (e) {
            contants = e.target.result;
            setHtmlText(contants);
            setValid(true);
            setAllowHtmlFile(true);
            const parser = new DOMParser();
            const doc = parser.parseFromString(contants, 'text/html');
            let radio = doc.querySelectorAll("input[type=radio]");
            for (let key in radio) {
                if (radio[key].type === "radio") {
                    setRadioTypLst(oldvalue => ({
                        ...oldvalue,
                        [radio[key].name]: radio[key].name
                    }));
                    // storeing radio types to be sent to next page and use it when page is returned from template field preview..
                    setallowAftRadioCrt(oldvalue => ({
                        ...oldvalue,
                        [radio[key].name]: radio[key].name
                    }));
                }
                else {
                    continue;
                }
            }
            setAllowAftHtmlFile(true);
        }
        setLoader(true);
    }, [])

    useEffect(() => {
        setLoader(false);
        if (valid) {
            let count = 0;
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');
            const tagExists = doc.querySelectorAll("table");
            const repeatTags = doc.querySelectorAll("repeatTag");

            //iterate over <repeatTag> tags and collect the counts..
            for (let tagKey in repeatTags) {
                if (!isNaN(tagKey)) {
                    count++;
                }
                setRepeatAbleTags(count);
            }

            // iterating the table array 
            for (let key in tagExists) {
                // tag exists array is not only iterating the tables but few property inside it as well
                // to avoid this isNaN() funcation is used..
                if (!isNaN(key)) {
                    setHTMLTables(oldvalue => ([
                        ...oldvalue,
                        {
                            [`Table_${Number(key) + 1}`]: 0
                        }
                    ]));
                    setTablesInHTML(oldvalue => ({
                        ...oldvalue,
                        [`Table_${Number(key) + 1}`]: tagExists[key]
                    }))
                }
            }

            let eachLineText = htmlText.split('\n');
            for (let i = 0; i <= eachLineText.length - 1; i++) {
                let splitedText = eachLineText[i].split(" ");
                for (let j = 0; j <= splitedText.length - 1; j++) {
                    if (splitedText[j].includes("<a") || splitedText[j].includes("<Link")) {
                        confirmAlert({
                            message: "Hyper links included HTML files are not allowed!",
                            buttons: [
                                {
                                    label: "OK",
                                    className: "confirmBtn"
                                },
                            ],
                        });
                        props.history.push("/uploadTemplate");
                    }
                    else if (splitedText[j].includes("{{") || splitedText[j].includes("}}")) {
                        let wordWthOutSpace = splitedText[j].replace(/\s/g, '');
                        let wordwithFirstCurly = wordWthOutSpace.split("{{")[1];
                        let wordWithSecondCurly = wordwithFirstCurly.split("}}")[0];
                        let dataWithCurly = wordWithSecondCurly.split(".")[1];
                        if (props.location.state.lableInput + "" === "undefined") {
                            setinput(oldvalue => ({
                                ...oldvalue,
                                [`${dataWithCurly}`]: dataWithCurly
                            }))
                        }
                        if (props.location.state.lableInput + "" != undefined) {
                            const inputLableToDisplay = props.location.state.lableInput;
                            for (let key in inputLableToDisplay) {
                                setinput(oldvalue => ({
                                    ...oldvalue,
                                    [key]: inputLableToDisplay[key]
                                }))
                            }
                        }
                        setSearchAbleKeys(oldvalue => ({
                            ...oldvalue,
                            [dataWithCurly]: false
                        }))
                        setFinalValidation(oldvalue => ({
                            ...oldvalue,
                            [`${dataWithCurly}`]: "notDone"
                        }))
                    }
                    // if the key has ## it is file attachment key..
                    else if (splitedText[j].includes("##")) {
                        let wordWithHash = splitedText[j];
                        let keyNameWithHash = "";
                        let allow = false;
                        let count = 7;
                        for (let index = 0; index <= wordWithHash.length - 1; index++) {
                            if (wordWithHash[index] === "#") {
                                allow = true;
                                count--;
                            }
                            if (allow) {
                                keyNameWithHash = keyNameWithHash + wordWithHash[index];
                            }
                            if (count === 1) {
                                allow = false;
                            }
                        }
                        if (keyNameWithHash.startsWith("#")) {
                            let keyName = keyNameWithHash.split("atchmt##")[1];
                            let OriginalkeyName = keyName.split("##")[0];
                            setTemplateAttachments(oldvalue => ({
                                ...oldvalue,
                                [OriginalkeyName]: OriginalkeyName
                            }))
                            setFinalValidationforDocu(oldvalue => ({
                                ...oldvalue,
                                [`${OriginalkeyName}`]: "notDone"
                            }))
                        }
                    }
                    else if (splitedText[j].startsWith("#$") || splitedText[j].includes("#$")) {
                        let drpDwnKey = splitedText[j].split("#$")[1];
                        if (!drpDwnKey.includes("#$")) {
                            setCustomDropdown(oldvalue => ({
                                ...oldvalue,
                                [drpDwnKey]: []
                            }))
                        }
                        else {
                            console.log("error in reading drpDown values");
                        }
                    }
                }
            }

            setFieldSubmission(true);
            if (props.location.state.templateinputFields + '' !== 'undefined') {
                setInputs(props.location.state.templateinputFields);
                settempDat(props.location.state.templateDetails);
                setInputsfileAttachment(props.location.state.templateFileFields);
                setradioTypeValues(props.location.state.radioTypeValues);
                setRadioTypLst(props.location.state.allowAftRadioCrt);
                setSearchAbleKeys(props.location.state.searchAbleKeys);
                setStatusFlag(props.location.state.statusFlag);
                setOldTemplateCode(props.location.state.oldTemplateCode);
                setCustField(props.location.state.customFields);
                setcustomFieldSearch(props.location.state.customFieldSearch);
                setCustomDropdown(props.location.state.customDropdownOption);
                setSearchAbleKeyCount(props.location.state.searchAbleKeyCount);
                setHTMLTables(props.location.state.dynamicTable);
                setValid1(true);
                setFieldSubmission(false);
                setAllowAftHtmlFile(false);
                setallowAftHtmlFileTwo(false);
            }
        }
        setLoader(true);
    }, [valid]);

    useEffect(() => {
        if (filedSuubmission) {
            for (let key in input) {
                setInputs(oldvalue => ({
                    ...oldvalue,
                    [key]: { "label": `${key}`, "placeHolder": `Enter The ${key} Here`, "inputDescription": `${key}`, "type": "", "minLength": "", "maxLength": "", "minRange": "", "maxRange": "", "inputField": "", "isMandatory": "1", "customValidation": "", "SearchAbleKey": "" }
                }))
                setAllowModalToRender(oldvalue => ({
                    ...oldvalue,
                    [key]: false
                }))
            }
            for (let key in templateAttachments) {
                setInputsfileAttachment(oldvalue => ({
                    ...oldvalue,
                    [templateAttachments[key]]: { "fieldLable": `${templateAttachments[key]}`, "filedDesc": "", "attachmentType": "", "maxAttachmentSize": "", "inputField": "", "key": "" }
                }))
            }

            for (let key in radioTypLst) {
                setradioTypeValues(oldvalue => ({
                    ...oldvalue,
                    [radioTypLst[key]]: { "label": "", "placeHolder": "", "inputDescription": radioTypLst[key], "type": "radio", "minLength": "", "maxLength": "", "minRange": "", "maxRange": "", "inputField": radioTypLst[key], "isMandatory": 1, "customValidation": "" }
                }))
            }

        }
    }, [filedSuubmission])

    useEffect(() => {
        setLoader(false);
        if (valid1) {
            for (let key in input) {
                document.getElementById(key).className = "fa fa-check";
                setFinalValidation(oldvalue => ({
                    ...oldvalue,
                    [key]: "Done"
                }
                ))
                setAllowModalToRender(oldvalue => ({
                    ...oldvalue,
                    [key]: true
                }))
            }

            for (let key in templateAttachments) {
                document.getElementById(templateAttachments[key]).className = "fa fa-check";
                setFinalValidationforDocu(oldvalue => ({
                    ...oldvalue,
                    [templateAttachments[key]]: "Done"
                }))
            }
            for (let key in radioTypeValues) {
                if (radioTypeValues[key].isMandatory === 1 || radioTypeValues[key].isMandatory === "1") {
                    document.getElementById(`${radioTypeValues[key].inputField}RadioId`).checked = false;
                }
                else {
                    document.getElementById(`${radioTypeValues[key].inputField}RadioId`).checked = true;
                }
            }
        }
        setLoader(true);
    }, [valid1])

    // below UseEffect is used to collect the radio type names from rendered from upload page;
    useEffect(() => {
        // allowAftHtmlFileTwo is made false when data's are returned from template filed preview..
        if (allowAftHtmlFile && allowAftHtmlFileTwo) {
            for (let key in radioTypLst) {
                setradioTypeValues(oldvalue => ({
                    ...oldvalue,
                    [radioTypLst[key]]: { "label": "", "placeHolder": "", "inputDescription": `${radioTypLst[key]}`, "type": "radio", "minLength": "", "maxLength": "", "minRange": "", "maxRange": "", "inputField": radioTypLst[key], "isMandatory": 1, "customValidation": "" }
                }))
            }
        }

    }, [allowAftHtmlFile])

    const CustomFieldModal = (event) => {
        if (custField.length === 10) {
            event.preventDefault();
            confirmAlert({
                message: "Maximum of 10 custom fields can be added",
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
        } else {
            setOpenCustFieldModal(true);
            setCustomFieldIndex(-1);
        }
    }

    const CustomFieldModalForEdit = (event, index) => {
        setOpenCustFieldModal(true);
        setCustomFieldIndex(index);
    }

    const openModal = (e, prop) => {
        setNameOfModel(prop);
        setAllowModal(true);
    }

    const openModalfordoc = (eprop) => {
        setNameOfModel(eprop);
        setallowmodalfordoc(true);
    }

    const closeTheModal = () => {
        setAllowModal(false);
        setallowmodalfordoc(false);
        setOpenCustFieldModal(false);
        setAllowmodalForDrpDwn(false);
    }

    const tempdetFun = (e) => {
        // to keep the templateCode in upperCase..
        // if (e.target.id === "templateCode") {
        //     settempDat({
        //         ...tempdat,
        //         [e.target.id]: e.target.value.toUpperCase()
        //     })
        // }
        if (e.target.id === "group") {
            let grpNamAndCode = e.target.value + "";
            let id = grpNamAndCode.split("$")[0];
            let groupName = grpNamAndCode.split("$")[1];
            settempDat({
                ...tempdat,
                [e.target.id]: groupName,
                "groupCode": id
            })
        }

        else if (e.target.id === "ModeofSignature") {
            let modeofsignwithname = e.target.value + "";
            let id = modeofsignwithname.split("$")[0];
            let signmodeName = modeofsignwithname.split("$")[1];
            settempDat({
                ...tempdat,
                [e.target.id]: id,
                "ModeofSignatureName": signmodeName
            })
        }

        else if (e.target.value === "noneOfTheAbove") {
            settempDat({
                ...tempdat,
                [e.target.id]: "1"
            })
        }

        else {
            settempDat({
                ...tempdat,
                [e.target.id]: e.target.value
            })
        }
    }

    const holderTheInputField = (e, nameofModel) => {

        if (e.target.value === "date") {
            document.getElementById(nameofModel + "placeHolder1").hidden = true;
            document.getElementById(nameofModel + "maxLength1").hidden = true;
            document.getElementById(nameofModel + "minLength1").hidden = true;
            document.getElementById(nameofModel + "minRange1").hidden = false;
            document.getElementById(nameofModel + "maxRange1").hidden = false;
            document.getElementById(nameofModel + "minRange").type = "date";
            document.getElementById(nameofModel + "maxRange").type = "date";
        }

        else if (e.target.value === "number") {
            document.getElementById(nameofModel + "placeHolder1").hidden = false;
            document.getElementById(nameofModel + "maxLength1").hidden = true;
            document.getElementById(nameofModel + "minLength1").hidden = true;
            document.getElementById(nameofModel + "minRange1").hidden = false;
            document.getElementById(nameofModel + "maxRange1").hidden = false;
            document.getElementById(nameofModel + "minRange").type = "number";
            document.getElementById(nameofModel + "maxRange").type = "number";
            document.getElementById(nameofModel + "placeHolder").value = `Enter The ${nameofModel} here`;
        }

        else {
            document.getElementById(nameofModel + "placeHolder1").hidden = false;
            document.getElementById(nameofModel + "maxLength1").hidden = false;
            document.getElementById(nameofModel + "minLength1").hidden = false;
            document.getElementById(nameofModel + "minRange1").hidden = true;
            document.getElementById(nameofModel + "maxRange1").hidden = true;
            document.getElementById(nameofModel + "placeHolder").value = `Enter The ${nameofModel} here`;
        }
    }

    // used to create a custom validation..
    const createCustValidDrpDow = () => {
        if (allowValiKeysToCreate) {
            return (
                <>
                    {
                        ValidationKeyData.map((data, index) => (
                            <option key={index} value={data} id={`${data}ValKeyId`}>{data}</option>
                        ))
                    }
                </>
            )
        }
    }

    //input field preview modal 
    const inputFieldPreviewModal = () => {

        if (allowModalToRender[nameofModel]) {
            let arr = [];
            let parjObject = inputs[nameofModel];
            let type = "";
            let placeHolder = false;
            let minLength = false;
            let maxLength = false;
            let minRange = false;
            let maxRange = false;
            let RangeDataType = "number";
            for (let keys in parjObject) {
                if (keys === "type") {
                    type = parjObject[keys];
                }
                arr.push(parjObject[keys] + "");
            }
            if (type === "date") {
                placeHolder = true;
                minLength = true;
                maxLength = true;
                RangeDataType = "date";
            }
            else if (type === "number") {
                minLength = true;
                maxLength = true;
            } else {
                minRange = true;
                maxRange = true;
            }

            return (
                <div key={nameofModel}>
                    <div className='Divo4Css'>
                        <div className='title'>
                            <span>Field Name: </span>
                        </div>
                        <div className='titleName'>
                            <span>{nameofModel}</span>
                        </div>
                    </div>
                    <div className='inputHolderCss'>
                        <div className='Divo5Css'>
                            <div className='InputName'>
                                <span>Label Name <span id="mandatoryRed">*</span>: </span>
                            </div>
                            <div className='inputname1'>
                                <input type='text' name='label' id={`${nameofModel}label`} defaultValue={arr[0]} autoCapitalize='off' className='inputCss' />
                            </div>
                        </div>
                        <div className='Divo5Css' id={`${nameofModel}placeHolder1`} hidden={placeHolder}>
                            <div className='InputName'>
                                <span>Place Holder<span id="mandatoryRed">*</span>: </span>
                            </div>
                            <div className='inputname1'>
                                <input type='text' name='placeHolder' id={`${nameofModel}placeHolder`} defaultValue={arr[1]} className='inputCss' />
                            </div>
                        </div>
                        <div className='Divo5Css'>
                            <div className='InputName'>
                                <span>Field Desc <span id="mandatoryRed">*</span>: </span>
                            </div>
                            <div className='inputname1'>
                                <input type='text' name='inputDescription' id={`${nameofModel}inputDescription`} defaultValue={arr[2]} className='inputCss' />
                            </div>
                        </div>
                        <div className='Divo5Css'>
                            <div className='InputName'>
                                <span>Data Type <span id="mandatoryRed">*</span>: </span>
                            </div>
                            <div className='inputname1'>
                                <select name='dataType' id={`${nameofModel}dataType`} className='selectdropdown' defaultValue={arr[3]} onChange={e => holderTheInputField(e, nameofModel)}>
                                    <option>text</option>
                                    <option>number</option>
                                    <option>date</option>
                                    <option>tel</option>
                                </select>
                            </div>
                        </div>
                        <div className='Divo5Css' id={`${nameofModel}minLength1`} hidden={minLength}>
                            <div className='InputName'>
                                <span>Char Min Length: </span>
                            </div>
                            <div className='inputname1'>
                                <input type='number' name='minLength' id={`${nameofModel}minLength`} defaultValue={arr[4]} className='inputCss' />
                            </div>
                        </div>
                        <div className='Divo5Css' id={`${nameofModel}maxLength1`} hidden={maxLength}>
                            <div className='InputName'>
                                <span>Char Max Length: </span>
                            </div>
                            <div className='inputname1'>
                                <input type='number' id={`${nameofModel}maxLength`} defaultValue={arr[5]} className='inputCss' />
                            </div>
                        </div>
                        <div className='Divo5Css' id={`${nameofModel}minRange1`} hidden={minRange}>
                            <div className='InputName'>
                                <span>Min range: </span>
                            </div>
                            <div className='inputname1'>
                                <input type={RangeDataType} id={`${nameofModel}minRange`} defaultValue={arr[6]} className='inputCss' />
                            </div>
                        </div>
                        <div className='Divo5Css' id={`${nameofModel}maxRange1`} hidden={maxRange}>
                            <div className='InputName'>
                                <span>Max range: </span>
                            </div>
                            <div className='inputname1'>
                                <input type={RangeDataType} id={`${nameofModel}maxRange`} defaultValue={arr[7]} className='inputCss' />
                            </div>
                        </div>
                        <div className='Divo5Css' id={`${nameofModel}customValidation`}>
                            <div className='InputName'>
                                <span>Validation Key: </span>
                            </div>
                            <div className='inputname1'>
                                <select id='ValidationKey' style={{ height: "30px" }} type='text' className='inputCss' defaultValue={arr[10]}>
                                    <option value="" disabled hidden>Choose Validation key</option>
                                    <option key="noneOfthese" value="noneOfthese" id="noneOftheseID">No Validation</option>
                                    {
                                        createCustValidDrpDow()
                                    }
                                </select>
                            </div>
                        </div>
                        <div className='Divo5Css'>
                            <div className='InputName'>
                                <span>Mandatory Field: </span>
                            </div>
                            <div className='inputname1'>
                                <select name='IsMandatory' id={`${nameofModel}IsMandatory`} className='selectdropdown' defaultValue={arr[9] === "0" ? "No" : "Yes"}>
                                    <option>Yes</option>
                                    <option>No</option>
                                </select>
                            </div>
                        </div>
                        <div className='Divo5Css'>
                            <div className='InputName'>
                                <span>Searchable Key: </span>
                            </div>
                            <div className='inputname1'>
                                <select name='SearchableKey' id={`${nameofModel}SearchableKey`} className='selectdropdown' defaultValue={arr[11]}>
                                    <option>No</option>
                                    <option>Yes</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className='Divo6Css'>
                        <div className='proceedCancelCss'>
                            <button className='cancelbtn' type='button' onClick={closeTheModal}>Cancel</button>
                        </div>
                        <div className='proceedCancelCss'>
                            <button className='proceedbtnX' type='button' onClick={e => CollectInputs(e, nameofModel)}>Proceed</button>
                        </div>
                    </div>
                </div>
            )
        }
        else {
            let arr = [];
            let parjObject = inputs[nameofModel];
            for (let keys in parjObject) {
                arr.push(parjObject[keys]);
            }
            return (
                <div key={nameofModel} className='Divo3Css'>
                    <div className='Divo4Css'>
                        <div className='title'>
                            <span>Field Name: </span>
                        </div>
                        <div className='titleName'>
                            <span>{nameofModel}</span>
                        </div>
                    </div>
                    <div className='inputHolderCss'>
                        <div className='Divo5Css'>
                            <div className='InputName'>
                                <span>Label Name<span id="mandatoryRed">*</span>: </span>
                            </div>
                            <div className='inputname1'>
                                <input type='text' name='label' id={`${nameofModel}label`} defaultValue={arr[0]} autoCapitalize='off' className='inputCss' />
                            </div>
                        </div>
                        <div className='Divo5Css' id={`${nameofModel}placeHolder1`} hidden={false}>
                            <div className='InputName'>
                                <span>Place Holder<span id="mandatoryRed">*</span>: </span>
                            </div>
                            <div className='inputname1'>
                                <input type='text' name='placeHolder' id={`${nameofModel}placeHolder`} defaultValue={arr[1]} className='inputCss' />
                            </div>
                        </div>
                        <div className='Divo5Css'>
                            <div className='InputName'>
                                <span>Field Desc<span id="mandatoryRed">*</span>: </span>
                            </div>
                            <div className='inputname1'>
                                <input type='text' name='inputDescription' id={`${nameofModel}inputDescription`} defaultValue={arr[2]} className='inputCss' />
                            </div>
                        </div>
                        <div className='Divo5Css'>
                            <div className='InputName'>
                                <span>Data Type<span id="mandatoryRed">*</span>: </span>
                            </div>
                            <div className='inputname1'>
                                <select name='dataType' id={`${nameofModel}dataType`} className='selectdropdown' defaultValue={arr[3]} onChange={e => holderTheInputField(e, nameofModel)}>
                                    <option>text</option>
                                    <option>number</option>
                                    <option>date</option>
                                    <option>tel</option>
                                </select>
                            </div>
                        </div>
                        <div className='Divo5Css' id={`${nameofModel}minLength1`} hidden={false}>
                            <div className='InputName'>
                                <span>Char Min Length: </span>
                            </div>
                            <div className='inputname1'>
                                <input type='number' name='minLength' id={`${nameofModel}minLength`} defaultValue={arr[4]} className='inputCss' />
                            </div>
                        </div>
                        <div className='Divo5Css' id={`${nameofModel}maxLength1`} hidden={false}>
                            <div className='InputName'>
                                <span>Char Max Length: </span>
                            </div>
                            <div className='inputname1'>
                                <input type='number' id={`${nameofModel}maxLength`} defaultValue={arr[5]} className='inputCss' />
                            </div>
                        </div>
                        <div className='Divo5Css' id={`${nameofModel}minRange1`} hidden={true}>
                            <div className='InputName'>
                                <span>Min range: </span>
                            </div>
                            <div className='inputname1'>
                                <input type='number' id={`${nameofModel}minRange`} defaultValue={arr[6]} className='inputCss' />
                            </div>
                        </div>
                        <div className='Divo5Css' id={`${nameofModel}maxRange1`} hidden={true}>
                            <div className='InputName'>
                                <span>Max range: </span>
                            </div>
                            <div className='inputname1'>
                                <input type='number' id={`${nameofModel}maxRange`} defaultValue={arr[7]} className='inputCss' />
                            </div>
                        </div>
                        <div className='Divo5Css' id={`${nameofModel}customValidation`} hidden={false}>
                            <div className='InputName'>
                                <span>Validation Key: </span>
                            </div>
                            <div className='inputname1'>
                                <select id='ValidationKey' type='text' className='inputCss' defaultValue="">
                                    <option value="" disabled hidden>Choose Validation key</option>
                                    <option key="noneOfthese" value="noneOfthese" id="noneOftheseID">No Validation</option>
                                    {
                                        createCustValidDrpDow()
                                    }
                                </select>
                            </div>
                        </div>
                        <div className='Divo5Css'>
                            <div className='InputName'>
                                <span>Mandatory Field: </span>
                            </div>
                            <div className='inputname1'>
                                <select name='IsMandatory' id={`${nameofModel}IsMandatory`} className='selectdropdown' defaultValue={arr[9] === "0" ? "No" : "Yes"}>
                                    <option>Yes</option>
                                    <option>No</option>
                                </select>
                            </div>
                        </div>
                        <div className='Divo5Css'>
                            <div className='InputName'>
                                <span>Searchable Key: </span>
                            </div>
                            <div className='inputname1'>
                                <select name='SearchableKey' id={`${nameofModel}SearchableKey`} className='selectdropdown' defaultValue={arr[11]}>
                                    <option>No</option>
                                    <option>Yes</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className='Divo6Css'>
                        <div className='proceedCancelCss'>
                            <button className='cancelbtn' type='button' onClick={closeTheModal}>Cancel</button>
                        </div>
                        <div className='proceedCancelCss'>
                        <button className='proceedbtnX' type='button' onClick={e => CollectInputs(e, nameofModel)}>Proceed</button>
                        </div>
                    </div>
                </div>
            )
        }
    }

    // used to collect the size of the custom fields and validate to make it as mandatory or optional.
    const colctCusFilSize = (event, id) => {
        setFileSize(event.target.value);
        if (Number(event.target.value) > 50) {
            if (document.getElementById(id).value === "Yes") {
                document.getElementById(id).value = "No";
            }
        }
    }

    // to allow maker to select searchable key as yes, if size is less than 50 character.
    const searchableField = (event, searchableId) => {
        if (Number(fileSize) > 50) {
            event.preventDefault();
            alert("Custom field size having greater then 50 character, cannot be made as searchable field.");
            document.getElementById(searchableId).value = "No";
        }
    }

    //to change the custom modal fields based on the data type selection..
    const changeFieldLableInputs = (event) => {
        if (event.target.value === "date") {
            document.getElementById("customPlaceHolderBody").hidden = true;
            document.getElementById("customMinlengthBody").hidden = true;
            document.getElementById("customMaxLengthBody").hidden = true;
            document.getElementById("customMinRangeBody").hidden = false;
            document.getElementById("customMaxRangeBody").hidden = false;
            document.getElementById("customMinRange").type = "date";
            document.getElementById("customMaxRange").type = "date";
        }
        else if (event.target.value === "number") {
            document.getElementById("customPlaceHolderBody").hidden = false;
            document.getElementById("customMinlengthBody").hidden = true;
            document.getElementById("customMaxLengthBody").hidden = true;
            document.getElementById("customMinRangeBody").hidden = false;
            document.getElementById("customMaxRangeBody").hidden = false;
            document.getElementById("customMinRange").type = "number";
            document.getElementById("customMaxRange").type = "number";
        }
        else {
            document.getElementById("customPlaceHolderBody").hidden = false;
            document.getElementById("customMinlengthBody").hidden = false;
            document.getElementById("customMaxLengthBody").hidden = false;
            document.getElementById("customMinRangeBody").hidden = true;
            document.getElementById("customMaxRangeBody").hidden = true;
        }
    }

    // used to collect the custom fields details..
    const collectCustFildDetail = (event, index, fromedit) => {
        let customFieldHeader = document.getElementById("customFieldHeaderID").value;
        let customFieldPlaceHolder = document.getElementById("customPlaceHolder").value;
        let CustomInputDescription = document.getElementById("customInputDescription").value;
        let searchAbleID = document.getElementById("searchAbleID").value;
        let mandatoryFieldID = document.getElementById("mandatoryFieldID").value;
        let customerFilled = document.getElementById("customerFilled").checked;
        let templateGroupFilled = document.getElementById("templateOwnerFilled").checked;
        let customFieldLable = document.getElementById("customLabelName").value;
        let customMinLength = document.getElementById("customMinlength").value;
        let customMaxLength = document.getElementById("customMaxLength").value;
        let customMinRange = document.getElementById("customMinRange").value;
        let customMaxRange = document.getElementById("customMaxRange").value;
        let customDataType = document.getElementById("customDataType").value;
        let customValidationKey = document.getElementById("ValidationKey").value;
        let customFieldCheck = "";
        let isManNumber = "";
        if (mandatoryFieldID === "Yes") {
            isManNumber = 1;
        }
        else {
            isManNumber = 0;
        }
        if (searchAbleID === "Yes") {
            customFieldCheck = true;
        }
        else {
            customFieldCheck = false;
        }
        if (customValidationKey === "noneOfthese") {
            customValidationKey = ""
        }
        if (customDataType === "number" || customDataType === "date") {
            customMinLength = "";
            customMaxLength = "";
        }
        else {
            customMinRange = "";
            customMaxRange = "";
        }

        if (customFieldHeader === "" || (customDataType === "date" ? null : customFieldPlaceHolder === "") || CustomInputDescription === "" || customFieldLable === "") {
            event.preventDefault();
            alert("Please fill all the mandatory fields.");
            return;
        }

        else if (customerFilled === false && templateGroupFilled === false) {
            event.preventDefault();
            alert("Please fill all the mandatory fields.");
            return;
        }
        else {
            let searchAbleKeyTrueOrFalse = null;
            if (isManNumber === 1) {
                searchAbleKeyTrueOrFalse = true;
            } else {
                searchAbleKeyTrueOrFalse = false;
            }
            if (fromedit) {
                custField[index] = {
                    "label": customFieldLable, "placeHolder": customFieldPlaceHolder, "inputDescription": CustomInputDescription, "type": customDataType, "minLength": customMinLength,
                    "maxLength": customMaxLength, "minRange": customMinRange, "maxRange": customMaxRange, "inputField": `custom_${customFieldHeader}`,
                    "isMandatory": isManNumber, "customValidation": customValidationKey, "SearchAbleKey": searchAbleID,
                    "customerFilled": customerFilled, "templateGroupFilled": templateGroupFilled
                }
                customFieldSearch[index] = {
                    [`custom_${customFieldHeader}`]: customFieldCheck
                };
            } else {
                setCustField([
                    ...custField,
                    {
                        "label": customFieldLable, "placeHolder": customFieldPlaceHolder, "inputDescription": CustomInputDescription, "type": customDataType, "minLength": customMinLength,
                        "maxLength": customMaxLength, "minRange": customMinRange, "maxRange": customMaxRange, "inputField": `custom_${customFieldHeader}`,
                        "isMandatory": isManNumber, "customValidation": customValidationKey, "SearchAbleKey": searchAbleID,
                        "customerFilled": customerFilled, "templateGroupFilled": templateGroupFilled
                    }
                ])
                setcustomFieldSearch([
                    ...customFieldSearch,
                    {
                        [`custom_${customFieldHeader}`]: customFieldCheck
                    }
                ])
            }
            setSearchAbleKeyCount({
                ...searchAbleKeyCount,
                [`custom_${customFieldHeader}`]: customFieldCheck
            });
        }
        closeTheModal();
    }

    // to fill the custom field header details..
    const openModalForCustFieldDetail = () => {
        if (customFieldindex === -1) {
            return (
                <div key="openModalForCustFieldDetail">
                    <div className='inputHolderCss' style={{ paddingTop: "10px", paddingBottom: "0px" }}>
                        <div className='Divo5Css'>
                            <div className='InputName'>
                                <span>Custom Field Key<span id="mandatoryRed">*</span>: </span>
                            </div>
                            <div className='inputname1' style={{ paddingTop: "1px" }}>
                                <input type='text' name='label' placeholder='Enter the custom field header' id="customFieldHeaderID" autoCapitalize='off' className='inputCss' />
                            </div>
                        </div>
                        <div className='Divo5Css'>
                            <div className='InputName'>
                                <span>Label Name<span id="mandatoryRed">*</span>: </span>
                            </div>
                            <div className='inputname1'>
                                <input type='text' name='label' id="customLabelName" placeholder="Enter the lable name" autoCapitalize='off' className='inputCss' />
                            </div>
                        </div>
                        <div className='Divo5Css' id="customPlaceHolderBody" >
                            <div className='InputName'>
                                <span>Place Holder<span id="mandatoryRed">*</span>: </span>
                            </div>
                            <div className='inputname1'>
                                <input type='text' name='placeHolder' placeholder='Enter the place holder' id="customPlaceHolder" className='inputCss' />
                            </div>
                        </div>
                        <div className='Divo5Css'>
                            <div className='InputName'>
                                <span>Field Desc<span id="mandatoryRed">*</span>: </span>
                            </div>
                            <div className='inputname1'>
                                <input type='text' name='inputDescription' placeholder='Enter the field description' id="customInputDescription" className='inputCss' />
                            </div>
                        </div>
                        <div className='Divo5Css'>
                            <div className='InputName'>
                                <span>Data Type<span id="mandatoryRed">*</span>: </span>
                            </div>
                            <div className='inputname1'>
                                <select name='dataType' id="customDataType" className='selectdropdown' onChange={e => changeFieldLableInputs(e)}>
                                    <option>text</option>
                                    <option>number</option>
                                    <option>date</option>
                                    <option>tel</option>
                                </select>
                            </div>
                        </div>
                        <div className='Divo5Css' id="customMinlengthBody">
                            <div className='InputName'>
                                <span>Char Min Length: </span>
                            </div>
                            <div className='inputname1'>
                                <input type='number' placeholder='Enter the min length' name='minLength' id="customMinlength" className='inputCss' />
                            </div>
                        </div>
                        <div className='Divo5Css' id="customMaxLengthBody">
                            <div className='InputName'>
                                <span>Char Max Length: </span>
                            </div>
                            <div className='inputname1'>
                                <input type='number' placeholder='Enter the max length' id="customMaxLength" className='inputCss' />
                            </div>
                        </div>
                        <div className='Divo5Css' id="customMinRangeBody" hidden={true}>
                            <div className='InputName'>
                                <span>Min range: </span>
                            </div>
                            <div className='inputname1'>
                                <input type='number' id="customMinRange" placeholder='Enter the min range' className='inputCss' />
                            </div>
                        </div>
                        <div className='Divo5Css' id="customMaxRangeBody" hidden={true}>
                            <div className='InputName'>
                                <span>Max range: </span>
                            </div>
                            <div className='inputname1'>
                                <input type='number' id="customMaxRange" placeholder='Enter the max range' className='inputCss' />
                            </div>
                        </div>
                        <div className='Divo5Css'>
                            <div className='InputName'>
                                <span>Validation Key: </span>
                            </div>
                            <div className='inputname1'>
                                <select id='ValidationKey' type='text' className='inputCss'>
                                    <option value="" disabled hidden>Choose Validation key</option>
                                    <option key="noneOfthese" value="noneOfthese" id="noneOftheseID">No Validation</option>
                                    {
                                        createCustValidDrpDow()
                                    }
                                </select>
                            </div>
                        </div>
                        <div className='Divo5Css'>
                            <div className='InputName'>
                                <span>Mandatory Field: </span>
                            </div>
                            <div className='inputname1' style={{ paddingTop: "1px" }}>
                                <select name='IsMandatory' id="mandatoryFieldID" className='selectdropdown'>
                                    <option>No</option>
                                    <option>Yes</option>
                                </select>
                            </div>
                        </div>
                        <div className='Divo5Css'>
                            <div className='InputName'>
                                <span>Searchable Key: </span>
                            </div>
                            <div className='inputname1' style={{ paddingTop: "1px" }}>
                                <select name='SearchableKey' id="searchAbleID" onChange={event => searchableField(event, "searchAbleID")} className='selectdropdown'>
                                    <option>Yes</option>
                                    <option>No</option>
                                </select>
                            </div>
                        </div>
                        <div className='Divo5Css'>
                            <div className='InputName' style={{ paddingTop: "3px" }}>
                                <span>Who Should Fill<span id="mandatoryRed">*</span>: </span>
                            </div>
                            <div className='inputname1' style={{ paddingTop: "5px" }}>
                                <label> <input type='radio' id='customerFilled' name='custmrOrTempOwnr' style={{ width: "20px", height: "14px" }} /></label><span style={{ fontFamily: "FontAwesome" }}>End user </span>
                                <label> <input type='radio' id='templateOwnerFilled' name='custmrOrTempOwnr' style={{ width: "20px", height: "14px" }} /></label><span style={{ fontFamily: "FontAwesome" }}>Template owner</span>
                            </div>
                        </div>
                    </div>
                    <div className='Divo6Css' style={{ paddingTop: "10px" }}>
                        <div className='proceedCancelCss'>
                            <button className='cancelbtn' type='button' onClick={closeTheModal}>Cancel</button>
                        </div>
                        <div className='proceedCancelCss'>
                            <button className='proceedbtnX' type='button' onClick={event => collectCustFildDetail(event, "", false)}>Proceed</button>
                        </div>
                    </div>
                </div>
            )
        }
        else {
            let custArr = [];
            let type = "";
            let minRange = false;
            let maxRange = false
            let placeHolder = false;
            let minLength = false;
            let maxLength = false;
            let dataType = "number"
            for (let key in custField[customFieldindex]) {
                if (key === "type") {
                    type = custField[customFieldindex][key];
                }
                custArr.push(custField[customFieldindex][key]);
            }
            if (type === "date") {
                placeHolder = true;
                minLength = true;
                maxLength = true;
                dataType = "date";
            } else if (type === "number") {
                minLength = true;
                maxLength = true;
            } else {
                minRange = true;
                maxRange = true;
            }

            return (
                <div key="openModalForCustFieldDetail" className='Divo3Css'>
                    <div className='inputHolderCss' style={{ paddingTop: "10px" }}>
                        <div className='Divo5Css'>
                            <div className='InputName'>
                                <span>Custom field key: </span>
                            </div>
                            <div className='inputname1' style={{ paddingTop: "1px" }}>
                                <input type='text' defaultValue={`${custArr[8]}`.substring(7, `${custArr[8]}`.length)} name='label' placeholder='Enter the custom field header' id="customFieldHeaderID" autoCapitalize='off' className='inputCss' />
                            </div>
                        </div>
                        <div className='Divo5Css'>
                            <div className='InputName'>
                                <span>Label Name: </span>
                            </div>
                            <div className='inputname1'>
                                <input type='text' name='label' defaultValue={custArr[0]} id="customLabelName" placeholder="Enter the lable name" autoCapitalize='off' className='inputCss' />
                            </div>
                        </div>
                        <div className='Divo5Css' id="customPlaceHolderBody" hidden={placeHolder}>
                            <div className='InputName'>
                                <span>Place Holder: </span>
                            </div>
                            <div className='inputname1' style={{ paddingTop: "1px" }}>
                                <input type='text' defaultValue={custArr[1]} placeholder='Enter the placeHolder' name='placeHolder' id="customPlaceHolder" className='inputCss' />
                            </div>
                        </div>
                        <div className='Divo5Css'>
                            <div className='InputName'>
                                <span>Field desc: </span>
                            </div>
                            <div className='inputname1' style={{ paddingTop: "1px" }}>
                                <input type='text' defaultValue={custArr[2]} placeholder='Enter the field description' name='inputDescription' id="customInputDescription" className='inputCss' />
                            </div>
                        </div>
                        <div className='Divo5Css'>
                            <div className='InputName'>
                                <span>Data Type: </span>
                            </div>
                            <div className='inputname1'>
                                <select name='dataType' defaultValue={custArr[3]} id="customDataType" placeholder='Choose the place holder' className='selectdropdown' onChange={e => changeFieldLableInputs(e)}>
                                    <option>text</option>
                                    <option>number</option>
                                    <option>date</option>
                                    <option>tel</option>
                                </select>
                            </div>
                        </div>
                        <div className='Divo5Css' id="customMinlengthBody" hidden={minLength}>
                            <div className='InputName'>
                                <span>Char Min Length: </span>
                            </div>
                            <div className='inputname1'>
                                <input type='number' defaultValue={custArr[4]} placeholder='Enter the min length' name='minLength' id="customMinlength" className='inputCss' />
                            </div>
                        </div>
                        <div className='Divo5Css' id="customMaxLengthBody" hidden={maxLength}>
                            <div className='InputName'>
                                <span>Char Max Length: </span>
                            </div>
                            <div className='inputname1'>
                                <input type='number' defaultValue={custArr[5]} placeholder='Enter the max length' id="customMaxLength" className='inputCss' />
                            </div>
                        </div>
                        <div className='Divo5Css' id="customMinRangeBody" hidden={minRange}>
                            <div className='InputName'>
                                <span>Min range: </span>
                            </div>
                            <div className='inputname1'>
                                <input type={dataType} defaultValue={custArr[6]} id="customMinRange" placeholder='Enter the min range' className='inputCss' />
                            </div>
                        </div>
                        <div className='Divo5Css' id="customMaxRangeBody" hidden={maxRange}>
                            <div className='InputName'>
                                <span>Max range: </span>
                            </div>
                            <div className='inputname1'>
                                <input type={dataType} defaultValue={custArr[7]} id="customMaxRange" placeholder='Enter the max range' className='inputCss' />
                            </div>
                        </div>
                        <div className='Divo5Css'>
                            <div className='InputName'>
                                <span>Validation Key: </span>
                            </div>
                            <div className='inputname1'>
                                <select id='ValidationKey' defaultValue={custArr[10]} type='text' className='inputCss'>
                                    <option value="" disabled hidden>Choose Validation key</option>
                                    <option key="noneOfthese" value="noneOfthese" id="noneOftheseID">No Validation</option>
                                    {
                                        createCustValidDrpDow()
                                    }
                                </select>
                            </div>
                        </div>
                        <div className='Divo5Css'>
                            <div className='InputName'>
                                <span>Mandatory field: </span>
                            </div>
                            <div className='inputname1' style={{ paddingTop: "1px" }}>
                                <select name='IsMandatory' defaultValue={custArr[9] === 1 ? "Yes" : "No"} id="mandatoryFieldID" className='selectdropdown'>
                                    <option>No</option>
                                    <option>Yes</option>
                                </select>
                            </div>
                        </div>
                        <div className='Divo5Css'>
                            <div className='InputName'>
                                <span>Searchable key: </span>
                            </div>
                            <div className='inputname1' style={{ paddingTop: "1px" }}>
                                <select name='SearchableKey' defaultValue={custArr[11]} id="searchAbleID" onChange={event => searchableField(event, "searchAbleID")} className='selectdropdown'>
                                    <option>Yes</option>
                                    <option>No</option>
                                </select>
                            </div>
                        </div>
                        <div className='Divo5Css'>
                            <div className='InputName' style={{ paddingTop: "3px" }}>
                                <span>Who should fill<span id="mandatoryRed">*</span>: </span>
                            </div>
                            <div className='inputname1' style={{ paddingTop: "5px" }}>
                                <label> <input type='radio' name='custmrOrTempOwnr' defaultChecked={custArr[12]} id='customerFilled' style={{ width: "20px", height: "14px" }} /></label><span style={{ fontFamily: "FontAwesome" }}>End user </span>
                                <label> <input type='radio' name='custmrOrTempOwnr' defaultChecked={custArr[13]} id='templateOwnerFilled' style={{ width: "20px", height: "14px" }} /></label><span style={{ fontFamily: "FontAwesome" }}>Template owner</span>
                            </div>
                        </div>
                    </div>
                    <div className='Divo6Css'>
                        <div className='proceedCancelCss'>
                            <button className='cancelbtn' type='button' onClick={closeTheModal}>Cancel</button>
                        </div>
                        <div className='proceedCancelCss'>
                        <button className='proceedbtnX' type='button' onClick={event => collectCustFildDetail(event, customFieldindex, true)}>Proceed</button>
                        </div>
                    </div>
                </div>
            )
        }
    }

    // to fill the file attachment validation.
    const openModalforDocu = () => {
        let arr = [];
        let parjObject = inputsfileAttachment[nameofModel];
        for (let keys in parjObject) {
            arr.push(parjObject[keys]);
        }
        return (
            <div key={nameofModel} >
                <div className='Divo4Css'>
                    <div className='title'>
                        <span>Field Name: </span>
                    </div>
                    <div className='titleName'>
                        <span>{nameofModel}</span>
                    </div>
                </div>
                <div className='inputHolderCss'>
                    <div className='Divo5Css'>
                        <div className='InputName'>
                            <span>Label Name<span id="mandatoryRed">*</span>: </span>
                        </div>
                        <div className='inputname1'>
                            <input type='text' name='attachmentLable' id={`${nameofModel}attachmentLable`} defaultValue={arr[0]} autoCapitalize='off' className='inputCss' />
                        </div>
                    </div>
                    <div className='Divo5Css'>
                        <div className='InputName'>
                            <span>Field Desc<span id="mandatoryRed">*</span>: </span>
                        </div>
                        <div className='inputname1'>
                            <input type='text' name='attachmentinputDescription' id={`${nameofModel}attachmentinputDescription`} defaultValue={arr[1]} className='inputCss' />
                        </div>
                    </div>
                    <div className='Divo5Css'>
                        <div className='InputName'>
                            <span>Attachment type<span id="mandatoryRed">*</span>: </span>
                        </div>
                        <div className='inputname1'>
                            <select name='attachmentdataType' id={`${nameofModel}attachmentdataType`} className='selectdropdown' defaultValue={arr[2]}>
                                <option>image/jpeg, image/png</option>
                                <option>application/pdf</option>
                            </select>
                        </div>
                    </div>
                    <div className='Divo5Css'>
                        <div className='InputName'>
                            <span>Max AttachmentSize: </span>
                        </div>
                        <div className='inputname1'>
                            <input type='number' id={`${nameofModel}MaxAttachmentSize`} defaultValue={arr[3]} placeholder='Enter the size in KB' className='inputCss' />
                        </div>
                    </div>
                </div>
                <div className='Divo6Css'>
                    <div className='proceedCancelCss'>
                        <button className='cancelbtn' type='button' onClick={closeTheModal}>Cancel</button>
                    </div>
                    <div className='proceedCancelCss'>
                        <button className='proceedbtnX' type='button' onClick={e => CollectInputsforDocument(e, nameofModel)}>Proceed</button>
                    </div>
                </div>
            </div>
        )
    }

    // used to create the input field form.
    const createInputForm = (params) => {
        let arr = [];
        Object.keys(input).forEach(function (key) {
            arr.push({ [key]: input[key] });
        })
        return (
            <>
                {
                    arr.map((props, index) => (
                        <div key={Object.keys(props)[0]} className='oneLabelBox'>
                            <div key={Object.keys(props)[0]} className='form-Montroll'>
                                <input type='text' disabled={true} value={props[Object.keys(props)[0]]} id={index} className='input-Montroll' />
                            </div>
                            <div className='editFields'>
                                <div className='editcss'>
                                    <button type='button' className='proceedbtn' onClick={e => openModal(e, Object.keys(props)[0])}>Edit</button>
                                </div>
                                <div className='tickMarkcss'>
                                    <span key={Object.keys(props)[0]} style={{ color: 'green' }} id={Object.keys(props)[0]} color='green'></span>
                                </div>
                            </div>
                        </div>
                    )
                    )
                }
            </>
        )
    }

    // on change radio for dynamic tables addition
    const dynamicRadioChange = (e, dynakey, tableNmeKey, index, TblNameInpt) => {
        let flag = 0;
        if (e.target.checked) {
            // to restrict of makaing a table as dynamic if the table contains a innerText as
            // {{Jsobj.
            let tableSelected = tablesInHTML[dynakey];
            let tbody = tableSelected.querySelector('tbody');
            let allowFlag = true;
            if (tbody !== null) {
                const individualStyleTag = tbody.querySelectorAll('tr');
                if (individualStyleTag.length !== 0) {
                    for (let key in individualStyleTag) {
                        if (!isNaN(key)) {
                            let tableData = individualStyleTag[key].querySelectorAll('td');
                            if (tableData.length !== 0) {
                                for (let key in tableData) {
                                    if (!isNaN(key)) {
                                        if ((tableData[key].innerText).includes("{{jsonObj")) {
                                            confirmAlert({
                                                message: `The table contains input fields, so this table cannot be made as dynamic. Please remove the input fields and retry.`,
                                                buttons: [
                                                    {
                                                        label: "OK",
                                                        className: "confirmBtn",
                                                    },
                                                ], closeOnClickOutside: false, // Set to false to prevent closing on click outside
                                            });
                                            allowFlag = false;
                                            document.getElementById(`dyna${dynakey}`).checked = false;
                                        }
                                    }
                                    else {
                                        continue;
                                    }
                                }
                            }
                            else {
                                continue;
                            }
                        }
                        else {
                            continue;
                        }
                    }
                }
                if (allowFlag) {
                    flag = 1;
                    document.getElementById(tableNmeKey).style.display = "";
                }
                else {

                }
            }
            else {
                confirmAlert({
                    message: `Invalid table formate! Table does not contain '<tbody>' tag.`,
                    buttons: [
                        {
                            label: "OK",
                            className: "confirmBtn",
                        },
                    ], closeOnClickOutside: false, // Set to false to prevent closing on click outside
                });
            }
        } else {
            htmlTables[index] = { [Object.keys(htmlTables[index])[0]]: htmlTables[index][Object.keys(htmlTables[index])[0]] };
            document.getElementById(tableNmeKey).style.display = "none";
            document.getElementById(TblNameInpt).value = '';
        }
        const indexToUpdate = htmlTables.findIndex(item => Object.keys(item)[0] === dynakey);
        htmlTables[indexToUpdate][dynakey] = flag;
    }


    // to collect the validation data once submit call is made in modal..
    const CollectInputs = (e, nameofModel) => {

        let label = document.getElementById(nameofModel + "label").value;
        let type = document.getElementById(nameofModel + "dataType").value;
        let inputDescription = document.getElementById(nameofModel + "inputDescription").value;
        let placeHolder = "";
        let minLength = "";
        let maxLength = "";
        let minRange = "";
        let maxRange = "";
        let customValidation = document.getElementById("ValidationKey").value;
        let isMandatoryNo = document.getElementById(nameofModel + "IsMandatory").value;
        let isMandatoryYesOrNo = "";
        let searchAbleKey = document.getElementById(nameofModel + "SearchableKey").value;
        let searchAbleKeyTrueOrFalse = "";
        if (label === "" || label === null) {
            alert("Please enter Label name");
            return;
        }

        if (inputDescription === "" || inputDescription === null) {
            alert("Please Enter Input Description");
            return;
        }

        if (type === "date") {

            if (document.getElementById(nameofModel + "minRange").value !== "" || document.getElementById(nameofModel + "minRange").value !== null) {
                minRange = document.getElementById(nameofModel + "minRange").value;
            }
            if (document.getElementById(nameofModel + "maxRange").value !== "" || document.getElementById(nameofModel + "maxRange").value !== null) {
                maxRange = document.getElementById(nameofModel + "maxRange").value;
            }
        }

        else if (type === "number") {

            if (document.getElementById(nameofModel + "placeHolder").value === "" || document.getElementById(nameofModel + "placeHolder").value === null) {
                alert('Please Fill The PlaceHolder!')
                return;
            }
            else {
                placeHolder = document.getElementById(nameofModel + "placeHolder").value;
            }

            if (document.getElementById(nameofModel + "minRange").value !== "" || document.getElementById(nameofModel + "minRange").value !== null) {
                minRange = document.getElementById(nameofModel + "minRange").value;
            }
            if (document.getElementById(nameofModel + "maxRange").value !== "" || document.getElementById(nameofModel + "maxRange").value !== null) {
                maxRange = document.getElementById(nameofModel + "maxRange").value;
            }
        }

        else if (type === "tel") {

            if (document.getElementById(nameofModel + "placeHolder").value === "" || document.getElementById(nameofModel + "placeHolder").value === null) {
                alert(`please fill the PlaceHolder`);
                return;
            }
            else {
                placeHolder = document.getElementById(nameofModel + "placeHolder").value;
            }
            minLength = 10;
            maxLength = 12;
        }

        else {
            if (document.getElementById(nameofModel + "placeHolder").value === "" || document.getElementById(nameofModel + "placeHolder").value === null) {
                alert(`please fill the PlaceHolder`);
                return;
            }
            else {
                placeHolder = document.getElementById(nameofModel + "placeHolder").value;
            }

            if (document.getElementById(nameofModel + "minLength").value === "" || document.getElementById(nameofModel + "minLength").value === null) {
                minLength = 5;
            }
            else {
                minLength = document.getElementById(nameofModel + "minLength").value;
            }
            if (document.getElementById(nameofModel + "maxLength").value === "" || document.getElementById(nameofModel + "minLength").value === null) {
                maxLength = 150;
            }
            else {
                maxLength = document.getElementById(nameofModel + "maxLength").value;
            }
            if (maxLength > 255 || maxLength <= 0) {
                e.preventDefault();
                alert("The Max Length Should Not Exceed 255 or below 0");
                return;
            }

            else if (minLength <= 0 || minLength > 255) {
                e.preventDefault();
                alert("The Min Length Should not be less than 1 or above 255");
                return;
            }
        }

        if (isMandatoryNo === "Yes") {
            isMandatoryYesOrNo = 1;
        } else {
            isMandatoryYesOrNo = 0;
        }
        if (searchAbleKey === "Yes") {
            searchAbleKeyTrueOrFalse = true;
        } else {
            searchAbleKeyTrueOrFalse = false;
        }

        if (customValidation === "noneOfthese") {
            customValidation = "";
        }

        setInputs({
            ...inputs,
            [nameofModel]: { "label": label, "placeHolder": placeHolder, "inputDescription": inputDescription, "type": type, "minLength": minLength, "maxLength": maxLength, "minRange": minRange, "maxRange": maxRange, "inputField": nameofModel, "isMandatory": isMandatoryYesOrNo, "customValidation": customValidation, "SearchAbleKey": searchAbleKey }
        })

        setAllowModalToRender({
            ...allowModalToRender,
            [nameofModel]: true
        })

        setFinalValidation({
            ...finalValidation,
            [nameofModel]: "Done"
        })

        setSearchAbleKeys({
            ...searchAbleKeys,
            [nameofModel]: searchAbleKeyTrueOrFalse
        })

        setinput({
            ...input,
            [nameofModel]: label
        })

        setSearchAbleKeyCount({
            ...searchAbleKeyCount,
            [nameofModel]: searchAbleKeyTrueOrFalse
        });

        closeTheModal();
        document.getElementById(nameofModel).className = "fa fa-check";
    }

    const CollectInputsforDocument = (e, nameofModel) => {
        let label = "";
        let fieldDesc = "";
        let attachmentdataType = "";
        let MaxAttachmentSize = "";

        if (document.getElementById(`${nameofModel}attachmentLable`).value === "" || document.getElementById(`${nameofModel}attachmentLable`).value === null) {
            e.preventDefault();
            alert(`Please enter the label`);
            return;
        }
        if (document.getElementById(`${nameofModel}attachmentinputDescription`).value === "" || document.getElementById(`${nameofModel}attachmentinputDescription`).value === null) {
            e.preventDefault();
            alert(`Please enter the Attachment Description`);
            return;
        }
        if (document.getElementById(`${nameofModel}attachmentdataType`).value === "" || document.getElementById(`${nameofModel}attachmentdataType`).value === null) {
            e.preventDefault();
            alert(`Please enter the Attachment Type`);
            return;
        }

        if (document.getElementById(`${nameofModel}MaxAttachmentSize`).value !== "") {
            let attachmentSize = document.getElementById(`${nameofModel}MaxAttachmentSize`).value;
            if (attachmentSize > 500) {
                e.preventDefault();
                alert(`AttachmentSize should not exceed 250`);
                return;
            }
            if (attachmentSize <= 0) {
                e.preventDefault();
                alert(`AttachmentSize should not be less that 0`);
                return;
            }
            MaxAttachmentSize = document.getElementById(`${nameofModel}MaxAttachmentSize`).value;
        }
        else {
            MaxAttachmentSize = 500;
        }

        label = document.getElementById(`${nameofModel}attachmentLable`).value;
        fieldDesc = document.getElementById(`${nameofModel}attachmentinputDescription`).value;
        attachmentdataType = document.getElementById(`${nameofModel}attachmentdataType`).value;

        setInputsfileAttachment({
            ...inputsfileAttachment,
            [nameofModel]: { "fieldLable": label, "fieldDesc": fieldDesc, "attachmentType": attachmentdataType, "maxAttachmentSize": MaxAttachmentSize, "inputField": nameofModel, "key": `##atchmt##${nameofModel}##` }
        })

        setFinalValidationforDocu({
            ...finalValidationforDocu,
            [nameofModel]: "Done"
        })

        closeTheModal();
        document.getElementById(nameofModel).className = "fa fa-check";
    }

    const proceedWithJson = (e) => {
        for (let key in tempdat) {
            if (tempdat[key] === '' || tempdat[key] === null) {
                confirmAlert({
                    message: `please fill the ${key}`,
                    buttons: [
                        {
                            label: "OK",
                            className: "confirmBtn",
                        },
                    ],
                });
                return;
            }
        }

        for (let key in finalValidation) {
            if (finalValidation[key] === "notDone") {
                confirmAlert({
                    message: `Please fill the required fields of ${key}`,
                    buttons: [
                        {
                            label: "OK",
                            className: "confirmBtn",
                        },
                    ],
                });
                return;
            }
        }

        for (let key in finalValidationforDocu) {
            if (finalValidationforDocu[key] === "notDone") {
                confirmAlert({
                    message: `Please fill the required fields of ${key}`,
                    buttons: [
                        {
                            label: "OK",
                            className: "confirmBtn",
                        },
                    ],
                });
                return;
            }
        }

        let count = 0;
        for (let key in searchAbleKeyCount) {
            if (searchAbleKeyCount[key] === true) {
                count++;
            } else {
                continue;
            }
        }

        for (let key in htmlTables) {
            if (htmlTables[key][Object.keys(htmlTables[key])[0]] === 1) {
                if (document.getElementById(`colctDynaInpt${Object.keys(htmlTables[key])[0]}`).value === "") {
                    confirmAlert({
                        message: `Kindly enter the name for ${Object.keys(htmlTables[key])[0]}.`,
                        buttons: [
                            {
                                label: "OK",
                                className: "confirmBtn",
                            }
                        ], closeOnClickOutside: false
                    });
                    return;
                }
                else {
                    continue;
                }
            }
            else {
                continue;
            }
        }

        for (let key in customDropdown) {
            let DrpDwnJsArry = customDropdown[key];
            if (DrpDwnJsArry.length < 1) {
                confirmAlert({
                    message: `Kindly include at least one values for the '${key}' option in the Custom Dropdown`,
                    buttons: [
                        {
                            label: "OK",
                            className: "confirmBtn",
                            onClick: () => { return; }
                        },
                    ], closeOnClickOutside: false,
                });
                return;
            }
        }

        e.preventDefault();
        if (count > 10) {
            confirmAlert({
                message: `The searchable keys selected should be less than 10`,
                buttons: [
                    {
                        label: "OK",
                        className: "confirmBtn",
                        onClick: () => { return; }
                    },
                ],
            });
        }
        else {
            props.history.push({
                pathname: "/templateFieldPreview",
                frompath: "/templatePreview",
                state: {
                    templateinputFields: inputs,
                    templateDetails: tempdat,
                    htmlFile: htmlFile,
                    templateFileFields: inputsfileAttachment,
                    radioTypeValues: radioTypeValues,
                    allowAftRadioCrt: allowAftRadioCrt,
                    searchAbleKeys: searchAbleKeys,
                    statusFlag: statusFlag,
                    oldTemplateCode: oldTemplateCode,
                    lableInput: input,
                    customFields: custField,
                    customFieldSearch: customFieldSearch,
                    customDropdownOption: customDropdown,
                    searchAbleKeyCount: searchAbleKeyCount,
                    tablesMadeDyna: htmlTables
                }
            })
        }
    }

    const creatHtmlForm = () => {
        if (allowHtmlfile) {
            var sampleText = htmlText;
            sampleText = sampleText.replaceAll("{{jsonObj.", `<span style="background-color: yellow; height: fit-content;">`)
            sampleText = sampleText.replaceAll("}}", '</span>');
            sampleText = sampleText.replaceAll("##atchmt##", `<span style="background-color: yellow; height: fit-content;">`)
            sampleText = sampleText.replaceAll("##", '</span>');
            sampleText = sampleText.replaceAll("#$", `<span style="background-color: yellow; height: fit-content;">`)
            sampleText = sampleText.replaceAll("#$", '</span>');
            sampleText = sampleText.replace(/@@(.*?)@@/g, "");
            for (let key in htmlTables) {
                sampleText = sampleText.replace([Object.keys(htmlTables[key])[0]], '');
            }
            return (
                <div dangerouslySetInnerHTML={{ __html: sampleText }} />
            )
        }
    }

    const createDropDown = (groupName) => {
        if (allowGroup) {
            return (
                <>
                    {
                        group.map((item) => (
                            <option value={item.code + "$" + item.name} selected={groupName === item.name ? true : false} id={item.code}>{item.name}</option>
                        ))
                    }
                </>
            )
        }
    }

    // used to create the file upload form..
    const createFileUploadtag = () => {
        if (Object.keys(templateAttachments).length !== 0) {
            let templateAttachmentArr = [];
            for (let key in templateAttachments) {
                templateAttachmentArr.push(templateAttachments[key]);
            }
            return (
                <>
                    <div className='part2Css'>
                        <div className='mainHeading'>
                            <span>Attachment Section</span>
                        </div>
                        <div className='formcontroller'>
                            <form id='uploadForm' name='uploadForm'>
                                {
                                    templateAttachmentArr.map((posts, index) => (
                                        <div key={index} className='oneLabelBox'>
                                            <div className='form-Montroll'>
                                                <input type='text' disabled={true} value={posts} className='input-Montroll' name={`${posts}`} />
                                            </div>
                                            <div className='editFields'>
                                                <div className='editcss'>
                                                    <button type='button' className='proceedbtn' onClick={e => openModalfordoc(posts)} name='uploadInputButton'>Edit</button>
                                                </div>
                                                <div className='tickMarkcss'>
                                                    <span style={{ color: 'green' }} id={posts} color='green'></span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </form>
                        </div>
                    </div >
                </>
            )
        }
    }

    //use to collect the value for check and unCheck
    let cheBxChekAndUnchek = (event, Radioname) => {
        if (event.target.checked) {
            setradioTypeValues({
                ...radioTypeValues,
                [Radioname]: { "label": "", "placeHolder": "", "inputDescription": `${Radioname}`, "type": "radio", "minLength": "", "maxLength": "", "minRange": "", "maxRange": "", "inputField": `${Radioname}`, "isMandatory": 0, "customValidation": "" }
            })
        } else {
            setradioTypeValues({
                ...radioTypeValues,
                [Radioname]: { "label": "", "placeHolder": "", "inputDescription": `${Radioname}`, "type": "radio", "minLength": "", "maxLength": "", "minRange": "", "maxRange": "", "inputField": `${Radioname}`, "isMandatory": 1, "customValidation": "" }
            })
        }
    }

    // to create the radio checks.
    let createRadioTypeForm = () => {
        if (Object.keys(radioTypLst).length !== 0) {
            let diffRadioArray = [];
            for (let key in radioTypLst) {
                diffRadioArray.push(radioTypLst[key]);
            }
            return (
                <>
                    <div className='part2Css'>
                        <div className='mainHeading' >
                            <span>Radio Buttons</span>
                        </div>
                        <div className="temdesContentCss" style={{ width: "100%", border: "1px solid black", fontWeight: "normal" }}>
                            <span className="blink">Note: </span>
                            <span style={{ fontSize: "13px" }} id="tempdesc">
                                {
                                    "By default all the radio buttons are made mandatory, to make it optional tick on the checkbox."
                                }
                            </span>
                        </div>
                        <div className='formcontroller'>
                            {
                                diffRadioArray.map((posts, index) => (
                                    <div key={index} className='oneLabelBox'>
                                        <div key={posts} style={{ width: "60%" }} className='form-Montroll'>
                                            <input type='text' disabled={true} value={posts} className='input-Montroll' />
                                        </div>
                                        <div className='editFields' style={{ width: "35%", paddingLeft: "8px" }} >
                                            <div className='editcss' style={{ display: "flex" }} >
                                                <input type='checkBox' style={{ height: "15px" }} id={`${posts}RadioId`} className='proceedbtn' onClick={e => cheBxChekAndUnchek(e, posts)} />
                                                <span style={{ paddingLeft: "2px" }}>optional</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div >
                </>
            )
        }
    }

    // used to create customFielddata 
    const createCustomFieldForm = () => {
        if (custField.length != 0) {
            return (
                <>
                    <div className='formcontroller'>
                        <form id='uploadForm' name='uploadForm'>
                            {
                                custField.map((posts, index) => (
                                    <div key={index} className='oneLabelBox' style={{ marginTop: "10px" }}>
                                        <div className='form-Montroll'>
                                            <input type='text' disabled={true} value={`${posts.inputField}`.substring(7, `${posts.inputField}`.length)} className='input-Montroll' />
                                        </div>
                                        <div className='editFields'>
                                            <div className='editcss'>
                                                <button type='button' className='proceedbtn' name='uploadInputButton' onClick={e => CustomFieldModalForEdit(e, index)}>Edit</button>
                                            </div>
                                            <div className='tickMarkcss'>
                                                <span style={{ color: 'green' }} color='green' className='fa fa-check'></span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </form>
                    </div>
                </>
            )

        }
    }


    //j-query which increase img when cursor is on particular template
    const bigimg = (props, fromlocation) => {
        if (fromlocation === "string") {
            $(document).ready(function () {
                // $(`.toggle${props}`).animate({
                //   height: "135px",
                //   width: "103px"
                // })
                $(`#${props}`).css("color", "red");
            });
        }
        else {
            $(document).ready(function () {
                // $(`.toggle${props}`).animate({
                //   height: "135px",
                //   width: "103px"
                // })
                $(`#${props}`).css("color", "coral");
            });
        }

    };

    //j-query which decrease img when cursor is on particular template
    const smallimg = (props, fromlocation) => {

        $(document).ready(function () {
            // $(`.toggle${props}`).animate({
            //   height: "130px",
            //   width: "100px"
            // })
            $(`#${props}`).css("color", "black");
        });
    }

    const collectTheDrpDwnVal = (e, propValue) => {
        if (document.getElementById(propValue).value === "") {
            e.preventDefault();
            alert('Please enter the value before proceeding!');
            document.getElementById(propValue).focus();
            return;
        }
        else if (customDropdown[dropDwnName].length === 5) {
            e.preventDefault();
            alert('Dropdown options cannot exceed more then 5!');
            document.getElementById(propValue).focus();
            return;
        }
        else {
            if (`${document.getElementById(propValue).value}`.length >= 100) {
                e.preventDefault();
                alert('Entered value cannot exceed more than "100" charactor');
                document.getElementById(propValue).focus();
                return;
            } else {
                let drpDwnDump = [];
                for (let key in customDropdown[propValue]) {
                    drpDwnDump.push(customDropdown[propValue][key])
                }
                drpDwnDump.push(document.getElementById(propValue).value);
                document.getElementById(propValue).value = "";
                setCustomDropdown({
                    ...customDropdown,
                    [propValue]: drpDwnDump
                })
            }
        }
    }

    const AllowmodalForDrpDwn = (dropDwnNme) => {
        setAllowmodalForDrpDwn(true);
        setDropDwnName(dropDwnNme);
    }

    const CltcustomDropdown = () => {
        if (Object.keys(customDropdown).length !== 0) {
            let arrayOfListOfRadioDropDown = [];
            for (let key in customDropdown) {
                arrayOfListOfRadioDropDown.push(key);
            }
            return (
                <div className='part2Css' style={{ marginTop: "25px" }} >
                    <div className='mainHeading' >
                        <span>Dropdown</span>
                    </div>
                    <div className='formcontroller'>
                        {
                            arrayOfListOfRadioDropDown.map((props, index) => (
                                <>
                                    <div key={props} className='oneLabelBox'>
                                        <div key={props} className='form-Montroll'>
                                            <input type='text' disabled={true} value={props} id={index} className='input-Montroll' />
                                        </div>
                                        <div className='editFields'>
                                            <div className='editcss'>
                                                <button type='button' className='proceedbtn' onClick={e => AllowmodalForDrpDwn(props)}>Add</button>
                                            </div>
                                            {/* <div className='tickMarkcss' >
                                                <a onMouseOver={(e) => bigimg(`${props}Finput`, true)} onMouseOut={(e) => smallimg(`${props}Finput`, true)} className='fa fa-bars ' key={props} id={`${props}Finput`} onClick={e => AllowmodalForDrpDwn(props)}></a>
                                            </div> */}
                                        </div>
                                    </div>
                                </>
                            )
                            )
                        }
                    </div>
                </div >
            )
        }
    }

    const removeDrpDwnData = (event, Drpvalue, DrpKey, index) => {
        let Drparray = customDropdown[DrpKey];
        Drparray.splice(index, 1);
        setCustomDropdown({
            ...customDropdown,
            [DrpKey]: Drparray
        })
    }

    const createListOfDrpDwn = () => {
        if (dropDwnName.length !== 0) {
            return (
                <>
                    <div key={`${dropDwnName}divOne`}>
                        <div key={`${dropDwnName}divThree`} className='oneLabelBox'>
                            <div key={dropDwnName} className='form-Montroll'>
                                <input placeholder='Please enter the value' type='text' id={dropDwnName} className='input-MontrollInput' />
                            </div>
                            <div className='editFields'>
                                <div className='editcssInput'>
                                    <a onMouseOver={(e) => bigimg(`${dropDwnName}Plus`, false)} onMouseOut={(e) => smallimg(`${dropDwnName}Plus`, false)} style={{ fontSize: "16px", paddingTop: "10px" }} id={`${dropDwnName}Plus`} type='button' className='fa fa-plus' onClick={e => collectTheDrpDwnVal(e, dropDwnName)} ></a>
                                </div>
                                <div className='tickMarkcss' style={{ fontSize: "20px" }}>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='inputHolderCssVocu ScrollBarForApprove'>
                        {
                            customDropdown[dropDwnName].map((posts, index) => ((
                                <>
                                    <div key={index} style={{ display: "flex" }}>
                                        <div style={{ marginRight: '2px' }}>
                                            {index + 1}.
                                        </div>
                                        <div style={{ paddingRight: "10px" }}>
                                            {posts}
                                        </div>
                                        <div><a onClick={e => removeDrpDwnData(e, posts, dropDwnName, index)} onMouseOver={(e) => bigimg(`${dropDwnName}Remove${index}`, "string")} onMouseOut={(e) => smallimg(`${dropDwnName}Remove${index}`, "string")} id={`${dropDwnName}Remove${index}`} className='fa fa-times'></a></div>
                                    </div>
                                </>
                            )))
                        }
                    </div>

                </>
            )
        }
    }

    // used to collect the table name..
    const colectTablName = (event, tableName, index) => {
        if (event.target.value !== "") {
            htmlTables[index] = { [Object.keys(htmlTables[index])[0]]: htmlTables[index][Object.keys(htmlTables[index])[0]], "tableName": event.target.value };
        } else {
            htmlTables[index] = { [Object.keys(htmlTables[index])[0]]: htmlTables[index][Object.keys(htmlTables[index])[0]] };
        }
    };

    return (
        <>
            <Loader
                loaded={loader}
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
            <>
                <div className='o1'>
                    <div className='o2'>
                        <div className='greyBackGroud scrollbar'>
                            <div className='whitebackground'>
                                <div className='htmltext'>
                                    {
                                        creatHtmlForm()
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='o4'>
                        <div className='form scrollbar'>
                            <div className='part1Css'>
                                <div className='mainHeading1'>
                                    <span>Template Details</span>
                                </div>
                                <div className='formcontroller1'>
                                    <div className='labelCss'>
                                        <span id='inputname'>Template Name</span>
                                    </div>
                                    <div className='inputfield'>
                                        <input id='templateName' type='text' className='input-Montroll1' defaultValue={tempdat.templateName} onChange={e => (tempdetFun(e))}></input>
                                    </div>
                                </div>
                                <div className='formcontroller1'>
                                    <div className='labelCss'>
                                        <span id='inputname'>Template Description</span>
                                    </div>
                                    <div className='inputfield'>
                                        <input id='templateDescp' type='text' className='input-Montroll1' defaultValue={tempdat.templateDescp} onChange={e => (tempdetFun(e))}></input>
                                    </div>
                                </div>
                                <div className='formcontroller1'>
                                    <div className='labelCss'>
                                        <span id='inputname'>Group</span>
                                    </div>
                                    <div className='inputfieldCss'>
                                        <select id='group' type='text' className='input-Montroll1Css' onChange={e => (tempdetFun(e))}>
                                            <option value='' disabled={false} hidden={false}>Choose group</option>
                                            {
                                                createDropDown(tempdat.group)
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div className='formcontroller1'>
                                    <div className='labelCss'>
                                        <span id='inputname'>Sub Group</span>
                                    </div>
                                    <div className='inputfield'>
                                        <input id='subGroup' type='text' className='input-Montroll1' defaultValue={tempdat.subGroup} onChange={e => (tempdetFun(e))}></input>
                                    </div>
                                </div>

                                <div className='formcontroller1'>
                                    <div className='labelCss'>
                                        <span id='inputname'>Mode of signature</span>
                                    </div>
                                    <div className='inputfieldCss'>
                                        <select id='ModeofSignature' type='text' className='input-Montroll1Css' onChange={e => (tempdetFun(e))} >
                                            <option value='' disabled={false} hidden={false}>Choose mode of signature</option>
                                            <option value="1$Electronic sign" selected={tempdat.ModeofSignatureName === "Electronic sign" ? true : false}>Electronic sign</option>
                                            <option value="2$Aadhaar esign" selected={tempdat.ModeofSignatureName === "Aadhaar esign" ? true : false}>Aadhaar esign</option>
                                            <option value="3$OTP sign" selected={tempdat.ModeofSignatureName === "OTP sign" ? true : false}>OTP sign</option>
                                            <option value="4$DSC Token sign" selected={tempdat.ModeofSignatureName === "DSC Token sign" ? true : false}>DSC Token sign</option>
                                        </select>
                                    </div>
                                </div>
                                <div className='formcontroller1'>
                                    <div className='labelCss'>
                                        <span id='inputname'>KYC Verified</span>
                                    </div>
                                    <div className='inputfield'>
                                        <select id='KYC_verified' type='text' className='input-Montroll1Css' onChange={e => (tempdetFun(e))} >
                                            <option value='' disabled={false} hidden={false}>Choose verified type</option>
                                            <option id='kycVerified' value="2" selected={tempdat.KYC_verified === "2" ? true : false}>KYC verified</option>
                                            {/* <option id='registered' value="1" selected={tempdat.KYC_verified === "1" ? true : false}>Registered</option> */}
                                            {/* <option id='IPV' value="3" selected={tempdat.KYC_verified === "3" ? true : false}>IPV</option> */}
                                            <option id='noneOfTheseForKyc' selected={tempdat.KYC_verified === "1" ? true : false} value="noneOfTheAbove">None of the above</option>
                                        </select>                                    </div>
                                </div>

                            </div>
                            <div className='part2Css'>
                                <div className='mainHeading'>
                                    <span>Fields From Template</span>
                                </div>
                                <div className='formcontroller'>
                                    <form>
                                        {
                                            createInputForm()
                                        }
                                    </form>
                                </div>
                            </div>
                            {
                                createFileUploadtag()
                            }
                            {
                                createRadioTypeForm()
                            }
                            <div className='part2Css'>
                                <div className='mainHeading' style={{ marginBottom: "0px", marginTop: "0px" }}>
                                    <span>Custom Fields</span>
                                </div>
                                {
                                    createCustomFieldForm()
                                }
                                <div className='CustomFieldHeader' style={{ marginTop: "3px" }}>
                                    <button className='btn btn-link' style={{ width: "100%", fontFamily: "initial", fontSize: "18px", textAlign: "start" }} onClick={e => CustomFieldModal(e)}> Add custom field</button>
                                </div>
                            </div>
                            {
                                CltcustomDropdown()
                            }
                            {
                                htmlTables.length !== 0 && (
                                    <>
                                        <div className='part2Css'>
                                            <div className='mainHeading' >
                                                <span key="htmltableHead">HTML Tables</span>
                                            </div>
                                            <div className='formcontroller'>
                                                {
                                                    htmlTables.map((data, index) => (
                                                        <>
                                                            <div key={Object.keys(data)[0]} className='oneLabelBox' style={{ marginBottom: "0px" }}>
                                                                <div key={Object.keys(data)[0]} className='form-Montroll'>
                                                                    <input type='text' disabled={true} value={Object.keys(data)[0]} id={index} className='input-Montroll' />
                                                                </div>
                                                            </div>
                                                            <div style={{ display: "flex", marginBottom: "5px" }}>
                                                                <div style={{ paddingTop: "2px" }}><input id={`dyna${Object.keys(data)[0]}`} onClick={e => dynamicRadioChange(e,
                                                                    Object.keys(data)[0], `colctDyna${Object.keys(data)[0]}`, index, `colctDynaInpt${Object.keys(data)[0]}`)} defaultChecked={data[Object.keys(data)[0]] === 1 ? true : false} type='checkBox' name={Object.keys(data)[0]} />
                                                                </div><div style={{ marginRight: "8px", marginLeft: "3px" }}>Allow additional rows</div>
                                                            </div>
                                                            <div className='inputfield' id={`colctDyna${Object.keys(data)[0]}`} style={{ display: ((data).hasOwnProperty('tableName') ? "" : "none"), marginBottom: "5px" }}>
                                                                <input defaultValue={data["tableName"]} onChange={e => colectTablName(e, Object.keys(data)[0], index)} id={`colctDynaInpt${Object.keys(data)[0]}`} placeholder={`Enter name for '${Object.keys(data)[0]}'`} type='text' className='input-Montroll1' ></input>
                                                                <div class="dotted-line"></div>
                                                            </div>
                                                        </>
                                                    ))
                                                }
                                            </div>
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
                            <div className='finalProceedCss'>
                                <button className='proceedbtnX' type='button' onClick={e => proceedWithJson(e)} >Proceed</button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
            <Modal className='inputTakingModel' onClose={closeTheModal} open={allowmodal} center={true} closeOnOverlayClick={false}>
                <div className='WholeContent'>
                    <div className='headingOfModalXcss'>
                        <span style={{ fontSize: "22px" }}>Fill the field details</span>
                    </div>
                    <form>
                        {
                            inputFieldPreviewModal()
                        }
                    </form>
                </div>
            </Modal>
            <Modal className='inputTakingModel' onClose={closeTheModal} open={allowmodalfordoc} center={true} closeOnOverlayClick={false}>
                <div className='WholeContent'>
                    <div className='headingOfModalXcss'>
                        <span style={{ fontSize: "22px" }}>Fill the field details</span>
                    </div>
                    <form>
                        {
                            openModalforDocu()
                        }
                    </form>
                </div>
            </Modal>
            <Modal className='inputTakingModel' onClose={closeTheModal} open={openCustFieldModal} center={true} closeOnOverlayClick={false}>
                <div className='WholeContent'>
                    <div className='headingOfModalXcss'>
                        <span style={{ fontSize: "20px" }}>Fill the custom field details</span>
                    </div>
                    <form>
                        {
                            openModalForCustFieldDetail()
                        }
                    </form>
                </div>
            </Modal>
            <Modal className='inputTakingModel' onClose={closeTheModal} open={allowmodalForDrpDwn} center={true} closeOnOverlayClick={false}>
                <div className='WholeContent'>
                    <div className='headingOfModalXcss'>
                        <span style={{ fontSize: "22px" }}>Dropdown List</span>
                    </div>
                    <div className='Divo4Css'>
                        <div className='title' style={{ fontSize: "15px", width: "34%" }}>
                            <span>Dropdown Name: </span>
                        </div>
                        <div className='titleName' style={{ fontSize: "15px" }}>
                            <span>{dropDwnName}</span>
                        </div>
                    </div>
                    <form>
                        <div key="openModalForCustFieldDetail" className='Divo3Css'>
                            <div className='inputHolderCss' style={{ paddingTop: "10px", paddingBottom: "0px" }}>
                                {
                                    createListOfDrpDwn()
                                }
                            </div>
                        </div>
                    </form>
                    <div className='Divo6Css'>
                        <button className='cancelbtn' type='button' onClick={closeTheModal}>Close</button>
                    </div>
                </div>
            </Modal>
        </>
    )
}
export default memo(HtmlInput1)

