import React, { useState } from "react";
import { Add, Close, EmojiEmotions, Send } from "@mui/icons-material";
import NavbarRight from "../components/Navbar/NavbarRight";
import NavbarLeft from "../components/Navbar/NavbarLeft";
import UserModal from "../components/Modals/UserModal";
import Footer from "../components/ui/Footer";
import {
  Box,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Typography,
} from "@mui/material";
import loaderGif from "../assets/icons/2.gif";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  setDocId,
  clearDocId,
  setUploadDocText,
  setEssentialRequirements,
  setOptionalRequirements,
  clearDocumentState,
  setIsGenerateDocCalledTrue,
} from "../features/DocumentSlice";
import { createDoc, getDocFromPrompt } from "../actions/createDoc";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  generateDocumentbyPrompt,
  getRequirements,
  uploadOptional,
  uploadPre,
} from "../actions/DocType";
import { generateDocument } from "../actions/DocType";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { trimQuotes } from "../utils/utils";
import { formatText } from "../utils/utils";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { steps } from "../utils/tour";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import { NODE_API_ENDPOINT } from "../utils/utils";
import axios from "axios";

const DrafterArgs = () => {
  const driverObj = driver({
    showProgress: true,
    steps: steps,
  });

  let path = localStorage.getItem("from");

  let navigate = useNavigate();
  let dispatch = useDispatch();
  const [loading, setIsLoading] = useState(false);

  const [isReqCalled, setIsReqCalled] = useState(false);
  const [reqLoading, setReqLoading] = useState(false);
  const prompt = useSelector((state) => state.prompt.prompt);
  const docId = useSelector((state) => state.document.docId);
  const docuText = useSelector((state) => state.document.uploadDocText);
  const isThisByprompt = useSelector((state) => state.document.IsThisByprompt);
  const currentUser = useSelector((state) => state.auth.user);
  const [uploadDocText, setDocText] = useState("");
  const [fallbackText, setFallbackText] = useState();
  const [EssentialReq, setEssentialReq] = useState([]);
  const [OptionalReq, setOptionalReq] = useState([]);
  const [essentialInputs, setEssentialInputs] = useState({});
  const [optionalInputs, setOptionalInputs] = useState({});
  const [docID, setDocID] = useState(null);
  const [languageDialogOpen, setLanguageDialogOpen] = useState(false); // State for language dialog
  const [selectedLanguages, setSelectedLanguages] = useState([]);

  const handleCancelLanguageSelection = () => {
    setLanguageDialogOpen(false);
    setSelectedLanguages([]);
  };

  const languages = ["English", "Hindi", "Telugu", "Tamil", "Kannada"];

  const handleLanguageChange = (event) => {
    const { value, checked } = event.target;
    setSelectedLanguages((prev) =>
      checked ? [...prev, value] : prev.filter((lang) => lang !== value)
    );
  };

  const convertArrayToString = (arr) => {
    return arr.map((lang) => lang.toLowerCase()).join(", ");
  };

  useEffect(() => {
    dispatch(clearDocId());

    const fetchDocId = async () => {
      try {
        const data = await createDoc(currentUser.jwt).then((data) => {
          const doc_id = data.data.data.fetchedData.doc_id;
          // console.log(doc_id);
          // console.log(data);
          dispatch(setDocId(doc_id));
          setDocID(doc_id);
          if (doc_id && prompt) {
            if (path !== "docType") {
              fetchData(doc_id);
            } else {
              fetchReq(doc_id);
            }
          }
        });
      } catch (error) {
        console.error("Failed to fetch document ID:", error);
      } finally {
        if (path === "docType") {
          if (localStorage.getItem("tut") == null) {
            driverObj.drive();
            localStorage.setItem("tut", false);
          }
        }
      }
    };
    fetchDocId();
  }, []);

  useEffect(() => {
    if (path === "docType")
      setDocText("Please set the requirements to proceed!");
  }, [docId]);

  const fetchReq = async (doc_id) => {
    console.log(docId);

    try {
      setIsLoading(true);
      const data = await getRequirements(doc_id, prompt, currentUser.jwt);
      const res = data.data.data.fetchedData;

      console.log(res);
      setEssentialReq(res.essential_requirements);
      setOptionalReq(res.optional_requirements);

      // Initialize input state
      const initialEssentialInputs = {};
      Object.keys(res.essential_requirements).forEach((req) => {
        initialEssentialInputs[req] = res.essential_requirements[req]
          ? res.essential_requirements[req]
          : "";
      });
      setEssentialInputs(initialEssentialInputs);

      const initialOptionalInputs = {};
      Object.keys(res.optional_requirements).forEach((req) => {
        initialOptionalInputs[req] = res.optional_requirements[req]
          ? res.optional_requirements[req]
          : "";
      });
      setOptionalInputs(initialOptionalInputs);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = async (doc_id) => {
    setIsLoading(true);
    try {
      await getDocFromPrompt(doc_id, prompt, currentUser.jwt).then((data) => {
        const docText = data.data.data.fetchedData.document;
        const processedText = docText;
        setDocText(trimQuotes(processedText));
        // setDocText(docText);
        // console.log(trimQuotes(processedText));
        setFallbackText(
          'Sale Agreement\n\nThis Sale Agreement ("Agreement") is made and entered into on this [DATE] by and between:\n\n1. [SELLER\'S NAME], residing at [SELLER\'S ADDRESS] (hereinafter referred to as the "Seller"); \nand\n2. [BUYER\'S NAME], residing at [BUYER\'S ADDRESS] (hereinafter referred to as the "Buyer").\n\nRecitals:\n\nWHEREAS, the Seller is the legal and beneficial owner of the property described below and desires to sell the same to the Buyer.\n\nWHEREAS, the Buyer is desirous of purchasing the said property from the Seller on the terms and conditions set forth in this Agreement.\n\nNOW, THEREFORE, in consideration of the mutual covenants and agreements hereinafter set forth, the parties hereto agree as follows:\n\n1. Description of Property:\nThe property being sold under this Agreement is described as [PROPERTY DETAILS, INCLUDING ADDRESS, LEGAL DESCRIPTION, AND ANY UNIQUE IDENTIFIERS]. The Seller hereby confirms that the property is free from all encumbrances, claims, and demands whatsoever.\n\n'
        );

        dispatch(setUploadDocText(trimQuotes(processedText)));
        console.log(data.data.data.fetchedData);

        const essentialRequirements =
          data.data.data.fetchedData.essential_requirements;
        setEssentialReq(essentialRequirements);
        const initialEssentialInputs = {};
        Object.keys(essentialRequirements || {}).forEach((req) => {
          initialEssentialInputs[req] = essentialRequirements[req]
            ? essentialRequirements[req]
            : "";
        });
        // console.log(initialEssentialInputs);
        setEssentialInputs(initialEssentialInputs);
        dispatch(setEssentialRequirements(essentialRequirements));

        const optionalRequirements =
          data.data.data.fetchedData.optional_requirements;
        setOptionalReq(optionalRequirements);
        const initialOptionalInputs = {};
        Object.keys(optionalRequirements || {}).forEach((req) => {
          initialOptionalInputs[req] = optionalRequirements[req]
            ? optionalRequirements[req]
            : "";
        });
        setOptionalInputs(initialOptionalInputs);
        dispatch(setOptionalRequirements(optionalRequirements));
      });
      // console.log(uploadDocText);
    } catch (e) {
      setDocText("");
      toast.error("Failed to fetch data");
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e, type) => {
    const { name, value } = e.target;

    if (type === "essential") {
      setEssentialInputs((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else if (type === "optional") {
      setOptionalInputs((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setReqLoading(true);
    // Combine essential and optional inputs into a single object
    const allInputs = {
      essential_requirements: essentialInputs,
      optional_requirements: optionalInputs,
    };

    // Convert the essential requirements to a JSON string with indentation for readability
    const essentialJsonString = JSON.stringify(
      allInputs.essential_requirements,
      null,
      4
    ); // 'null, 4' adds indentation

    // Convert the optional requirements to a JSON string with indentation
    const optionalJsonString = JSON.stringify(
      allInputs.optional_requirements,
      null,
      4
    );

    // Final result where the JSON string is encapsulated as a plain string
    const finalEssentialString = essentialJsonString;
    const finalOptionalString = optionalJsonString;
    try {
      const res1 = await uploadPre(
        docId,
        finalEssentialString,
        currentUser.jwt
      );
      console.log(res1);
      const res2 = await uploadOptional(
        docId,
        finalOptionalString,
        currentUser.jwt
      );
      console.log(res2);
      let res;
      if (isThisByprompt) {
        res = await generateDocumentbyPrompt(docId, currentUser.jwt);
      } else {
        res = await generateDocument(docId, currentUser.jwt);
      }
      dispatch(setIsGenerateDocCalledTrue());
      console.log(res.data.data.fetchedData.document);
      setDocText(res.data.data.fetchedData.document);
      setFallbackText(
        'Sale Agreement\n\nThis Sale Agreement ("Agreement") is made and entered into on this [DATE] by and between:\n\n1. [SELLER\'S NAME], residing at [SELLER\'S ADDRESS] (hereinafter referred to as the "Seller"); \nand\n2. [BUYER\'S NAME], residing at [BUYER\'S ADDRESS] (hereinafter referred to as the "Buyer").\n\nRecitals:\n\nWHEREAS, the Seller is the legal and beneficial owner of the property described below and desires to sell the same to the Buyer.\n\nWHEREAS, the Buyer is desirous of purchasing the said property from the Seller on the terms and conditions set forth in this Agreement.\n\nNOW, THEREFORE, in consideration of the mutual covenants and agreements hereinafter set forth, the parties hereto agree as follows:\n\n1. Description of Property:\nThe property being sold under this Agreement is described as [PROPERTY DETAILS, INCLUDING ADDRESS, LEGAL DESCRIPTION, AND ANY UNIQUE IDENTIFIERS]. The Seller hereby confirms that the property is free from all encumbrances, claims, and demands whatsoever.\n\n'
      );
      dispatch(setUploadDocText(res.data.data.fetchedData.document));
    } catch (e) {
      console.log(e);
    } finally {
      setReqLoading(false);
      setIsReqCalled(true);
      navigate("/DocPreview");
    }

    // You can send this final string to your API
    console.log(finalOptionalString); // Optional requirements in string format
    console.log(finalEssentialString); // Optional requirements in string format

    toast.success("Requirements saved successfully!");
  };

  const handleSaveRequirements = async (e) => {
    e.preventDefault();
    setReqLoading(true);
    // Combine essential and optional inputs into a single object
    const allInputs = {
      essential_requirements: essentialInputs,
      optional_requirements: optionalInputs,
    };

    // Convert the essential requirements to a JSON string with indentation for readability
    const essentialJsonString = JSON.stringify(
      allInputs.essential_requirements,
      null,
      4
    ); // 'null, 4' adds indentation

    // Convert the optional requirements to a JSON string with indentation
    const optionalJsonString = JSON.stringify(
      allInputs.optional_requirements,
      null,
      4
    );

    // Final result where the JSON string is encapsulated as a plain string
    const finalEssentialString = essentialJsonString;
    const finalOptionalString = optionalJsonString;
    try {
      const res1 = await uploadPre(docId, finalEssentialString);
      console.log(res1);
      const res2 = await uploadOptional(docId, finalOptionalString);
      console.log(res2);
      let res;
      if (isThisByprompt) {
        res = await generateDocumentbyPrompt(docId);
      } else {
        res = await generateDocument(docId);
      }
      dispatch(setIsGenerateDocCalledTrue());
      console.log(res.data.data.fetchedData.document);
      setDocText(res.data.data.fetchedData.document);
      setFallbackText(
        'Sale Agreement\n\nThis Sale Agreement ("Agreement") is made and entered into on this [DATE] by and between:\n\n1. [SELLER\'S NAME], residing at [SELLER\'S ADDRESS] (hereinafter referred to as the "Seller"); \nand\n2. [BUYER\'S NAME], residing at [BUYER\'S ADDRESS] (hereinafter referred to as the "Buyer").\n\nRecitals:\n\nWHEREAS, the Seller is the legal and beneficial owner of the property described below and desires to sell the same to the Buyer.\n\nWHEREAS, the Buyer is desirous of purchasing the said property from the Seller on the terms and conditions set forth in this Agreement.\n\nNOW, THEREFORE, in consideration of the mutual covenants and agreements hereinafter set forth, the parties hereto agree as follows:\n\n1. Description of Property:\nThe property being sold under this Agreement is described as [PROPERTY DETAILS, INCLUDING ADDRESS, LEGAL DESCRIPTION, AND ANY UNIQUE IDENTIFIERS]. The Seller hereby confirms that the property is free from all encumbrances, claims, and demands whatsoever.\n\n'
      );
      dispatch(setUploadDocText(res.data.data.fetchedData.document));
    } catch (e) {
      console.log(e);
    } finally {
      setReqLoading(false);
      setIsReqCalled(true);
    }

    // You can send this final string to your API
    console.log(finalOptionalString); // Optional requirements in string format
    console.log(finalEssentialString); // Optional requirements in string format

    toast.success("Requirements saved successfully!");
    navigate("/DocEdit");
  };

  const handleLanguageConfirm = () => {
    setLanguageDialogOpen(false);
    handleUploadDoc();
    // Proceed with file selection
    // if (fileInputRef.current) {
    //   fileInputRef.current.click();
    // }
  };

  const handleToOpenDialog = () => {
    setLanguageDialogOpen(true);
  };

  const handleUploadDoc = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf,.docx,.txt"; // Specify the accepted file types
    fileInput.multiple = true;
    fileInput.addEventListener("change", async (event) => {
      const files = Array.from(event.target.files);
      if (files.length > 0) {
        for (const file of files) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("doc_id", docId);
          const language = convertArrayToString(selectedLanguages);
          formData.append("language", language);
          // formData.append("isMultilang", true);
          const response = await axios.post(
            `${NODE_API_ENDPOINT}/ai-drafter/upload_input_document`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${currentUser.jwt}`,
              },
            }
          );
          if (response.status == 200) {
            toast.success("File uploaded successfully");
          } else {
            toast.error("Error in uploading file");
          }
          console.log(response);
        }
      }
    });
    fileInput.click();
  };

  return (
    <div className="flex font-sans flex-col h-screen justify-between space-y-2 w-full p-5">
      <div className="flex flex-row justify-between w-full items-center">
        <NavbarRight showMenu={false} />
        <NavbarLeft />
      </div>

      <div className="flex space-x-5 flex-row w-full h-[80%]  justify-center items-center">
        <div className="w-[70%] space-y-2 flex flex-col h-full bg-customBlack rounded-md px-5 py-5">
          {/* user */}
          <div className="flex  font-semibold text-lg gap-5 w-full flex-row justify-start items-center">
            {/* <UserModal /> */}
            <div className="h-20 items-center justify-center flex flex-col overflow-y-auto scrollbar-hide">
              {prompt
                .split(" ")
                .map((x) => {
                  return x[0].toUpperCase() + x.slice(1);
                })
                .join(" ")}
            </div>
          </div>
          {/* arguments container */}
          <div
            id="docText"
            className="bg-card-gradient  scrollbar-hide overflow-y-auto scroll-smooth rounded-md w-full flex flex-col items-start p-5 h-full"
          >
            {loading ? (
              <div className="flex flex-col h-full items-center justify-center w-full">
                <img
                  className="flex flex-row justify-center items-center w-40 h-40"
                  src={loaderGif}
                  alt="Loading..."
                />
                <p className="font-semibold">Generating Document...</p>
              </div>
            ) : (
              <div>
                <Markdown rehypePlugins={[rehypeRaw]}>
                  {formatText(
                    trimQuotes(uploadDocText.replace(/\u20B9/g, "₹"))
                  )}
                </Markdown>
              </div>
            )}
          </div>
        </div>
        <div className="w-[30%] space-y-5 flex flex-col justify-center items-center h-full">
          <div className="w-full p-2 flex  items-center h-full overflow-y-auto rounded-md flex-col bg-customBlack">
            {loading ? (
              <img
                className="flex flex-row justify-center items-center w-40 h-40"
                src={loaderGif}
                alt="Loading..."
              />
            ) : (
              <div className="flex flex-col gap-3 h-full justify-between ">
                <form
                  id="reqPanel"
                  className="space-y-3 flex flex-col h-full w-full overflow-auto scrollbar-hide text-sm"
                  onSubmit={handleSaveRequirements}
                >
                  <Accordion
                    style={{
                      backgroundColor: "rgba(34, 34, 34, 0.8)",
                      font: "",
                      boxShadow: "0px",
                      "border-radius": "5px",
                    }}
                    className=" rounded-md"
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon className="text-white" />}
                      aria-controls="panel1-content"
                      id="panel1-header"
                      style={{
                        backgroundColor: "rgba(34, 34, 34,",
                        // backgroundColor:"rgba(34, 34, 34, 0.8)",
                        font: "",
                        boxShadow: "0px",
                        color: "white",
                      }}
                    >
                      Essential Requirements
                    </AccordionSummary>
                    <AccordionDetails>
                      {Object.keys(EssentialReq || {}).map((req, index) => (
                        <div key={index}>
                          <label htmlFor={req} className="text-white text-sm">
                            {req.replaceAll("_", " ")}
                          </label>
                          <input
                            type="text"
                            name={req}
                            value={essentialInputs[req]}
                            onChange={(e) => handleInputChange(e, "essential")}
                            style={{ border: "1px solid #d1d5db" }}
                            className="w-full p-0.5 bg-customBlack border-white rounded-md text-white text-xs"
                          />
                        </div>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                  <Accordion
                    style={{
                      backgroundColor: "rgba(34, 34, 34, 0.8)",
                      font: "",
                      boxShadow: "0px",
                      color: "white",
                      "border-radius": "5px",
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon className="text-white" />}
                      aria-controls="panel2-content"
                      id="panel2-header"
                      style={{
                        backgroundColor: "rgba(34, 34, 34, 0.8)",
                        font: "",
                        boxShadow: "0px",
                        color: "white",
                      }}
                    >
                      Optional Requirements
                    </AccordionSummary>
                    <AccordionDetails>
                      {Object.keys(OptionalReq || {}).map((req, index) => (
                        <div key={index}>
                          <label
                            htmlFor={req}
                            className="text-white-50 text-xs"
                          >
                            {req.replaceAll("_", " ")}
                          </label>
                          <input
                            type="text"
                            name={req}
                            value={optionalInputs[req]}
                            onChange={(e) => handleInputChange(e, "optional")}
                            style={{ border: "1px solid #d1d5db" }}
                            className="w-full p-0.5  bg-customBlack border-white rounded-md text-white"
                          />
                        </div>
                      ))}
                    </AccordionDetails>
                  </Accordion>

                  {/* <div className="flex flex-col gap-3">
                  
                  <div className="text-sm">
                    <h2 className="underline text-primary-theme-white-50 font-bold">
                      Essential Requirements
                    </h2>
                    {Object.keys(EssentialReq || {}).map((req, index) => (
                      <div key={index}>
                        <label
                          htmlFor={req}
                          className="text-primary-theme-white-50 text-xs"
                        >
                          {req}
                        </label>
                        <input
                          type="text"
                          name={req}
                          value={essentialInputs[req]}
                          onChange={(e) => handleInputChange(e, "essential")}
                          className="w-full p-0.5 bg-customBlack border-white rounded-md text-primary-theme-white-50 "
                        />
                      </div>
                    ))}
                  </div>
                  <div className="w-full h-0.5 bg-white/50 rounded-md" />
                  <div>
                    <h2 className="underline text-primary-theme-white-50 font-bold">
                      Optional Requirements
                    </h2>
                    {Object.keys(OptionalReq || {}).map((req, index) => (
                      <div key={index}>
                        <label
                          htmlFor={req}
                          className="text-primary-theme-white-50 text-xs"
                        >
                          {req}
                        </label>
                        <input
                          type="text"
                          name={req}
                          value={optionalInputs[req]}
                          onChange={(e) => handleInputChange(e, "optional")}
                          className="w-full p-2 bg-customBlack border-white rounded-md text-primary-theme-white-50"
                        />
                      </div>
                    ))}
                  </div>
                </div> */}
                </form>

                <button
                  onClick={handleToOpenDialog}
                  className="w-full rounded-md bg-[#018081] py-2 font-semibold text-lg "
                >
                  <div className=" flex gap-3 items-center justify-center">
                    <svg
                      className=""
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M4.026 3.42386L5.4 2.04352V7.79895C5.4 7.95812 5.46321 8.11077 5.57574 8.22332C5.68826 8.33587 5.84087 8.3991 6 8.3991C6.15913 8.3991 6.31174 8.33587 6.42426 8.22332C6.53679 8.11077 6.6 7.95812 6.6 7.79895V2.04352L7.974 3.42386C8.02978 3.48011 8.09614 3.52476 8.16925 3.55523C8.24237 3.5857 8.32079 3.60139 8.4 3.60139C8.47921 3.60139 8.55763 3.5857 8.63075 3.55523C8.70386 3.52476 8.77022 3.48011 8.826 3.42386C8.88224 3.36807 8.92687 3.30169 8.95734 3.22856C8.9878 3.15543 9.00348 3.07698 9.00348 2.99776C9.00348 2.91853 8.9878 2.84009 8.95734 2.76695C8.92687 2.69382 8.88224 2.62744 8.826 2.57165L6.426 0.171051C6.36894 0.116413 6.30165 0.0735831 6.228 0.0450193C6.08192 -0.0150064 5.91808 -0.0150064 5.772 0.0450193C5.69835 0.0735831 5.63106 0.116413 5.574 0.171051L3.174 2.57165C3.11806 2.62761 3.07368 2.69404 3.0434 2.76715C3.01313 2.84026 2.99755 2.91862 2.99755 2.99776C2.99755 3.07689 3.01313 3.15525 3.0434 3.22836C3.07368 3.30147 3.11806 3.3679 3.174 3.42386C3.22994 3.47982 3.29636 3.52421 3.36945 3.55449C3.44254 3.58477 3.52088 3.60036 3.6 3.60036C3.67912 3.60036 3.75746 3.58477 3.83055 3.55449C3.90364 3.52421 3.97006 3.47982 4.026 3.42386ZM11.4 5.9985C11.2409 5.9985 11.0883 6.06173 10.9757 6.17428C10.8632 6.28683 10.8 6.43948 10.8 6.59865V10.1996C10.8 10.3587 10.7368 10.5114 10.6243 10.6239C10.5117 10.7365 10.3591 10.7997 10.2 10.7997H1.8C1.64087 10.7997 1.48826 10.7365 1.37574 10.6239C1.26321 10.5114 1.2 10.3587 1.2 10.1996V6.59865C1.2 6.43948 1.13679 6.28683 1.02426 6.17428C0.911742 6.06173 0.75913 5.9985 0.6 5.9985C0.44087 5.9985 0.288258 6.06173 0.175736 6.17428C0.0632141 6.28683 0 6.43948 0 6.59865V10.1996C0 10.6771 0.189642 11.135 0.527208 11.4727C0.864773 11.8103 1.32261 12 1.8 12H10.2C10.6774 12 11.1352 11.8103 11.4728 11.4727C11.8104 11.135 12 10.6771 12 10.1996V6.59865C12 6.43948 11.9368 6.28683 11.8243 6.17428C11.7117 6.06173 11.5591 5.9985 11.4 5.9985Z"
                        fill="white"
                      />
                    </svg>
                    <span>Upload Document</span>
                  </div>
                </button>
                <Dialog
                  open={languageDialogOpen}
                  onClose={handleCancelLanguageSelection}
                  PaperProps={{
                    style: {
                      background: "linear-gradient(135deg, #004343, #00A9AB)",
                      color: "#fff",
                      borderRadius: "15px",
                      width: "30%",
                      border: "2px solid white",
                    },
                  }}
                >
                  <DialogTitle>
                    <Typography variant="h5" style={{ fontWeight: "bold" }}>
                      Select Languages
                    </Typography>
                  </DialogTitle>
                  <DialogContent>
                    <Box display="flex" flexDirection="column" gap={1}>
                      {languages.map((language) => (
                        <FormControlLabel
                          key={language}
                          control={
                            <Checkbox
                              value={language}
                              checked={selectedLanguages.includes(language)}
                              onChange={handleLanguageChange}
                              style={{ color: "#fff" }}
                            />
                          }
                          label={
                            <Typography style={{ color: "#fff" }}>
                              {language}
                            </Typography>
                          }
                        />
                      ))}
                    </Box>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={handleCancelLanguageSelection}
                      style={{
                        backgroundColor: "transparent",
                        color: "#fff",
                        border: "2px solid #fff",
                        borderRadius: "10px",
                        padding: "5px 15px",
                        fontWeight: "bold",
                        textTransform: "none",
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleLanguageConfirm}
                      disabled={selectedLanguages.length === 0}
                      style={{
                        backgroundColor: "#018081",
                        color: "#fff",
                        border: "2px solid #fff",
                        borderRadius: "10px",
                        padding: "5px 15px",
                        fontWeight: "bold",
                        textTransform: "none",
                      }}
                    >
                      Confirm
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            )}
          </div>
          <div className="flex font-sans flex-row w-full  justify-between items-center gap-3">
            <button
              onClick={() => {
                if (path !== "docType") navigate("/Drafter");
                else navigate("/DocType");
              }}
              className="w-full py-2 transition  ease-in-out duration-500  hover:scale-110  bg-[#004343] rounded-md text-sm border-white border-2"
            >
              {path !== "docType" ? "Re-enter Prompt" : "Re-select doctype"}
            </button>
            {reqLoading ? (
              <button
                id="Generate"
                onClick={handleGenerate}
                disabled={loading || reqLoading}
                className={`${
                  loading || reqLoading
                    ? " pointer-events-none genarate-button cursor-not-allowed"
                    : ""
                } w-full py-2 border-white border-2 transition ease-in-out duration-1000  hover:scale-110  bg-[#004343]   rounded-md text-sm`}
              >
                {reqLoading ? "Generating ..." : "Generate Document"}
              </button>
            ) : (
              <button
                id="Generate"
                onClick={handleGenerate}
                disabled={loading || reqLoading}
                className={`${
                  loading || reqLoading
                    ? "opacity-75 pointer-events-none cursor-not-allowed"
                    : ""
                } w-full border-white border-2 transition ease-in-out duration-1000  hover:scale-110  bg-[#004343]  py-2  rounded-md text-sm`}
              >
                {reqLoading ? "Generating ..." : "Generate Document"}
              </button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DrafterArgs;
