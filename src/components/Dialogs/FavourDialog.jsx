import axios from "axios";
import React, { useEffect, useState } from "react";
import { NODE_API_ENDPOINT, trimQuotes } from "../../utils/utils";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Markdown from "react-markdown";
import loaderGif from "../../assets/icons/2.gif";

const FavourDialog = () => {
  let navigate = useNavigate();
  let location = useLocation();
  let { id: paramsId } = useParams();
  const doc_id = useSelector((state) => state.document.docId);
  const breakoutData = useSelector((state) => state.breakout.breakoutData);
  const currentUser = useSelector((state) => state.auth.user);
  const headpoints = breakoutData.data.fetchedData.headpoints;
  const details = breakoutData.data.fetchedData.details;

  const [isLoading, setisLoading] = useState(false);
  const [data, setData] = useState("");
  const [selectedHeadpoint, setSlectedHeadpont] = useState("");
  const [selectedDetails, setSelectedDetails] = useState("");

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

  const fetchData = async (headpoint) => {
    setisLoading(true);
    const res = await axios.post(`${NODE_API_ENDPOINT}/ai-drafter/favor`, {
      doc_id,
      headpoint_to_find: headpoint,
    }, {
      headers: {
        Authorization: `Bearer ${currentUser.jwt}`,
        "Content-Type": "application/json",
      },});
    const temp = res.data.data.fetchedData.favourable_for;
    setData(temp);
    setisLoading(false);
  };
  return (
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
          {" "}
          Summary
        </button>
        <button
          className="rounded border-[1px] w-fit p-2 hover:bg-hover-gradient hover:text-black hover:border-0 py-1 bg-customBlue"
          onClick={() => navigate(`/Snippets/Favour/${paramsId}`)} // Use navigate instead of <a>
        >
          In whose favour
        </button>
        <button
          className="rounded border-[1px] w-fit p-2 hover:bg-hover-gradient hover:text-black hover:border-0 py-1"
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
          <div className="flex overflow-y-auto scrollbar-hide justify-center items-center h-full flex-col gap-2 text-justify font-sans text-white m-5 ">
            <img
              className="flex flex-row justify-center items-center w-40 h-40"
              src={loaderGif}
              alt="Loading..."
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FavourDialog;
