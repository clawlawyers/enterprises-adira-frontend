import { useState, useRef, useEffect, useCallback } from "react";
import { Avatar, LinearProgress, Box, Typography } from "@mui/material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Checkbox,
  Button,
  FormControlLabel,
} from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import GoogleDriveImage from "../../assets/icons/Google_Drive_logo 1.svg";
import FolderImage from "../../assets/icons/dropbox.svg";
import DropBox from "../../assets/icons/—Pngtree—dropbox icon_3584851 1.svg";
import analyzingGif from "../../assets/icons/analyze.gif";
import { useNavigate } from "react-router-dom";
import UserModal from "../Modals/UserModal";
import ResponseDialog from "../Dialogs/EditableDialog";
import { useDispatch, useSelector } from "react-redux";
import { setFileBlob } from "../../features/authSlice";
import {
  setDocId,
  setUploadDocText,
  setIsGenerateDocCalledTrue,
} from "../../features/DocumentSlice";
import axios from "axios";
import {
  setBreakoutData,
  setLoading,
  setError,
} from "../../features/breakoutSlice";

import DocEdit from "../../DocEdit/DocEdit";
import toast from "react-hot-toast";
import { NODE_API_ENDPOINT } from "../../utils/utils";
import TipsComponent from "../TipsComponent/TipsComponent";

