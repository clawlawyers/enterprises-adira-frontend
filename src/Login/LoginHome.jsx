import React from "react";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
import styles from "./LoginHome.module.css";

const LoginHome = ({ setLoginPopup, setIsOpen }) => {
  return (
    <div className="flex flex-col items-center justify-between w-full h-full p-20">
      <div className="flex flex-col gap-2 items-center text-center">
        <div className="font-sans font-medium text-2xl">Welcome to</div>
        {/* <div className="font-sans font-semibold text-6xl px-6 py-2 bg-logo-gradient">
            Adira AI
          </div> */}
        <div className="font-sans w-72 font-semibold text-6xl px-6 py-2 bg-logo-gradient rounded">
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
            wrapper="span"
            speed={1}
            style={{
              fontSize: "3.5rem",
              fontWeight: "700",
              display: "inline-block",
            }}
            repeat={Infinity}
          />
        </div>
        <div className="font-sans font-medium text-sm mt-2">
          AI Powered Legal Document Drafter by CLAW
        </div>
      </div>
      <motion.div whileHover={{ scale: "1.1" }} className="w-1/3">
        <button
          onClick={() => {
            setLoginPopup(true);
            setIsOpen(true);
          }}
          className={styles.glow_on_hover}
        >
          Login To Continue
        </button>
      </motion.div>
    </div>
  );
};

export default LoginHome;
