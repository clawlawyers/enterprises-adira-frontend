import React, { useState } from "react";
import { Close } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const LoginDialog = ({ setLoginPopup, setIsOpen }) => {
  const [signUpForm, setSignUpForm] = useState(false);

  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    navigate("/pricing");
  };

  return (
    // <div className="fixed flex backdrop-blur-sm w-full h-full top-0 left-0 items-center justify-center z-50">
    <div className="w-full flex relative flex-col gap-12 p-10">
      <div
        className="absolute right-3 hover:cursor-pointer top-2"
        onClick={() => {
          setLoginPopup(false);
          setIsOpen(false);
        }}
      >
        <Close />
      </div>
      {!signUpForm ? (
        <div className="flex flex-col justify-center h-full items-start gap-2">
          <h1
            className="font-sans text-[2rem] leading-[3rem] -tracking-[0.09rem] font-bold"
            style={{
              background:
                "linear-gradient(to bottom, rgb(0, 128, 128) 0%, #00FFA3 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",

              color: "transparent",
            }}
          >
            Enter Login Credentials
          </h1>
          <div className="w-full py-2 flex flex-col gap-3">
            <input
              className="w-full px-2 py-3 rounded-lg text-black"
              placeholder="Enter Username"
            />
            <input
              className="w-full px-2 py-3 rounded-lg text-black"
              placeholder="Enter Password"
            />
          </div>
          <div className="w-full flex justify-end">
            <button className="border px-6 py-2 rounded-lg hover:bg-white hover:bg-opacity-25">
              Login
            </button>
          </div>
          <div className="w-full flex justify-center">
            <p>
              Not yet registered?{" "}
              <span
                onClick={() => setSignUpForm(true)}
                className="font-bold cursor-pointer"
                style={{
                  background:
                    "linear-gradient(to bottom, rgb(0, 128, 128) 0%, #00FFA3 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",

                  color: "transparent",
                }}
              >
                Sign Up Here
              </span>
            </p>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSignIn}
          className="flex flex-col justify-center h-full items-start gap-2"
        >
          <h1
            className="font-sans text-[2rem] leading-[3rem] -tracking-[0.09rem] font-bold"
            style={{
              background:
                "linear-gradient(to bottom, rgb(0, 128, 128) 0%, #00FFA3 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",

              color: "transparent",
            }}
          >
            Create An Account
          </h1>
          <div className="w-full py-2 flex flex-col gap-3">
            <input
              className="w-full px-2 py-3 rounded-lg text-black"
              placeholder="Enter Username"
            />
            <input
              className="w-full px-2 py-3 rounded-lg text-black"
              placeholder="Enter Email ID"
            />
            <input
              className="w-full px-2 py-3 rounded-lg text-black"
              placeholder="Enter Mobile Number"
            />
            <input
              className="w-full px-2 py-3 rounded-lg text-black"
              placeholder="Enter A Password"
            />
          </div>
          <div className="w-full flex justify-end">
            <button
              type="submit"
              className="border px-6 py-2 rounded-lg hover:bg-white hover:bg-opacity-25"
            >
              Sign Up
            </button>
          </div>
          <div className="w-full flex justify-center">
            <p>
              Already registered ?{" "}
              <span
                onClick={() => setSignUpForm(false)}
                className="font-bold cursor-pointer"
                style={{
                  background:
                    "linear-gradient(to bottom, rgb(0, 128, 128) 0%, #00FFA3 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",

                  color: "transparent",
                }}
              >
                Login Here
              </span>
            </p>
          </div>
        </form>
      )}
    </div>
    // </div>
  );
};

export default LoginDialog;
