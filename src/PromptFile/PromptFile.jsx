import React, { useEffect, useState } from "react";
import UserModal from "../components/Modals/UserModal";
import Footer from "../components/ui/Footer";
import CustomInput from "../components/ui/CustomInput";
import HeroText from "../components/ui/Hero";
import Banner from "../components/ui/Banner";
import { createDoc, getDocFromPrompt } from "../actions/createDoc";
import { useDispatch, useSelector } from "react-redux";
import aiIcon from "../assets/icons/back.gif";
import backGif from "../assets/icons/backgif.gif";
import pdf from "../assets/icons/pdf.svg";
import { trimQuotes } from "../utils/utils";
import { Helmet } from "react-helmet";

import { setPrompt } from "../features/PromptSlice";
import { useNavigate } from "react-router-dom";
import {
  setDocId,
  setEssentialRequirements,
  setIsThisBypromptFalse,
  setIsThisBypromptTrue,
  setOptionalRequirements,
  setUploadDocText,
} from "../features/DocumentSlice";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import HomeNav from "../components/Navbar/HomeNav";
import toast from "react-hot-toast";
import axios from "axios";
import { NODE_API_ENDPOINT } from "../utils/utils";

const PromptFile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [prompt, setPromptValue] = useState("");
  const [fileData, setFileData] = useState([]);
  const [fileUploaded, setFileUploaded] = useState(true);
  const [loading, setLoading] = useState(false);
  const currentUser = useSelector((state) => state.auth.user);
  const [fileUploading, setFileUploading] = useState(false);
  const [languageDialogOpen, setLanguageDialogOpen] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState([]);

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

  const handleLanguageConfirm = () => {
    setLanguageDialogOpen(false);
    handleFileUpload();
    // Proceed with file selection
    // if (fileInputRef.current) {
    //   fileInputRef.current.click();
    // }
  };

  const handleCancelLanguageSelection = () => {
    setLanguageDialogOpen(false);
    setSelectedLanguages([]);
  };

  const onChange = (e) => {
    setPromptValue(e.target.value);
  };

  const handleSubmit = async () => {
    if (fileData.length == 0) {
      console.log("jo");
      setFileUploaded(false);
      return;
    }
    setFileUploading(true);
    const formData = new FormData();
    const response = await axios.get(
      `${NODE_API_ENDPOINT}/ai-drafter/create_document`,
      {
        headers: {
          Authorization: `Bearer ${currentUser.jwt}`,
          "Content-Type": "application/json",
        },
      }
    );
    const doc_id = response.data.data.fetchedData.doc_id;
    dispatch(setDocId(doc_id));
    const renamedFile = new File([fileData[0]], doc_id + ".docx", {
      type: fileData[0].type,
    });
    console.log(renamedFile);
    formData.append("file", renamedFile);

    formData.append("doc_id", doc_id);
    formData.append("query", prompt);
    const language = convertArrayToString(selectedLanguages);
    formData.append("language", language);
    const res = await axios.post(
      `${NODE_API_ENDPOINT}/ai-drafter/uploadPrompt`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${currentUser.jwt}`,
        },
      }
    );
    dispatch(setUploadDocText(trimQuotes(res.data.document)));
    dispatch(setEssentialRequirements(res.data.essential_requirements));
    dispatch(setOptionalRequirements(res.data.optional_requirements));
    console.log(res);

    localStorage.setItem("from", "Prompt");
    // dispatch(setPrompt(prompt));

    navigate("/Drafter/DrafterArgs");
  };

  const handleFileUpload = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf,.docx,.txt"; // Specify the accepted file types
    // fileInput.multiple = true;
    fileInput.addEventListener("change", async (event) => {
      const files = Array.from(event.target.files);
      setFileData(files);
      // if (files.length > 0) {
      //   for (const file of files) {
      //     const formData = new FormData();
      //     formData.append("file", file);
      // formData.append("doc_id", docId);
      // formData.append("isMultilang", true);
      // const response = await axios.post(
      //   `${NODE_API_ENDPOINT}/ai-drafter/upload_input_document`,
      //   formData,
      //   {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //     //   Authorization: `Bearer ${currentUser.jwt}`,
      //     },
      //   }
      // );
      // if (response.status == 200) {
      //   toast.success("file Uploaded");
      // } else {
      //   toast.error("error uploading file");
      // }
      // console.log(response);
      // }
      // }
    });
    fileInput.click();
  };

  const removeFileData = () => {
    setFileData([]);
  };
  useEffect(() => {
    console.log(fileData);
  }, [fileData]);
  useEffect(() => {
    dispatch(setIsThisBypromptTrue());
  }, []);

  return (
    <div className="flex font-sans flex-col justify-center items-center w-full h-screen p-2 relative">
      <Helmet>
        <title>Legal Insights by Adira</title>
        <meta
          name="description"
          content="Get instant insights and solutions with Adira's intelligent legal prompts. Designed to enhance decision-making for legal professionals."
        />
        <meta
          name="keywords"
          content="legal prompts, intelligent solutions, AI legal assistance, quick insights, decision-making tools, law innovation, Adira prompts, legal AI solutions, professional support, legaltech innovation"
        />
      </Helmet>

      <div
        className="w-full h-screen absolute p-3 rounded-lg"
        style={{
          background: `radial-gradient(circle at 50% 0%, #018585, transparent 45%)`,
        }}
      >
        {/* <img className="w-full h-full opacity-50" src={"https://res.cloudinary.com/dyuov6i8c/image/upload/v1731494821/Assets/wu5vjve1k99lh1dov25w.gif"} /> */}
        <video
          className="w-full h-full object-cover opacity-65"
          autoPlay
          loop
          muted
          playsInline
        >
          <source
            src="https://res.cloudinary.com/dyuov6i8c/video/upload/v1732689934/LegalGPT/vnibvz9t1533t1bq2ekf.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>
      <div
        className="flex flex-col h-screen w-full  z-20 gap-3 bg-black bg-opacity-20 rounded-lg p-4"
        style={{ boxShadow: "0 0 5px white, 0 0 10px white, 0 0 5px white" }}
      >
        <div className="flex flex-col w-full h-full items-center">
          <div className="h-[10%] w-full ">
            <HomeNav />
          </div>
          <div className="h-full flex flex-col justify-between">
            <HeroText />
            <Banner />

            <div className="flex flex-col gap-2 justify-center w-full">
              {/* <CustomInput
              onSubmit={handleSubmit}
              btn={true}
              placeholder="Type prompt to generate a new document"
              onChange={onChange}
              loading={loading}
              value={prompt}
              required={true}
            /> */}
              {fileUploading ? (
                <div
                  className={
                    "send-button w-full flex justify-center items-center upload-button text-center h-10 border-2 rounded bg-customFleUploadBg"
                  }
                >
                  <span>Uploading </span>
                  <span className="pl-2">
                    <CircularProgress size={15} color="inherit" />
                  </span>
                </div>
              ) : (
                <div className="flex gap-2 justify-between">
                  {fileData.length > 0 ? (
                    <div
                      className={`w-[30%] relative flex gap-3 border-2 rounded justify-around   items-center bg-customFleUploadBg text-white ${
                        fileUploading ? "send-button" : ""
                      }`}
                    >
                      <svg
                        width="25"
                        height="30"
                        viewBox="0 0 35 40"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g id="Group 88">
                          <path
                            id="Vector"
                            d="M1.42822 21.4287H22.8568V32.8573H1.42822V21.4287Z"
                            fill="#00B6FF"
                          />
                          <path
                            id="Vector_2"
                            d="M34.2857 10.5357C34.292 10.5027 34.292 10.4688 34.2857 10.4357C34.2509 10.3506 34.1999 10.273 34.1357 10.2072L24.1357 0.207171C24.0699 0.142921 23.9923 0.0919879 23.9071 0.0571714C23.8741 0.0508076 23.8402 0.0508076 23.8071 0.0571714C23.7345 0.0187863 23.6535 -0.000856023 23.5714 2.86112e-05H3.57143C3.38199 2.86112e-05 3.2003 0.0752836 3.06635 0.209238C2.9324 0.343192 2.85714 0.524874 2.85714 0.714314V20H0.714285C0.524845 20 0.343164 20.0753 0.209209 20.2092C0.075255 20.3432 0 20.5249 0 20.7143V33.5714C0 33.7609 0.075255 33.9426 0.209209 34.0765C0.343164 34.2105 0.524845 34.2857 0.714285 34.2857H2.85714V39.2857C2.85714 39.4752 2.9324 39.6568 3.06635 39.7908C3.2003 39.9247 3.38199 40 3.57143 40H33.5714C33.7608 40 33.9425 39.9247 34.0765 39.7908C34.2104 39.6568 34.2857 39.4752 34.2857 39.2857V10.7143C34.2966 10.6553 34.2966 10.5948 34.2857 10.5357ZM24.2857 2.43574L31.85 10H24.2857V2.43574ZM1.42857 21.4286H22.8571V32.8571H1.42857V21.4286ZM4.28571 38.5714V34.2857H23.5714C23.7608 34.2857 23.9425 34.2105 24.0765 34.0765C24.2104 33.9426 24.2857 33.7609 24.2857 33.5714V20.7143C24.2857 20.5249 24.2104 20.3432 24.0765 20.2092C23.9425 20.0753 23.7608 20 23.5714 20H4.28571V1.4286H22.8571V10.7143C22.8571 10.9037 22.9324 11.0854 23.0663 11.2194C23.2003 11.3533 23.382 11.4286 23.5714 11.4286H32.8571V38.5714H4.28571Z"
                            fill="#016F9B"
                          />
                          <path
                            id="Vector_3"
                            d="M31.8499 9.99983H24.2856V2.43555L31.8499 9.99983Z"
                            fill="white"
                          />
                          <path
                            id="Vector_4"
                            d="M32.857 11.4287V38.5715H4.28564V34.2858H23.5713C23.7608 34.2858 23.9425 34.2106 24.0764 34.0766C24.2104 33.9427 24.2856 33.761 24.2856 33.5715V20.7144C24.2856 20.525 24.2104 20.3433 24.0764 20.2093C23.9425 20.0754 23.7608 20.0001 23.5713 20.0001H4.28564V1.42871H22.8571V10.7144C22.8571 10.9039 22.9323 11.0855 23.0663 11.2195C23.2002 11.3534 23.3819 11.4287 23.5713 11.4287H32.857Z"
                            fill="white"
                          />
                          <path
                            id="Vector_5"
                            d="M5 29.9999V24.2857H6.9C7.38781 24.2532 7.8706 24.4006 8.25714 24.6999C8.45224 24.8696 8.60679 25.0809 8.70939 25.3183C8.812 25.5556 8.86005 25.813 8.85 26.0714C8.84569 26.4053 8.74929 26.7316 8.57143 27.0142C8.40437 27.2928 8.15473 27.5125 7.85714 27.6428C7.59889 27.7578 7.31831 27.8139 7.03571 27.8071H6.17857V29.9999H5ZM6.20714 26.7714H6.87857C7.0901 26.7825 7.29764 26.7107 7.45714 26.5714C7.52778 26.5004 7.58272 26.4155 7.6184 26.322C7.65409 26.2284 7.66972 26.1285 7.66428 26.0285C7.66428 25.5904 7.40238 25.3714 6.87857 25.3714H6.20714V26.7714ZM9.96428 29.9999V24.2857H12.1071C12.6442 24.2667 13.1707 24.4388 13.5929 24.7714C13.9425 25.0558 14.2199 25.4189 14.4024 25.8311C14.5849 26.2432 14.6673 26.6927 14.6428 27.1428C14.649 27.6668 14.5264 28.1844 14.2857 28.6499C14.0605 29.0853 13.7129 29.4453 13.2857 29.6857C12.7921 29.9226 12.2466 30.0307 11.7 29.9999H9.96428ZM11.1714 28.9142H11.9429C12.2172 28.9242 12.4883 28.8521 12.7214 28.7071C12.9686 28.5215 13.164 28.2757 13.2891 27.9931C13.4141 27.7105 13.4646 27.4005 13.4357 27.0928C13.46 26.8036 13.4105 26.5129 13.2919 26.2481C13.1732 25.9832 12.9892 25.7528 12.7571 25.5785C12.5271 25.4324 12.258 25.3601 11.9857 25.3714H11.1714V28.9142ZM15.8857 29.9999V24.2857H19.1571V25.3714H17.0928V26.5357H18.9857V27.6214H17.0928V29.9999H15.8857Z"
                            fill="#016F9B"
                          />
                        </g>
                      </svg>
                      <p>
                        {fileData[0].name.length <= 17
                          ? fileData[0].name
                          : fileData[0].name.slice(0, 17 - 3) +
                            "..." +
                            fileData[0].name.slice(-4)}
                      </p>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 30 30"
                        fill="none"
                        onClick={removeFileData}
                      >
                        <path
                          d="M15 0C12.0333 0 9.13319 0.879734 6.66645 2.52796C4.19971 4.17618 2.27713 6.51885 1.14181 9.25974C0.00649926 12.0006 -0.290551 15.0166 0.288227 17.9263C0.867006 20.8361 2.29562 23.5088 4.3934 25.6066C6.49119 27.7044 9.16394 29.133 12.0736 29.7118C14.9834 30.2905 17.9994 29.9935 20.7403 28.8582C23.4811 27.7229 25.8238 25.8003 27.472 23.3335C29.1203 20.8668 30 17.9667 30 15C30 13.0302 29.612 11.0796 28.8582 9.25974C28.1044 7.43986 26.9995 5.78628 25.6066 4.3934C24.2137 3.00052 22.5601 1.89563 20.7403 1.14181C18.9204 0.387986 16.9698 0 15 0ZM19.815 17.685C19.9556 17.8244 20.0672 17.9903 20.1433 18.1731C20.2195 18.3559 20.2587 18.552 20.2587 18.75C20.2587 18.948 20.2195 19.1441 20.1433 19.3269C20.0672 19.5096 19.9556 19.6755 19.815 19.815C19.6756 19.9556 19.5097 20.0672 19.3269 20.1433C19.1441 20.2195 18.948 20.2587 18.75 20.2587C18.552 20.2587 18.3559 20.2195 18.1731 20.1433C17.9903 20.0672 17.8244 19.9556 17.685 19.815L15 17.115L12.315 19.815C12.1756 19.9556 12.0097 20.0672 11.8269 20.1433C11.6441 20.2195 11.448 20.2587 11.25 20.2587C11.052 20.2587 10.8559 20.2195 10.6731 20.1433C10.4903 20.0672 10.3244 19.9556 10.185 19.815C10.0444 19.6755 9.93282 19.5096 9.85667 19.3269C9.78051 19.1441 9.74131 18.948 9.74131 18.75C9.74131 18.552 9.78051 18.3559 9.85667 18.1731C9.93282 17.9903 10.0444 17.8244 10.185 17.685L12.885 15L10.185 12.315C9.90255 12.0325 9.74387 11.6494 9.74387 11.25C9.74387 10.8505 9.90255 10.4675 10.185 10.185C10.4675 9.90254 10.8506 9.74386 11.25 9.74386C11.6495 9.74386 12.0325 9.90254 12.315 10.185L15 12.885L17.685 10.185C17.9675 9.90254 18.3505 9.74386 18.75 9.74386C19.1495 9.74386 19.5325 9.90254 19.815 10.185C20.0975 10.4675 20.2561 10.8505 20.2561 11.25C20.2561 11.6494 20.0975 12.0325 19.815 12.315L17.115 15L19.815 17.685Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                  ) : (
                    <>
                      <div
                        onClick={() => setLanguageDialogOpen(true)}
                        className={`cursor-pointer w-[30%] relative flex gap-3 border-2 rounded justify-center items-center ${
                          fileUploaded
                            ? "bg-white"
                            : "bg-[#FFC9C9]  border-red-700 border-md"
                        } text-[#018081]`}
                      >
                        {!fileUploaded && (
                          <div className="absolute -inset-y-7 text-[#FFC9C9]">
                            Upload Your File First
                          </div>
                        )}
                        <svg
                          //   className="color-[#018081]"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 12 12"
                          //   stroke="#018081"
                        >
                          <path
                            d="M4.026 3.42386L5.4 2.04352V7.79895C5.4 7.95812 5.46321 8.11077 5.57574 8.22332C5.68826 8.33587 5.84087 8.3991 6 8.3991C6.15913 8.3991 6.31174 8.33587 6.42426 8.22332C6.53679 8.11077 6.6 7.95812 6.6 7.79895V2.04352L7.974 3.42386C8.02978 3.48011 8.09614 3.52476 8.16925 3.55523C8.24237 3.5857 8.32079 3.60139 8.4 3.60139C8.47921 3.60139 8.55763 3.5857 8.63075 3.55523C8.70386 3.52476 8.77022 3.48011 8.826 3.42386C8.88224 3.36807 8.92687 3.30169 8.95734 3.22856C8.9878 3.15543 9.00348 3.07698 9.00348 2.99776C9.00348 2.91853 8.9878 2.84009 8.95734 2.76695C8.92687 2.69382 8.88224 2.62744 8.826 2.57165L6.426 0.171051C6.36894 0.116413 6.30165 0.0735831 6.228 0.0450193C6.08192 -0.0150064 5.91808 -0.0150064 5.772 0.0450193C5.69835 0.0735831 5.63106 0.116413 5.574 0.171051L3.174 2.57165C3.11806 2.62761 3.07368 2.69404 3.0434 2.76715C3.01313 2.84026 2.99755 2.91862 2.99755 2.99776C2.99755 3.07689 3.01313 3.15525 3.0434 3.22836C3.07368 3.30147 3.11806 3.3679 3.174 3.42386C3.22994 3.47982 3.29636 3.52421 3.36945 3.55449C3.44254 3.58477 3.52088 3.60036 3.6 3.60036C3.67912 3.60036 3.75746 3.58477 3.83055 3.55449C3.90364 3.52421 3.97006 3.47982 4.026 3.42386ZM11.4 5.9985C11.2409 5.9985 11.0883 6.06173 10.9757 6.17428C10.8632 6.28683 10.8 6.43948 10.8 6.59865V10.1996C10.8 10.3587 10.7368 10.5114 10.6243 10.6239C10.5117 10.7365 10.3591 10.7997 10.2 10.7997H1.8C1.64087 10.7997 1.48826 10.7365 1.37574 10.6239C1.26321 10.5114 1.2 10.3587 1.2 10.1996V6.59865C1.2 6.43948 1.13679 6.28683 1.02426 6.17428C0.911742 6.06173 0.75913 5.9985 0.6 5.9985C0.44087 5.9985 0.288258 6.06173 0.175736 6.17428C0.0632141 6.28683 0 6.43948 0 6.59865V10.1996C0 10.6771 0.189642 11.135 0.527208 11.4727C0.864773 11.8103 1.32261 12 1.8 12H10.2C10.6774 12 11.1352 11.8103 11.4728 11.4727C11.8104 11.135 12 10.6771 12 10.1996V6.59865C12 6.43948 11.9368 6.28683 11.8243 6.17428C11.7117 6.06173 11.5591 5.9985 11.4 5.9985Z"
                            fill="#018081"
                          />
                        </svg>
                        <p>Add Your File</p>
                      </div>
                      <Dialog
                        open={languageDialogOpen}
                        onClose={handleCancelLanguageSelection}
                        PaperProps={{
                          style: {
                            background:
                              "linear-gradient(135deg, #004343, #00A9AB)",
                            color: "#fff",
                            borderRadius: "15px",
                            width: "30%",
                            border: "2px solid white",
                          },
                        }}
                      >
                        <DialogTitle>
                          <Typography
                            variant="h5"
                            style={{ fontWeight: "bold" }}
                          >
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
                                    checked={selectedLanguages.includes(
                                      language
                                    )}
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
                              cursor: "pointer",
                            }}
                          >
                            Confirm
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </>
                  )}
                  <TextField
                    className="rounded w-[70%]"
                    fullWidth
                    id="outlined-multiline-flexible"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "transparent", // Remove the border color
                        },
                        "&:hover fieldset": {
                          borderColor: "transparent", // Remove border on hover
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "black", // Remove border on focus
                        },
                      },
                      backgroundColor: "white",
                    }}
                    placeholder="Type prompt to generate a new document"
                    multiline
                    maxRows={4}
                    value={prompt}
                    onChange={onChange}
                  />
                  <button
                    disabled={prompt === "" || fileUploading}
                    onClick={handleSubmit}
                    className="bg-btn-gradient p-2 font-semibold px-4 rounded-md"
                  >
                    Send
                  </button>
                </div>
              )}
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptFile;
