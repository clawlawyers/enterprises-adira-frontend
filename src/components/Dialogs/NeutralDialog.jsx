import axios from "axios";
import React, { useEffect, useState } from "react";
import { NODE_API_ENDPOINT, trimQuotes } from "../../utils/utils";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Markdown from "react-markdown";
import loaderGif from "../../assets/icons/2.gif";
import { sync, motion } from "framer-motion";
// import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import { setBreakoutData } from "../../features/breakoutSlice";
import { setUploadDocText } from "../../features/DocumentSlice";
import { CircularProgress } from "@mui/material";
import toast from "react-hot-toast";

const NeutralDialog = () => {
  let navigate = useNavigate();
  let location = useLocation();
  const dispatch = useDispatch();
  let { id: paramsId } = useParams();
  const doc_id = useSelector((state) => state.document.docId);
  const breakoutData = useSelector((state) => state.breakout.breakoutData);
  const currentUser = useSelector((state) => state.auth.user);
  const headpoints = breakoutData.data.fetchedData.headpoints;
  const details = breakoutData.data.fetchedData.details;

  const [isLoading, setisLoading] = useState(false);
  const [rephraseLoading, setRephraseLoading] = useState(false);
  const [data, setData] = useState("");
  const [selectedHeadpoint, setSlectedHeadpont] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState("");

  // const { vertical, horizontal, open } = state;
  const index = parseInt(location.pathname.slice(-1));
  useEffect(() => {
    if (paramsId >= 0 && paramsId < headpoints.length) {
      fetchData(headpoints[paramsId]);
      setSlectedHeadpont(headpoints[paramsId]);
    }
  }, [paramsId, headpoints]);

  useEffect(() => {
    if (paramsId >= 0 && paramsId < details.length) {
      setSelectedDetails(details[paramsId]);
    }
  }, [paramsId, details]);

  // const handleClose = (event, reason) => {
  //   if (reason === "clickaway") {
  //     return;
  //   }

  //   setOpen(false);
  // };

  const fetchData = async (headpoint) => {
    setisLoading(true);
    const res = await axios.post(`${NODE_API_ENDPOINT}/ai-drafter/neutralize`, {
      doc_id,
      headpoint_to_find: headpoint,
    },   {
      headers: {
        Authorization: `Bearer ${currentUser.jwt}`,
        "Content-Type": "application/json",
      },});
    const temp = res.data.data.fetchedData.steps_to_make_neutral;
    setData(temp);
    setisLoading(false);
  };
  const handleRepharse = async () => {
    setRephraseLoading(true);
    try {
      var config = {
        method: "post",
        url: `${NODE_API_ENDPOINT}/ai-drafter/api/get_modified_doc`,
        data: {
          doc_id: doc_id,
        },
        headers: {
          Authorization: `Bearer ${currentUser.jwt}`,
          "Content-Type": "application/json",
        },
      };
      const res = await axios.request(config);
      dispatch(setBreakoutData(res.data));
      dispatch(setUploadDocText(res.data.data.fetchedData.updated_document));
      // setOpen(true);
      // console.log(res);
      setRephraseLoading(false);
      toast.success("Your document has been updated!");
    } catch (e) {
      setRephraseLoading(false);
    }
  };
  return (
    <>
      <div className="h-full flex flex-col  font-sans gap-4 p-4 text-white">
        <div className="h-[25vh] bg-popup-gradient p-4 text-[1rem] font-bold  rounded-[0.625rem] border-2 border-white flex flex-col gap-2">
          <p className="text-lg">
            <Markdown>{selectedHeadpoint}</Markdown>
          </p>
          <hr />
          <p className="flex-1 h-full overflow-auto scrollbar-hide text-xs font-normal">
            <Markdown>
              {selectedDetails
                .replaceAll(/\u20b9/g, "₹")
                .replaceAll(/\\u20b9/g, "₹")
                .replaceAll(/\\n/g, "\n\n")
                .replaceAll(/\\t/g, "\t")
                .replaceAll(/\\"/g, '"')
                .replaceAll(/1\n"/g, "\n")}
            </Markdown>
          </p>
        </div>
        <div className="flex flex-row gap-3  text-xs text-nowrap ">
          <button
            className="rounded border-[1px] w-fit p-2 hover:bg-hover-gradient hover:text-black hover:border-0 py-1"
            onClick={() => navigate(`/Snippets/Summary/${paramsId}`)} // Use navigate instead of <a>
          >
            Summary
          </button>
          <button
            className="rounded border-[1px] w-fit p-2 hover:bg-hover-gradient hover:text-black hover:border-0 py-1"
            onClick={() => navigate(`/Snippets/Favour/${paramsId}`)} // Use navigate instead of <a>
          >
            In whose favour
          </button>
          <button
            className="rounded border-[1px] w-fit p-2 hover:bg-hover-gradient hover:text-black hover:border-0 py-1 bg-customBlue"
            onClick={() => navigate(`/Snippets/Neutral/${paramsId}`)} // Use navigate instead of <a>
          >
            How to make Neutral
          </button>
          <button
            className="rounded border-[1px] w-fit p-2 hover:bg-hover-gradient hover:text-black hover:border-0 py-1"
            onClick={() => navigate(`/Snippets/Direction/${paramsId}`)} // Use navigate instead of <a>
          >
            Bend in Opp. Direction
          </button>
        </div>
        <div className="flex-1 h-full overflow-auto scrollbar-hide">
          {!isLoading ? (
            <div className="flex text-sm flex-col gap-2 text-justify font-sans text-white  ">
              <Markdown>
                {trimQuotes(
                  data
                    .replaceAll(/\u20b9/g, "₹")
                    .replaceAll(/\\u20b9/g, "₹")
                    .replaceAll(/\\n/g, "\n\n")
                    .replaceAll(/\\t/g, "\t")
                    .replaceAll(/\\"/g, '"')
                    .replaceAll(/1\n"/g, "\n")
                )}
              </Markdown>
            </div>
          ) : (
            <div className="flex overflow-y-auto scrollbar-hide justify-center items-center flex-col gap-2 text-justify font-sans text-white m-5 ">
              <img
                className="flex flex-row justify-center items-center w-40 h-40"
                src={loaderGif}
                alt="Loading..."
              />
            </div>
          )}
        </div>
        <div className="flex flex-row  w-full justify-end items-center px-5 font-semibold space-x-5">
          {rephraseLoading ? (
            <motion.div className="flex gap-2 items-center bg-card-gradient p-2 border border-white rounded-md">
              <CircularProgress size={10} color="inherit" />
              <p>Rephrasing...</p>
            </motion.div>
          ) : (
            <motion.button
              whileTap={{ scale: "0.95" }}
              onClick={handleRepharse}
              className="bg-card-gradient p-2 border border-white rounded-md"
            >
              Rephrase
            </motion.button>
          )}
        </div>
      </div>
      {/* <div className="w-10 h-10"> */}
      {/* <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        message="YOUR DOCUMENT HAS BEEN UPADTED"
      ></Snackbar> */}
      {/* </div> */}
    </>
  );
};

export default NeutralDialog;
