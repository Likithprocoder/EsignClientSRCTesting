import React, { useState, useEffect, useCallback } from "react";
import "./Template.css";
import { memo } from "react";
import $, { event } from "jquery";
import { URL } from "../URLConstant";
import _, { keys } from "lodash";
import { Tooltip } from "reactstrap";
import { confirmAlert } from "react-confirm-alert";
import UserDetailValidation from "./UserDetailValidation";
import Webcam from 'react-webcam';
import ReactCrop from 'react-image-crop'
import imageCompression from 'browser-image-compression';
import { FaCameraRotate } from 'react-icons/fa6';
import { BsCameraFill } from 'react-icons/bs';
import { useRef } from "react";
import 'react-image-crop/dist/ReactCrop.css'
import 'bootstrap/js/dist/modal.js';
import '../AdminUploadTemplate/HtmlUpload.css';
import '../AdminTemplateApproval/AdminApr.css';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Typography } from "@material-ui/core";

var Loader = require("react-loader");

function NewTemplate(props) {

    const initialCropState = {
        unit: '%',
        x: 0,
        y: 0,
        width: 100,
        height: 95
    };

    // loader 
    const [allowLoader, setAllowLoader] = useState(false);

    // templateCode
    const [templateCode, setTemplateCode] = useState("");

    // templateName
    const [templateName, setTemplateName] = useState("");

    // mode of signature as defined 
    const [modeOfSignature, setModeOfSignature] = useState("");

    // used to store the custom field details..
    const [customFieldData, setCustomFieldData] = useState([]);

    // template form attachment details
    const [fileAttahments, setFileAttahments] = useState([]);

    //********************************** */ Select drop down..
    // to store the selectDropdown values which is only used to push to next page and vice versa..
    const [selectDrpDwn, setSelectDrpDwn] = useState({});
    //to render the selectDropDown to Client.
    const [selectDrpArray, setselectDrpArray] = useState([]);
    // to store the selectDrpDwn value and display in the template..
    const [selectDrpDwnVal, setSelectDrpDwnVal] = useState({});
    //********************************** */

    // to store boolean to render custom fields.
    const [allowForCus, setAllowForCus] = useState(false);

    const [screenSize, setScreenSize] = useState({});
    // to set the page pathName..
    const [fromPath, setFromPath] = useState("");

    // to store the meta data.
    const [detail, setDetail] = useState({});

    // to store template draft reference number
    const [temptDrftRef, setTempDrftRef] = useState("");

    //*********************************** Template attachments
    const [templateForRendering, setTemplateForRendering] = useState([]);
    const [templateAttachmentForProcced, settemplateAttachmentForProcced] = useState([]);
    const [imageFileForSaveDraft, setimageFileForSaveDraft] = useState([]);
    const [imageFileForSaveDraftTwo, setimageFileForSaveDraftTwo] = useState([]);
    const [templateAttachmentForDraft, setTemplateAttachmentForDraft] = useState([]);
    //***********************************

    // prefilling of data to UI block boolean..
    const [isDataRender, setIsDataRender] = useState(false);

    // used for allowing a particluar if block to execute based on the boolean..
    const [renderFromOtherPage, setRenderFromOtherPage] = useState(false);

    // radio list
    const [radioButtonList, setRadioButtonList] = useState({});

    // checkBox list
    const [checkBoxList, setCheckedBoxList] = useState({});

    // template radio attachment to  
    const [tempRadioValidation, setTempRadioValidation] = useState([]);

    //camera capture feature
    const webcamRef = useRef(null);
    const [cameraIsOpen, setCameraIsOpen] = useState(true);
    const [captureData, setCaptureData] = useState(null);
    const [iterationId, setIterationId] = useState(0);
    const [capturedImageArray, setCaturedImageArray] = useState([]);
    const [isMobile, setIsMobile] = useState(false);
    const [facingMode, setFacingMode] = useState('user');
    const [selectedOption, setSelectedOption] = useState('None');
    const [crop, setCrop] = useState(initialCropState);
    const [cropWithHighRes, setCropWithHighRes] = useState(initialCropState);
    const [croppedImageUrl, setCroppedImageUrl] = useState(null);
    const [aspect, setAspect] = useState(null);
    const [cropedSize, setCropedSize] = useState(null);
    // tool tip 
    const [tooltipOpen, setToolTipOpen] = useState(false);

    // used for allowing a particluar if block when datas are from server..
    const [allowDataToRenderThisPage, setAllowDataToRenderThisPage] = useState(false);

    // to store only entered value and used to render on the template..
    const [List, SetList] = useState({});

    // to synch both the values on template form input and input modal..
    const [synchInputField, setSynchInputField] = useState({});

    // filled meta data
    const [ListMeta, SetListMeta] = useState({});

    // to store template attachment files when returned from template pdf preview.
    const [templateAttachment, setTemplateAttachment] = useState([]);

    // data to be sent for save draft..
    const [listForSaveDraft, setListForSaveDraft] = useState({});

    // used to store the custom field key and value to be sent to server..
    const [customFieldDetail, setCustomFieldDetail] = useState({});

    // to open modal
    const [allowModal, setAllowModal] = useState({
        dynamicTable: false,
        inputModal: false,
        dropDownModal: false,
    });

    // to open repeat block modal..
    const [openReptBlock, setOpenReptBlock] = useState({
        openReptBlock1: false,
        allowTextArea: false
    });

    // to store the PDF preview pathName.
    const [toPathName, setToPathName] = useState("");

    // Dynamic Table appending defined data.
    const [dynamicTable, setDynamicTable] = useState([]);

    // holds the table columns and its values 
    const [tablesData, setTablesData] = useState({});

    // to control the collapse dropDown.
    const [drpDown, setDrpDown] = useState("");

    // to control the collapse dropDown.
    const [repeatDrpDwn, setrepeatDrpDwn] = useState("");

    //to store the list of repeatable tags 
    const [repeatAbleBlock, setRepeatAbleBlock] = useState({});

    // to store individual name of tables 
    const [dynamicTableName, setDynamicTableName] = useState({
        tableName: "",
        tableValueType: "",
        actualTableName: ""
    });

    // holds the intial html file as it is recieved from server.
    const [htmlFileServer, setHTMLFileServer] = useState();

    // holds the input fields of ready from repetable block.
    const [reptBlockFields, setReptBlockFields] = useState({});

    // holds the name of the blockName on which we currently we work.
    const [intFld, setIntFld] = useState({
        intFldKey: "",
        intFldIndex: 0,
        operationFlag: false
    });

    // inputfield array which contains html input which are to be used in inputModal.
    const [inputFieldArrToModal, setInputFieldArrToModal] = useState({});

    // holds the HTML String 
    const [form, setForm] = useState({
        status: "",
        tempCode: "",
        HtmlBase64String: "",
        templateInputs: [],
        templateDescription: "",
    });

    // to store the eachInputName 
    const [htmlInputFieldKey, setHtmlInputFieldKey] = useState("");

    // to control the scroll of HTML 
    const [scrollControl, setScrollControl] = useState(false);

    // to store the eachInputName 
    const [htmlDrpDwnFieldKey, setHtmlDrpDwnFieldKey] = useState("");

    var monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    // holds the array values of the rept block to be edited..
    const [childNodeOfRptBlck, setChildNodeOfRptBlck] = useState([]);


    // below operation to operate all the time when ever any changes are done.
    useEffect(() => {
        // to assign the function call on click of span on html form.
        for (let key in form.templateInputs) {
            let id = document.getElementById(form.templateInputs[key].inputField);
            if (id !== null && form.templateInputs[key].editable !== 0) {
                id.onclick = newInputField;
            }
        }
        for (let key in selectDrpDwn) {
            let id = document.getElementById(`#$${key}#$Template`);
            if (id !== null) {
                id.onclick = selectDrpDwnModal;
            }
        }
    });

    // scrolls the HTML when repeat block or table is highlighted..
    useEffect(() => {
        if (!(document.getElementById('scrollToreptBlk') === null)) {
            const container = document.getElementById('ScrollBarX');
            const element = document.getElementById('scrollToreptBlk');
            const containerRect = container.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();
            container.scroll({
                top: elementRect.top - containerRect.top + container.scrollTop,
                behavior: 'smooth'
            });
        }
    }, [scrollControl]);

    // To fetch the data from server as well as to reassign the values 
    //when page is returned from edit details.
    // to detect on when device the user is working..
    useEffect(() => {
        // Detect if the device is mobile based on the user agent string
        const checkIsMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        setIsMobile(checkIsMobile);
        // alert("isMobile: " + checkIsMobile)
        // from template PDF preview page.
        if (props.location.frompath === "/draftTemplates" || props.location.frompath === "/templatePdfPreview") {
            setFromPath(props.location.pathname);
            setToPathName(props.location.state.toPathName);
            setDetail(props.location.state.userDetails);
            setForm(props.location.state.Adetails);
            setHTMLFileServer(props.location.state.HTMLFileServer);
            setTempRadioValidation(props.location.state.tempRadioAttch);
            setFileAttahments(props.location.state.templateAttachmentList);
            setTemplateAttachment(props.location.state.templateAttachments);
            setTemplateForRendering(props.location.state.templateAttachments);
            setTempDrftRef(props.location.state.temptDrftRef);
            setModeOfSignature(props.location.state.modeOfSignature);
            setCustomFieldData(props.location.state.customFeildInputs);
            setSelectDrpDwn(props.location.state.selectDrpDwnList);
            setTemplateName(props.location.state.templateName);
            setTemplateCode(props.location.state.templateCode);
            setTablesData(props.location.state.dynamicTableData);
            setReptBlockFields(props.location.state.reptBlockFields);
            setRepeatAbleBlock(props.location.state.repeatAbleBlock);
            for (let key in props.location.state.selectDrpDwnList) {
                setselectDrpArray(oldvalue => ([
                    ...oldvalue,
                    { [key]: props.location.state.selectDrpDwnList[key] }
                ]))
            }
            for (let key in props.location.state.customFeildInputs) {
                if (props.location.state.customFeildInputs[key].tobefilledby === 0) {
                    setAllowForCus(true);
                }
            }
            // dynamic table response receivied from server
            // contains data even if none of the flag is 1.
            // checking if the none of the flag is 1 the setDynamicTable state is kept []
            for (let key in props.location.state.dynamicTable) {
                if (props.location.state.dynamicTable[key][Object.keys(props.location.state.dynamicTable[key])[0]] === 1) {
                    setDynamicTable(props.location.state.dynamicTable)
                    break;
                }
            }
            setRenderFromOtherPage(true);
            setAllowLoader(true);
        }
        // for the first fetch call when page renders...
        else {
            setTemplateName(props.location.state.templateName);
            setTemplateCode(props.location.state.templateCode);
            setFromPath(props.location.pathname);
            setToPathName("/templatePdfPreview");
            const url = URL.getTemplateInputs;
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    authToken: sessionStorage.getItem("authToken"),
                    templateCode: props.location.state.templateCode,
                }),
            };

            fetch(url, options)
                .then((response) => response.json())
                .then((responsedata) => {
                    if (responsedata.status === "SUCCESS") {
                        if (responsedata.hasOwnProperty("tempDataInDrft")) {
                            confirmAlert({
                                title: "Templates",
                                message: "This template data was saved earlier! please select 'Draft saved' to continue or go with the 'New template'.",
                                buttons: [
                                    {
                                        // label: "Continue with the drafts saved earlier!",
                                        label: "Draft saved",
                                        className: "confirmBtn",
                                        onClick: () => {
                                            props.history.push({
                                                pathname: "/draftForms",
                                            });
                                        }
                                    },
                                    {
                                        // label: "Continue with the new fresh template.",
                                        label: "New template",
                                        className: "confirmBtn",
                                        onClick: () => { }
                                    },
                                ], closeOnClickOutside: false, // Set to false to prevent closing on click outside
                            });
                        }
                        setForm(responsedata);
                        setHTMLFileServer(responsedata.HtmlBase64String);
                        setTempRadioValidation(responsedata.templateRadioInputs);
                        setModeOfSignature(responsedata.modeOfSignature);
                        setCustomFieldData(responsedata.customFeildInputs);
                        setFileAttahments(responsedata.templateAttachmentList);
                        // setDynamicTable(responsedata.dynamicTable);
                        for (let key in responsedata.selectDropdown) {
                            let drpDwnKey = Object.keys(responsedata.selectDropdown[key])[0];
                            let drpDwnValue = responsedata.selectDropdown[key][Object.keys(responsedata.selectDropdown[key])[0]];
                            setselectDrpArray(oldvalue => ([
                                ...oldvalue,
                                { [drpDwnKey]: drpDwnValue }]
                            ));
                            setSelectDrpDwnVal(oldvalue => ({
                                ...oldvalue,
                                [`#$${drpDwnKey}#$`]: drpDwnKey
                            }));
                            setSynchInputField((oldvalue) => ({
                                ...oldvalue,
                                [`${drpDwnKey}`]: ""
                            }));
                            setSelectDrpDwn((oldvalue) => ({
                                ...oldvalue,
                                [drpDwnKey]: drpDwnValue
                            }));
                        }

                        for (let key in responsedata.customFeildInputs) {
                            if (responsedata.customFeildInputs[key].tobefilledby === 0) {
                                setAllowForCus(true);
                                break;
                            }
                        }

                        let dataFromServer = responsedata.dynamicTable;
                        // converting HTML string to a DOM..
                        let count = 1;
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(atob(responsedata.HtmlBase64String), 'text/html');
                        const tagExists = doc.querySelectorAll("table");
                        const repeatTags = doc.querySelectorAll("repeatTag");

                        //iterate over <repeatTag> tags and collect the counts..
                        for (let tagKey in repeatTags) {
                            if (!isNaN(tagKey)) {
                                const childrenTags = Array.from(repeatTags[tagKey].children);
                                // Create a new parent element
                                const parentElement = document.createElement('div');
                                // Append all elements from the collection to the parent element
                                Array.from(childrenTags).forEach(element => {
                                    parentElement.appendChild(element.cloneNode(true));
                                });
                                setRepeatAbleBlock(oldvalue => ({
                                    ...oldvalue,
                                    [`Repeatable Block ${count}`]: [parentElement.outerHTML]
                                }));
                                count++;
                                setrepeatDrpDwn(oldvalue => ({
                                    ...oldvalue,
                                    [`Repeatable Block ${count}`]: false
                                }))
                            }
                        }

                        // iterating the table array 
                        for (let key in tagExists) {
                            // tag exists array is not only iterating the tables but few property inside it as well
                            // to avoid this isNaN() funcation is used..
                            if (!isNaN(key)) {
                                const jsObj = dataFromServer[key];
                                let tableFromHTML = tagExists[key];
                                let tableDataArray = [];
                                let tableHeadData = tableFromHTML.querySelector("thead");
                                if (tableHeadData) {
                                    let tableHead = tableHeadData.querySelectorAll("th");
                                    if (tableHead.length !== 0) {
                                        for (let key in tableHead) {
                                            if (!isNaN(key)) {
                                                tableDataArray.push(tableHead[key].innerText);
                                            }
                                        };
                                    }
                                }
                                // Dynamically create JSON object with keys from tableDataArray
                                const jsonObject = tableDataArray.reduce((obj, key) => {
                                    obj[key] = ''; // Set initial value to an empty string
                                    return obj;
                                }, {});
                                setTablesData(oldvalue => ({
                                    ...oldvalue,
                                    [Object.keys(jsObj)[0]]: { headers: jsonObject }
                                }));
                            } else {
                                continue;
                            }
                        }
                        // dynamic table response receivied from server
                        // contains data even if none of the flag is 1.
                        // checking if the none of the flag is 1 the setDynamicTable state is kept []
                        for (let key in responsedata.dynamicTable) {
                            setDrpDown(oldvalue => ({
                                ...oldvalue,
                                [Object.keys(responsedata.dynamicTable[key])[0]]: false
                            }))
                            if (responsedata.dynamicTable[key][Object.keys(responsedata.dynamicTable[key])[0]] === 1) {
                                setDynamicTable(responsedata.dynamicTable)
                                // break;
                            }
                        }
                        setAllowDataToRenderThisPage(true);
                    }
                    else if (responsedata.statusDetails === "KYC not verified") {
                        confirmAlert({
                            message: "KYC should be verified to use this template!",
                            buttons: [
                                {
                                    label: "OK",
                                    className: "confirmBtn",
                                    onClick: () => {
                                        props.history.push("/templates");
                                    },
                                },
                            ],
                        });
                    }
                    else if (responsedata.statusDetails === "Session Expired!!") {
                        confirmAlert({
                            message: responsedata.statusDetails,
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
                    } else {
                        confirmAlertFunction(responsedata.statusDetails);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    confirmAlertFunction(`SomeThing Went Wrong PLease Try Again`);
                });
            setAllowLoader(true);
        }
    }, []);

    // to reassign the check/ticks on template every time..
    useEffect(() => {
        for (let key in radioButtonList) {
            document.getElementById(key).checked = radioButtonList[key];
        }
        for (let key in checkBoxList) {
            document.getElementById(key).checked = checkBoxList[key];
        }
    }, [radioButtonList, checkBoxList]);

    // allowed when its success, returned from server..
    useEffect(() => {
        if (allowDataToRenderThisPage) {
            setAllowLoader(false);
            form.templateInputs.map((pst) => {
                const input1 = pst.inputField;
                SetList((oldvalue) => ({
                    ...oldvalue,
                    [`${input1}`]: input1,
                }));
                setSynchInputField((oldvalue) => ({
                    ...oldvalue,
                    [`${input1}`]: "",
                }));
                SetListMeta((oldvalue) => ({
                    ...oldvalue,
                    [`${input1}`]: { value: input1, dataType: pst.inputDataType }
                }))
                setListForSaveDraft((oldvalue) => ({
                    ...oldvalue,
                    [`${input1}`]: { value: input1, dataType: pst.inputDataType }
                }));
                setInputFieldArrToModal(oldvalue => ({
                    ...oldvalue,
                    [input1]: pst
                }))
            });

            for (let key in customFieldData) {
                setCustomFieldDetail(oldvalue => ({
                    ...oldvalue,
                    [`${customFieldData[key].inputField}`]: { value: '', dataType: customFieldData[key].inputDataType, customField: true, filledBy: customFieldData[key].tobefilledby }
                }))
            }
            setAllowLoader(true);
            setAllowDataToRenderThisPage(false);
        }
    }, [allowDataToRenderThisPage])

    // allowed when page is returned from previous page..
    // used to append values to above declared useStates..
    useEffect(() => {
        if (renderFromOtherPage) {
            setAllowLoader(false);
            for (let key in detail) {
                let userValue = "";
                let userValueForSync = "";
                if (detail[key].value.includes("_____") && Object.keys(detail[key]).length != 4) {
                    userValue = key;
                }
                else {
                    userValue = detail[key].value;
                    if (detail[key].value.includes("-Jan-") || detail[key].value.includes("-Feb-") || detail[key].value.includes("-Mar-") || detail[key].value.includes("-Apr-") || detail[key].value.includes("-May-") ||
                        detail[key].value.includes("-Jun-") || detail[key].value.includes("-Jul-") || detail[key].value.includes("-Aug-") || detail[key].value.includes("-Sep-") || detail[key].value.includes("-Oct-") || detail[key].value.includes("-Nov-") || detail[key].value.includes("-Dec-")) {
                        let formattedDate = convertDateFormate(detail[key].value);
                        document.getElementById(`${key}1`).value = formattedDate;
                        userValueForSync = formattedDate;
                    }
                    else {
                        userValueForSync = detail[key].value;
                    }
                }
                if (Object.keys(detail[key]).length === 4) {
                    setCustomFieldDetail(oldvalue => ({
                        ...oldvalue,
                        [`${key}`]: { value: detail[key].value, dataType: detail[key].dataType, customField: detail[key].customField, filledBy: detail[key].filledBy }
                    }))
                }
                else {
                    if (key.startsWith("#$")) {
                        if (detail[key].value === "__________") {
                            setSelectDrpDwnVal(oldvalue => ({
                                ...oldvalue,
                                [key]: key.substring(2, key.length - 2)
                            }));
                            setSynchInputField((oldvalue) => ({
                                ...oldvalue,
                                [key.substring(2, key.length - 2)]: "",
                            }));
                        } else {
                            setSelectDrpDwnVal(oldvalue => ({
                                ...oldvalue,
                                [key]: detail[key].value
                            }));
                            setSynchInputField((oldvalue) => ({
                                ...oldvalue,
                                [key.substring(2, key.length - 2)]: detail[key].value,
                            }));
                        }
                    }
                    else if (!key.includes("$$")) {
                        SetListMeta(oldvalue => ({
                            ...oldvalue,
                            [key]: { value: detail[key].value, dataType: detail[key].dataType }
                        }));
                        setListForSaveDraft((oldvalue) => ({
                            ...oldvalue,
                            [key]: { value: detail[key].value, dataType: detail[key].dataType },
                        }));
                        SetList((oldvalue) => ({
                            ...oldvalue,
                            [key]: userValue,
                        }));
                        setSynchInputField((oldvalue) => ({
                            ...oldvalue,
                            [key]: userValueForSync,
                        }));
                    }
                }
            }
            // to assign the inputValidation for the setInputFieldArrToModal.
            for (let key in form.templateInputs) {
                setInputFieldArrToModal(oldvalue => ({
                    ...oldvalue,
                    [form.templateInputs[key].inputField]: form.templateInputs[key]
                }))
            }
            setRenderFromOtherPage(false);
            setIsDataRender(true);
            setAllowLoader(true);
        }
    }, [renderFromOtherPage]);

    // Below useEffect is executed when a page is returned from edit details..
    // used to append values in HTML template and input forms..
    useEffect(() => {
        if (isDataRender) {
            setAllowLoader(false);
            for (let key in detail) {
                // Template input fields..
                if (!key.includes("$$") && !key.includes("##") && !key.includes("#$")) {
                    if (detail[key].value.includes("-Jan-") || detail[key].value.includes("-Feb-") || detail[key].value.includes("-Mar-") || detail[key].value.includes("-Apr-") || detail[key].value.includes("-May-") ||
                        detail[key].value.includes("-Jun-") || detail[key].value.includes("-Jul-") || detail[key].value.includes("-Aug-") || detail[key].value.includes("-Sep-") || detail[key].value.includes("-Oct-") || detail[key].value.includes("-Nov-") || detail[key].value.includes("-Dec-")) {
                        let formattedDate = convertDateFormate(detail[key].value);
                        document.getElementById(`${key}1`).value = formattedDate;
                    }
                    else {
                        if (detail[key].hasOwnProperty("filledBy")) {
                            if (detail[key].filledBy !== 1) {
                                document.getElementById(`${key}1`).value = detail[key].value;
                            }
                        }
                        else {
                            if (detail[key].value.includes("_____")) {
                                document.getElementById(`${key}1`).value = "";
                            }
                            else {
                                document.getElementById(`${key}1`).value = detail[key].value;
                            }
                        }
                    }

                }
                //radio and checkboxes.
                else if (key.includes("$$")) {
                    if (detail[key].value === "checked") {
                        document.getElementById(key).checked = true;
                    } else {
                        document.getElementById(key).checked = false;
                    }
                }
                //select dropdowns..
                else if (key.includes("#$")) {
                    if (detail[key].value !== "__________") {
                        document.getElementById(key.substring(2, key.length - 2)).value = detail[key].value;
                    } else {
                        continue;
                    }
                }
                // to template attachments..
                else {
                    for (let attchmentkey in templateAttachment) {
                        if (templateAttachment[attchmentkey].attachmentKey === key) {
                            if (String(templateAttachment[attchmentkey].isAvailableInSvr) === "1") {
                                let file = new File([], `${templateAttachment[attchmentkey].attmntFileName}`, { type: `${templateAttachment[attchmentkey].attachmentType}` });
                                let filenput = document.getElementById(key);
                                document.getElementById(key).name = "isAvailableInSvr";
                                let list = new DataTransfer();
                                list.items.add(file);
                                let myFileList = list.files;
                                filenput.files = myFileList;
                                document.getElementById(`${key}1`).innerHTML = "Attachment Uploaded";
                                document.getElementById(`${key}1`).style.backgroundColor = "#ffc107db";
                            } else {
                                let base64 = templateAttachment[attchmentkey].attachmentData;
                                let byteString = atob(base64.split(",")[1]);
                                let mimeString = base64.split(",")[0].split(":")[1].split(";")[0];
                                let ab = new ArrayBuffer(byteString.length);
                                let ia = new Uint8Array(ab);
                                for (var i = 0; i < byteString.length; i++) {
                                    ia[i] = byteString.charCodeAt(i);
                                }
                                let file = new File(
                                    [ab],
                                    `${templateAttachment[attchmentkey].attmntFileName}`,
                                    { type: mimeString }
                                );
                                let filenput = document.getElementById(key);
                                let list = new DataTransfer();
                                list.items.add(file);
                                let myFileList = list.files;
                                filenput.files = myFileList;
                                document.getElementById(`${key}1`).innerHTML =
                                    "Attachment Uploaded";
                                document.getElementById(`${key}1`).style.backgroundColor =
                                    "#ffc107db";
                            }
                        }
                    }
                }
            }
            setAllowLoader(true);
        }
    }, [isDataRender]);



    /*------------------------Comman used FUNCATIONS-------------------------------------*/
    // input field modal close
    const closeTheModal = () => {
        setAllowModal({
            inputModal: false,
            dropDownModal: false,
            dynamicTable: false
        });
        setOpenReptBlock({
            allowTextArea: false,
            openReptBlock1: false
        });
        setChildNodeOfRptBlck([]);
    };
    const openToolTip = () => {
        setToolTipOpen(true);
    };
    const closeToolTip = () => {
        setToolTipOpen(false);
    };
    // convert date from yyyy-mm-dd to yyyy-mmm-dd..
    function dateFormat(d) {
        var t = new Date(d);
        return t.getDate() + "-" + monthNames[t.getMonth()] + "-" + t.getFullYear();
    };
    // one consent confirmAlert that is used allover.
    const confirmAlertFunction = (message) => {
        confirmAlert({
            message: message,
            buttons: [
                {
                    label: "OK",
                    className: "confirmBtn"
                }
            ],
            closeOnClickOutside: false, // Set to false to prevent closing on click outside
        });
    };
    // to convert dd-mmm-yyyy to dd-mm-yy
    const convertDateFormate = (dateValue) => {
        var date = `${dateValue}`.split("-");
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        for (var j = 0; j < months.length; j++) {
            if (date[1] == months[j]) {
                date[1] = months.indexOf(months[j]) + 1;
            }
        }
        if (date[1] < 10) {
            date[1] = '0' + date[1];
        }
        if (date[0] < 10) {
            date[0] = "0" + date[0];
        }
        var formattedDate = date[2] + "-" + date[1] + "-" + date[0];
        return formattedDate;
    };
    // commonly used must to be filled alert..
    const mustFillInputs = (inputId, label) => {
        confirmAlert({
            message: `Please fill the '${label}' before proceeding`,
            buttons: [
                {
                    label: "OK",
                    className: "confirmBtn",
                    onClick: () => {
                        document
                            .getElementById(inputId)
                            .focus();
                    },
                },
            ], closeOnClickOutside: false, // Set to false to prevent closing on click outside
        });
        setAllowLoader(true);
    };
    // to validate the data..
    const dataValidation = (isCustomValidation, EnteredValue, customValidation, label, datatype, min, max) => {
        let responseJson = {
            boolean: false,
            clinetResponse: "continue"
        }
        if (isCustomValidation) {
            let result = UserDetailValidation(EnteredValue, customValidation);
            let responseToclient = "";
            let allowBoolean = false;
            if (result === "invalidInput") {
                responseToclient = "Invalid date selection";
                allowBoolean = true;
            }
            else if (result === "ageProblem") {
                responseToclient = "age should be between 18 to 65!";
                allowBoolean = true;
            }
            else if (result === "isNotANumber" || !result) {
                responseToclient = `Invalid inputs for the ${label}`;
                allowBoolean = true;
            }
            responseJson = {
                boolean: allowBoolean,
                clinetResponse: responseToclient
            }
            return responseJson;
        }

        else if (datatype === "number" || datatype === "date") {
            if (min === "" && max === "") {
                return responseJson;
            } else if (EnteredValue < min || EnteredValue > max) {
                if (datatype === "date") {
                    min = dateFormat(min);
                    max = dateFormat(max);
                }
                responseJson = {
                    boolean: true,
                    clinetResponse: `The value for the field '${label}' should fall with in range of  ${min} to ${max}.`
                }
                return responseJson;
            }
        }

        else if (datatype === "tel") {
            if (isNaN(EnteredValue) || (EnteredValue.length !== 10 || EnteredValue.length !== 12)) {
                responseJson = {
                    boolean: true,
                    clinetResponse: `Invalid inputs for the field ${label}`
                }
                return responseJson;
            }
        }
        return responseJson;
    };
    /*------------------------Comman used FUNCATIONS-------------------------------------*/


    /*------------------------Template Input form-------------------------------------*/
    // when ever any value changes for template inputs..
    const inputFieldOnchange = (e, FieldId, datatype) => {
        const container = document.getElementById('ScrollBarX');
        const element = document.getElementById(FieldId);
        const containerRect = container.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        const scrollTop = container.scrollTop;
        const containerHeight = container.clientHeight;
        const elementHeight = elementRect.height;
        container.scroll({
            top: elementRect.top - containerRect.top + scrollTop - (containerHeight / 2) + (elementHeight / 2),
            behavior: 'smooth'
        });

        let radiobtn = document.querySelectorAll("input[type=radio]");
        for (let i = 0; i <= radiobtn.length - 1; i++) {
            setRadioButtonList((oldvalue) => ({
                ...oldvalue,
                [radiobtn[i].id]: radiobtn[i].checked
            }));
        }
        let checkbtn = document.querySelectorAll("input[type=checkBox]");
        for (let i = 0; i <= checkbtn.length - 1; i++) {
            setCheckedBoxList((oldvalue) => ({
                ...oldvalue,
                [checkbtn[i].id]: checkbtn[i].checked,
            }));
        }

        // for date as DataType..
        if (e.target.type === "date" || e.target.type === "Date") {
            let dateInMyFormat = dateFormat(e.target.value);
            SetList({
                ...List,
                [e.target.name]: dateInMyFormat,
            });
            setSynchInputField({
                ...synchInputField,
                [e.target.name]: e.target.value,
            });
            SetListMeta({
                ...ListMeta,
                [e.target.name]: { value: dateInMyFormat, dataType: datatype }
            })
            setListForSaveDraft({
                ...listForSaveDraft,
                [e.target.name]: { value: dateInMyFormat, dataType: datatype },
            });

            //if the values are empty the yellow background is showen..
            if (e.target.value === "") {
                SetList({
                    ...List,
                    [e.target.name]: `${e.target.name}`,
                });
                setSynchInputField({
                    ...synchInputField,
                    [e.target.name]: "",
                });
                SetListMeta({
                    ...ListMeta,
                    [e.target.name]: { value: e.target.name, dataType: datatype }
                })
                setListForSaveDraft({
                    ...listForSaveDraft,
                    [e.target.name]: { value: e.target.name, dataType: datatype },
                });
            }
        }

        // rest of the data types..
        if (e.target.type !== "date" && e.target.type !== "Date") {
            SetList({
                ...List,
                [e.target.name]: e.target.value,
            });
            setSynchInputField({
                ...synchInputField,
                [e.target.name]: e.target.value,
            });
            SetListMeta({
                ...ListMeta,
                [e.target.name]: { value: e.target.value, dataType: e.target.type }
            })
            setListForSaveDraft({
                ...listForSaveDraft,
                [e.target.name]: { value: e.target.value, dataType: e.target.type }
            });

            //if the values are empty the yellow background is showen..
            if (e.target.value === "") {
                SetList({
                    ...List,
                    [e.target.name]: `${e.target.name}`,
                });
                setSynchInputField({
                    ...synchInputField,
                    [e.target.name]: "",
                });
                SetListMeta({
                    ...ListMeta,
                    [e.target.name]: { value: e.target.name, dataType: e.target.type }
                })
                setListForSaveDraft({
                    ...listForSaveDraft,
                    [e.target.name]: { value: e.target.name, dataType: e.target.type },
                })
            }
        }
    };
    // template input form Modal..
    // to open the modal when clicked on html form for template datainputs..
    const newInputField = (event) => {
        setHtmlInputFieldKey(event.srcElement.id);
        setAllowModal({
            ...allowModal,
            inputModal: true
        });
    };
    // to open modal of dropDown..
    // to open the modal when clicked on html form used for the Template dropDown..
    const selectDrpDwnModal = (event) => {
        setHtmlDrpDwnFieldKey((event.srcElement.id).substring(2, ((event.srcElement.id).length - 10)));
        setAllowModal({
            ...allowModal,
            dropDownModal: true
        });
    };
    // returns input field to the inputFieldModal..
    const inputFieldModal = () => {
        if (allowModal.inputModal && htmlInputFieldKey.length !== 0) {
            let inputValidation = inputFieldArrToModal[htmlInputFieldKey];
            let jsValidationObj = {
                id: `${htmlInputFieldKey}ModalInput`,
                customValidationKey: inputValidation.customValidation,
                inputField: inputValidation.inputField,
                dataType: inputValidation.inputDataType,
                minRange: inputValidation.minRange,
                maxRange: inputValidation.maxRange,
                minLength: inputValidation.minLength,
                maxLength: inputValidation.maxLength,
                label: inputValidation.label,
                id: `${inputValidation.inputField}ModalInput`
            }
            return (
                <>
                    <div key="key" style={{ paddingTop: "16px" }}>
                        <div className='Divo4Css'>
                            <div className='title'>
                                <span> Label: </span>
                            </div>
                            <div style={{ width: "fit-content", marginLeft: "10px" }} className='titleName'>
                                <span>{inputValidation.label}</span>
                            </div>
                        </div>
                        <div className='inputHolderCss'>
                            <div className='Divo5Css'>
                                <input type={inputValidation.inputDataType}
                                    placeholder={inputValidation.placeHolder} min={inputValidation.minRange} max={inputValidation.maxRange} minLength={inputValidation.minLength} maxLength={inputValidation.maxLength}
                                    name={inputValidation.label} id={`${inputValidation.inputField}ModalInput`} defaultValue={synchInputField[inputValidation.inputField]} autoCapitalize='off' className='inputCssTemplate' />
                            </div>
                        </div>
                        <div className="InRange_R1" style={{ paddingTop: "8px" }}
                            hidden={(inputValidation.minRange !== "" && inputValidation.maxRange !== "" && inputValidation.minRange !== " " && inputValidation.maxRange !== " ") ? false : true}>
                            <div className="InRange_R2" >
                                <div className="InRange_R3" >
                                    <div className="InRange_R3" style={{ width: "85%" }}>Minimum range</div> <div>:</div>
                                </div>
                                <div className="InRange_R4" >
                                    <span>{inputValidation.minRange}</span>
                                </div>
                            </div>
                            <div className="InRange_R2" >
                                <div className="InRange_R3" >
                                    <div style={{ width: "85%" }}>Maximum range</div> <div>:</div>
                                </div>
                                <div className="InRange_R4" >
                                    <span>{inputValidation.maxRange}</span>
                                </div>
                            </div>
                        </div>
                        <div className="InRange_R1" style={{ paddingTop: "8px" }}
                            hidden={(inputValidation.maxLength !== "" && inputValidation.minLength !== "" && inputValidation.maxLength !== " " && inputValidation.minLength !== " ") ? false : true}>
                            <div className="InRange_R2" >
                                <div className="InRange_R3" >
                                    <div className="InRange_R3" style={{ width: "85%" }}>Minimum Length</div> <div>:</div>
                                </div>
                                <div className="InRange_R4" >
                                    <span>{inputValidation.minLength}</span>
                                </div>
                            </div>
                            <div className="InRange_R2" >
                                <div className="InRange_R3" >
                                    <div style={{ width: "85%" }}>Maximum Length</div> <div>:</div>
                                </div>
                                <div className="InRange_R4" >
                                    <span>{inputValidation.maxLength}</span>
                                </div>
                            </div>
                        </div>
                        <div style={{ width: "100%", textAlign: "center", paddingTop: "8px" }}>
                            <button className='proceedbtnXVoucher' type='button' onClick={e => collectInputModalData(e, jsValidationObj)}>OK</button>
                        </div>
                    </div >
                </>
            )
        }
        if (allowModal.dropDownModal && htmlDrpDwnFieldKey.length !== 0) {
            return (
                <>
                    <div key="key" className='Divo3Css' style={{ paddingTop: "16px" }}>
                        <div className='Divo4Css'>
                            <div style={{ width: "fit-content" }} className='title'>
                                <span> Dropdown: </span>
                            </div>
                            <div style={{ width: "fit-content", marginLeft: "10px" }} className='titleName'>
                                <span>{htmlDrpDwnFieldKey}</span>
                            </div>
                        </div>
                        <div className='inputHolderCss'>
                            <div className='Divo5Css'>
                                <div>
                                    <div className='inputfieldCss'>
                                        <select id={`${htmlInputFieldKey}DrpDwnModl`} style={{ borderColor: "#9dc1e3" }} className='input-Montroll1Css' /*onChange={e => selectedValue(e, htmlInputFieldKey)}*/>
                                            <option value='' disabled={false} hidden={false}>Choose value</option>
                                            {
                                                createDropDown(selectDrpDwn[htmlDrpDwnFieldKey], htmlDrpDwnFieldKey)
                                            }
                                        </select>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div style={{ width: "100%", textAlign: "center", paddingTop: "8px" }}>
                            <button className='proceedbtnXVoucher' type='button' onClick={e => selectedValue(e, htmlDrpDwnFieldKey, `${htmlInputFieldKey}DrpDwnModl`)}>OK</button>
                        </div>
                    </div>
                </>
            )
        }

    };
    // to collect inputs data entered through modal..
    const collectInputModalData = (event, jsValidation) => {
        let scrollIntoViewOptions = { block: "center" };
        const element = document.getElementById(jsValidation.inputField);
        element.scrollIntoView(scrollIntoViewOptions);
        let Enteredvalue = document.getElementById(jsValidation.id).value;
        let validationResponse = {
            boolean: false,
            clinetResponse: "continue"
        };
        if (Enteredvalue !== "") {
            if (jsValidation.customValidationKey !== "") {
                validationResponse = dataValidation(true, Enteredvalue, jsValidation.customValidationKey, jsValidation.label, jsValidation.dataType, "", "");
            } else if (jsValidation.dataType === "number") {
                validationResponse = dataValidation(false, Number(Enteredvalue), jsValidation.customValidationKey, jsValidation.label, jsValidation.dataType, Number(jsValidation.minRange), Number(jsValidation.maxRange));
            } else if (jsValidation.dataType === "date") {
                validationResponse = dataValidation(false, new Date(Enteredvalue), jsValidation.customValidationKey, jsValidation.label, jsValidation.dataType, new Date(jsValidation.minRange), new Date(jsValidation.maxRange));
            } else if (jsValidation.dataType === "tel") {
                validationResponse = dataValidation(false, Enteredvalue, jsValidation.customValidationKey, jsValidation.label, jsValidation.dataType, "", "");
            }
            if (validationResponse.boolean) {
                event.preventDefault();
                confirmAlertFunction(validationResponse.clinetResponse);
                return;
            }
        }
        closeTheModal();
        document.getElementById(`${jsValidation.inputField}1`).value = Enteredvalue;
        if (jsValidation.dataType === "date" || jsValidation.dataType === "Date") {
            let dateInMyFormat = dateFormat(Enteredvalue);
            SetList({
                ...List,
                [jsValidation.inputField]: dateInMyFormat,
            });
            setSynchInputField({
                ...synchInputField,
                [jsValidation.inputField]: Enteredvalue,
            });
            SetListMeta({
                ...ListMeta,
                [jsValidation.inputField]: { value: dateInMyFormat, dataType: jsValidation.dataType }
            })
            setListForSaveDraft({
                ...listForSaveDraft,
                [jsValidation.inputField]: { value: dateInMyFormat, dataType: jsValidation.dataType },
            });


            //if the values are empty the yellow background is showen..
            if (Enteredvalue === "") {
                SetList({
                    ...List,
                    [jsValidation.inputField]: `${jsValidation.inputField}`,
                });
                setSynchInputField({
                    ...synchInputField,
                    [jsValidation.inputField]: "",
                });
                SetListMeta({
                    ...ListMeta,
                    [jsValidation.inputField]: { value: jsValidation.inputField, dataType: jsValidation.dataType }
                })
                setListForSaveDraft({
                    ...List,
                    [jsValidation.inputField]: { value: jsValidation.inputField, dataType: jsValidation.dataType },
                });
            }
        }

        if (jsValidation.dataType !== "date" && jsValidation.dataType !== "Date") {
            SetList({
                ...List,
                [jsValidation.inputField]: Enteredvalue,
            });
            setSynchInputField({
                ...synchInputField,
                [jsValidation.inputField]: Enteredvalue,
            });
            SetListMeta({
                ...ListMeta,
                [jsValidation.inputField]: { value: Enteredvalue, dataType: jsValidation.dataType }
            })
            setListForSaveDraft({
                ...listForSaveDraft,
                [jsValidation.inputField]: { value: Enteredvalue, dataType: jsValidation.dataType }
            });

            //if the values are empty the yellow background is showen..
            if (Enteredvalue === "") {
                SetList({
                    ...List,
                    [jsValidation.inputField]: `${jsValidation.inputField}`,
                });
                setSynchInputField({
                    ...synchInputField,
                    [jsValidation.inputField]: "",
                });
                SetListMeta({
                    ...ListMeta,
                    [jsValidation.inputField]: { value: jsValidation.inputField, dataType: jsValidation.dataType }
                })
                setListForSaveDraft({
                    ...listForSaveDraft,
                    [jsValidation.inputField]: { value: jsValidation.inputField, dataType: jsValidation.dataType },
                });
            }
        }
    };
    /*------------------------Template Input form-------------------------------------*/


    /*------------------------save draft -------------------------------------*/
    // tempalte saving in draft tempates page.
    const saveDraft = (e) => {
        setAllowLoader(false);
        let formInputs = form.templateInputs;

        for (let keys in formInputs) {

            if (formInputs[keys].customValidation != "") {
                e.preventDefault();
                if (document.getElementById(`${formInputs[keys].inputField}1`).value + "" === "") {
                    continue;
                }
                else {
                    let responseJson = dataValidation(true, document.getElementById(`${formInputs[keys].inputField}1`).value + "", formInputs[keys].customValidation,
                        formInputs[keys].label, "", "", "");
                    if (responseJson.boolean) {
                        setAllowLoader(true);
                        e.preventDefault();
                        confirmAlert({
                            message: responseJson.clinetResponse,
                            buttons: [
                                {
                                    label: "OK",
                                    className: "confirmBtn",
                                    onClick: () => {
                                        document
                                            .getElementById(`${formInputs[keys].inputField}1`)
                                            .focus();
                                    },
                                },
                            ],
                        });
                        return;
                    }
                    else {
                        continue;
                    }
                }
            }

            else if (formInputs[keys].inputDataType === "number") {
                e.preventDefault();
                if (document.getElementById(`${formInputs[keys].inputField}1`).value + "" === "") {
                    continue;
                }
                else {
                    let validationResponse = dataValidation(false, Number(document.getElementById(`${formInputs[keys].inputField}1`).value, ""),
                        formInputs[keys].label, "number", Number(formInputs[keys].minRange), Number(formInputs[keys].minRange));
                    if (validationResponse.boolean) {
                        e.preventDefault();
                        confirmAlert({
                            message: validationResponse.clinetResponse,
                            buttons: [
                                {
                                    label: "OK",
                                    className: "confirmBtn",
                                    onClick: () => {
                                        document
                                            .getElementById(`${formInputs[keys].inputField}1`)
                                            .focus();
                                    },
                                },
                            ],
                        });
                        setAllowLoader(true);
                        return;
                    }
                    else {
                        continue;
                    }
                }
            }

            else if (formInputs[keys].inputDataType === "date") {
                e.preventDefault();
                if (document.getElementById(`${formInputs[keys].inputField}1`).value + "" === "") {
                    continue;
                }
                else {
                    let validationResponse = dataValidation(false, new Date(document.getElementById(`${formInputs[keys].inputField}1`).value), "",
                        formInputs[keys].label, "date", new Date(formInputs[keys].minRange), new Date(formInputs[keys].maxRange));
                    if (validationResponse.boolean) {
                        e.preventDefault();
                        confirmAlert({
                            message: validationResponse.clinetResponse,
                            buttons: [
                                {
                                    label: "OK",
                                    className: "confirmBtn",
                                    onClick: () => {
                                        document
                                            .getElementById(`${formInputs[keys].inputField}1`)
                                            .focus();
                                    },
                                },
                            ],
                        });
                        setAllowLoader(true);
                        return;
                    }
                    else {
                        continue;
                    }
                }
            }

            else if (formInputs[keys].inputDataType === "tel") {
                e.preventDefault();
                if (document.getElementById(`${formInputs[keys].inputField}1`).value + "" === "") {
                    continue;
                }
                else {
                    let validationResponse = dataValidation(false, document.getElementById(`${formInputs[keys].inputField}1`).value,
                        formInputs[keys].label, "tel", "", "");
                    if (validationResponse.boolean) {
                        e.preventDefault();
                        confirmAlert({
                            message: validationResponse.clinetResponse,
                            buttons: [
                                {
                                    label: "OK",
                                    className: "confirmBtn",
                                    onClick: () => {
                                        document
                                            .getElementById(`${formInputs[keys].inputField}1`)
                                            .focus();
                                    },
                                },
                            ],
                        });
                        setAllowLoader(true);
                        return;
                    } else {
                        continue;
                    }
                }
            }
        }

        for (let keys in customFieldData) {
            if (customFieldData[keys].customValidation != "" && customFieldData[keys].tobefilledby === 0) {
                e.preventDefault();
                if (document.getElementById(`${customFieldData[keys].inputField}1`).value + "" === "") {
                    continue;
                }
                else {
                    let responseJson = dataValidation(true, document.getElementById(`${customFieldData[keys].inputField}1`).value + "", customFieldData[keys].customValidation,
                        customFieldData[keys].label, "", "", "");
                    if (responseJson.boolean) {
                        setAllowLoader(true);
                        e.preventDefault();
                        confirmAlert({
                            message: responseJson.clinetResponse,
                            buttons: [
                                {
                                    label: "OK",
                                    className: "confirmBtn",
                                    onClick: () => {
                                        document
                                            .getElementById(`${customFieldData[keys].inputField}1`)
                                            .focus();
                                    },
                                },
                            ],
                        });
                        return;
                    }
                    else {
                        continue;
                    }
                }
            }

            else if (customFieldData[keys].inputDataType === "number" && customFieldData[keys].tobefilledby !== 1) {
                e.preventDefault();
                if (document.getElementById(`${customFieldData[keys].inputField}1`).value + "" === "") {
                    continue;
                }
                else {
                    let validationResponse = dataValidation(false, Number(document.getElementById(`${customFieldData[keys].inputField}1`).value, ""),
                        customFieldData[keys].label, "number", Number(customFieldData[keys].minRange), Number(customFieldData[keys].minRange));
                    if (validationResponse.boolean) {
                        e.preventDefault();
                        confirmAlert({
                            message: validationResponse.clinetResponse,
                            buttons: [
                                {
                                    label: "OK",
                                    className: "confirmBtn",
                                    onClick: () => {
                                        document
                                            .getElementById(`${customFieldData[keys].inputField}1`)
                                            .focus();
                                    },
                                },
                            ],
                        });
                        setAllowLoader(true);
                        return;
                    }
                    else {
                        continue;
                    }
                }
            }

            else if (customFieldData[keys].inputDataType === "date" && customFieldData[keys].tobefilledby !== 1) {
                e.preventDefault();
                if (document.getElementById(`${customFieldData[keys].inputField}1`).value + "" === "") {
                    continue;
                }
                else {
                    let validationResponse = dataValidation(false, new Date(document.getElementById(`${customFieldData[keys].inputField}1`).value, ""),
                        customFieldData[keys].label, "date", new Date(customFieldData[keys].minRange), new Date(customFieldData[keys].maxRange));
                    if (validationResponse.boolean) {
                        e.preventDefault();
                        confirmAlert({
                            message: validationResponse.clinetResponse,
                            buttons: [
                                {
                                    label: "OK",
                                    className: "confirmBtn",
                                    onClick: () => {
                                        document
                                            .getElementById(`${customFieldData[keys].inputField}1`)
                                            .focus();
                                    },
                                },
                            ],
                        });
                        setAllowLoader(true);
                        return;
                    }
                    else {
                        continue;
                    }
                }
            }

            else if (customFieldData[keys].inputDataType === "tel" && customFieldData[keys].tobefilledby !== 1) {
                e.preventDefault();
                if (document.getElementById(`${customFieldData[keys].inputField}1`).value + "" === "") {
                    continue;
                }
                else {
                    let validationResponse = dataValidation(false, document.getElementById(`${customFieldData[keys].inputField}1`).value,
                        customFieldData[keys].label, "tel", "", "");
                    if (validationResponse.boolean) {
                        e.preventDefault();
                        confirmAlert({
                            message: validationResponse.clinetResponse,
                            buttons: [
                                {
                                    label: "OK",
                                    className: "confirmBtn",
                                    onClick: () => {
                                        document
                                            .getElementById(`${customFieldData[keys].inputField}1`)
                                            .focus();
                                    },
                                },
                            ],
                        });
                        setAllowLoader(true);
                        return;
                    } else {
                        continue;
                    }
                }
            }
        }

        let file = document.querySelectorAll("input[type=file]");
        let totalfileuplodedcount = compareAndPrepareAttData(e, false, false);
        let radio = document.querySelectorAll("input[type=radio]");
        var checkBox = document.querySelectorAll("input[type=checkBox]");
        if (radio.length !== 0) {
            for (let i = 0; i <= radio.length - 1; i++) {
                if (radio[i].checked === false) {

                    listForSaveDraft[radio[i].id] = { value: "", dataType: "radio" };
                } else {

                    listForSaveDraft[radio[i].id] = { value: "checked", dataType: "radio" };
                }
            }
        }
        if (checkBox.length !== 0) {
            for (let i = 0; i <= checkBox.length - 1; i++) {
                if (checkBox[i].checked === false) {
                    listForSaveDraft[checkBox[i].id] = { value: "", dataType: "checkBox" };
                } else {
                    listForSaveDraft[checkBox[i].id] = { value: "checked", dataType: "checkBox" };
                }
            }
        }

        for (let key in listForSaveDraft) {
            if (listForSaveDraft[key].value === key) {
                let json = { value: "__________", dataType: listForSaveDraft[key].dataType };
                listForSaveDraft[key] = json;
            }
        }

        //to include the custom field to the list..
        for (let key in customFieldDetail) {
            listForSaveDraft[key] = customFieldDetail[key];
        }

        // to store the selectdropdownValues..
        for (let key in selectDrpDwnVal) {
            if (key === `#$${selectDrpDwnVal[key]}#$`) {
                listForSaveDraft[key] = { value: "__________" };
            }
            else {
                listForSaveDraft[key] = { value: selectDrpDwnVal[key] };
            }
        }

        // let file = document.querySelectorAll("input[type=file]");
        let isFilesAvailable = false;
        for (let index = 0; index <= file.length - 1; index++) {
            if (file[index].value !== "") {
                isFilesAvailable = true;
            }
        }

        // checking if any images are captured are attached.
        if (capturedImageArray.length !== 0) {
            isFilesAvailable = true;
        };

        if (isFilesAvailable) {
            let count = 0;
            if (Object.keys(imageFileForSaveDraft).length !== 0) {
                for (let key in imageFileForSaveDraft) {
                    if (imageFileForSaveDraft[key].attachmentData != "") {
                        let reader = new FileReader();
                        reader.readAsDataURL(imageFileForSaveDraft[key].attachmentData);
                        reader.onload = function () {
                            templateAttachmentForDraft[count] = {
                                attachmentData: reader.result,
                                attachmentKey: key,
                                attachmentType: imageFileForSaveDraft[key].attachmentData.type,
                                attachmentLable: imageFileForSaveDraft[key].attachmentLable,
                                attachmentId: imageFileForSaveDraft[key].attachmentId,
                                attmntFileName: imageFileForSaveDraft[key].attmntFileName
                            };
                            count++;
                            if (count === totalfileuplodedcount) {
                                SaveDraftAPI(e);
                                setTemplateForRendering(imageFileForSaveDraftTwo);
                                setimageFileForSaveDraft([]);
                            }
                        };
                        reader.onerror = function (error) {
                            console.log("Error: ", error);
                        };
                    } else {
                        templateAttachmentForDraft[count] = {
                            attachmentData: "",
                            attachmentKey: key,
                            attachmentType: imageFileForSaveDraft[key].attachmentType,
                            attachmentLable: imageFileForSaveDraft[key].attachmentLable,
                            attachmentId: imageFileForSaveDraft[key].attachmentId,
                            attmntFileName: imageFileForSaveDraft[key].attmntFileName,
                            attachmentDimension: imageFileForSaveDraft[key].attachmentDimension,
                            isAvailableInSvr: imageFileForSaveDraft[key].isAvailableInSvr,
                        };
                        count++;
                        if (count === totalfileuplodedcount) {
                            SaveDraftAPI(e);
                            setTemplateForRendering(imageFileForSaveDraftTwo);
                            setimageFileForSaveDraft([]);
                        }
                    }
                }
            } else {
                SaveDraftAPI(e);
                setimageFileForSaveDraft([]);
            }
        } else {
            SaveDraftAPI(e);
        }
        e.preventDefault();
    };
    // Final save draft funcation which saves the data... 
    const SaveDraftAPI = e => {
        setTemplateAttachmentForDraft([]);
        setAllowLoader(false);
        // converting dynamic tables data to array format and storing on server side.
        let additionalData = {};
        let reptData = { "reptBlockFields": reptBlockFields, "repeatAbleBlock": repeatAbleBlock, "encodedHTML": form.HtmlBase64String };
        // appending the repetable Block to the dynamicTableArray..
        additionalData["repeatAbleBolckData"] = JSON.stringify(reptData);
        additionalData["dynamicTableArray"] = JSON.stringify(tablesData);

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                authToken: sessionStorage.getItem("authToken"),
                templateData: listForSaveDraft,
                templateCode: templateCode,
                templateAttachments: templateAttachmentForDraft,
                temptDrftRef: temptDrftRef,
                dynaTableDataForSaveDraft: additionalData
            }),
        };

        fetch(URL.saveTemplateDrafts, options)
            .then((response) => response.json())
            .then((responsedata) => {
                if (responsedata.status === "SUCCESS") {
                    e.preventDefault();
                    setAllowLoader(true);
                    confirmAlertFunction(responsedata.statusDetails);
                    e.preventDefault();
                } else if (responsedata.statusDetails === "Session Expired!!") {
                    setAllowLoader(true);
                    confirmAlert({
                        message: responsedata.statusDetails,
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
                else if (responsedata.status === "failedInValidation") {
                    e.preventDefault();
                    confirmAlert({
                        message: responsedata.statusDetails,
                        buttons: [
                            {
                                label: "OK",
                                className: "confirmBtn",
                                onClick: () => {
                                    document.getElementById(`${responsedata.fieldLabel}1`).focus();
                                },
                            },
                        ],
                    });
                    setAllowLoader(true);
                    return;
                }
                else {
                    confirmAlertFunction(responsedata.statusDetails);
                }
            })
            .catch((error) => {
                confirmAlertFunction(`SomeThing Went Wrong PLease Try Again!`);
            });
        setAllowLoader(true);
    };
    /*------------------------save draft -------------------------------------*/


    /*------------------------HTML Create (UI)-------------------------------------*/
    // to create Template to render on UI..
    const creatMyForm = () => {
        let HtmlHash = atob(form.HtmlBase64String);
        var renderingHtml = HtmlHash;
        let dataToSplit = HtmlHash;
        let splitedHtmlForm = dataToSplit.split("\n");
        for (let i = 0; i <= splitedHtmlForm.length - 1; i++) {
            let eachLine = splitedHtmlForm[i];
            let words = eachLine.split(" ");
            for (let j = 0; j <= words.length - 1; j++) {
                // '{{' having input fields..
                if (words[j].includes("{{") || words[j].includes("}}")) {
                    let wordwithFirstCurly = words[j].split("{{")[1];
                    let wordWithSecondCurly = wordwithFirstCurly.split("}}")[0];
                    let dataWithCurly = wordWithSecondCurly.split(".")[1];
                    renderingHtml = renderingHtml.replace(
                        `{{${wordWithSecondCurly}`,
                        `<span id=${dataWithCurly} class=${`${List[dataWithCurly]}` !== dataWithCurly ? "recount" : "encount"
                        }>${List[dataWithCurly]}</span >`
                    );
                    renderingHtml = renderingHtml.replace("}}", "");
                }

                // '##' search for the attachments..
                else if (words[j].includes("##")) {
                    let wordWithHash = words[j];
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
                        let id = keyNameWithHash;
                        let keyName = keyNameWithHash.split("atchmt##")[1];
                        let OriginalkeyName = keyName.split("##")[0];
                        renderingHtml = renderingHtml.replace(
                            `##atchmt##${OriginalkeyName}##`,
                            `<div><span style="font-size:12px; margin-left:5px; font-family: initial; background-color:yellow;" id=${`${id}1`}>(Please Upload the attachment)</span></div>`
                        );
                    }
                }

                // '#$' search for the  selectDropDown
                else if (words[j].startsWith("#$")) {
                    renderingHtml = renderingHtml.replace(`${words[j]}`,
                        `<span id=${`${words[j]}Template`} class=${`#$${selectDrpDwnVal[words[j]]}#$` !== words[j] ? "recount" : "encount"
                        }>${selectDrpDwnVal[words[j]]}</span>`
                    );
                }
            }
        }

        // removing @@ repeatAble search keys from HTML 
        renderingHtml = renderingHtml.replace(/@@(.*?)@@/g, "");

        // removing dynamic-table keys from the template, to avoid showing to end user..
        for (let key in dynamicTable) {
            renderingHtml = renderingHtml.replace([Object.keys(dynamicTable[key])[0]], "");
        }

        return <div dangerouslySetInnerHTML={{ __html: renderingHtml }} />;
    };
    /*------------------------HTML Create (UI)-------------------------------------*/


    /*------------------------Custom fields-------------------------------------*/
    //  to create custom field input form.
    const customFieldInputForm = () => {
        if (customFieldData.length != 0 && allowForCus) {
            return (
                <div className="fileUploadBorder">
                    <span className="form-montrol1" style={{ marginBottom: "10px" }}>
                        fill the custom field input
                    </span>
                    {
                        customFieldData.map((posts, index) => {
                            if (posts.tobefilledby === 0) {
                                return (
                                    <div key={index}>
                                        <div className="form-loop md-5">
                                            <label style={{ width: "100%" }}>{posts.label}
                                                <input
                                                    name={posts.inputField}
                                                    id={`${posts.inputField}1`}
                                                    minLength={posts.minLength}
                                                    maxLength={posts.maxLength}
                                                    min={posts.minRange}
                                                    max={posts.maxRange}
                                                    type={posts.inputDataType}
                                                    class="form-montrol"
                                                    placeholder={`${posts.placeHolder}`}
                                                    onChange={(e) => cusFieldOnChange(e, posts.inputField, posts.tobefilledby)}
                                                    autoComplete="true"
                                                />
                                            </label>
                                            <span className="WarMesForInVaInputCss" id={`${posts.inputField}ToDisplayWarMess`}></span>
                                        </div>

                                    </div>
                                )
                            }
                        })
                    }
                </div>
            )
        }
    };
    // to collect the custom field data, entered by the user...
    const cusFieldOnChange = (event, key, tobeFilledBy) => {
        let radiobtn = document.querySelectorAll("input[type=radio]");
        for (let i = 0; i <= radiobtn.length - 1; i++) {
            setRadioButtonList((oldvalue) => ({
                ...oldvalue,
                [radiobtn[i].id]: radiobtn[i].checked,
            }));
        }
        let checkbtn = document.querySelectorAll("input[type=checkBox]");
        for (let i = 0; i <= checkbtn.length - 1; i++) {
            setCheckedBoxList((oldvalue) => ({
                ...oldvalue,
                [checkbtn[i].id]: checkbtn[i].checked,
            }));
        }

        if (event.target.type === "date" || event.target.type === "Date") {
            let dateInMyFormat = dateFormat(event.target.value);
            setCustomFieldDetail({
                ...customFieldDetail,
                [`${key}`]: { value: dateInMyFormat, dataType: event.target.type, customField: true, filledBy: tobeFilledBy }
            })
        }

        if (event.target.type !== "date" && event.target.type !== "Date") {
            setCustomFieldDetail({
                ...customFieldDetail,
                [`${key}`]: { value: event.target.value, dataType: event.target.type, customField: true, filledBy: tobeFilledBy }
            })
        }
    };
    /*------------------------Custom fields-------------------------------------*/


    /*------------------------Custom select drop down-------------------------------------*/
    // creates dropdown values..
    const createDropDown = (listArray, drpDwnKey) => {
        if (listArray.length !== 0) {
            return (
                <>
                    {
                        listArray.map((item) => (
                            <option key={`${item}Key`} selected={synchInputField[drpDwnKey] === item ? true : false} value={item} id={`${item}Option`}>{item}</option>
                        ))
                    }
                </>
            )
        }
    };
    //drop down selected values
    const selectedValue = (event, key, DomID) => {
        let radiobtn = document.querySelectorAll("input[type=radio]");
        for (let i = 0; i <= radiobtn.length - 1; i++) {
            setRadioButtonList((oldvalue) => ({
                ...oldvalue,
                [radiobtn[i].id]: radiobtn[i].checked,
            }));
        }
        let checkbtn = document.querySelectorAll("input[type=checkBox]");
        for (let i = 0; i <= checkbtn.length - 1; i++) {
            setCheckedBoxList((oldvalue) => ({
                ...oldvalue,
                [checkbtn[i].id]: checkbtn[i].checked,
            }));
        }

        if (document.getElementById(DomID).value === "") {
            setSelectDrpDwnVal({
                ...selectDrpDwnVal,
                [`#$${key}#$`]: key
            })
            setSynchInputField((oldvalue) => ({
                ...oldvalue,
                [`${key}`]: "",
            }));
        }
        else {
            setSelectDrpDwnVal({
                ...selectDrpDwnVal,
                [`#$${key}#$`]: document.getElementById(DomID).value
            })
            setSynchInputField((oldvalue) => ({
                ...oldvalue,
                [`${key}`]: document.getElementById(DomID).value,
            }));
        }
        closeTheModal();
        // to sroll the view of the custom dropdown on HTML.. 
        const container = document.getElementById('ScrollBarX');
        const element = document.getElementById(`${`#$${key}#$`}Template`);
        const containerRect = container.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        const scrollTop = container.scrollTop;
        const containerHeight = container.clientHeight;
        const elementHeight = elementRect.height;
        container.scroll({
            top: elementRect.top - containerRect.top + scrollTop - (containerHeight / 2) + (elementHeight / 2),
            behavior: 'smooth'
        });
    };
    /*------------------------Custom select drop down-------------------------------------*/


    /*------------------------add rows to the table-------------------------------------*/
    // used to change the value
    const colapsDrpDwn = (panel) => (event, expanded) => {
        if (expanded) {
            setDrpDown(panel);
            updateHTML(panel, "", false, "");
        } else {
            setDrpDown("");
            updateHTML("", "", false, "");
        }
    };
    // () to create a HTML file based on the Data updated.
    const updateHTML = (tableName, tableKey, boolean, repetableKey) => {
        // adding of the data to the tables in HTML..
        // need to convert the HTML in to base64 and add to the form usestate....
        const contents = atob(htmlFileServer);
        const parser = new DOMParser();
        const doc = parser.parseFromString(contents, 'text/html');
        const tagExists = doc.querySelectorAll('table');
        const repetableTags = doc.querySelectorAll('repeatTag');
        // reading the tables prsent in the HTML. appending the added rows to the table.
        for (let key in tagExists) {
            if (!isNaN(key)) {
                if (dynamicTable[key][Object.keys(dynamicTable[key])[0]] === 1) {
                    // dynamicTable
                    let table = tagExists[key];
                    if (Number(tableName.split("_")[1]) === (Number(key) + 1)) {
                        table.setAttribute("style", `${table.getAttribute('style')}; border: 3px solid green;`)
                        table.setAttribute('id', 'scrollToreptBlk');
                        setScrollControl(!scrollControl);
                    }
                    let tbody = table.querySelector('tbody');
                    if (tbody === null) {
                        // deleting a key and value inside the JSON..
                        if (!boolean) {
                            delete tablesData[tableName][tableKey];
                        }
                        confirmAlertFunction(`Insertion of data to this table cannot be performed!`);
                        closeTheModal();
                        return;
                    } else {
                        // reading the style tag from already present <td> tags
                        const individualStyleTag = table.querySelector("thead");
                        let styleProperty = "";
                        let tableDataStyle = "";
                        let respectiveTable = "";
                        if (individualStyleTag) {
                            const trStyleTag = table.querySelector("tr");
                            if (trStyleTag.getAttribute('style') !== null) {
                                styleProperty = individualStyleTag.getAttribute('style');
                            }
                            let tData = trStyleTag.querySelector('th');
                            if (tData) {
                                if (tData.getAttribute('style') !== null) {
                                    tableDataStyle = individualStyleTag.querySelector('th').getAttribute('style');
                                }
                            }
                        }
                        respectiveTable = tablesData[`Table_${Number(key) + 1}`];
                        for (let keyzz in respectiveTable) {
                            if (keyzz !== "headers") {
                                // Insert a new row into the <tbody>..
                                const bodyRow = tbody.insertRow();
                                // adding style attribute..
                                bodyRow.setAttribute('style', `${styleProperty}; background-color: #fafa96`);
                                const individualRowsData = respectiveTable[keyzz]
                                for (let key1 in individualRowsData) {
                                    const cell = bodyRow.insertCell();
                                    cell.setAttribute('style', tableDataStyle)
                                    cell.textContent = individualRowsData[key1];
                                }
                                // iterating to add data to the rows of table..
                            } else { continue }
                        }
                    }
                }
                else { continue }
            }
            else { continue }
        }

        let docString = doc.documentElement.outerHTML;
        // iterate the repeatTag and highlighting the repetable Block..
        for (let key in repetableTags) {
            if (repetableKey.substring(17, repetableKey.length) === `${Number(key) + 1}`) {
                // const parentElement = docElement.querySelector("repeatTag1");
                const parentElement = document.createElement('div');
                parentElement.setAttribute('id', 'scrollToreptBlk');
                setScrollControl(!scrollControl);
                const reptTag = document.createElement('repeatTag');
                parentElement.setAttribute('style', "border: 3px solid green;margin-bottom: 5px;  width: fit-content; height: fit-content");
                const childElements = repetableTags[key].innerHTML;
                const range = document.createRange();
                // Create a document fragment from the HTML string
                const fragment = range.createContextualFragment(childElements);
                // Iterate over all child elements and process them
                Array.from(fragment.children).forEach((node) => {
                    parentElement.appendChild(node.cloneNode(true));
                    // Perform operations on each node
                });
                // Append all elements from the collection to the parent element
                reptTag.appendChild(parentElement);
                reptTag.insertAdjacentHTML('beforeend', `@@repeatTag${Number(key) + 1}@@`);
                // console.log(reptTag.outerHTML);
                docString = docString.replace(repetableTags[key].outerHTML, `${reptTag.outerHTML}`);
            }
        }

        // iterating to append the repeatAble blocks..
        for (let key in repeatAbleBlock) {
            // iterating the array
            for (let keyz in repeatAbleBlock[key]) {
                // avoid the 1st index content appending to HTML form because it contains the original data and 1 extra 
                // data will be appended...
                if (keyz !== "0") {
                    docString = docString.replace(`@@repeatTag${key.substring(key.length - 1, key.length)}@@`,
                        `<div style="word-break: break-all;word-wrap: break-word;border:2px solid yellow;margin-bottom: 5px;width: fit-content;height: fit-content;overflow-wrap: break-word;">${(repeatAbleBlock[key][keyz])}</div>@@repeatTag${key.substring(17, key.length)}@@`);
                }
            }
        }



        // replacing the new htmlBase64 which contains new rows appended..
        setForm({
            ...form,
            HtmlBase64String: btoa(docString)
        })
    };
    // open modal for to add rows to the table
    const dynamicTableModalOpner = (event, tableKey, tableType, tableName) => {
        event.preventDefault();
        setAllowModal({
            ...allowModal,
            dynamicTable: true
        });
        setDynamicTableName({
            tableName: tableKey,
            tableValueType: tableType,
            actualTableName: tableName
        });
    };
    // deletion of rows from the table.
    const deleteTableRow = (event, tableName, tableKey) => {
        event.preventDefault();
        delete tablesData[tableName][tableKey];
        // iterating and changing the rows number orderly starting from 1 to n.
        let updatedRows = tablesData[tableName];
        let toBeUpdatRows = {};
        let count = 1;
        for (let key in updatedRows) {
            if (key === "headers") {
                toBeUpdatRows[key] = updatedRows[key];
            }
            else {
                toBeUpdatRows["Row " + count] = updatedRows[key];
                count++;
            }
        }
        setTablesData({
            ...tablesData,
            [tableName]: toBeUpdatRows
        })
        updateHTML(tableName, tableKey, true, "");
        toast.error("Row deleted!", { autoClose: 1000 });
    };
    // to return the input fields for adding the rows to the table
    const dynamicTableFun = () => {
        const content = tablesData[dynamicTableName.tableName][dynamicTableName.tableValueType];
        let tableKey = "";
        if (dynamicTableName.tableValueType === "headers") {
            tableKey = `Row ${(Object.keys(tablesData[dynamicTableName.tableName]).length)}`;
        } else {
            tableKey = dynamicTableName.tableValueType;
        }
        const tableHeadersArray = [];
        for (let key in content) {
            tableHeadersArray.push(key);
        };
        return (
            <>
                <div className='Divo4Css'>
                    <div className='title'>
                        <span>Name: </span>
                    </div>
                    <div className='titleName'>
                        <span>{dynamicTableName.actualTableName}</span>
                    </div>
                </div>
                <div className='Divo4Css' hidden={dynamicTableName.tableValueType === "headers" ? true : false}>
                    <div className='title'>
                        <span>Row: </span>
                    </div>
                    <div className='titleName'>
                        <span>{(dynamicTableName.tableValueType).split(" ")[1]}</span>
                    </div>
                </div>
                <div className='inputHolderCss' >
                    {
                        tableHeadersArray.map((data, index) => (
                            <div key={index} className='Divo5Css'>
                                <div className='InputName' style={{ width: "40%", fontSize: "15px" }}>
                                    <span>{data} : </span>
                                </div>
                                <div style={{ width: "55%" }}>
                                    <input type='text' placeholder={`Enter the ${data} here`} name='attachmentLable' id={data} defaultValue={content[data]} autoCapitalize='off' className='inputCss' />
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className='Divo6Css'>
                    <div className='proceedCancelCss'>
                        <button className='cancelbtn' type='button' onClick={closeTheModal}>Cancel</button>
                    </div>
                    <div className='proceedCancelCss'>
                        <button className='proceedbtnX' type='button' onClick={e =>
                            collectTableRowData(e, tableHeadersArray, dynamicTableName.tableName, tableKey, (dynamicTableName.tableValueType === "headers" ? true : false))}>{dynamicTableName.tableValueType === "headers" ? "Add" : "Save Changes"}</button>
                    </div>
                </div>
            </>

        )
    };
    // to collect the table row data
    const collectTableRowData = (e, idArray, tableName, tableKey, flag) => {
        e.preventDefault();
        let boolean = true;
        // value updation before changes in the HTML.
        const arrayToJSConverter = idArray.reduce((obj, value) => {
            if (document.getElementById(value).value !== "") {
                boolean = false;
            }
            obj[value] = document.getElementById(value).value
            return obj;
        }, {});
        if (boolean) {
            confirmAlertFunction('Fill atleast one of the input to insert the row!');
            return;
        } else {
            tablesData[tableName] = {
                ...tablesData[tableName],
                [tableKey]: arrayToJSConverter
            };
            updateHTML(tableName, tableKey, true, "");
            toast.success(flag ? "Row added!" : "Row edited!", { autoClose: 1000 });
            closeTheModal();
        };
    };
    /*------------------------add rows to the table--------------------------------------*/


    /*------------------------Repeatable blocks--------------------------------------*/
    // on call of add btn in repeatAbleBlock block 
    const repetColapsDrpDwn = (panel) => (event, expanded) => {
        if (expanded) {
            setrepeatDrpDwn(panel);
            updateHTML("", "", false, panel);
        } else {
            setrepeatDrpDwn("");
            updateHTML("", "", false, "");
        }
    }
    // open modal for to add repeatable blocks
    const repeatAbleBlk = (event, value, index, boolean) => {
        event.preventDefault();
        // if the key is already present then it indicates the operation is for edit..
        if (!reptBlockFields.hasOwnProperty(value)) {
            let HtmlHash = repeatAbleBlock[value][0];
            let dataToSplit = HtmlHash;
            let splitedHtmlForm = dataToSplit.split("\n");
            let inputFields = {};
            // read the inputs from the repeatable block..
            // and create a json of the input fields..
            for (let i = 0; i <= splitedHtmlForm.length - 1; i++) {
                let eachLine = splitedHtmlForm[i];
                let words = eachLine.split(" ");
                for (let j = 0; j <= words.length - 1; j++) {
                    if (words[j].includes("{{") || words[j].includes("}}")) {
                        let wordwithFirstCurly = words[j].split("{{")[1];
                        let wordWithSecondCurly = wordwithFirstCurly.split("}}")[0];
                        let dataWithCurly = wordWithSecondCurly.split(".")[1];
                        inputFields[dataWithCurly] = [];
                    }
                }
            }
            if (Object.keys(inputFields).length !== 0) {
                setReptBlockFields({
                    ...reptBlockFields,
                    [value]: inputFields
                });
                setOpenReptBlock({
                    ...openReptBlock,
                    openReptBlock1: true
                });
            }
            else {
                // repeat the section..
                const range = document.createRange();
                // Create a document fragment from the HTML string
                const fragment = range.createContextualFragment(repeatAbleBlock[value][index]);
                // Iterate over all child elements and process them
                const node = fragment.firstChild;
                let booleann = false;
                // to check weather the elements contain any <table> tag..
                // if it contains any table tag then dont allow for the editing option..
                for (let key in node.childNodes) {
                    if (!isNaN(key)) {
                        if ((node.childNodes[key]).tagName === "TABLE" || (node.childNodes[key]).tagName === "THEAD" || (node.childNodes[key]).tagName === "TBODy") {
                            booleann = true;
                            break;
                        }
                    }
                }
                // if boolean is true dont allow to edit.
                // boolean indicates, True- add block, false- edit block
                // else allow..
                if (booleann) {
                    if (boolean) {
                        repeatTheBlock(value);
                    } else {
                        confirmAlertFunction("This block doesn't contain any content to edit!");
                        return;
                    }
                } else {
                    const childElementsArray = Array.from(node.childNodes);
                    Array.from(childElementsArray).forEach(element => {
                        const hasChildElements = Array.from(element.childNodes).some(child => child.nodeType === Node.ELEMENT_NODE);
                        // if the node contains its own child nodes..
                        // else just the contain..
                        if (hasChildElements) {
                            const childElementsArray2 = Array.from(element.childNodes);
                            let elementData = [];
                            // iterating for the child nodes of the main node..
                            Array.from(childElementsArray2).forEach(element1 => {
                                // in case the child element of the above parent element doesn't have a tag but contians only txt.
                                // then add 'noTag' and push the text..
                                if (element1.nodeType === Node.ELEMENT_NODE && element1.tagName !== "BR") {
                                    // excluding the br tag to be added.
                                    elementData.push({ [element1.tagName]: element1 });
                                } else if (element1.textContent.trim().length !== 0 || element1.tagName === "BR") {
                                    // apending the <br/> tag..
                                    if (element1.tagName === "BR") {
                                        elementData.push({ [element1.tagName]: "" });
                                    } else {
                                        // not including the @@repeatTag text
                                        if (!element1.textContent.trim().includes("@@repeatTag")) {
                                            elementData.push({ "noTag": element1.textContent.trim() });
                                        };
                                    }
                                }
                            });
                            setChildNodeOfRptBlck(oldvalue => ([
                                ...oldvalue,
                                { [element.tagName]: elementData }
                            ]));
                        } else {
                            setChildNodeOfRptBlck(oldvalue => ([
                                ...oldvalue,
                                { [element.tagName]: element }
                            ]));
                        }
                    });
                    setOpenReptBlock({
                        ...openReptBlock,
                        allowTextArea: true
                    });
                }
            }
        } else {
            setOpenReptBlock({
                ...openReptBlock,
                openReptBlock1: true
            });
        }
        setIntFld({
            intFldKey: value,
            intFldIndex: index,
            operationFlag: boolean
        });
    };
    // () repeats the block content.
    const repeatTheBlock = (value) => {
        let contents = atob(form.HtmlBase64String);
        let newContent = repeatAbleBlock[value][0];
        let repetBlockChanges = contents.replace(`@@repeatTag${value.substring(17, value.length)}@@`,
            `<div style="word-break: break-all;word-wrap: break-word;border:2px solid yellow;margin-bottom: 5px;width: fit-content;height: fit-content;overflow-wrap: break-word;">${newContent}</div>@@repeatTag${value.substring(17, value.length)}@@`);
        // replacing the new htmlBase64 which contains new rows appended..
        setRepeatAbleBlock({
            ...repeatAbleBlock,
            [value]: [...repeatAbleBlock[value], newContent]
        });
        setForm({
            ...form,
            HtmlBase64String: btoa(repetBlockChanges)
        });
        toast.success("Block added!", { autoClose: 1000 });
    };
    // to remove the repeatAble block from the HTML
    const deleteReptBlock = (event, index, key) => {
        // removing the data from repeatAbleBlock state
        repeatAbleBlock[key].splice(index, 1);
        // removing data from the repeatAbleFlieds state
        for (let keyzz in reptBlockFields[key]) {
            reptBlockFields[key][keyzz].splice(Number(index - 1), 1);
        }
        toast.error("Block deleted!", { autoClose: 1000 });
        updateHTML("", "", false, key);
    };
    const repetableBlock = () => {
        let inputFields = reptBlockFields[intFld.intFldKey];
        // let repeatBlock = repeatAble[intFld.intFldKey][intFld.intFldIndex];
        return (
            <>
                <div className='Divo4Css'>
                    <div className='title'>
                        <span>Name: </span>
                    </div>
                    <div className='titleName'>
                        <span>{intFld.intFldKey.substring(11, intFld.intFldKey.length)}</span>
                    </div>
                </div>
                <div className='Divo4Css' hidden={intFld.intFldIndex === 0 ? true : false}>
                    <div className='title'>
                        <span>Row: </span>
                    </div>
                    <div className='titleName'>
                        <span>{`Content ${intFld.intFldIndex}`}</span>
                    </div>
                </div>
                <div className='inputHolderCss' >

                    {
                        Object.keys(inputFields).map((data, index) => (
                            <div key={index} className='Divo5Css'>
                                <div className='InputName' style={{ width: "40%", fontSize: "15px" }}>
                                    <span>{data} : </span>
                                </div>
                                <div style={{ width: "55%" }}>
                                    <input
                                        type={inputFieldArrToModal[data].inputDataType}
                                        name={inputFieldArrToModal[data].inputField}
                                        id={`Repeat${data}`}
                                        defaultValue={inputFields[data][Number(intFld.intFldIndex) - 1]}
                                        autoCapitalize='off'
                                        className='inputCss'
                                        minLength={inputFieldArrToModal[data].minLength}
                                        maxLength={inputFieldArrToModal[data].maxLength}
                                        min={inputFieldArrToModal[data].minRange}
                                        max={inputFieldArrToModal[data].maxRange}
                                        placeholder={`${inputFieldArrToModal[data].editable === 0 ? inputFieldArrToModal[data].inputField :
                                            inputFieldArrToModal[data].placeHolder}`}
                                        autoComplete="true"
                                    />
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className='Divo6Css'>
                    <div className='proceedCancelCss'>
                        <button className='cancelbtn' type='button' onClick={closeTheModal}>Cancel</button>
                    </div>
                    <div className='proceedCancelCss'>
                        <button onClick={e => collectInputModalDataRept(e)} className='proceedbtnX' type='button'>{intFld.intFldIndex === 0 ? "Add" : "Save Changes"}</button>
                    </div>
                </div>
            </>
        );
    };
    // to validate the entered data by users.
    const collectInputModalDataRept = (event) => {
        let inputFields = reptBlockFields[intFld.intFldKey];
        let enteredValuesArray = {};
        let contents = atob(form.HtmlBase64String);
        let divBlock = "";
        // checking the flag. if the operation is edit then collect the old data for operation..
        if (!intFld.operationFlag) {
            divBlock = repeatAbleBlock[intFld.intFldKey][intFld.intFldIndex];
        };

        for (let key in inputFields) {
            let validationData = inputFieldArrToModal[key]
            let Enteredvalue = document.getElementById(`Repeat${key}`).value;
            let validationResponse = {
                boolean: false,
                clinetResponse: "continue"
            };
            if (Enteredvalue !== "") {
                if (validationData.customValidation !== "") {
                    validationResponse = dataValidation(true, Enteredvalue, validationData.customValidation, validationData.label, validationData.inputDataType, "", "");
                } else if (validationData.inputDataType === "number") {
                    validationResponse = dataValidation(false, Number(Enteredvalue), validationData.customValidation, validationData.label, validationData.inputDataType, Number(validationData.minRange), Number(validationData.maxRange));
                } else if (validationData.inputDataType === "date") {
                    validationResponse = dataValidation(false, new Date(Enteredvalue), validationData.customValidation, validationData.label, validationData.inputDataType, new Date(validationData.minRange), new Date(validationData.maxRange));
                } else if (validationData.inputDataType === "tel") {
                    validationResponse = dataValidation(false, Enteredvalue, validationData.customValidation, validationData.label, validationData.inputDataType, "", "");
                }
                if (validationResponse.boolean) {
                    event.preventDefault();
                    confirmAlertFunction(validationResponse.clinetResponse);
                    return;
                }
            }
            else {
                if (validationData.isMandatory === "1") {
                    event.preventDefault();
                    confirmAlertFunction(`Please fill the '${validationData.label}' before proceeding`);
                    return;
                }
            }

            // if the booelean is true. it indicates the operation is insertion..
            if (intFld.operationFlag) {
                // entered values are inserted in the state..
                setReptBlockFields(oldvalue => ({
                    ...oldvalue,
                    [intFld.intFldKey]: {
                        ...oldvalue[intFld.intFldKey],
                        [key]: [...oldvalue[intFld.intFldKey][key], Enteredvalue]
                    }
                }));
            } else {
                reptBlockFields[intFld.intFldKey][key][Number(intFld.intFldIndex) - 1] = Enteredvalue;
            }
            enteredValuesArray[key] = Enteredvalue;
        }
        // replacing of values in the repeatable blocks.
        let repeatAbleBlkStr = repeatAbleBlock[intFld.intFldKey][0];
        for (let key in enteredValuesArray) {
            // repeatAbleBlkStr = repeatAbleBlkStr.replace(`{{jsonObj.${key}}}`, `<span class="recount">${enteredValuesArray[key]}</span>`);
            repeatAbleBlkStr = repeatAbleBlkStr.replace(`{{jsonObj.${key}}}`, `<span class="recount">${enteredValuesArray[key] !== "" ? enteredValuesArray[key] : "__________"}</span>`);
        }

        // Create a range
        const range = document.createRange();
        // Create a document fragment from the HTML string
        const fragment = range.createContextualFragment(repeatAbleBlkStr);
        // Get the first child of the fragment, which is the newly created node
        const node = fragment.firstChild;

        let repetBlockChanges = "";
        // if the booelean is true. it indicates the operation is insertion..
        if (intFld.operationFlag) {
            // adding value to the setRepeatAbleBlock state..
            setRepeatAbleBlock({
                ...repeatAbleBlock,
                [intFld.intFldKey]: [...repeatAbleBlock[intFld.intFldKey], node.outerHTML]
            });
            repetBlockChanges = contents.replace(`@@repeatTag${intFld.intFldKey.substring(intFld.intFldKey.length - 1, intFld.intFldKey.length)}@@`,
                `<div style="word-break: break-all;word-wrap: break-word;border:2px solid yellow;margin-bottom: 5px;width: fit-content;height: fit-content;overflow-wrap: break-word;">${repeatAbleBlkStr}</div>@@repeatTag${intFld.intFldKey.substring(intFld.intFldKey.length - 1, intFld.intFldKey.length)}@@`);
        } else {
            // adding value to the setRepeatAbleBlock state..
            repeatAbleBlock[intFld.intFldKey][intFld.intFldIndex] = node.outerHTML;
            // replacing the string.
            repetBlockChanges = contents.replace(`${divBlock}`, `${repeatAbleBlkStr}`);
        }

        // setting the HTML rendering state..
        setForm({
            ...form,
            HtmlBase64String: btoa(repetBlockChanges)
        });
        toast.success(intFld.intFldIndex === 0 ? "Block added!" : "Block edited!", { autoClose: 1000 });
        closeTheModal();
    };
    //  collects the edited content of the HTML.
    const colectEditedChanges = (event) => {
        event.preventDefault();
        const parentElement = document.createElement("div");
        let repetBlockChanges = "";
        let divBlock = "";
        // checking the flag. if the operation is edit then collect the old data for operation..
        if (!intFld.operationFlag) {
            divBlock = repeatAbleBlock[intFld.intFldKey][intFld.intFldIndex];
        };
        // iterate all the tags inside and add inside the div tag..
        for (let key in childNodeOfRptBlck) {
            // if the value is node element
            // if array go to else
            if (childNodeOfRptBlck[key][Object.keys(childNodeOfRptBlck[key])[0]].nodeType === Node.ELEMENT_NODE) {
                const newTag = document.createElement(Object.keys(childNodeOfRptBlck[key])[0]);
                if ((document.getElementById(`txtArea${key}`).value).trim().length === 0) {
                    confirmAlertFunction('Please add some content before add/saving a block.');
                    return;
                }
                newTag.innerText = (document.getElementById(`txtArea${key}`).value).trim();
                parentElement.appendChild(newTag);
            }
            else {
                let array = childNodeOfRptBlck[key][Object.keys(childNodeOfRptBlck[key])[0]];
                const newTagMain = document.createElement(Object.keys(childNodeOfRptBlck[key])[0]);
                let hasSomeText = false;
                for (let keyz in array) {
                    const newTag = document.createElement(Object.keys(array[keyz])[0]);
                    // NOTAG indicate the content inside the parent tag doesn't contain any tags..
                    if (newTag.tagName === "NOTAG") {
                        // some content should be present in order to add a repeatAble block..
                        hasSomeText = document.getElementById(`txtAreaChild${keyz}${key}`).value.trim() !== "" ? true : hasSomeText
                        // creating the text node and appending to parent element..
                        newTagMain.appendChild(document.createTextNode(document.getElementById(`txtAreaChild${keyz}${key}`).value.trim()));
                    }
                    else if (newTag.tagName === "BR") {
                        newTagMain.appendChild(document.createElement("br"));
                    }
                    else {
                        hasSomeText = document.getElementById(`txtAreaChild${keyz}${key}`).value.trim() !== "" ? true : hasSomeText;
                        newTag.innerText = (document.getElementById(`txtAreaChild${keyz}${key}`).value).trim();
                        newTagMain.appendChild(newTag);
                    }
                }
                // hasSomeText boolean 'true' indiactes some contents are present.
                if (hasSomeText) {
                    parentElement.appendChild(newTagMain);
                }
                else {
                    confirmAlertFunction('Please add some content before add/saving a block.');
                    return;
                }
            }
        }

        // appending the data to the state and updating HTML..
        let contents = atob(form.HtmlBase64String);
        // replacing the new htmlBase64 which contains new rows appended..
        if (intFld.operationFlag) {
            repetBlockChanges = contents.replace(`@@repeatTag${intFld.intFldKey.substring(17, intFld.intFldKey.length)}@@`,
                `<div style="word-break: break-all;word-wrap: break-word;border:2px solid yellow;margin-bottom: 5px;width: fit-content;height: fit-content;overflow-wrap: break-word;">${parentElement.outerHTML}</div>@@repeatTag${intFld.intFldKey.substring(17, intFld.intFldKey.length)}@@`);
            setRepeatAbleBlock({
                ...repeatAbleBlock,
                [intFld.intFldKey]: [...repeatAbleBlock[intFld.intFldKey], parentElement.outerHTML]
            });
        }
        else {
            // adding value to the setRepeatAbleBlock state..
            repeatAbleBlock[intFld.intFldKey][intFld.intFldIndex] = parentElement.outerHTML;
            // replacing the string.
            repetBlockChanges = contents.replace(`${divBlock}`, `${parentElement.outerHTML}`);
        }
        setForm({
            ...form,
            HtmlBase64String: btoa(repetBlockChanges)
        });
        toast.success(intFld.intFldIndex === 0 ? "Block added!" : "Block edited!", { autoClose: 1000 });
        setChildNodeOfRptBlck([]);
        closeTheModal();
    };
    // returns the text area modal to edit the content,
    const openTxtModal = () => {
        return (
            <>
                <div className='Divo4Css'>
                    <div className='title'>
                        <span>Name: </span>
                    </div>
                    <div className='titleName'>
                        <span>{intFld.intFldKey.substring(11, intFld.intFldKey.length)}</span>
                    </div>
                </div>
                <div className='Divo4Css' hidden={intFld.intFldIndex === 0 ? true : false}>
                    <div className='title'>
                        <span>Block: </span>
                    </div>
                    <div className='titleName'>
                        <span>{`Content ${intFld.intFldIndex}`}</span>
                    </div>
                </div>
                <div className="ScrollBarForApproveTemp">
                    <>
                        {
                            childNodeOfRptBlck.map((data, index) => (
                                Array.isArray(data[Object.keys(data)[0]]) ? <>
                                    {
                                        data[Object.keys(data)[0]].map((data1, index1) => (
                                            // the array can also contain BR which is not required to show in text area.
                                            Object.keys(data1)[0] === "BR" ? <> </> :
                                                <textarea rows="5" cols="50" id={`txtAreaChild${index1}${index}`} key={index1} className='inputCssRT'>{Object.keys(data1)[0] !== "noTag" ? data1[Object.keys(data1)[0]].innerText : data1[Object.keys(data1)[0]]}</textarea>
                                        ))
                                    }
                                </> : <textarea rows="5" cols="50" id={`txtArea${index}`} key={index} className='inputCssRT'>{data[Object.keys(data)[0]].innerText}</textarea>
                            ))
                        }
                    </>
                </div>
                <div className='Divo6Css'>
                    <div className='proceedCancelCss'>
                        <button className='cancelbtn' type='button' onClick={closeTheModal}>Cancel</button>
                    </div>
                    <div className='proceedCancelCss'>
                        <button className='proceedbtnX' onClick={e => colectEditedChanges(e)} type='button'>{intFld.intFldIndex === 0 ? "Add" : "Save changes"}</button>
                    </div>
                </div>
            </>
        );
    };
    /*------------------------Repeatable blocks--------------------------------------*/


    /*------------------------File upload section--------------------------------------*/
    // to create file attachment input fields on UI.
    const createFileUploadtag = () => {
        if (fileAttahments.length !== 0) {
            return (
                <>
                    <div className="fileUploadBorder">
                        <span className="form-montrol1" style={{ marginBottom: "10px" }}>
                            Upload below documents
                        </span>
                        <div className="noteFileCss" style={{ fontFamily: "inherit" }}>
                            <span className="blink">Note:</span>
                            <br />
                            1. The maximum of 500KB file can be uploaded.
                            <div>
                                2. File format accepted (.pdf, .jpeg, .png)
                            </div>
                        </div>
                        {fileAttahments.map((posts, index) => (
                            <div
                                key={index}
                                className="OuterTagCss"
                                style={{ width: "100%" }}
                            >
                                <div
                                    className="filenameCss"
                                    style={{
                                        fontSize: "14px",
                                        fontStyle: "italic",
                                        width: "100%",
                                        paddingTop: "5px",
                                    }}
                                >
                                    <span id={posts.inputField} title={posts.fieldLable} className={posts.mandatory}>
                                        {posts.fieldLable}
                                    </span>
                                </div >
                                <div className="uploadimageCss" style={{ width: "100%" }}>
                                    <table>
                                        <tr>
                                            <td style={{ width: "70%" }}>
                                                <input
                                                    type="file"
                                                    // onChange={(e) => ChangenameInTemplate(e, posts.key)}
                                                    onChange={(e) => ChangenameInTemplate(e, e.currentTarget.id, posts.fieldLable)}
                                                    style={{
                                                        width: "90%",
                                                        border: "1px solid black",
                                                        backgroundColor: "white",
                                                        fontStyle: "italic",
                                                        borderRadius: "5px",
                                                        fontSize: "14px",
                                                    }}
                                                    accept={posts.attachmentType}
                                                    id={posts.key}
                                                />
                                            </td>
                                            <text style={{ fontSize: "120%" }}>or</text>
                                            &nbsp;
                                            <td>
                                                <BsCameraFill id={`${posts.key},${posts.fieldLable}`} onClick={(e) => setupWebcam(e.currentTarget.id, facingMode)} style={{ fontSize: "250%", color: "#007bff" }} data-toggle="modal" data-target="#cameraModal"
                                                />
                                                <div className={`modal ${cameraIsOpen ? 'show' : ''}`} id="cameraModal" tabIndex="-1" aria-labelledby="cameraModalLabel" aria-hidden={!cameraIsOpen} data-backdrop="static">
                                                    <div className="custom-modalTWO" >
                                                        <div className="CustomModal-contentTWO  ScrollBarXCamera">
                                                            <div className="">
                                                                <div style={{ display: "flex", marginBottom: "5px", marginTop: "15px" }}>
                                                                    <div style={{ width: "100%", textAlign: "end" }}>
                                                                        <button type="button" className="btn btn-success rounded-pill" onClick={capturePhoto}>capture</button>
                                                                    </div>
                                                                </div>
                                                                <button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick={(e) => closeCamera(e)}><span aria-hidden="true">&times;</span></button>
                                                                {!captureData && (
                                                                    <>
                                                                        {isMobile ? (
                                                                            <div>
                                                                                <FaCameraRotate onClick={(e) => handleSwitchCamera(e)} style={{ marginBottom: "2%", fontSize: "200%", color: "#007bff" }} />
                                                                            </div>
                                                                        ) : (
                                                                            <></>
                                                                        )}
                                                                        <video  className="videoDisplay"   ref={webcamRef} width={screenSize["width"]} height={screenSize["height"]} ></video>
                                                                    </>
                                                                )}
                                                                {captureData && (
                                                                    // <div ref={resultRef} id="results"></div>
                                                                    <div>
                                                                        <ReactCrop crop={crop}
                                                                            onChange={c => handleCropChange(c)}
                                                                            id="reactCrop"
                                                                            aspect={aspect}
                                                                        >
                                                                            <img height={screenSize["height"]} width={screenSize["width"]} src={captureData} alt="Captured" /><br />
                                                                        </ReactCrop>

                                                                        <form>
                                                                            <div className="radio" style={{ fontfamily: "ui-monospace" }}>
                                                                                <text>
                                                                                    Select the size of the image
                                                                                </text> &nbsp;
                                                                                <input
                                                                                    type="radio"
                                                                                    name="CropSize"
                                                                                    id="radio"
                                                                                    value="None"
                                                                                    checked={selectedOption === 'None'}
                                                                                    onChange={handleRadioChange}
                                                                                />Original
                                                                                &nbsp;
                                                                                <input
                                                                                    type="radio"
                                                                                    name="CropSize"
                                                                                    value="A4"
                                                                                    checked={selectedOption === 'A4'}
                                                                                    onChange={handleRadioChange}
                                                                                />A4
                                                                                &nbsp;
                                                                                <input
                                                                                    type="radio"
                                                                                    name="CropSize"
                                                                                    value="pp"
                                                                                    checked={selectedOption === 'pp'}
                                                                                    onChange={handleRadioChange}
                                                                                />Passport
                                                                                &nbsp;
                                                                                <input
                                                                                    type="radio"
                                                                                    name="CropSize"
                                                                                    value="idvertical"
                                                                                    checked={selectedOption === 'idvertical'}
                                                                                    onChange={handleRadioChange}
                                                                                />ID -Portrait
                                                                                &nbsp;
                                                                                <input
                                                                                    type="radio"
                                                                                    name="CropSize"
                                                                                    value="idhorizontal"
                                                                                    checked={selectedOption === 'idhorizontal'}
                                                                                    onChange={handleRadioChange}
                                                                                />ID -Landscape
                                                                                &nbsp;
                                                                            </div>
                                                                        </form>

                                                                        {croppedImageUrl ? (
                                                                            <div style={{ textAlign: "center" }}>
                                                                                <h2 >Cropped Image:</h2>
                                                                                <img height={cropedSize["height"]} width={cropedSize["width"]} src={croppedImageUrl} alt="Cropped" />
                                                                            </div>
                                                                        ) : (<></>)}
                                                                    </div>
                                                                )}
                                                                <div style={{ textAlign: "end", marginTop: "10px" }}>
                                                                    {!captureData ? (
                                                                        <div>
                                                                        </div>
                                                                    ) : (
                                                                        <div>
                                                                            <button id="cropper" type="button" className="btn btn-warning rounded-pill" onClick={handleCropComplete} hidden>Crop & Preview</button>&nbsp;
                                                                            <button type="button" className="btn btn-warning rounded-pill" onClick={retakeImage}>Retake</button>&nbsp;
                                                                            <button type="button" class="btn btn-success rounded-pill" id={`${posts.key},${index}`} onClick={(e) => capturedImage(e, captureData)}  >Proceed</button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <br></br>
                                        <tr >
                                            {/* <td   > */}
                                            <lable id={`${posts.key},${posts.fieldLable}message`} style={{ fontSize: "13px", display: "none", color: "#620404c7" }} >
                                                {posts.fieldLable} attachment captured</lable>
                                            <div style={{ borderBottom: "1px solid #817c7c8f", marginTop: "8%" }}></div>
                                            {/* </td> */}
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            );
        }

    };
    // when file is attached, displaying file is attached on Template..
    const ChangenameInTemplate = (e, id, fieldLabel) => {
        // if (!iterationId == 0) {
        document.getElementById(id + "," + fieldLabel + "message").style.display = "none";
        // }

        if (document.getElementById(id).files.length != 0) {
            let size = document.getElementById(id).files[0].size;
            let sizeInKB = size / 1024;
            e.preventDefault();
            if (sizeInKB > 500) {
                document.getElementById(id).files[0].value = "";
                document.getElementById(id).type = "";
                document.getElementById(id).type = "file";
                confirmAlertFunction(`Attachment cannot exceed 500KB`);
                document.getElementById(id + "1").innerHTML = `(Please Upload the attachment)`;
                document.getElementById(id + "1").style.backgroundColor = "yellow";
            }
            else {
                document.getElementById(id + "1").innerHTML = `Attachment Uploaded`;
                document.getElementById(id + "1").style.backgroundColor = "#ffc107db";
            }
        }
        else {
            setTemplateAttachment([]);
        }
    };
    /*------------------------File upload section--------------------------------------*/


    /*------------------------Final Proceed--------------------------------------*/
    // final procced for pdf preview..
    const proceed = (e) => {
        e.preventDefault();
        let formInputs = form.templateInputs;
        for (let keys in formInputs) {
            if (formInputs[keys].customValidation !== "" && formInputs[keys].customValidation !== " " && formInputs[keys].editable !== 0) {
                e.preventDefault();
                if (document.getElementById(`${formInputs[keys].inputField}1`).value + "" === "") {
                    if (formInputs[keys].isMandatory === 0) {
                        continue;
                    }
                    else {
                        e.preventDefault();
                        mustFillInputs(`${formInputs[keys].inputField}1`, formInputs[keys].label);
                        return;
                    }
                }
                else {
                    let responseJson = dataValidation(true, document.getElementById(`${formInputs[keys].inputField}1`).value + "", formInputs[keys].customValidation,
                        formInputs[keys].label, "", "", "");
                    if (responseJson.boolean) {
                        setAllowLoader(true);
                        e.preventDefault();
                        if (formInputs[keys].editable === 1) {
                            alert(responseJson.clinetResponse);
                        } else {
                            confirmAlert({
                                message: responseJson.clinetResponse,
                                buttons: [
                                    {
                                        label: "OK",
                                        className: "confirmBtn",
                                        onClick: () => {
                                            document
                                                .getElementById(`${formInputs[keys].inputField}1`)
                                                .focus();
                                        },
                                    },
                                ],
                            });
                        }

                        return;
                    }
                    else {
                        continue;
                    }
                }
            }

            if (formInputs[keys].isMandatory === 1 && formInputs[keys].editable !== 0) {
                if (document.getElementById(`${formInputs[keys].inputField}1`).value + "" === "") {
                    e.preventDefault();
                    if (formInputs[keys].inputField === 1) {
                        alert(`Please fill the '${formInputs[keys].label}' before proceeding`)
                    } else {
                        mustFillInputs(`${formInputs[keys].inputField}1`, formInputs[keys].label);
                    }
                    setAllowLoader(true);
                    return;
                }
            }

            if (formInputs[keys].inputDataType === "number" && formInputs[keys].editable !== 0) {
                if (document.getElementById(`${formInputs[keys].inputField}1`).value + "" !== "") {
                    let validationResponse = dataValidation(false, Number(document.getElementById(`${formInputs[keys].inputField}1`).value, ""),
                        formInputs[keys].label, "number", Number(formInputs[keys].minRange), Number(formInputs[keys].minRange));
                    if (validationResponse.boolean) {
                        e.preventDefault();
                        if (formInputs[keys].editable === 1) {
                            alert(validationResponse.clinetResponse);
                        } else {
                            confirmAlert({
                                message: validationResponse.clinetResponse,
                                buttons: [
                                    {
                                        label: "OK",
                                        className: "confirmBtn",
                                        onClick: () => {
                                            document
                                                .getElementById(`${formInputs[keys].inputField}1`)
                                                .focus();
                                        },
                                    },
                                ],
                            });
                        }
                        setAllowLoader(true);
                        return;
                    }
                    else {
                        continue;
                    }
                }
                else {
                    if (formInputs[keys].isMandatory === 0) {
                        continue;
                    }
                    else {
                        e.preventDefault();
                        mustFillInputs(`${formInputs[keys].inputField}1`, formInputs[keys].label);
                        setAllowLoader(true);
                        return;
                    }
                }
            }

            else if (formInputs[keys].inputDataType === "date" && formInputs[keys].editable !== 0) {
                if (document.getElementById(`${formInputs[keys].inputField}1`).value + "" !== "") {
                    let validationResponse = dataValidation(false, new Date(document.getElementById(`${formInputs[keys].inputField}1`).value), "",
                        formInputs[keys].label, "date", new Date(formInputs[keys].minRange), new Date(formInputs[keys].maxRange));
                    if (validationResponse.boolean) {
                        e.preventDefault();
                        if (formInputs[keys].editable === 1) {
                            alert(validationResponse.clinetResponse);
                        } else {
                            confirmAlert({
                                message: validationResponse.clinetResponse,
                                buttons: [
                                    {
                                        label: "OK",
                                        className: "confirmBtn",
                                        onClick: () => {
                                            document
                                                .getElementById(`${formInputs[keys].inputField}1`)
                                                .focus();
                                        },
                                    },
                                ],
                            });
                        }
                        setAllowLoader(true);
                        return;
                    }
                    else {
                        continue;
                    }
                }
                else {
                    e.preventDefault();
                    if (formInputs[keys].isMandatory === 0) {
                        continue;
                    }
                    else {
                        mustFillInputs(`${formInputs[keys].inputField}1`, formInputs[keys].label);
                        setAllowLoader(true);
                        return;
                    }
                }
            }

            else if (formInputs[keys].inputDataType === "tel" && formInputs[keys].editable !== 0) {
                if (document.getElementById(`${formInputs[keys].inputField}1`).value !== "") {
                    let validationResponse = dataValidation(false, document.getElementById(`${formInputs[keys].inputField}1`).value,
                        formInputs[keys].label, "tel", "", "");
                    if (validationResponse.boolean) {
                        e.preventDefault();
                        if (formInputs[keys].editable === 1) {
                            alert(validationResponse.clinetResponse);
                        } else {
                            confirmAlert({
                                message: validationResponse.clinetResponse,
                                buttons: [
                                    {
                                        label: "OK",
                                        className: "confirmBtn",
                                        onClick: () => {
                                            document
                                                .getElementById(`${formInputs[keys].inputField}1`)
                                                .focus();
                                        },
                                    },
                                ],
                            });
                        }
                        setAllowLoader(true);
                        return;
                    } else {
                        continue;
                    }
                }
                else {
                    e.preventDefault();
                    if (formInputs[keys].isMandatory === 0) {
                        continue;
                    }
                    else {
                        mustFillInputs(`${formInputs[keys].inputField}1`, formInputs[keys].label);
                        setAllowLoader(true);
                        return;
                    }
                }
            }
        }

        for (let keys in customFieldData) {
            e.preventDefault();
            if (customFieldData[keys].customValidation !== "" && customFieldData[keys].tobefilledby !== 1) {
                e.preventDefault();
                if (document.getElementById(`${customFieldData[keys].inputField}1`).value + "" === "") {
                    if (customFieldData[keys].isMandatory === 0) {
                        continue;
                    }
                    else {
                        e.preventDefault();
                        mustFillInputs(`${customFieldData[keys].inputField}1`, customFieldData[keys].label);
                        setAllowLoader(true);
                        return;
                    }
                }
                else {
                    let responseJson = dataValidation(true, document.getElementById(`${customFieldData[keys].inputField}1`).value + "", customFieldData[keys].customValidation,
                        customFieldData[keys].label, "", "", "");
                    if (responseJson.boolean) {
                        setAllowLoader(true);
                        e.preventDefault();
                        confirmAlert({
                            message: responseJson.clinetResponse,
                            buttons: [
                                {
                                    label: "OK",
                                    className: "confirmBtn",
                                    onClick: () => {
                                        document
                                            .getElementById(`${customFieldData[keys].inputField}1`)
                                            .focus();
                                    },
                                },
                            ],
                        });
                        return;
                    }
                    else {
                        continue;
                    }
                }
            }

            if (customFieldData[keys].isMandatory === 1 && customFieldData[keys].tobefilledby !== 1) {
                if (document.getElementById(`${customFieldData[keys].inputField}1`).value + "" === "") {
                    e.preventDefault();
                    mustFillInputs(`${customFieldData[keys].inputField}1`, customFieldData[keys].label);
                    setAllowLoader(true);
                    return;
                }
            }

            if (customFieldData[keys].inputDataType === "number" && customFieldData[keys].tobefilledby !== 1) {
                if (customFieldData[keys].customValidation === "") {
                    if (document.getElementById(`${customFieldData[keys].inputField}1`).value + "" !== "") {
                        let validationResponse = dataValidation(false, Number(document.getElementById(`${customFieldData[keys].inputField}1`).value, ""),
                            customFieldData[keys].label, "number", Number(customFieldData[keys].minRange), Number(customFieldData[keys].minRange));
                        if (validationResponse.boolean) {
                            e.preventDefault();
                            confirmAlert({
                                message: validationResponse.clinetResponse,
                                buttons: [
                                    {
                                        label: "OK",
                                        className: "confirmBtn",
                                        onClick: () => {
                                            document
                                                .getElementById(`${customFieldData[keys].inputField}1`)
                                                .focus();
                                        },
                                    },
                                ],
                            });
                            setAllowLoader(true);
                            return;
                        }
                        else {
                            continue;
                        }
                    }
                    else {
                        if (customFieldData[keys].isMandatory === 0) {
                            continue;
                        }
                        else {
                            e.preventDefault();
                            mustFillInputs(`${customFieldData[keys].inputField}1`, customFieldData[keys].label);
                            setAllowLoader(true);
                            return;
                        }
                    }
                }
            }

            else if (customFieldData[keys].inputDataType === "date" && customFieldData[keys].tobefilledby !== 1) {
                if (document.getElementById(`${customFieldData[keys].inputField}1`).value !== "") {
                    let validationResponse = dataValidation(false, new Date(document.getElementById(`${customFieldData[keys].inputField}1`).value), "",
                        customFieldData[keys].label, "date", new Date(customFieldData[keys].minRange), new Date(customFieldData[keys].maxRange));
                    if (validationResponse.boolean) {
                        e.preventDefault();
                        confirmAlert({
                            message: validationResponse.clinetResponse,
                            buttons: [
                                {
                                    label: "OK",
                                    className: "confirmBtn",
                                    onClick: () => {
                                        document
                                            .getElementById(`${customFieldData[keys].inputField}1`)
                                            .focus();
                                    },
                                },
                            ],
                        });
                        setAllowLoader(true);
                        return;
                    }
                    else {
                        continue;
                    }
                } else {
                    e.preventDefault();
                    if (customFieldData[keys].isMandatory === 0) {
                        continue;
                    }
                    else {
                        mustFillInputs(`${customFieldData[keys].inputField}1`, customFieldData[keys].label);
                        setAllowLoader(true);
                        return;
                    }
                }
            }

            else if (customFieldData[keys].inputDataType === "tel" && customFieldData[keys].tobefilledby !== 1) {
                if (document.getElementById(`${customFieldData[keys].inputField}1`).value !== "") {
                    let validationResponse = dataValidation(false, document.getElementById(`${customFieldData[keys].inputField}1`).value,
                        customFieldData[keys].label, "tel", "", "");
                    if (validationResponse.boolean) {
                        e.preventDefault();
                        confirmAlert({
                            message: validationResponse.clinetResponse,
                            buttons: [
                                {
                                    label: "OK",
                                    className: "confirmBtn",
                                    onClick: () => {
                                        document
                                            .getElementById(`${customFieldData[keys].inputField}1`)
                                            .focus();
                                    },
                                },
                            ],
                        });
                        setAllowLoader(true);
                        return;
                    } else {
                        continue;
                    }
                }
                else {
                    e.preventDefault();
                    if (formInputs[keys].isMandatory === 0) {
                        continue;
                    }
                    else {
                        mustFillInputs(`${formInputs[keys].inputField}1`, formInputs[keys].label);
                        setAllowLoader(true);
                        return;
                    }
                }
            }
        }
        let checkBox = document.querySelectorAll("input[type=checkBox]");
        let radio = document.querySelectorAll("input[type=radio]");
        for (let key in tempRadioValidation) {
            let eachJsObj = tempRadioValidation[key]
            let keys = Object.keys(tempRadioValidation[key]);
            if (eachJsObj[keys[0]] === 1) {
                let name = keys[0];
                let checkIfChecked = "dontAllow";
                let radioBtnCheck = "";
                for (let i = 0; i <= radio.length - 1; i++) {
                    if (radio[i].name === name) {
                        radioBtnCheck = radio[i].id;
                        if (radio[i].checked === true) {
                            checkIfChecked = "Allow";
                        }
                        else {
                            continue;
                        }
                    }
                }
                if (checkIfChecked === "dontAllow") {
                    confirmAlertFunction(`Please check the field ${name} before proceeding`);
                    e.preventDefault();
                    const container = document.getElementById('ScrollBarX');
                    const element = document.getElementById(radioBtnCheck);
                    const containerRect = container.getBoundingClientRect();
                    const elementRect = element.getBoundingClientRect();
                    container.scroll({
                        top: elementRect.top - containerRect.top + container.scrollTop,
                        behavior: 'smooth'
                    });
                    return;
                } else {
                    continue;
                }
            }
            else {
                continue;
            }
        }

        if (radio.length !== 0) {
            for (let i = 0; i <= radio.length - 1; i++) {
                if (radio[i].checked === false) {
                    List[radio[i].id] = { value: "", dataType: "radio" };
                } else {
                    List[radio[i].id] = { value: "checked", dataType: "radio" };
                }
            }
        }

        if (checkBox.length !== 0) {
            for (let i = 0; i <= checkBox.length - 1; i++) {
                if (checkBox[i].checked === false) {
                    List[checkBox[i].id] = { value: "", dataType: "checkBox" };
                } else {
                    List[checkBox[i].id] = { value: "checked", dataType: "checkBox" };
                }
            }
        }
        //to include the custom field to the list..
        for (let key in customFieldDetail) {
            List[key] = customFieldDetail[key];
        }

        for (let key in ListMeta) {
            if (ListMeta[key].value === key) {
                let json = { value: "__________", dataType: ListMeta[key].dataType };
                List[key] = json;
            }
            else {
                List[key] = ListMeta[key];
            }
        }

        for (let key in selectDrpDwnVal) {
            if (key === `#$${selectDrpDwnVal[key]}#$`) {
                List[key] = { value: "__________" };
            }
            else {
                List[key] = { value: selectDrpDwnVal[key] };
            }
        }

        let file = document.querySelectorAll("input[type=file]");
        let totalfileuplodedcount = compareAndPrepareAttData(e, true, true);
        if (totalfileuplodedcount === "attachNeedToFill") {
            return;
        }

        // checking if the files are avialable, if existed enter the if block to creat files state;
        let isFilesAvailable = false;

        for (let index = 0; index <= file.length - 1; index++) {
            if (file[index].value !== "" || capturedImageArray.length !== 0) {
                isFilesAvailable = true;
            }
        }

        if (isFilesAvailable) {
            let count = 0;
            if (Object.keys(imageFileForSaveDraft).length !== 0) {
                for (let key in imageFileForSaveDraft) {
                    if (imageFileForSaveDraft[key].attachmentData != "") {
                        let reader = new FileReader();
                        reader.readAsDataURL(imageFileForSaveDraft[key].attachmentData);
                        reader.onload = function () {
                            templateAttachmentForProcced[count] = {
                                attachmentData: reader.result,
                                attachmentKey: key,
                                attachmentType: imageFileForSaveDraft[key].attachmentData.type,
                                attachmentLable: imageFileForSaveDraft[key].attachmentLable,
                                attachmentId: imageFileForSaveDraft[key].attachmentId,
                                attmntFileName: imageFileForSaveDraft[key].attmntFileName,
                                attachmentDimension: imageFileForSaveDraft[key].attachmentDimension,
                            };
                            count++;
                            if (count === totalfileuplodedcount) {
                                furthurproceed();
                                setimageFileForSaveDraft([]);
                            }
                        };
                        reader.onerror = function (error) {
                            console.log("Error: ", error);
                        };
                    } else {
                        templateAttachmentForProcced[count] = {
                            attachmentData: "",
                            attachmentKey: key,
                            attachmentType: imageFileForSaveDraft[key].attachmentType,
                            attachmentLable: imageFileForSaveDraft[key].attachmentLable,
                            attachmentId: imageFileForSaveDraft[key].attachmentId,
                            attmntFileName: imageFileForSaveDraft[key].attmntFileName,
                            attachmentDimension: imageFileForSaveDraft[key].attachmentDimension,
                            isAvailableInSvr: imageFileForSaveDraft[key].isAvailableInSvr,
                        };
                        count++;
                        if (count === totalfileuplodedcount) {
                            furthurproceed();
                            setimageFileForSaveDraft([]);
                        }
                    }
                }
            } else {
                furthurproceed();
                setimageFileForSaveDraft([]);
            }
        } else {
            furthurproceed();
        }
        e.preventDefault();
    };
    // Page is pushed to TempaltePDF priview page with user data's..
    const furthurproceed = () => {
        setAllowLoader(true);
        let state = {
            userDetails: List,
            Adetails: form,
            templateCode: templateCode,
            templateName: templateName,
            templateAttachments: templateAttachmentForProcced,
            templateAttachmentList: fileAttahments,
            temptDrftRef: temptDrftRef,
            frompath: fromPath,
            modeOfSignature: modeOfSignature,
            tempRadioAttch: tempRadioValidation,
            customFeildInputs: customFieldData,
            selectDrpDwnList: selectDrpDwn,
            dynamicTable: dynamicTable,
            dynamicTableData: tablesData,
            HTMLFileServer: htmlFileServer,
            reptBlockFild: reptBlockFields,
            repeatAbleBlck: repeatAbleBlock
        };

        props.history.push({
            pathname: toPathName,
            frompath: fromPath,
            state: state
        });
    };
    // file attachment data. 
    const compareAndPrepareAttData = (e, makeFileToAttach, formsaveOrproceed) => {
        let mandatoryKey = "";
        let totalfileuplodedcount = 0;
        let file = document.querySelectorAll("input[type=file]");
        for (let index = 0; index <= file.length - 1; index++) {
            let id = file[index].id;
            let keyName = id.split("atchmt##")[1];
            mandatoryKey = keyName.split("##")[0];
            List[file[index].id] = { value: "" };
            listForSaveDraft[file[index].id] = { value: "" };
            if (file[index].value !== "") {
                let id = file[index].id;
                let keyName = id.split("atchmt##")[1];
                let OriginalkeyName = keyName.split("##")[0];
                let attachmentLable = document.getElementById(`${OriginalkeyName}`).title;
                e.preventDefault();
                let allowFileToAttach = true;
                if (Object.keys(templateForRendering).length != 0) {
                    for (let key in templateForRendering) {
                        if (file[index].files[0].name === templateForRendering[key].attmntFileName && file[index].id === templateForRendering[key].attachmentKey) {
                            allowFileToAttach = false;
                        }
                    }
                    if (allowFileToAttach) {
                        totalfileuplodedcount++;
                        imageFileForSaveDraft[file[index].id] = {
                            attachmentData: file[index].files[0],
                            attachmentKey: file[index].id,
                            attachmentType: file[index].files[0].type,
                            attachmentLable: attachmentLable,
                            attachmentId: id,
                            attmntFileName: file[index].files[0].name,
                        };
                        imageFileForSaveDraftTwo[file[index].id] = {
                            attachmentData: file[index].files[0],
                            attachmentKey: file[index].id,
                            attachmentType: file[index].files[0].type,
                            attachmentLable: attachmentLable,
                            attachmentId: id,
                            attmntFileName: file[index].files[0].name,
                        };
                    }
                    else {
                        if (document.getElementById(id).name === "isAvailableInSvr") {
                            totalfileuplodedcount++;
                            imageFileForSaveDraft[file[index].id] = {
                                attachmentData: "",
                                attachmentKey: id,
                                attachmentType: file[index].files[0].type,
                                attachmentLable: attachmentLable,
                                attachmentId: id,
                                attmntFileName: file[index].files[0].name,
                                isAvailableInSvr: "1"
                            };
                            imageFileForSaveDraftTwo[file[index].id] = {
                                attachmentData: "",
                                attachmentKey: id,
                                attachmentType: file[index].files[0].type,
                                attachmentLable: attachmentLable,
                                attachmentId: id,
                                attmntFileName: file[index].files[0].name,
                                isAvailableInSvr: "1"
                            };
                        }
                        else {
                            if (fromPath === "/draftTemplates" || makeFileToAttach) {
                                totalfileuplodedcount++;
                                imageFileForSaveDraft[file[index].id] = {
                                    attachmentData: file[index].files[0],
                                    attachmentKey: id,
                                    attachmentType: file[index].files[0].type,
                                    attachmentLable: attachmentLable,
                                    attachmentId: id,
                                    attmntFileName: file[index].files[0].name,
                                };
                            }
                        }
                    }
                }
                else {
                    totalfileuplodedcount++;
                    imageFileForSaveDraft[file[index].id] = {
                        attachmentData: file[index].files[0],
                        attachmentKey: file[index].id,
                        attachmentType: file[index].files[0].type,
                        attachmentLable: attachmentLable,
                        attachmentId: id,
                        attmntFileName: file[index].files[0].name,
                    };
                    imageFileForSaveDraftTwo[file[index].id] = {
                        attachmentData: file[index].files[0],
                        attachmentKey: file[index].id,
                        attachmentType: file[index].files[0].type,
                        attachmentLable: attachmentLable,
                        attachmentId: id,
                        attmntFileName: file[index].files[0].name,
                    };
                }
            }

            else {
                let fileid = file[index].id.split("##")[2];
                let id = file[index].id;
                let keyName = id.split("atchmt##")[1];
                let OriginalkeyName = keyName.split("##")[0];
                let attachmentLable = document.getElementById(`${OriginalkeyName}`).title;
                //name and data
                capturedImageArray.forEach((item, index1) => {
                    if (fileid == item.name) {
                        let allowFileToAttach = true;
                        if (Object.keys(templateForRendering).length != 0) {
                            if (allowFileToAttach) {
                                totalfileuplodedcount++;
                                imageFileForSaveDraft[file[index].id] = {
                                    attachmentData: item.data,
                                    attachmentKey: id,
                                    attachmentType: item.data.type,
                                    attachmentLable: attachmentLable,
                                    attachmentId: id,
                                    attmntFileName: item.data.name,
                                    attachmentDimension: item.attachmentDimension
                                };
                                imageFileForSaveDraftTwo[file[index].id] = {
                                    attachmentData: item.data,
                                    attachmentKey: file[index].id,
                                    attachmentType: item.data.type,
                                    attachmentLable: attachmentLable,
                                    attachmentId: id,
                                    attmntFileName: item.data.name,
                                    attachmentDimension: item.attachmentDimension
                                };
                            }
                            else {
                                if (document.getElementById(id).name === "isAvailableInSvr") {
                                    totalfileuplodedcount++;
                                    imageFileForSaveDraft[file[index].id] = {
                                        attachmentData: "",
                                        attachmentKey: id,
                                        attachmentType: item.data.type,
                                        attachmentLable: attachmentLable,
                                        attachmentId: id,
                                        attmntFileName: item.data.name,
                                        attachmentDimension: item.attachmentDimension,
                                        isAvailableInSvr: "1"
                                    };
                                    imageFileForSaveDraftTwo[file[index].id] = {
                                        attachmentData: "",
                                        attachmentKey: id,
                                        attachmentType: item.data.type,
                                        attachmentLable: attachmentLable,
                                        attachmentId: id,
                                        attmntFileName: item.data.name,
                                        attachmentDimension: item.attachmentDimension,
                                        isAvailableInSvr: "1"
                                    };
                                }
                                else {
                                    if (fromPath === "/draftTemplates" || makeFileToAttach) {
                                        totalfileuplodedcount++;
                                        imageFileForSaveDraft[file[index].id] = {
                                            attachmentData: item.data,
                                            attachmentKey: id,
                                            attachmentType: item.data.type,
                                            attachmentLable: attachmentLable,
                                            attachmentId: id,
                                            attmntFileName: item.data.name,
                                            attachmentDimension: item.attachmentDimension,
                                        };
                                    }
                                }
                            }
                        }
                        else {
                            totalfileuplodedcount++;
                            imageFileForSaveDraft[file[index].id] = {
                                attachmentData: item.data,
                                attachmentKey: file[index].id,
                                attachmentType: item.data.type,
                                attachmentLable: attachmentLable,
                                attachmentId: id,
                                attmntFileName: item.data.name,
                                attachmentDimension: item.attachmentDimension,
                            };
                            imageFileForSaveDraftTwo[file[index].id] = {
                                attachmentData: item.data,
                                attachmentKey: file[index].id,
                                attachmentType: item.data.type,
                                attachmentLable: attachmentLable,
                                attachmentId: id,
                                attmntFileName: item.data.name,
                                attachmentDimension: item.attachmentDimension,
                            };
                        }

                    }
                });
                if (formsaveOrproceed) {
                    let mandatory = document.getElementById(`${mandatoryKey}`).className;
                    let fieldLabel = document.getElementById(`${mandatoryKey}`).title;
                    let dontAllwMan = (mandatory === "true");
                    if (dontAllwMan) {
                        e.preventDefault();
                        confirmAlertFunction(`Please attach the ${fieldLabel} file before procceding`);
                        return "attachNeedToFill";
                    } else {
                        continue;
                    }
                }
            }
        }
        return (totalfileuplodedcount);
    };
    /*------------------------Final Proceed--------------------------------------*/


    /*------------------------Camera sesction--------------------------------------*/
    const handleRadioChange = (event) => {
        setSelectedOption(event.target.value);
        if (event.target.value === "A4") {
            document.getElementById("cropper").removeAttribute("hidden")
            let cropState = {}
            if (isMobile) {
                cropState = {
                    //A4
                    unit: 'px',
                    x: 0,
                    y: 0,
                    width: (19.01 / (2.5 * 3.15)) * 72,
                    height: (21.62 / (2.5 * 3.15)) * 72
                };
            }
            else {
                cropState = {
                    //A4
                    unit: 'px',
                    x: 0,
                    y: 0,
                    width: (21.01 / (2.5 * 1.8)) * 72,
                    height: (29.62 / (2.5 * 1.8)) * 72
                };
            }
            setAspect(cropState.width / cropState.height);
            setCropWithHighRes(convertCropDimensions(cropState));
            setCrop(cropState)
        }
        else if (event.target.value === "pp") {
            document.getElementById("cropper").removeAttribute("hidden")
            let cropState = {}
            if (isMobile) {
                cropState = {
                    // passport
                    unit: 'px',
                    x: 0,
                    y: 0,
                    width: (3.5 / 2.5) * 72,
                    height: (4.5 / 2.5) * 72
                };
            }
            else {
                cropState = {
                    // passport
                    unit: 'px',
                    x: 0,
                    y: 0,
                    width: (3.5 / 1.5) * 72,
                    height: (4.5 / 1.5) * 72
                };
            }
            setAspect(cropState.width / cropState.height)
            setCropWithHighRes(convertCropDimensions(cropState));
            setCrop(cropState)
        }
        else if (event.target.value === "idvertical") {
            document.getElementById("cropper").removeAttribute("hidden")
            let cropState = {}
            if (isMobile) {
                cropState = {
                    //vertical id 
                    unit: 'px',
                    x: 0,
                    y: 0,
                    width: (5.4 / 2.5) * 72,
                    height: (8.6 / 2.5) * 72
                };
            }
            else {
                cropState = {
                    //vertical id 
                    unit: 'px',
                    x: 0,
                    y: 0,
                    width: (5.4 / 1.5) * 72,
                    height: (8.6 / 1.5) * 72
                };
            }
            setAspect(cropState.width / cropState.height)
            setCropWithHighRes(convertCropDimensions(cropState));
            setCrop(cropState)

        }
        else if (event.target.value === "idhorizontal") {
            document.getElementById("cropper").removeAttribute("hidden")
            let cropState = {}
            if (isMobile) {
                cropState = {
                    //horizontal id 
                    unit: 'px',
                    x: 0,
                    y: 0,
                    width: (8.6 / 2.5) * 72,
                    height: (5.4 / 2.5) * 72
                };
            }
            else {
                cropState = {
                    //horizontal id 
                    unit: 'px',
                    x: 0,
                    y: 0,
                    width: (8.6 / 1.5) * 72,
                    height: (5.4 / 1.5) * 72
                };
            }
            setAspect(cropState.width / cropState.height)
            setCropWithHighRes(convertCropDimensions(cropState));
            setCrop(cropState)
        }
        else {
            document.getElementById("cropper").setAttribute("hidden", "true");
            setCroppedImageUrl(null);
            setAspect(null)
            setCrop(initialCropState)
        }
    };

    const setupWebcam = (id, facingMode) => {
        setIterationId(id);
        let width = "";
        let height = "";
        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
            // const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            // const screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            // width = Math.round(screenWidth * 0.85);
            // height = Math.round(screenHeight * 0.7);
            width = 270;
            height = 480;
        }
        else {
            // width = Math.round(window.innerWidth * 0.5);
            // height = Math.round(window.innerHeight * 0.75);
            width = 640;
            height = 360;
        };
        setScreenSize({
            width: width,
            height: height
        });
        navigator.mediaDevices.getUserMedia({
            video: {
                width: { exact: 1280 },
                height: { exact: 720 },
                facingMode: facingMode
            }
        }).then(stream => {
            if (webcamRef.current) {
                webcamRef.current.srcObject = stream;
                webcamRef.current.play();
            }
        }).catch(err => {
            console.error(`Error accessing ${facingMode} camera: `, err);
        });
    };

    const capturePhoto = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1280;
        canvas.height = 720;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(webcamRef.current, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL('image/jpeg', 1.0);
        setCaptureData(dataUri);
        const stream = webcamRef.current.srcObject;
        stream.getTracks().forEach(track => track.stop());
        webcamRef.current.srcObject = null;
    };

    // useEffect(() => {
    //     let width = "";
    //     let height = "";
    //     if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    //         const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    //         const screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    //         width = Math.round(screenWidth * 0.85);
    //         height = Math.round(screenHeight * 0.5);
    //     }
    //     else {
    //         width = Math.round(window.innerWidth * 0.5);
    //         height = Math.round(window.innerHeight * 0.75);
    //     };
    //     setScreenSize({
    //         width: width,
    //         height: height
    //     });
    //     if (cameraOpen && webcamRef.current) {
    //         console.log(facingMode);
    //         // Initialize the webcam after the element is available
    //         // window.Webcam.set({
    //         //     width: width,
    //         //     height: height,
    //         //     dest_width: 1280, // setting of resolution
    //         //     dest_height: 720, // setting of resolution
    //         //     image_format: 'jpeg', // Change to 'jpeg' if you prefer JPEG
    //         //     jpeg_quality: 100, // Use if format is 'jpeg'
    //         //     force_flash: false, // disable flash fallback
    //         // });
    //         // window.Webcam.attach(webcamRef.current, function (err) {
    //         //     if (err) {
    //         //         console.error('Webcam attach error:', err);
    //         //     }
    //         // });
    //     }

    //     return () => {
    //         if (cameraOpen) {
    //             // window.Webcam.reset();
    //         };
    //     };
    // }, [cameraOpen]);

    // const capturePhoto = (event) => {
    //     event.preventDefault();
    //     window.Webcam.snap((data_uri) => {
    //         if (data_uri) {
    //             console.log(data_uri);
    //             setCaptureData(data_uri);
    //             window.Webcam.reset(); // after capturing the photo reseting the webcam();
    //         } else {
    //             console.error('Failed to capture photo, data_uri is null');
    //         };
    //     });
    // };

    //closing camera
    const closeCamera = (e) => {
        setAllowLoader(false);
        setSelectedOption('None');
        e.preventDefault();
        //clearning the image captured 
        setCaptureData(null);
        setCroppedImageUrl(null);
        // Update the state to indicate that the camera is closed
        setCameraIsOpen(false);
        //setting the cropping tool to default
        resetCropToDefault();
        setAllowLoader(true);
        if (webcamRef.current && webcamRef.current.srcObject) {
            const stream = webcamRef.current.srcObject;
            stream.getTracks().forEach(track => track.stop());
            webcamRef.current.srcObject = null;
        };
    };

    // retake of image
    const retakeImage = () => {
        setSelectedOption('None')
        setCaptureData(null);
        setCroppedImageUrl(null);
        setupWebcam(iterationId, facingMode);
        resetCropToDefault();
    };

    function convertCropDimensions(crop) {
        const scaleX = 1280 / screenSize["width"];
        const scaleY = 720 / screenSize["height"];
        // displayin scaleY
        return {
            x: crop.x * scaleX,
            y: crop.y * scaleY,
            width: crop.width * scaleX,
            height: crop.height * scaleY,
            unit: '%'
        };
    };

    // corp change handle.
    const handleCropChange = (newCrop) => {
        setCrop(newCrop);
        setCropWithHighRes(convertCropDimensions(newCrop))
        document.getElementById("cropper").removeAttribute("hidden");
    };
    // Function to reset the crop state to its initial values
    const resetCropToDefault = () => {
        setAspect(null)
        setCrop(initialCropState);
    };
    const handleCropComplete = () => {
        if (captureData) {
            const image = new Image();
            image.src = captureData;
            const canvas = document.createElement('canvas');
            canvas.width = cropWithHighRes.width;
            canvas.height = cropWithHighRes.height;
            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(
                image,
                cropWithHighRes.x,
                cropWithHighRes.y,
                cropWithHighRes.width,
                cropWithHighRes.height,
                0,
                0,
                cropWithHighRes.width,
                cropWithHighRes.height
            );
            // Convert the cropped image to a data URL
            const croppedURL = canvas.toDataURL('image/jpeg', 1.0);
            // Set the cropped image URL
            console.log(croppedURL);
            setCroppedImageUrl(croppedURL);
            setCropedSize(crop);
        }
    };
    const handleSwitchCamera = (e) => {
        e.preventDefault();
        // Toggle between 'user' and 'environment' for front and rear view camera respectively
        const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
        setFacingMode(newFacingMode);
        setupWebcam(iterationId, newFacingMode);
    };
    const capturedImage = (e, captureData) => {
        closeCamera(e);
        //setting the crop size radio to default
        document.getElementById(iterationId.split(",")[0]).value = "";
        e.preventDefault();
        let base64Data = null;
        if (croppedImageUrl) {
            confirmAlert({
                message: `Image is cropped, which image do you want to proceed with?`,
                buttons: [
                    {
                        label: "Cancel",
                        className: "cancelBtn",
                        style: { fontSize: "13px" },
                        onClick: () => {
                            //setting radio button to none(default)
                            setSelectedOption('None')
                            $('#cameraModal').modal('show')
                            setupWebcam(iterationId, facingMode);
                            resetCropToDefault();
                        },
                    },
                    {
                        label: "Original",
                        className: "confirmBtn",
                        style: { fontSize: "13px" },
                        onClick: () => {
                            //setting radio button to none(default)
                            setSelectedOption('None')
                            base64Data = captureData.split(",")[1];
                            proceedingWithImg(base64Data);
                        },
                    },
                    {
                        label: "Cropped",
                        className: "confirmBtn",
                        style: { fontSize: "13px" },
                        onClick: () => {
                            base64Data = croppedImageUrl.split(",")[1];
                            proceedingWithImg(base64Data);
                        },
                    },
                ], closeOnClickOutside: false,
            });
            if (webcamRef.current && webcamRef.current.srcObject) {
                const stream = webcamRef.current.srcObject;
                stream.getTracks().forEach(track => track.stop());
                webcamRef.current.srcObject = null;
            };
        }
        else {
            if (crop.x == initialCropState.x && crop.y == initialCropState.y &&
                crop.width == initialCropState.width && crop.height == initialCropState.height && crop.unit == initialCropState.unit) {
                base64Data = captureData.split(",")[1];
                proceedingWithImg(base64Data);
                if (webcamRef.current && webcamRef.current.srcObject) {
                    const stream = webcamRef.current.srcObject;
                    stream.getTracks().forEach(track => track.stop());
                    webcamRef.current.srcObject = null;
                };
            }
            else {
                confirmAlert({
                    message: `Image is cropped, which image do you want to proceed with?`,
                    buttons: [
                        {
                            label: "Cancel",
                            className: "cancelBtn",
                            onClick: () => {
                                //setting radio button to none(default)
                                setSelectedOption('None')
                                $('#cameraModal').modal('show')
                                setupWebcam(iterationId, facingMode);
                                resetCropToDefault();
                            },
                        },
                        {
                            label: "Original",
                            className: "confirmBtn",
                            onClick: () => {
                                //setting radio button to none(default)
                                setSelectedOption('None')
                                base64Data = captureData.split(",")[1];
                                proceedingWithImg(base64Data);
                            },
                        },
                        {
                            label: "Cropped",
                            className: "confirmBtn",
                            onClick: () => {
                                //Cropping the image based on cropping tool position
                                const image = new Image();
                                image.src = captureData;
                                const canvas = document.createElement('canvas');
                                canvas.width = cropWithHighRes.width;
                                canvas.height = cropWithHighRes.height;
                                let ctx = canvas.getContext('2d');
                                ctx.drawImage(
                                    image,
                                    cropWithHighRes.x,
                                    cropWithHighRes.y,
                                    cropWithHighRes.width,
                                    cropWithHighRes.height,
                                    0,
                                    0,
                                    cropWithHighRes.width,
                                    cropWithHighRes.height
                                );
                                let imageURL = canvas.toDataURL('image/jpeg');
                                // let imageURL = canvas.toDataURL('image/jpeg',"0.1");
                                base64Data = imageURL.split(",")[1];
                                proceedingWithImg(base64Data);
                                console.log(base64Data);
                            },
                        },
                    ], closeOnClickOutside: false,
                });
                if (webcamRef.current && webcamRef.current.srcObject) {
                    const stream = webcamRef.current.srcObject;
                    stream.getTracks().forEach(track => track.stop());
                    webcamRef.current.srcObject = null;
                };
            }
        }
        $('#cameraModal').modal('hide')
        $('.modal-backdrop').remove();
    }
    const proceedingWithImg = async (base64imgData) => {
        // Decode the base64 data
        const binaryData = atob(base64imgData);
        // Convert the binary data to Uint8Array
        const dataArray = new Uint8Array(binaryData.length);
        for (let i = 0; i < binaryData.length; i++) {
            dataArray[i] = binaryData.charCodeAt(i);
        }
        // Create a Blob with the appropriate MIME type
        const mime = captureData.split(";")[0].split(":")[1];
        const blob = new Blob([dataArray], { type: mime });
        // Create a File 
        const fileName = iterationId.split(",")[1] + ' (captured)-image.jpg'; // Replace with the desired file name
        const file = new File([blob], fileName, { type: mime });
        const fileSize = file.size
        const fileSizeInmb = (fileSize / (1024 * 1024)).toFixed(2);
        let compressImage = file;

        if (fileSizeInmb > 2) {
            const options = {
                maxSizeMB: 0.5, // Maximum size in megabytes
                // maxWidthOrHeight: 1024, // Maximum width or height of the output image
                // useWebWorker: true,
            };
            // Compress the image
            setAllowLoader(false);
            compressImage = await imageCompression(file, options);
            // Calculate the compressed file size after compression
            const compressfileSize = compressImage.size;
            const compressfileSizeInmb = (compressfileSize / (1024 * 1024)).toFixed(2);
            setAllowLoader(true);
        }
        //image size validation
        if (fileSizeInmb > 2) {
            //setting radio button to none(default)
            setSelectedOption('None')
            setAllowLoader(true);
            confirmAlertFunction(`Attachment cannot exceed 2mb`);
        }
        else {
            let jsonData = { "name": iterationId.split("##")[2].split(",")[0], "data": compressImage, "attachmentDimension": selectedOption }
            // setCaturedImageArray(prevArray => [...prevArray, jsonData]);
            //avoiding duplicate entries
            setCaturedImageArray(prevArray => {
                const newArray = [...prevArray];
                const newEntryString = JSON.stringify(jsonData);
                const index = newArray.findIndex(item => {
                    const itemObject = JSON.parse(JSON.stringify(item));
                    return itemObject.name === JSON.parse(newEntryString).name;
                });

                if (index !== -1) {
                    // If it  exists replace the old entry with the new one
                    newArray[index] = jsonData;
                } else {
                    // else just add another entry 
                    newArray.push(jsonData);
                }
                return newArray;
            });
            //setting radio button to none(default)
            setSelectedOption('None');
            document.getElementById(iterationId + "message").style.display = "block";
            document.getElementById(iterationId.split(",")[0] + "1").innerHTML = `Attachment Captured`;
            document.getElementById(iterationId.split(",")[0] + "1").style.backgroundColor = "#ffc65e";
            //erasing the captured image and cropped image(if any) from screen 
            setCaptureData(null);
            setCroppedImageUrl(null);
            //setting the cropping tool to default position
            resetCropToDefault();
        }
    }
    // to make the cursore pointer when
    const bigimg = (props, id) => {
        document.getElementById(id).style.cursor = "pointer";
    };
    /*------------------------Camera sesction--------------------------------------*/

    return (
        <>
            <ToastContainer></ToastContainer>
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

            <div className="temdescCss" >
                <div className="temdesContentCssTemplate" style={{ width: "50%" }}>
                    <Tooltip
                        target="tempdesc"
                        id="tooltip"
                        isOpen={tooltipOpen}
                        placement="bottom"
                    >
                        {form.templateDescription}
                    </Tooltip>
                    <span className="blink">Note: </span>
                    <span
                        onMouseOver={openToolTip}
                        onMouseLeave={closeToolTip}
                        id="tempdesc"
                    >
                        {
                            form.templateDescription.substring(0, 25) + "..."
                        }
                    </span>
                </div>
                <form id="URL" name="URL" method="POST" action="http:localhost:8090/MYSIGN/login" encType="multipart/form-data" target="my_iframe">
                </form>
                <div className="saveDraftCss">
                    <button className="btn btn-primary" onClick={e => saveDraft(e)}>Save Draft</button>
                </div>
            </div>
            <div className="mainclass">
                <div className="contentCss">
                    <div id="ScrollBarX" className="greyBackCss ScrollBarX">
                        <div className="whiteBackCss">
                            {
                                creatMyForm()
                            }
                        </div>
                    </div>
                </div>
                <div className="MainFormCss ">
                    <div className="FormBorderCss ScrollBarX1">
                        <div className="FormCss ">
                            <h6 className=" form-montrol1 ">Fill the document details</h6>
                            <form>
                                {form.templateInputs.length
                                    ? form.templateInputs.map((posts, index) => (
                                        //below display attribute in style tag is used to 
                                        // hide the input fields if the editable key is 0
                                        // which is basically used in HTML edit for bulk signing
                                        <div key={index} className="form-loop md-5">
                                            <label style={{ width: "100%" }}>{posts.editable === 0 ? posts.inputField : posts.label}
                                                <input
                                                    disabled={posts.editable === 0 ? true : false}
                                                    style={{ backgroundColor: posts.editable === 0 ? "lightgrey" : "" }}
                                                    name={posts.inputField}
                                                    id={`${posts.inputField}1`}
                                                    minLength={posts.minLength}
                                                    maxLength={posts.maxLength}
                                                    min={posts.minRange}
                                                    max={posts.maxRange}
                                                    type={posts.inputDataType}
                                                    class="form-montrol"
                                                    placeholder={`${posts.editable === 0 ? posts.inputField : posts.placeHolder}`}
                                                    onChange={(e) => inputFieldOnchange(e, posts.inputField, posts.inputDataType)}
                                                    autoComplete="true"
                                                />
                                            </label>
                                            <span className="WarMesForInVaInputCss" id={`${posts.inputField}ToDisplayWarMess`}></span>
                                        </div>
                                    ))
                                    : "No Inputs Are Required this Form"}
                                {
                                    customFieldInputForm()
                                }
                                {
                                    selectDrpArray.length !== 0 ?
                                        <div className="fileUploadBorder">
                                            <span className="form-montrol1" style={{ marginBottom: "10px" }}>
                                                Dropdown
                                            </span>
                                            {
                                                selectDrpArray.map((posts, index) => (
                                                    <div key={`${Object.keys(posts)[0]}drpDwnKey`} className='formcontroller1'>
                                                        <div className='labelCss'>
                                                            <span id='inputname'>{Object.keys(posts)[0]}</span>
                                                        </div>
                                                        <div className='inputfieldCss'>
                                                            <select id={`${Object.keys(posts)[0]}`} className='input-Montroll1Css' onChange={e => selectedValue(e, `${Object.keys(posts)[0]}`, `${Object.keys(posts)[0]}`)}>
                                                                <option value='' disabled={false} hidden={false}>Choose value</option>
                                                                {
                                                                    createDropDown(posts[Object.keys(posts)[0]], Object.keys(posts)[0])
                                                                }
                                                            </select>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div> :
                                        <div></div>
                                }
                                {
                                    dynamicTable.length !== 0 && (
                                        <div className="fileUploadBorder" style={{ border: "3px solid burlywood" }}>
                                            <h6 style={{ marginBottom: "20px" }} className=" form-montrol1 ">Add Rows To The Table</h6>
                                            {
                                                dynamicTable.map((data, index) => (
                                                    data[Object.keys(data)[0]] === 1 && (
                                                        <>
                                                            <Accordion
                                                                style={{
                                                                    backgroundColor: "#FFFFF4",
                                                                    borderWidth: "3px",
                                                                    borderColor: "black",
                                                                    marginBottom: "20px"
                                                                }}
                                                                id={`accor${Object.keys(data)[0]}`}
                                                                expanded={drpDown === Object.keys(data)[0]}
                                                                onChange={colapsDrpDwn(Object.keys(data)[0])}
                                                            >
                                                                <AccordionSummary
                                                                    expandIcon={<ExpandMoreIcon />}
                                                                    aria-controls="panel1a-content"
                                                                    id="panel1a-header"
                                                                >
                                                                    <Typography >
                                                                        <b>{data[Object.keys(data)[1]]}</b>
                                                                    </Typography>
                                                                </AccordionSummary>
                                                                <div style={{ width: "100%", textAlignLast: "end", paddingRight: "6%", }} title="Add values to the table!" ><button onClick={e => dynamicTableModalOpner(e, Object.keys(data)[0], "headers", data[Object.keys(data)[1]])} className="btn btn-success">Add Row</button></div>
                                                                <AccordionDetails >
                                                                    <Typography>
                                                                        <div className="ScrollBarForApproveTemp" id={`${Object.keys(data)[0]}dropDown`} style={{ backgroundColor: "floralwhite", borderRadius: "10px", maxHeight: "150px", height: "fit-Content" }}>
                                                                            {
                                                                                Object.keys(tablesData[Object.keys(data)[0]]).map((headerKey, index) => (
                                                                                    <>
                                                                                        {
                                                                                            headerKey !== "headers" ? <>
                                                                                                <div style={{ display: "flex", padding: "8px" }}>
                                                                                                    <div style={{ width: "50%", marginRight: "4px" }}> <label style={{ width: "100%" }}>
                                                                                                        <input
                                                                                                            name={headerKey}
                                                                                                            type="text"
                                                                                                            class="form-montrol"
                                                                                                            autoComplete="true"
                                                                                                            disabled={true}
                                                                                                            value={headerKey}
                                                                                                            style={{ height: "30px" }}
                                                                                                        />
                                                                                                    </label></div>
                                                                                                    <div className='editcss' title="Edit values" style={{ width: "32%", marginRight: "4px" }}>
                                                                                                        <button style={{ height: "30px" }} onClick={e => dynamicTableModalOpner(e, Object.keys(data)[0], headerKey, data[Object.keys(data)[1]])} type='button' className='proceedbtn' name='uploadInputButton' >Edit</button>
                                                                                                    </div>
                                                                                                    <div title="Delete values" className="next-nav">
                                                                                                        <span
                                                                                                            style={{ color: "red", fontSize: "29px" }}
                                                                                                            className="fa fa-trash"
                                                                                                            id="signerInfoRmvBtn"
                                                                                                            onMouseOver={(e) => bigimg(e, "signerInfoRmvBtn")}
                                                                                                            onClick={(e) => deleteTableRow(e, Object.keys(data)[0], headerKey)}
                                                                                                            title="Remove data from the table!"
                                                                                                        >
                                                                                                        </span>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </> : <></>
                                                                                        }
                                                                                    </>
                                                                                ))
                                                                            }
                                                                        </div >
                                                                    </Typography>
                                                                </AccordionDetails>
                                                            </Accordion>
                                                        </>
                                                    )
                                                ))
                                            }

                                        </div >
                                    )
                                }
                                {
                                    Object.keys(repeatAbleBlock).length !== 0 && (
                                        <div className="fileUploadBorder" style={{ border: "3px solid burlywood" }}>
                                            <h6 style={{ marginBottom: "20px" }} className="form-montrol1">Add Contents</h6>
                                            {
                                                Object.keys(repeatAbleBlock).map((value, index) => (
                                                    <>
                                                        <Accordion
                                                            style={{
                                                                backgroundColor: "#FFFFF4",
                                                                borderWidth: "3px",
                                                                borderColor: "black",
                                                                marginBottom: "20px"
                                                            }}
                                                            id={`accor${value}`}
                                                            expanded={repeatDrpDwn === value}
                                                            onChange={repetColapsDrpDwn(value)}
                                                        >
                                                            <AccordionSummary
                                                                expandIcon={<ExpandMoreIcon />}
                                                                aria-controls="panel1a-content"
                                                                id="panel1a-header"
                                                            >
                                                                <Typography >
                                                                    <b>{value.substring(11, value.length)}</b>
                                                                </Typography>
                                                            </AccordionSummary>
                                                            <div style={{ width: "100%", textAlignLast: "end", paddingRight: "6%", }} title="Add blocks!" ><button onClick={e => repeatAbleBlk(e, value, 0, true)} className="btn btn-success">Add Block</button></div>
                                                            <AccordionDetails >
                                                                <Typography>
                                                                    <div className="ScrollBarForApproveTemp" id={`${value}dropDown`} style={{ backgroundColor: "floralwhite", borderRadius: "10px", maxHeight: "150px", height: "fit-Content" }}>
                                                                        {
                                                                            repeatAbleBlock[value].map((headerKey, index) => (
                                                                                index !== 0 && (
                                                                                    <>
                                                                                        {
                                                                                            <div style={{ display: "flex", padding: "8px" }}>
                                                                                                <div style={{ width: "50%", marginRight: "4px" }}> <label style={{ width: "100%" }}>
                                                                                                    <input
                                                                                                        name={`Block ${index}`}
                                                                                                        type="text"
                                                                                                        class="form-montrol"
                                                                                                        autoComplete="true"
                                                                                                        disabled={true}
                                                                                                        value={`Block ${index}`}
                                                                                                        style={{ height: "30px" }}
                                                                                                    />
                                                                                                </label></div>
                                                                                                <div className='editcss' title="Edit values" style={{ width: "32%", marginRight: "4px" }}>
                                                                                                    <button onClick={e => repeatAbleBlk(e, value, index, false)} style={{ height: "30px" }} type='button' className='proceedbtn' name='uploadInputButton' >Edit</button>
                                                                                                </div>
                                                                                                <div title="Delete values" className="next-nav">
                                                                                                    <span
                                                                                                        style={{ color: "red", fontSize: "29px" }}
                                                                                                        className="fa fa-trash"
                                                                                                        id="signerInfoRmvBtn"
                                                                                                        onMouseOver={(e) => bigimg(e, "signerInfoRmvBtn")}
                                                                                                        onClick={e => deleteReptBlock(e, index, value)}
                                                                                                        title="Remove data from the table!"
                                                                                                    >
                                                                                                    </span>
                                                                                                </div>
                                                                                            </div>
                                                                                        }
                                                                                    </>
                                                                                )
                                                                            ))
                                                                        }
                                                                    </div >
                                                                </Typography>
                                                            </AccordionDetails>
                                                        </Accordion>
                                                    </>
                                                ))
                                            }

                                        </div >
                                    )
                                }
                                {
                                    createFileUploadtag()
                                }
                                <div className="buttonCss">
                                    <button class="container btn btn-primary " onClick={proceed}>
                                        Proceed
                                    </button>
                                </div>
                            </form >
                        </div>
                    </div>
                </div>
                {
                    allowModal.dynamicTable && (
                        <div className="custom-modal">
                            <div className="CustomModal-content">
                                <span className="close" onClick={closeTheModal}>&times;</span>
                                {
                                    dynamicTableFun()
                                }
                            </div>
                        </div>
                    )
                }
                {
                    openReptBlock.openReptBlock1 && (
                        <div className="custom-modal">
                            <div className="CustomModal-content">
                                <span className="close" onClick={closeTheModal}>&times;</span>
                                {
                                    repetableBlock()
                                }
                            </div>
                        </div>
                    )
                }
                {
                    openReptBlock.allowTextArea && (
                        <div className="custom-modal">
                            <div className="CustomModal-content">
                                <span className="close" onClick={closeTheModal}>&times;</span>
                                {
                                    openTxtModal()
                                }
                            </div>
                        </div>
                    )
                }
                {
                    (allowModal.inputModal || allowModal.dropDownModal) && (
                        <div className="custom-modal">
                            <div className="CustomModal-content">
                                <span className="close" onClick={closeTheModal}>&times;</span>
                                {
                                    inputFieldModal()
                                }
                            </div>
                        </div>
                    )
                }
            </div >
        </>
    );
}
export default memo(NewTemplate);