const UploadDialog = () => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(""); // "uploading", "complete", "analyzing"
  const [responseText, setResponseText] = useState(""); // State for response text
  const [openResponseDialog, setOpenResponseDialog] = useState(false); // State for dialog visibility
  const [languageDialogOpen, setLanguageDialogOpen] = useState(false); // State for language dialog
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { fileBlob } = useSelector((state) => state.auth);
  const doc_id = useSelector((state) => state.document.docId);
  const breakoutData = useSelector((state) => state.breakout.breakoutData);
  const currentUser = useSelector((state) => state.auth.user);
  // console.log(currentUser);
  const breakoutCalledRef = useRef(false); // Use ref to avoid re-render on change

  const languages = ["English", "Hindi", "Telugu", "Tamil", "Kannada"];

  const handleLanguageChange = (event) => {
    const { value, checked } = event.target;
    setSelectedLanguages((prev) =>
      checked ? [...prev, value] : prev.filter((lang) => lang !== value)
    );
  };
  // console.log(selectedLanguages);

  const handleCancelLanguageSelection = () => {
    setLanguageDialogOpen(false);
    setSelectedLanguages([]);
  };

  const handleLanguageConfirm = () => {
    setLanguageDialogOpen(false);
    handleComputerUpload();
    // Proceed with file selection
    // if (fileInputRef.current) {
    //   fileInputRef.current.click();
    // }
  };

  const convertArrayToString = (arr) => {
    return arr.map((lang) => lang.toLowerCase()).join(", ");
  };

  // Memoize breakout function to avoid unnecessary re-creation
  const breakout = useCallback(async () => {
    if (breakoutCalledRef.current) return;
    breakoutCalledRef.current = true;

    dispatch(setLoading(true));

    try {
      const res = await axios.post(
        `${NODE_API_ENDPOINT}/ai-drafter/breakout`,
        {
          doc_id: doc_id,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.jwt}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res.data);
      axios.post(
        `${NODE_API_ENDPOINT}/ai-drafter/generate_db`,
        {
          doc_id: doc_id,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.jwt}`,
            "Content-Type": "application/json",
          },
        }
      );
      // dispatch(setGreenHeading([]));
      dispatch(setBreakoutData(res.data));
      console.log(res.data);
      dispatch(setUploadDocText(res.data.data.fetchedData.document));
      setUploadStatus(""); // Stop the analyzing GIF after response
      setFile(null);
      // setOpenResponseDialog(true); // Open the response dialog
      navigate("/DocPreview");
    } catch (error) {
      console.error("Breakout failed", error);
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
      breakoutCalledRef.current = false; // Reset the flag if needed
    }
  }, [doc_id, dispatch]);

  useEffect(() => {
    if (uploadStatus === "analyzing" && doc_id) {
      breakout();
    }
  }, [uploadStatus, doc_id, breakout]);

  const handleDropboxUpload = useCallback(() => {
    console.log("Upload from Dropbox clicked");
  }, []);

  console.log(selectedLanguages);

  const handleFileChange = useCallback(
    async (event) => {
      console.log(selectedLanguages);

      var file = event.target.files[0];
      if (file) {
        setFile(file);
        setUploadStatus("uploading");

        try {
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
          console.log(doc_id);
          console.log("hi");

          // dispatch(setDocId(doc_id));
          // file.originalname = doc_id + ".docx";
          // file.name = doc_id + ".docx";
          console.log(file);
          const renamedFile = new File([file], doc_id + ".docx", {
            type: file.type,
          });
          formData.append("file", renamedFile);

          console.log(selectedLanguages);
          const language = convertArrayToString(selectedLanguages);

          formData.append("doc_id", doc_id);
          formData.append("language", language);
          const res = await axios.post(
            `${NODE_API_ENDPOINT}/ai-drafter/upload_document`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${currentUser.jwt}`,
              },
            }
          );
          const data = res.data.data.fetchedData;
          console.log(data);
          dispatch(setDocId(data.doc_id));
          dispatch(setUploadDocText(data.document));
          // dispatch(setIsGenerateDocCalledTrue())
          setResponseText(data.document);
          simulateUpload();
        } catch (error) {
          console.error("Upload failed", error);
          toast.error("An error occured");
          navigate("/");
        }
      }
    },
    [selectedLanguages, dispatch]
  );

  const handleGoogleDriveUpload = useCallback(() => {
    console.log("Upload from Google Drive clicked");
  }, []);

  const handleComputerUpload = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const simulateUpload = useCallback(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setUploadStatus("complete");
        dispatch(setFileBlob(true));
        // navigate("/DocPreview");
        setUploadStatus("analyzing");
      }
    }, 500);
  }, [dispatch]);

  const handleSaveResponse = useCallback(
    async (text) => {
      // Handle the save action, e.g., save to backend or local storage
      console.log("Saved response text:", text);
      dispatch(setUploadDocText(text));
    },
    [dispatch]
  );
  const handleCancel = () => {
    setFile(null);
    setUploadProgress(0);
    setUploadStatus("");
    dispatch(setFileBlob(false));
    navigate("/");
  };
  const handlleuplaodfromcomputerlanguage = () => {
    setLanguageDialogOpen(true);
    console.log("adsd");
  };

  const uploadOptions = [
    {
      src: "https://res.cloudinary.com/dyuov6i8c/image/upload/v1732988219/Assets/wwzeqnqjmppxkkyprjo3.png",
      alt: "Google Drive",
      text: "Upload from Drive",
      hasText: true,
      textClass: "text-neutral-800 text-center font-semibold mt-4",
      onClick: handleGoogleDriveUpload,
    },
    {
      src: "https://res.cloudinary.com/dyuov6i8c/image/upload/v1732988219/Assets/yiqy6jm522y4logozt01.png",
      alt: "Upload from Computer",
      text: "Upload from Computer",
      textClass: "text-neutral-800 text-center font-semibold mt-5",
      hasText: true,
      // containerClass: "-mt-5",
      // onClick: handleComputerUpload,
      onClick: handlleuplaodfromcomputerlanguage,
    },
    {
      src: "https://res.cloudinary.com/dyuov6i8c/image/upload/v1732988219/Assets/plagq9li7rcrocmv3fol.png",
      alt: "Dropbox",
      text: "Upload from DropBox",
      textClass: "text-neutral-800 text-center font-semibold mt-1",
      // containerClass: "-mt-2",
      hasText: true,
      onClick: handleDropboxUpload,
    },
  ];

  return (
    <div className="bg-black bg-opacity-80 h-full p-4 rounded-md">
      {/* <div className="flex flex-row justify-end w-full"> */}
      {/* <UserModal /> */}
      {/* </div> */}

      <div className="flex flex-row justify-center w-full  items-center h-[80vh]">
        <div className="flex flex-col w-1/2 p-5 bg-upload-card rounded-md space-y-7 relative">
          <div>
            <div className="absolute right-5 w-full flex justify-end">
              {uploadStatus !== "analyzing" && (
                <HighlightOffIcon
                  onClick={handleCancel}
                  className="text-teal-700 text-2xl scale-150 cursor-pointer"
                />
              )}
            </div>

            <div className="flex justify-center pb-8">
              <p className="text-teal-700 font-bold text-2xl">
                {!file ? "Upload Your Document" : ""}
              </p>
            </div>
          </div>

          {file ? (
            <div className="flex flex-col w-full items-center">
              {uploadStatus === "uploading" && (
                <div className="flex flex-col items-center justify-center w-full space-y-5 ">
                  <p className="text-4xl font-semibold text-teal-600 text-center">
                    Uploading Document...
                  </p>
                  <div className="w-full flex gap-2 justify-center items-center">
                    <LinearProgress
                      variant="determinate"
                      value={uploadProgress}
                      sx={{
                        height: "10px",
                        width: "90%",
                        padding: "5px",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: "#0d9488", // Customize progress bar color here
                        },
                      }}
                    />
                    <span className="text-teal-600 font-semibold">
                      {uploadProgress}%
                    </span>
                  </div>
                  <div className="w-[30rem] h-16 text-teal-600 text-center">
                    <TipsComponent />
                  </div>
                </div>
              )}

              {uploadStatus === "complete" && (
                <p className="text-2xl font-semibold text-teal-600 text-center">
                  Upload Complete
                </p>
              )}

              {uploadStatus === "analyzing" && (
                <div className="flex flex-col items-center">
                  <p className="text-4xl font-semibold text-teal-600 text-center">
                    Analyzing Documents
                  </p>
                  <img
                    src={analyzingGif}
                    alt="Analyzing"
                    className="w-60 h-60"
                  />
                  <div className="w-[30rem] h-16 text-teal-600 text-center">
                    <TipsComponent />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-row justify-center items-start space-x-12 h-40">
              {uploadOptions.map((option, index) => (
                <div
                  key={index}
                  className={`flex flex-col justify-start items-center ${
                    option.containerClass || ""
                  }`}
                >
                  <img
                    className="hover:scale-110 duration-300 cursor-pointer"
                    src={option.src}
                    width="100"
                    alt={option.alt}
                    onClick={option.onClick}
                    height="100"
                  />
                  {option.hasText && (
                    <p className={option.textClass}>{option.text}</p>
                  )}
                  {option.alt === "Upload from Computer" && (
                    <input
                      type="file"
                      accept=".pdf, .doc, .docx, .txt"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      className="hidden"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
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
                  <Typography style={{ color: "#fff" }}>{language}</Typography>
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
  );
};

export default UploadDialog;
