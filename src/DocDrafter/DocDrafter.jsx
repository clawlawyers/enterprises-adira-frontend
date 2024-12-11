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
import { Helmet } from "react-helmet";

import { setPrompt } from "../features/PromptSlice";
import { useNavigate } from "react-router-dom";
import {
  setIsThisBypromptFalse,
  setIsThisBypromptTrue,
} from "../features/DocumentSlice";
import { TextField } from "@mui/material";
import HomeNav from "../components/Navbar/HomeNav";

const DocDrafter = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [prompt, setPromptValue] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setPromptValue(e.target.value);
  };

  const handleSubmit = () => {
    localStorage.setItem("from", "drafter");
    dispatch(setPrompt(prompt));
    navigate("/Drafter/DrafterArgs");
  };

  useEffect(() => {
    dispatch(setIsThisBypromptTrue());
  }, []);

  return (
    <div className="flex font-sans flex-col justify-center items-center w-full h-screen p-2 relative">
      <Helmet>
        <title>Adira-Powered Drafting </title>
        <meta
          name="description"
          content="Transform the way you draft legal documents with Adira Drafter. This AI-driven tool helps you create precise, professional documents in no time."
        />
        <meta
          name="keywords"
          content="legal drafting, Adira Drafter, AI legal tech, document automation, efficient legal writing, contract drafting, AI document tools, law tech innovation, legal efficiency, drafting solutions"
        />
      </Helmet>
      <div
        className="w-full h-screen absolute p-3 rounded-lg"
        style={{
          background: `radial-gradient(circle at 50% 0%, #018585, transparent 45%)`,
        }}
      >
        {/* Video background */}
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
              <div className="flex gap-2">
                <TextField
                  className="rounded"
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
                  disabled={prompt === ""}
                  onClick={handleSubmit}
                  className="bg-btn-gradient p-2 font-semibold px-4 rounded-md"
                >
                  Send
                </button>
              </div>
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocDrafter;
