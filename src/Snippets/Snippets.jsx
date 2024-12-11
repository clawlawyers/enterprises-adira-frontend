import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Route, Routes, Outlet, useNavigate } from "react-router-dom";
import NavbarRight from "../components/Navbar/NavbarRight";
import NavbarLeft from "../components/Navbar/NavbarLeft";
import TextBoxDialog from "../components/Dialogs/TextBoxDialog";
import SnippetDialog from "../components/Dialogs/SnippetDialog";
import SummaryDialog from "../components/Dialogs/SummaryDialog";
import NeutralDialog from "../components/Dialogs/NeutralDialog";
import FavourDialog from "../components/Dialogs/FavourDialog";
import DirectionDialog from "../components/Dialogs/DirectionDialog";
import QueryGIF from "../components/ui/QueryGIF";
import giff from "../assets/icons/2.gif";
import { NODE_API_ENDPOINT } from "../utils/utils";
import toast from "react-hot-toast";
import Dropdown from "./Dropdown";
import { ToastContainer } from "react-toastify";

const Snippets = () => {
  const queryBox = useRef();
  let navigate = useNavigate();
  const doc_id = useSelector((state) => state.document.docId);
  const [showGIF, setShowGif] = useState(false);
  const [query, setquery] = useState("");
  const [textBoxData, setTextBoxData] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const currentUser = useSelector((state) => state.auth.user);

  // useEffect(() => {
  //   var localnewData = JSON.parse(localStorage.getItem("newdata"));
  //   if (localnewData !== null) {
  //     setTextBoxData(localnewData);
  //   }
  // }, []);

  useEffect(() => {
    // Scroll to the bottom of the chat container when textBoxData changes
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = 0;
    }
  }, [textBoxData]);

  const handleSend = async (e) => {
    e.preventDefault();
    setLoading(true);

    let data = JSON.stringify({
      doc_id: doc_id,
      query: query,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${NODE_API_ENDPOINT}/ai-drafter/ask_question`,

      headers: {
        Authorization: `Bearer ${currentUser.jwt}`,
        "Content-Type": "application/json",
      },
      data: data,
    };
    var newdata = textBoxData;

    newdata.push({
      query: query,
      response: {},
      isLoading: false,
    });
    setTextBoxData([...newdata]);
    console.log(textBoxData);

    try {
      const response = await axios.request(config);
      newdata[newdata.length - 1].isLoading = true;
      newdata[newdata.length - 1].response = response;

      setTextBoxData(newdata);
      localStorage.setItem("newdata", JSON.stringify(newdata));
      console.log(textBoxData);
      console.log("query is", query);
      setquery("");
      localStorage.removeItem("newdata");
    } catch (error) {
      console.error("Error sending data:", error);
      toast.error("Error fetching");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex font-sans flex-row h-screen gap-3 p-6">
      <section className="flex flex-col md:flex-row  w-full justify-between items-center space-x-0 md:space-x-5 h-full">
        <div className="flex  flex-col h-full w-full md:w-3/4 gap-6 px-4 md:px-0">
          <NavbarRight />
          <div className="flex flex-col scrollbar-hide h-[80vh] p-2 gap-2 justify-between rounded-[0.625rem] bg-customBlack">
            <Routes>
              <Route path="/" element={<Outlet />}>
                <Route path="" element={<SnippetDialog />} />
                <Route path="/Summary/:id" element={<SummaryDialog />} />
                <Route path="/Favour/:id" element={<FavourDialog />} />
                <Route path="/Neutral/:id" element={<NeutralDialog />} />
                <Route path="/Direction/:id" element={<DirectionDialog />} />
              </Route>
            </Routes>
            {/* <div className="flex flex-row  w-full justify-end items-center px-5 font-semibold space-x-5">
              <button
                // onClick={() => navigate("/")}
                className="bg-card-gradient p-2 border border-white rounded-md"
              >
                Download Document
              </button>
              <button
                onClick={() => navigate("/")}
                className="bg-card-gradient p-2 border border-white rounded-md"
              >
                New Document
              </button>
              <button
                onClick={() => {
                  localStorage.setItem("SummaryPath", "/Snippets");
                  navigate("/Summary");
                }}
                className="bg-card-gradient p-2 border border-white rounded-md"
              >
                Generate Summary
              </button>
              <button
                onClick={() => navigate("/DocPreview")}
                className="bg-card-gradient p-2 border border-white rounded-md"
              >
                Document Preview
              </button>
            </div> */}
          </div>
        </div>
        <div className="flex flex-col  h-full w-full md:w-1/4">
          <NavbarLeft />
          <div className="overflow-y-auto flex relative flex-col h-[80vh] mt-4 p-2 gap-3 rounded-[0.625rem] bg-customBlack">
            <div
              ref={chatContainerRef}
              className="chat section overflow-y-auto scrollbar-hide h-full flex flex-col">
              {textBoxData.length > 0 ? (
                <div className="flex flex-col justify-center items-center w-full pb-10 gap-3">
                  {textBoxData
                    .slice()
                    .reverse()
                    .map((item, i) => {
                      if (item.isLoading)
                        return <TextBoxDialog key={i} responseData={item} />;
                      return (
                        // <img className="h-40 w-40" src={giff} key={i} alt="" />
                        <div className="h-full w-full p-3 flex flex-col gap-2">
                          <div className="w-full h-3 bg-slate-600 animate-pulse  rounded-full"></div>
                          <div className="w-full h-3 bg-slate-600 animate-pulse  rounded-full"></div>
                          <div className="w-[60%] h-3 bg-slate-600 animate-pulse  rounded-full"></div>
                          <div className="w-[40%] h-3 bg-slate-600 animate-pulse  rounded-full"></div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <QueryGIF />
              )}
            </div>
            <div className="flex justify-center items-center  ">
              <Dropdown />
            </div>
            <form
              onSubmit={handleSend}
              className="p-2 space-x-2 flex flex-row justify-center items-center bottom-3">
              <input
                className="bg-white text-black rounded-md border-[0.05rem] border-black p-2 px-4 w-full"
                type="text"
                placeholder="Enter Your Question..."
                value={query}
                onChange={(e) => setquery(e.target.value)}
                required
              />
              <button
                type="submit"
                className="text-sm text-white bg-teal-700 p-2.5 px-3 rounded"
                disabled={loading}>
                SEND
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Snippets;
