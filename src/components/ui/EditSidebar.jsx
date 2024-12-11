import React, { useState, useCallback } from "react";
import { getAnswer } from "../../actions/UploadAction";
import { useDispatch, useSelector } from "react-redux";

import { setUploadDocText } from "../../features/DocumentSlice";
import { formatText } from "../../utils/utils";
import axios from "axios";
import { NODE_API_ENDPOINT } from "../../utils/utils";
import { breakout } from "../../actions/createDoc";
import { setBreakoutData } from "../../features/breakoutSlice";
import { TextField } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

// import CircularProgress from '@mui/joy/CircularProgress';

const EditSidebar = () => {
  const dispatch = useDispatch();
  const doc_id = useSelector((state) => state.document.docId);
  const currentUser = useSelector((state) => state.auth.user);

  const [promptQuery, setPromptQuery] = useState("");
  const [queryLoading, setQueryLoading] = useState(false);
  const [showQueryTextbox, setShowQueryTextbox] = useState(false);

  const [clauseQuery, setClauseQuery] = useState("");
  const [clauseLoading, setClauseLoading] = useState(false);
  const [showClauseTextbox, setShowClauseTextbox] = useState(false);

  const [toggleTextbox, setToggleTextbox] = useState(false);
  const [circularProgressLoading, setcircularProgressLoading] = useState(false);
  const [progressValue, setprogressValue] = useState(0);

  // const procedButtonStyle = {

  // }

  const onQueryChange = (e) => {
    setPromptQuery(e.target.value);
  };

  const onClauseChange = (e) => {
    setClauseQuery(e.target.value);
  };
  const simulateUpload = useCallback(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      setprogressValue(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setcircularProgressLoading(false);
        // setUploadStatus("complete");
        // dispatch(setFileBlob(true));
        // setUploadStatus("analyzing");
      }
    }, 500);
  });

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    setQueryLoading(true);
    try {
      setcircularProgressLoading(true);
      // const res= getAnswer(doc_id, promptQuery)
      axios
        .post(
          `${NODE_API_ENDPOINT}/ai-drafter/edit_document`,
          {
            doc_id: doc_id,
            edit_query: promptQuery,
          },
          {
            headers: {
              Authorization: `Bearer ${currentUser.jwt}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then(async (res) => {
          console.log(res);
          const doc = res.data.data.fetchedData.updated_document;
          console.log(JSON.stringify(doc));
          dispatch(setUploadDocText(JSON.stringify(doc)));
          setQueryLoading(false);
          setPromptQuery("");
          setShowQueryTextbox(false);

          const res2 = await breakout(doc_id, currentUser.jwt);
          console.log(res2.data);
          dispatch(setBreakoutData(res2.data));
          await axios.post(
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
        });
      // while(progressValue<100){

      //   setprogressValue(progressValue+1)
      // }
      simulateUpload();

      // console.log(res);
      // const doc = res.data.data.fetchedData.updated_document;
      // console.log(JSON.stringify(doc));
      // dispatch(setUploadDocText(JSON.stringify(doc)));
      // setQueryLoading(false);
      // setPromptQuery("");
      // setShowQueryTextbox(false);

      // const res2 = await breakout(doc_id);
      // console.log(res2.data);
      // dispatch(setBreakoutData(res2.data));
      // await axios.post(`${NODE_API_ENDPOINT}/ai-drafter/generate_db`, {
      //   doc_id: doc_id,
      // });
    } catch (error) {
      console.error("Error fetching answer:", error);
      setQueryLoading(false);
      setPromptQuery("");
      setShowQueryTextbox(false);
    }
  };

  const handleClauseSubmit = async (e) => {
    e.preventDefault();
    setClauseLoading(true);
    try {
      const res = await axios.post(
        `${NODE_API_ENDPOINT}/ai-drafter/api_add_clause`,
        {
          doc_id: doc_id,
          clause_query: clauseQuery,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.jwt}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res);
      const doc = res.data.data.fetchedData.updated_document;
      console.log(JSON.stringify(doc));
      dispatch(setUploadDocText(JSON.stringify(doc)));
      const res2 = await breakout(doc_id);
      console.log(res2.data);
      dispatch(setBreakoutData(res2.data));
      await axios.post(
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
    } catch (error) {
      console.error("Error fetching answer:", error);
    } finally {
      setClauseLoading(false);
      setClauseQuery("");
      setShowClauseTextbox(false);
    }
  };

  return (
    <main className="w-full font-sans flex flex-col justify-between rounded-md h-full">
      <div className="flex-1 h-full">
        {showQueryTextbox ? (
          <section className="flex flex-col gap-3 w-full h-full ">
            <h1 className="text-2xl m-0 text-[#00A9AB] font-semibold">Query</h1>
            <p className="flex-1 m-0 h-full overflow-auto bg-white text-black p-2 rounded-lg">
              {promptQuery}
            </p>
            <div className="flex w-full justify-evenly gap-3">
              {queryLoading ? (
                <button
                  className="w-full py-2  send-button border cursor-not-allowed  border-white rounded hover:bg-white hover:bg-opacity-25"
                  onClick={handleQuerySubmit}
                  disabled={queryLoading}
                >
                  Editing
                  <span className="pl-2">
                    <CircularProgress size={15} color="inherit" />
                  </span>
                </button>
              ) : (
                <button
                  className=" w-full py-2 border border-white rounded hover:bg-white hover:bg-opacity-25"
                  onClick={handleQuerySubmit}
                  disabled={queryLoading}
                >
                  Proceed
                  {/* {queryLoading ? "Loading..." : "Proceed"} */}
                  {/* Proceed */}
                  {/* {queryLoading ? (circularProgressLoading ? (
                  <div className=" send-button relative">
                  
                  </div>
                  ) :<CircularProgress />) : "Proceed"} */}
                </button>
              )}
              <button
                className={`w-full py-2 border border-white rounded hover:bg-white hover:bg-opacity-25 ${
                  queryLoading ? "cursor-not-allowed" : ""
                } `}
                onClick={() => {
                  setPromptQuery("");
                  setShowQueryTextbox(false);
                }}
                disabled={queryLoading}
              >
                Re-Enter Query
              </button>
            </div>
          </section>
        ) : showClauseTextbox ? (
          <section className="flex flex-col gap-3 w-full h-[50vh] ">
            <h1 className="text-2xl m-0 text-[#00A9AB]">Clause</h1>
            <p className="flex-1 m-0 h-full overflow-auto">{clauseQuery}</p>
            <div className="flex gap-3">
              <button
                className="px-5 py-1 border border-white rounded"
                onClick={handleClauseSubmit}
              >
                {/* Proceed */}
                {clauseLoading ? "Loading..." : "Proceed"}
              </button>
              <button
                className="px-5 py-1 border border-white rounded"
                onClick={() => {
                  setClauseQuery("");
                  setShowClauseTextbox(false);
                }}
              >
                Re-Enter Clause
              </button>
            </div>
          </section>
        ) : (
          <section className="flex flex-col h-full items-center justify-center text-center space-y-10 overflow-y-auto">
            <h4 className="font-bold text-white text-3xl">
              Want to Edit
              <br /> Generated Document?
            </h4>
            <p>
              Ask the AI to change a part of the document. Provide proper
              details to get better results.
            </p>
          </section>
        )}
      </div>
      {!showQueryTextbox ? (
        <div className="flex flex-col gap-3">
          {!toggleTextbox ? (
            <div
              style={{}}
              // onSubmit={handleQuerySubmit}
              className="w-full space-x-3 flex gap-2 justify-center items-center"
            >
              {/* <input
              className="bg-white text-neutral-700 text-base font-semibold w-full rounded-md p-2"
              type="text"
              placeholder="Enter your query"
              onChange={onQueryChange}
              readOnly={queryLoading}
              value={promptQuery}
              required
            /> */}
              <TextField
                fullWidth
                className="rounded"
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
                      borderColor: "black",
                      // Remove border on focus
                    },
                  },
                  backgroundColor: "white",
                  // Thumb and track color for Firefo
                }}
                // label="Multiline Placeholder"
                placeholder="Enter your Query"
                multiline
                maxRows={4}
                readOnly={queryLoading}
                value={promptQuery}
                onChange={onQueryChange}
              />
              <button
                disabled={promptQuery === ""}
                onClick={() => {
                  setClauseQuery("");
                  setShowClauseTextbox(false);
                  setShowQueryTextbox(true);
                }}
                // type="submit"
                className={`bg-teal-700 ${
                  queryLoading ? "opacity-75 pointer-events-none" : ""
                } p-2 font-semibold px-4 rounded-md`}
              >
                {/* {queryLoading ? "Loading..." : "Send"} */}
                Send
              </button>
            </div>
          ) : (
            <div
              onSubmit={handleClauseSubmit}
              className="w-full space-x-3 flex flex-row justify-center items-center"
            >
              <input
                className="bg-white text-neutral-700 text-base font-semibold w-full rounded-md p-2"
                type="text"
                placeholder="Enter your clause"
                onChange={onClauseChange}
                readOnly={clauseLoading}
                value={clauseQuery}
                required
              />
              <button
                // type="submit"
                onClick={() => {
                  setPromptQuery("");
                  setShowQueryTextbox(false);
                  setShowClauseTextbox(true);
                }}
                className={`bg-teal-700 ${
                  clauseLoading ? "opacity-75 pointer-events-none" : ""
                } p-2 font-semibold px-4 rounded-md`}
              >
                {/* {clauseLoading ? "Loading..." : "Send"} */}
                Send
              </button>
            </div>
          )}

          {/* <button
          className="w-full p-2 rounded-md bg-[#00A9AB]"
          onClick={() => {
            setToggleTextbox(!toggleTextbox);
            setPromptQuery("");
            setShowQueryTextbox(false);
            setClauseQuery("");
            setShowClauseTextbox(false);
          }}
        >
          {!toggleTextbox ? "Add Clause" : "Add Query"}
        </button> */}
        </div>
      ) : (
        <div></div>
      )}
    </main>
  );
};

export default EditSidebar;
