import React from "react";
import { useNavigate } from "react-router-dom";
import Cloud from "../../assets/icons/Cloud.svg";
import Type from "../../assets/icons/Type.svg";
import Prompt from "../../assets/icons/Prompt.svg";
import UserModal from "../../components/Modals/UserModal";
import { TypeAnimation } from "react-type-animation";
import group from "../../assets/icons/Subtract.png";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const HeroPage = () => {
  let navigate = useNavigate();

  const userPlan = useSelector((state) => state.auth.PlanData);
  return (
    <div className="flex flex-col gap-5 items-center justify-between w-full h-full px-4">
      <div className="flex flex-col items-center text-center">
        <div className="font-sans font-medium text-xl">Welcome to</div>
        {/* <div className="font-sans w-72  text-6xl px-6 py-2 bg-logo-gradient rounded"> */}
        {/* <div  style={{
            
              display: "inline-block",
            }} className="  typing-demo">Adira AI</div> */}
        <TypeAnimation
          sequence={[
            // Same substring at the start will only be typed out once, initially
            "Adira AI",
            3000,
            "",
            1000,
            // "Frontend Developer",
            // 2000,
          ]}
          wrapper="div"
          speed={1}
          style={{
            color: "#018081",
            fontSize: "4rem",
            fontWeight: "700",
            display: "inline-block",

            // borderStyle: "solid",
            // borderWidth: "5px",
          }}
          cursor={false}
          className="type"
          repeat={Infinity}
        />
        {/* </div> */}
        <div className="font-sans font-medium text-xl">
          AI Powered Legal Document Drafter by CLAW
        </div>
      </div>
      <div className="grid font-sans md:grid-cols-4 gap-5 w-[90%]">
        <div
          onClick={() => {
            if (userPlan?.isUploadOwnDocument) {
              navigate("/upload");
            } else {
              toast.error("PLEASE UPGRADE YOUR PLAN");
            }
          }}
          className="py-3 hover:scale-110 duration-200 cursor-pointer bg-logo-gradient flex flex-col gap-3 items-center justify-center rounded-lg"
        >
          <img
            src={
              "https://res.cloudinary.com/dumjofgxz/image/upload/v1730969164/Cloud_vfpmhw.svg"
            }
            className=""
            alt="Upload Icon"
          />
          <div className="flex-1 flex flex-col  ">
            <p className="text-center text-xl font-semibold">
              Upload Your Document
            </p>
            <p className="text-center text-xs">
              Quickly upload your legal file
            </p>
          </div>
        </div>
        <div
          onClick={() => {
            if (userPlan?.isPromptDrafting) {
              navigate("/Drafter");
            } else {
              toast.error("PLEASE UPGRADE YOUR PLAN");
            }
          }}
          className="py-3 hover:scale-110 duration-200 cursor-pointer bg-logo-gradient flex flex-col gap-3 items-center justify-center rounded-lg"
        >
          <img
            src={
              "https://res.cloudinary.com/dumjofgxz/image/upload/v1730969165/Prompt_bkzjmu.svg"
            }
            // className="h-[90px] w-[90px] object-contain"
            alt="Prompt Icon"
          />
          <div className="flex flex-col flex-1 ">
            <p className="text-center text-xl font-semibold">
              Create Document from Prompt
            </p>
            <p className="text-center text-xs">Describe it, we’ll draft it</p>
          </div>
        </div>
        <div
          onClick={() => {
            if (userPlan?.isTypeOfDocument) {
              navigate("/DocType");
            } else {
              toast.error("PLEASE UPGRADE YOUR PLAN");
            }
          }}
          className="py-3 hover:scale-110 duration-200 cursor-pointer bg-logo-gradient flex flex-col gap-3 items-center justify-center rounded-lg"
        >
          <img
            src={
              "https://res.cloudinary.com/dumjofgxz/image/upload/v1730969164/Type_m2w22m.svg"
            }
            // className="h-[80px] w-[80px] object-contain"
            alt="Type Icon"
          />
          <div className="flex flex-col flex-1 ">
            <p className="text-center text-xl font-semibold">
              Select Type of Document
            </p>
            <p className="text-center text-xs">
              Quickly upload your legal file
            </p>
          </div>
        </div>
        <div
          onClick={() => {
            if (userPlan?.isUploadOwnDocumentWithPrompt) {
              navigate("/Prompt");
            } else {
              toast.error("PLEASE UPGRADE YOUR PLAN");
            }
          }}
          className="py-3 hover:scale-110 duration-200 cursor-pointer bg-logo-gradient flex flex-col gap-3 items-center justify-center rounded-lg"
        >
          <img
            src={group}
            className="h-[50px] w-[80px] object-contain"
            alt="Type Icon"
          />

          <div className="flex flex-col flex-1 ">
            <p className="text-center text-xl font-semibold">
              File along with Prompt
            </p>
            <p className="text-center text-xs ">
              Upload your file and describe using prompt
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroPage;
