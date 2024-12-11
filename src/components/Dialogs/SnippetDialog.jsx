import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";
// import { setGreenHeading } from "../../features/greenHeadingSlice";

const SnippetDialog = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const breakout = useSelector((state) => state.breakout);
  const greenHeading = useSelector((state) => state.greenHeading);
  console.log(breakout);
  const [headPoints, setHeadPoints] = useState([]);
  const [details, setDetails] = useState([]);
  // const dispatch = useDispatch();
  // dispatch(setGreenHeading([]));

  useEffect(() => {
    if (breakout.breakoutData) {
      // console.log(breakout?.greenHeading);
      setHeadPoints(
        breakout.breakoutData.data.fetchedData.headpoints.map(
          (heading) => heading.replace(/^#+\s*/, "") // Remove leading # symbols
        ) || []
      );
      setDetails(
        breakout.breakoutData.data.fetchedData.details.map(
          (detail) => detail.replace(/[()]/g, "") // Remove leading # symbols
        ) || []
      );
    }
  }, [breakout]);

  const combinedData = headPoints.map((heading, index) => ({
    heading,
    text: details[index] || "", // Ensure text exists for each heading
  }));

  console.log(combinedData);

  return (
    <>
      <div className="hide-scrollbar overflow-y-auto flex flex-col gap-5 mx-6 my-5 ">
        {combinedData.map((item, i) => (
          <div key={i} className="flex flex-row items-start gap-3 ">
            <motion.div
              initial={{ x: -100 }} // Start off-screen (left)
              animate={{ x: 0 }} // End at original position
              transition={{ duration: 1, ease: "easeInOut" }}
              className={twMerge(
                "flex flex-col rounded-[0.635rem] border-2 px-4 py-2 border-white bg-popup-gradient w-3/4 gap-1 h-full", // Added h-64 for fixed height
                greenHeading.greenHeading?.includes(`${i + 1}`) &&
                  "border-green-500"
              )}
            >
              <div className="font-sans text-[1.125rem] font-bold leading-[1.13625rem] sticky top-0 bg-popup-gradient z-10">
                <Markdown>{item.heading}</Markdown>
              </div>
              <div className="font-sans text-[0.625rem] scrollbar-hide w-fit break-words overflow-wrap break-word word-wrap break-word overflow-y-auto flex-1">
                <Markdown>
                  {item.text
                    .replaceAll(/\u20b9/g, "₹")
                    .replaceAll(/\\u20b9/g, "₹")
                    .replaceAll(/\\n/g, "\n\n")
                    .replaceAll(/\\t/g, "\t")
                    .replaceAll(/\\"/g, '"')
                    .replaceAll(/1\n"/g, "\n")}
                </Markdown>
              </div>
            </motion.div>
            <motion.div
              initial={{ x: 100 }} // Start off-screen (left)
              animate={{ x: 0 }} // End at original position
              transition={{ duration: 1, ease: "easeInOut" }}
              className="w-1/4 text-clip flex gap-4 flex-col text-[0.6875rem] font-sans"
            >
              <div className="flex gap-3 text-xs">
                <motion.button
                  whileHover="hover"
                  className="rounded-md relative border-[2px]  w-1/2 bg-hover-gradient hover:text-black hover:border-0 p-2  text-[0.6875rem]"
                  onClick={() => navigate(`/Snippets/Summary/${i}`)} // Use navigate instead of <a>
                >
                  <motion.div
                    variants={{
                      hover: { x: "100%" },
                    }}
                    initial={{ x: "0%" }}
                    transition={{ type: "tween", duration: 0.5 }}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      // background: "#0E1118",
                      zIndex: 0,
                    }}
                      className="bg-customBlack rounded-md"
                  />
                  <span
                    style={{
                      position: "relative",
                      zIndex: 2,
                    }}
                  >
                    Summary
                  </span>
                </motion.button>
                <motion.button
                  whileHover="hover"
                  className="rounded-md relative border-[2px] w-1/2 bg-hover-gradient hover:text-black hover:border-0  p-2 text-[0.6875rem]"
                  onClick={() => navigate(`/Snippets/Favour/${i}`)} // Use navigate instead of <a>
                >
                  <motion.div
                    variants={{
                      hover: { x: "100%" },
                    }}
                    initial={{ x: "0%" }}
                    transition={{ type: "tween", duration: 0.5 }}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      // background: "#0E1118",
                      zIndex: 0,
                    }}
                     className="bg-customBlack rounded-md"
                  />
                  <span
                    style={{
                      position: "relative",
                      zIndex: 2,
                    }}
                  >
                    In whose favour
                  </span>
                </motion.button>
              </div>
              <div className="flex  text-[0.6875rem] gap-3">
                <motion.button
                  whileHover="hover"
                  className="rounded-md relative border-[2px] w-1/2  bg-hover-gradient hover:text-black hover:border-0 p-2 text-[0.6875rem]"
                  onClick={() => navigate(`/Snippets/Neutral/${i}`)} // Use navigate instead of <a>
                >
                  <motion.div
                    variants={{
                      hover: { x: "100%" },
                    }}
                    initial={{ x: "0%" }}
                    transition={{ type: "tween", duration: 0.5 }}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      // background: "#0E1118",
                      zIndex: 0,
                    }}
                      className="bg-customBlack rounded-md"
                  />
                  <span
                    style={{
                      position: "relative",
                      zIndex: 2,
                    }}
                  >
                    How to make neutral
                  </span>
                </motion.button>
                <motion.button
                  whileHover="hover"
                  className="rounded-md relative border-[2px] bg-hover-gradient  w-1/2 hover:text-black hover:border-0 p-2  text-[0.6875rem]"
                  onClick={() => navigate(`/Snippets/Direction/${i}`)} // Use navigate instead of <a>
                >
                  <motion.div
                    variants={{
                      hover: { x: "100%" },
                    }}
                    initial={{ x: "0%" }}
                    transition={{ type: "tween", duration: 0.5 }}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      // background: "#0E1118",
                      zIndex: 0,
                    }}
                    className="bg-customBlack rounded-md"
                  />
                  <span
                    style={{
                      position: "relative",
                      zIndex: 2,
                    }}
                  >
                    Bend in Opp. Direction
                  </span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
      <div className="flex flex-row  w-full justify-end items-center px-5 font-semibold space-x-5">
        {/* <button
          onClick={() => navigate("/")}
          className="bg-card-gradient p-2 border border-white rounded-md"
        >
          New Document
        </button> */}
        <button
          onClick={() => {
            localStorage.setItem("SummaryPath", "/Snippets");
            navigate("/Summary");
          }}
          className="transition ease-in-out duration-1000  hover:scale-110 bg-card-gradient p-2 border border-white rounded-md"
        >
          Generate Summary
        </button>
        <button
          onClick={() => navigate("/DocPreview")}
          className="transition ease-in-out duration-1000  hover:scale-110  bg-card-gradient p-2 border border-white rounded-md"
        >
          Document Preview
        </button>
      </div>
    </>
  );
};

export default SnippetDialog;
