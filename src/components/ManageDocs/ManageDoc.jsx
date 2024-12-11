import React, { useCallback, useEffect, useState } from "react";
import HomeNav from "../Navbar/HomeNav";
import Footer from "../ui/Footer";
import folderIcon from "../../assets/icons/folder.png";
import documentIcon from "../../assets/icons/Document.png";
import { CircularProgress, LinearProgress, Popover } from "@mui/material";
import { Close } from "@mui/icons-material";
import backIcon from "../../assets/icons/goBack.png";
import { useNavigate } from "react-router-dom";
import { NODE_API_ENDPOINT } from "../../utils/utils";
import toast from "react-hot-toast";
import axios from "axios";
import { setDocId, setUploadDocText } from "../../features/DocumentSlice";
import {
  setBreakoutData,
  setError,
  setLoading,
} from "../../features/breakoutSlice";
import { useDispatch, useSelector } from "react-redux";
import { setFileBlob } from "../../features/authSlice";
import analyzingGif from "../../assets/icons/analyze.gif";
import docIcon from "../../assets/icons/docIcon.png";
import pdfIcon from "../../assets/icons/pdfIcon.png";
import aiIcon from "../../assets/icons/back.gif";

const ManageDoc = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const doc_id = useSelector((state) => state.document.docId);
  const currentUser = useSelector((state) => state.auth.user);

  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editNameDialog, setEditNameDialog] = useState(false);
  const [editName, setEditName] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [oldFileName, setOldFileName] = useState("");
  const [deleteFolderDialog, setDeleteFolderDialog] = useState(false);
  const [deleteFileName, setDeleteFileName] = useState("");
  const [allFiles, setAllFiles] = useState([]);
  const [searchableFiles, setSearchableFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadFileDialog, setUploadFileDialog] = useState(false);
  const [searchFile, setSearchFile] = useState("");

  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditName = (oldName) => {
    setAnchorEl(null);
    setEditNameDialog(true);
    setOldFileName(oldName);
  };

  const handleDeleteFolder = (filename) => {
    setAnchorEl(null);
    setDeleteFolderDialog(true);
    setDeleteFileName(filename);
  };

  useEffect(() => {
    getAllDocuments();
  }, []);

  const getAllDocuments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${NODE_API_ENDPOINT}/documentDrafter/listFiles`,
        {
          method: "GET",
          
            headers: {
              Authorization: `Bearer ${currentUser.jwt}`,
              "Content-Type": "application/json",
            },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const json = await response.json();
      console.log(json);
      // json.shift();
      setAllFiles(json);
      setSearchableFiles(json);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(true);
    }
  };

  const handleRenameFile = async () => {
    setEditLoading(true);
    const reqExtensionSplit = oldFileName.split(".");
    const reqExt = reqExtensionSplit[reqExtensionSplit.length - 1];
    try {
      const response = await fetch(
        `${NODE_API_ENDPOINT}/documentDrafter/renameFile`,
        {
          method: "POST",
          
            headers: {
              Authorization: `Bearer ${currentUser.jwt}`,
              "Content-Type": "application/json",
            },
          body: JSON.stringify({
            oldFilename: oldFileName,
            newFilename: `${editName}.${reqExt}`,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to Rename");
      }

      const json = await response.json();
      console.log(json);
      setEditNameDialog(false);
      setEditName("");
      setOldFileName("");
      setEditLoading(false);
      getAllDocuments();
      toast.success("File renamed successfully!");
    } catch (e) {
      console.log(e);
      setEditLoading(false);
    }
  };

  const handleDeleteFile = async () => {
    setEditLoading(true);
    try {
      const response = await fetch(
        `${NODE_API_ENDPOINT}/documentDrafter/deleteFile/${deleteFileName}`,
        {
          method: "DELETE",
          
            headers: {
              Authorization: `Bearer ${currentUser.jwt}`,
              "Content-Type": "application/json",
            },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete");
      }

      const json = await response.json();
      console.log(json);
      setDeleteFolderDialog(false);
      setDeleteFileName("");
      setEditLoading(false);
      getAllDocuments();
      toast.success("File deleted successfully!");
    } catch (e) {
      console.log(e);
      setEditLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    var file = event.target.files[0];

    setEditLoading(true);
    try {
      const formData = new FormData();
      console.log("hi");
      console.log(file);
      formData.append("file", file);

      // const res = await axios.post(
      //   `${NODE_API_ENDPOINT}/ai-drafter/upload_document`,
      //   formData
      // );
      const response = await fetch(
        `${NODE_API_ENDPOINT}/documentDrafter/uploadFile`,
        {
          method: "POST",
          body: formData,
          
            headers: {
              Authorization: `Bearer ${currentUser.jwt}`,
              "Content-Type": "application/json",
            }
          // headers: formData.getHeaders()
        }
      );
      if (!response.ok) {
        throw new Error("Failed to Rename");
      }

      const json = await response.json();
      console.log(json);
      toast.success(json.message);
      setEditLoading(false);
      setUploadFileDialog(false);
      getAllDocuments();
    } catch (error) {
      console.error("Upload failed", error);
      setEditLoading(false);
      setUploadFileDialog(false);
    }
  };

  const handleSearch = (e) => {
    setSearchFile(e.target.value);
  };

  useEffect(() => {
    if (searchFile === "") {
      setSearchableFiles(allFiles);
    } else {
      const fileFound = allFiles.filter((x) => {
        const namePart = x.name.split("/")[1];
        return (
          namePart && namePart.toLowerCase().includes(searchFile.toLowerCase())
        );
      });
      setSearchableFiles(fileFound);
    }
  }, [searchFile]);

  const handleUploadToDrafter = async (fileName) => {
    setShowUploadDialog(true);
    setUploadStatus("uploading");
    try {
      const response = await fetch(
        `${NODE_API_ENDPOINT}/documentDrafter/downloadFile/${fileName}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to download");
      }
      const blob = await response.blob();

      const formData = new FormData();

      const docRes = await axios.get(
        `${NODE_API_ENDPOINT}/ai-drafter/create_document`,  {
          headers: {
            Authorization: `Bearer ${currentUser.jwt}`,
            "Content-Type": "application/json",
          },}
      );
      const doc_id = docRes.data.data.fetchedData.doc_id;

      const renamedFile = new File([blob], doc_id + ".docx", {
        type: blob.type,
      });
      // formData.append("file", blob, fileName);
      formData.append("file", renamedFile);
      formData.append("doc_id", doc_id);

      const res = await axios.post(
        `${NODE_API_ENDPOINT}/ai-drafter/upload_document`,
        formData,  {
          headers: {
            Authorization: `Bearer ${currentUser.jwt}`,
            "Content-Type": "application/json",
          },}
      );
      const data = res.data.data.fetchedData;
      dispatch(setDocId(data.doc_id));
      dispatch(setUploadDocText(data.document));
      simulateUpload();
    } catch (e) {
      console.log(e);
      // setEditLoading(false);
    }
  };

  const breakout = useCallback(async () => {
    dispatch(setLoading(true));

    try {
      const res = await axios.post(`${NODE_API_ENDPOINT}/ai-drafter/breakout`, {
        doc_id: doc_id,
      },   {
        headers: {
          Authorization: `Bearer ${currentUser.jwt}`,
          "Content-Type": "application/json",
        },});
      await axios.post(`${NODE_API_ENDPOINT}/ai-drafter/generate_db`, {
        doc_id: doc_id,
      },   {
        headers: {
          Authorization: `Bearer ${currentUser.jwt}`,
          "Content-Type": "application/json",
        },});
      dispatch(setBreakoutData(res.data));
      dispatch(setUploadDocText(res.data.data.fetchedData.document));
      setUploadStatus("");
      setShowUploadDialog(false);
      navigate("/DocPreview");
    } catch (error) {
      console.error("Breakout failed", error);
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
      // breakoutCalledRef.current = false
    }
  }, [doc_id, dispatch]);

  useEffect(() => {
    if (uploadStatus === "analyzing" && doc_id) {
      breakout();
    }
  }, [uploadStatus, doc_id, breakout]);

  const simulateUpload = useCallback(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setUploadStatus("complete");
        dispatch(setFileBlob(true));
        setUploadStatus("analyzing");
      }
    }, 500);
  }, [dispatch]);

  return (
    <div className="justify-center items-center w-full h-screen p-2 relative">
      <div
        className="w-full absolute p-3 rounded-lg top-0 left-0 h-screen -z-10"
        style={{
          background: `radial-gradient(circle at 50% 0%, #018585, transparent 45%)`,
        }}
      >
        <img className="w-full h-full opacity-50" src={aiIcon} />
      </div>
      <div className="bg-black bg-opacity-20 h-full flex flex-col rounded p-4 z-20">
        <HomeNav className="w-full" />
        <div className="flex-1 flex flex-col bg-black bg-opacity-20 h-[80%] rounded-lg mt-2 p-2 ">
          <div className="flex justify-end items-center gap-3">
            <input
              className="py-2 px-5 text-xs rounded-full border-2 border-[#00A9AB] text-black"
              placeholder="Search for a File"
              value={searchFile}
              onChange={handleSearch}
            />
            <button
              onClick={setUploadFileDialog}
              className="py-1 px-4 bg-[#00A9AB] rounded"
            >
              + Add New
            </button>
          </div>
          {isLoading ? (
            <div className="flex-1 h-[88%] flex justify-center items-center">
              <CircularProgress size={100} color="inherit" />
            </div>
          ) : (
            <div className="pt-2 flex-1 overflow-auto scrollbar-hide h-[88%] flex flex-wrap gap-4">
              {searchableFiles.length > 0 ? (
                <>
                  {searchableFiles.map((x, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center gap-2 relative w-[145px]"
                    >
                      <img
                        onClick={(e) => {
                          setOpenDialog(true);
                          setAnchorEl(e.currentTarget);
                          setSelectedFile(x);
                        }}
                        className="w-12 h-14 cursor-pointer"
                        src={
                          x.name.split("/")[1].split(".")[1].toLowerCase() ===
                          "pdf"
                            ? pdfIcon
                            : docIcon
                        }
                      />
                      {openDialog && anchorEl && selectedFile === x && (
                        <Popover
                          id={id}
                          open={open}
                          anchorEl={anchorEl}
                          onClose={handleClose}
                          anchorOrigin={{
                            vertical: "center",
                            horizontal: "center",
                          }}
                        >
                          <div className="flex flex-col bg-gray-400 p-3 text-white gap-1">
                            <p
                              onClick={() => {
                                handleUploadToDrafter(x.name.split("/")[1]);
                                setAnchorEl(null);
                              }}
                              className="border-b border-white py-1 cursor-pointer"
                            >
                              Upload To Drafter
                            </p>
                            <p
                              onClick={() =>
                                handleEditName(x.name.split("/")[1])
                              }
                              className="border-b border-white py-1 cursor-pointer"
                            >
                              Edit Filename
                            </p>
                            <p
                              onClick={() =>
                                handleDeleteFolder(x.name.split("/")[1])
                              }
                              className="cursor-pointer"
                            >
                              Delete File
                            </p>
                          </div>
                        </Popover>
                      )}
                      <p className="text-center text-sm">
                        {x.name.split("/")[1]}
                      </p>
                    </div>
                  ))}
                </>
              ) : (
                <div className="w-full flex flex-col items-center justify-center gap-2">
                  <img className="w-24 h-28" src={documentIcon} />
                  <p>No File Found </p>
                </div>
              )}
            </div>
          )}
          <div className="flex justify-end">
            <div
              onClick={() => {
                navigate(-1);
              }}
              className="flex justify-end gap-2"
            >
              <img className="w-7 h-7" src={backIcon} />
              <button className="text-lg">Go Back</button>
            </div>
          </div>
        </div>
        <Footer className="w-full" />
      </div>
      {editNameDialog && (
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            left: "0",
            right: "0",
            top: "0",
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            // backdropFilter: "blur(3px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "20",
          }}
        >
          <div
            className=" w-2/6 rounded-xl px-3 py-5 flex flex-col gap-3 justify-center"
            style={{ background: "linear-gradient(90deg,#018081,#D2D2D2)" }}
          >
            <div className="flex justify-between items-center border-b border-white pb-2">
              <p className="text-white text-xl font-semibold">Rename File ?</p>
              <Close
                onClick={() => {
                  setEditNameDialog(false);
                  setEditName("");
                  setOldFileName("");
                }}
                sx={{ color: "#004343", cursor: "pointer" }}
              />
            </div>
            <input
              className="w-full rounded py-2 px-1 text-xs text-black"
              placeholder="Enter New File Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <div className="flex justify-end">
              {editLoading ? (
                <button className="bg-[#004343] py-1 px-5 rounded">
                  <CircularProgress size={12} color="inherit" />
                </button>
              ) : (
                <button
                  onClick={handleRenameFile}
                  className="bg-[#004343] py-1 px-5 rounded"
                >
                  Change
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {deleteFolderDialog && (
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            left: "0",
            right: "0",
            top: "0",
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            // backdropFilter: "blur(3px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "20",
          }}
        >
          <div
            className=" w-2/6 rounded-xl p-5 flex flex-col gap-3 justify-center"
            style={{ background: "linear-gradient(90deg,#018081,#D2D2D2)" }}
          >
            <div className="flex justify-center items-center border-b border-white pb-3">
              <p className="text-[#004343] text-xl font-bold">Delete File ?</p>
            </div>
            <div className="flex flex-col gap-10">
              <div className="flex justify-center">
                <p className="text-black">
                  File once deleted can't be reverted back
                </p>
              </div>
              <div className="flex justify-center gap-5">
                <button
                  onClick={() => {
                    setDeleteFolderDialog(false);
                    setDeleteFileName("");
                  }}
                  className="border-2 border-white py-1 px-5 rounded text-white font-semibold"
                >
                  Cancel
                </button>
                {editLoading ? (
                  <button className="bg-[#00A9AB] py-1 px-5 rounded text-[#004343] font-semibold">
                    <CircularProgress size={12} color="inherit" />
                  </button>
                ) : (
                  <button
                    onClick={handleDeleteFile}
                    className="bg-[#00A9AB] py-1 px-5 rounded text-white font-semibold"
                  >
                    Confirm
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {uploadFileDialog && (
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            left: "0",
            right: "0",
            top: "0",
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            // backdropFilter: "blur(3px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "20",
          }}
        >
          <div
            className=" w-2/6 rounded-xl p-5 flex flex-col gap-3 justify-center"
            style={{ background: "linear-gradient(90deg,#018081,#D2D2D2)" }}
          >
            <div className="flex justify-between items-center border-b border-white pb-3">
              <p className="text-[#004343] text-xl font-bold">
                Upload a New file
              </p>
              <Close
                onClick={() => setUploadFileDialog(false)}
                sx={{ color: "#004343", cursor: "pointer" }}
              />
            </div>
            <div className="flex justify-center py-3">
              {editLoading ? (
                <div className="flex items-center gap-2">
                  <CircularProgress size={20} />
                  <p className="text-sm text-[#004343]">Uploading...</p>
                </div>
              ) : (
                <input
                  type="file"
                  accept=".pdf, .doc, .docx"
                  onChange={handleFileUpload}
                  className="text-[#004343] text-sm border-4 border-white cursor-pointer"
                />
              )}
            </div>
          </div>
        </div>
      )}
      {showUploadDialog ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            left: "0",
            right: "0",
            top: "0",
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            // backdropFilter: "blur(3px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "20",
          }}
        >
          <div className="bg-[#D2D2D2] h-fit flex flex-col w-2/5 rounded justify-center items-center space-y-4 p-3">
            {uploadStatus === "uploading" && (
              <div className="flex flex-col w-full space-y-5 pb-7 ">
                <p className="text-2xl font-semibold text-teal-600 text-center">
                  Uploading... {uploadProgress}%
                </p>

                <LinearProgress
                  variant="determinate"
                  value={uploadProgress}
                  sx={{ height: "4px", width: "90%", padding: "5px" }}
                />
              </div>
            )}

            {uploadStatus === "complete" && (
              <p className="text-2xl font-semibold text-teal-600 text-center">
                Upload Complete
              </p>
            )}

            {uploadStatus === "analyzing" && (
              <div className="flex flex-col items-center">
                <img src={analyzingGif} alt="Analyzing" className="w-80 h-80" />
                <p className="text-2xl font-semibold text-teal-600 text-center">
                  Analyzing Documents
                </p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ManageDoc;
