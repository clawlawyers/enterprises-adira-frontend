import React from "react";
import { TypeAnimation } from "react-type-animation";
import LoginDialog from "../components/Dialogs/LoginDialog";
import ClawLogo from "../assets/clawlogo2.png";
import HomeLogo from "../assets/home1.png";

const LoginHome = ({ setLoginPopup, setIsOpen }) => {
  return (
    <div className="flex flex-col items-center justify-between w-full h-screen p-4 overflow-auto">
      <div className="flex justify-between items-center w-full">
        <img
          src={ClawLogo}
          alt="Claw Logo"
          className="h-15 w-15 object-contain transition-transform duration-300 hover:scale-110 hover:opacity-80"
        />
        <img
          src={HomeLogo}
          alt="Home Logo"
          className="h-10 w-10 object-contain transition-transform duration-300 hover:scale-110 hover:opacity-80"
        />
      </div>

      {/* Header Section */}
      <div className="flex flex-col gap-4 items-center text-center">
        <div className="font-sans font-medium text-2xl">Welcome to</div>
        <TypeAnimation
          sequence={["Adira AI", 3000, "", 1000]}
          wrapper="div"
          speed={1}
          style={{
            color: "#018081",
            fontSize: "3rem",
            fontWeight: "700",
            display: "inline-block",
          }}
          cursor={false}
          className="type"
          repeat={Infinity}
        />
        <div className="font-sans font-medium text-sm">
          AI Powered Legal Document Drafter by CLAW
        </div>
      </div>

      {/* Login Dialog Section */}
      <LoginDialog />
    </div>
  );
};

export default LoginHome;
