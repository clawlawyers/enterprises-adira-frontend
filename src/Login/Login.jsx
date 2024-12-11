import React, { useState } from "react";
import LoginDialog from "../components/Dialogs/LoginDialog";
import Footer from "../components/ui/Footer";
import LoginHome from "./LoginHome";
import aiIcon from "../assets/icons/back.gif";
import loginIcon from "../assets/icons/login.png";
import { motion } from "framer-motion";

const Login = () => {
  const [loginPopup, setLoginPopup] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen relative p-2 overflow-hidden">
      <div
        className="w-full h-screen absolute p-3 rounded-lg"
        style={{
          background: `radial-gradient(circle at 50% 0%, #018585, transparent 45%)`,
        }}
      >
        <img className="w-full h-full opacity-50" src={aiIcon} />
      </div>
      <div
        className="flex flex-col h-screen w-full  z-20 p-2 gap-3 bg-black bg-opacity-20 rounded-lg"
        style={{ boxShadow: "0 0 5px white, 0 0 10px white, 0 0 10px white" }}
      >
        <div className="flex flex-col justify-between w-full h-full  ">
          <LoginHome setLoginPopup={setLoginPopup} setIsOpen={setIsOpen} />
          {/* <button onClick={toggleSlide}>{isOpen ? "Hide" : "Show"} Div</button> */}
          <Footer />
        </div>

        {/* {loginPopup && <LoginDialog setLoginPopup={setLoginPopup} />} */}
        {loginPopup && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: isOpen ? 0 : "100%", opacity: isOpen ? 1 : 0 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              overflow: "hidden",
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "transparent",
              padding: "20px",
              color: "white",
              textAlign: "center",
              height: "70%",
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div className="grid md:grid-cols-2 h-full overflow-hidden w-2/3 bg-logo-gradient rounded-lg border border-white">
              <div className="p-2">
                <img src={loginIcon} />
              </div>
              <LoginDialog
                setLoginPopup={setLoginPopup}
                setIsOpen={setIsOpen}
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Login;
