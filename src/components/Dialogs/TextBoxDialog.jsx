import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setGreenHeading } from "../../features/greenHeadingSlice";
import { motion } from "framer-motion";

const TextBoxDialog = ({ responseData }) => {
  const [isLoading, setisLoading] = useState(false);

  const [showDocument, setshowDocument] = useState(false);
  // const [responseData, setresponseData] = useState([
  //   "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
  // ]);
  const dispatch = useDispatch();
  const handleDraft = () => {
    let greenHeading = [];
    Object.keys(responseData.response.data.data.fetchedData.headpoint).map(
      function (key, index) {
        greenHeading.push(key.split("d")[1]);
      }
    );
    dispatch(setGreenHeading(greenHeading));
    console.log(greenHeading);
  };
  return (
    <div className="flex flex-col gap-3 p-4">
      {/* <div className="flex gap-2 flex-row ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M10 0C7.34874 0.00296443 4.80693 1.05748 2.93221 2.93221C1.05748 4.80693 0.00296443 7.34874 0 10C0.00444216 12.6508 1.05944 15.1918 2.93384 17.0662C4.80824 18.9406 7.3492 19.9956 10 20C12.6522 20 15.1957 18.9464 17.0711 17.0711C18.9464 15.1957 20 12.6522 20 10C20 7.34784 18.9464 4.8043 17.0711 2.92893C15.1957 1.05357 12.6522 0 10 0ZM16.0824 15.7704C15.5208 14.6376 14.6538 13.6843 13.5792 13.018C12.5046 12.3518 11.2652 11.9991 10.0008 11.9998C8.73644 12.0004 7.49741 12.3544 6.42353 13.0218C5.34964 13.6892 4.48363 14.6434 3.9232 15.7768C2.42793 14.226 1.59475 12.1542 1.6 10C1.6 7.77218 2.485 5.63561 4.0603 4.0603C5.63561 2.485 7.77218 1.6 10 1.6C12.2278 1.6 14.3644 2.485 15.9397 4.0603C17.515 5.63561 18.4 7.77218 18.4 10C18.405 12.1512 17.574 14.2203 16.0824 15.7704ZM10 4C9.28799 4 8.59196 4.21114 7.99995 4.60671C7.40793 5.00228 6.94651 5.56453 6.67403 6.22234C6.40156 6.88015 6.33027 7.60399 6.46917 8.30233C6.60808 9.00066 6.95095 9.64212 7.45442 10.1456C7.95789 10.6491 8.59934 10.9919 9.29768 11.1308C9.99601 11.2697 10.7198 11.1984 11.3777 10.926C12.0355 10.6535 12.5977 10.1921 12.9933 9.60005C13.3889 9.00804 13.6 8.31201 13.6 7.6C13.6 7.12724 13.5069 6.65911 13.326 6.22234C13.145 5.78557 12.8799 5.38871 12.5456 5.05442C12.2113 4.72013 11.8144 4.45495 11.3777 4.27403C10.9409 4.09312 10.4728 4 10 4Z"
            fill="#00969A"
          />
        </svg>
        <div className="font-sans text-customBlue font-bold">Soumya Banik</div>
      </div> */}
      <div className=" font-sans text-sm">{responseData.query}</div>
      <div className=" rounded-[0.625rem] border-[0.1rem] border-white font-sans text-xs p-2 px-3 text-justify bg-customBlue leading-5 ">
        {responseData.response.data.data.fetchedData.answer}
      </div>
      <div className="flex flex-row text-[0.6875rem] font-sans  gap-2">
        <motion.button
          whileHover={"hover"}
          className="rounded relative border-[1px]  w-1/2 bg-hover-gradient hover:text-black hover:border-0   py-1 "
          onClick={handleDraft}
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
            className="bg-customBlack rounded "
          />
          <span
            style={{
              position: "relative",
              zIndex: 2,
            }}
          >
            Find in Drafter
          </span>
        </motion.button>
        <motion.button
          whileHover={"hover"}
          onClick={() => setshowDocument(true)}
          className="rounded relative border-[1px] w-1/2 bg-hover-gradient hover:text-black hover:border-0   py-1 "
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
            className="bg-customBlack  rounded"
          />
          <span
            style={{
              position: "relative",
              zIndex: 2,
            }}
          >
            Find in Document
          </span>
        </motion.button>
      </div>
      {showDocument && (
        <div className="flex flex-col gap-3 rounded-[0.625rem] border-[0.1rem] border-white font-sans text-[0.625rem] p-2 px-3 text-justify bg-customBlue ">
          {Object.keys(
            responseData.response.data.data.fetchedData.headpoint
          ).map(function (key, index) {
            console.log("hi");

            // responseData.response.data.data.fetchedData.references[
            //   index
            // ].keys();
            return (
              <div className="flex flex-col gap-1">
                <div className="font-bold text-[1rem]">
                  {
                    responseData.response.data.data.fetchedData.headpoint[key][
                      "headpoint"
                    ]
                  }
                </div>

                <div>
                  {
                    Object.values(
                      responseData.response.data.data.fetchedData.references[
                        index
                      ]
                    )[0]
                  }
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TextBoxDialog;
