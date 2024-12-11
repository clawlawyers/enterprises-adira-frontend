import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { setOtpVerified, setUser } from "../../features/authSlice";
import {
  auth,
  PhoneAuthProvider,
  RecaptchaVerifier,
  // RecaptchaVerifier,
  signInWithCredential,
  signInWithPhoneNumber,
} from "../../utils/firebase";
import { useNavigate } from "react-router-dom";
import { NODE_API_ENDPOINT } from "../../utils/utils";
import { Close } from "@mui/icons-material";
import toast from "react-hot-toast";
import { CircularProgress } from "@mui/material";

const LoginDialog = ({ setLoginPopup, setIsOpen }) => {
  const dispatch = useDispatch();
  const { isOtpVerified } = useSelector((state) => state.auth);
  // const [firstName, setFirstName] = useState("");
  // const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [localOtp, setLocalOtp] = useState("");
  const [showOtpDialog, setShowOtpDialog] = useState(false);

  // const [phoneNumber, setPhoneNumber] = useState();
  const [verificationId, setVerificationId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const currentUser = useSelector((state)=>state.auth.user)

  // Function to clear children of an element
  function clearRecaptchaChildren() {
    const recaptchaElement = document.getElementById("recaptcha");

    if (recaptchaElement) {
      while (recaptchaElement.firstChild) {
        recaptchaElement.removeChild(recaptchaElement.firstChild);
      }
    } else {
      console.warn('Element with ID "recaptcha" not found.');
    }
  }

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    // Example usage
    clearRecaptchaChildren();
    // check ether mobile number is registered or not
    const fetchedResp = await fetch(
      `${NODE_API_ENDPOINT}/clientAdira/clientAdiraValidation`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${currentUser.jwt}`,
          "Content-Type": "application/json",
        },
     
        body: JSON.stringify({ phoneNumber }),
      }
    );

    if (!fetchedResp.ok) {
      toast.error("This number is not registered!");
      setIsLoading(false);
      return;
    }

    // handleDisableButton();
    console.log("sendOTP");

    const recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha", {
      size: "invisible",
      callback: (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        console.log(response);
      },
      auth,
    });

    console.log("I am here");
    console.log(phoneNumber);

    signInWithPhoneNumber(auth, "+91" + phoneNumber, recaptchaVerifier)
      .then((confirmationResult) => {
        setVerificationId(confirmationResult.verificationId);
        // alert("OTP sent!");
        toast.success("OTP sent successfully !");
        setIsLoading(false);
        setShowOtpDialog(true);
      })
      .catch((error) => {
        // alert("Error during OTP request");
        toast.error("Error during OTP request");
        console.error("Error during OTP request:", error);
        setShowOtpDialog(false);
        setIsLoading(false);
      });
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);
    const credential = PhoneAuthProvider.credential(verificationId, localOtp);
    localStorage.setItem("loginOtp", localOtp);

    signInWithCredential(auth, credential)
      .then(async (userCredential) => {
        const user = userCredential.user;
        setIsLoading(false);
        toast.success("Phone number verified successfully!");

        const props = await fetch(`${NODE_API_ENDPOINT}/clientAdira/getuser`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${parsedUser.token}`,
          },
        });

        if (!props.ok) {
          setIsLoading(false);
          toast.error("User not found!");
          return;
        }
        const parsedProps = await props.json();
        console.log(parsedProps.data);
        dispatch(setUser(parsedProps.data.user));
        navigate("/");
      })

      .catch((error) => {
        toast.error("Error during OTP verification:");
        console.log(error);
        setIsLoading(false);
        // setProceedToPayment(false);
      });
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   setShowOtpDialog(true);
  // };

  // const handleVerifyOtp = () => {
  //   // Simulate OTP verification logic
  // };

  const handleOtpVerification = (e) => {
    setLocalOtp(e.target.value);
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
      <div className="flex flex-col justify-start items-start gap-1">
        <div className="font-sans text-[2rem] leading-[3rem] -tracking-[0.09rem] text-black font-bold">
          Welcome Back !
        </div>
        <p className=" text-sm">
          Enter Your Mobile Number to Login to{" "}
          <span className="font-bold">Adira AI</span>
        </p>
      </div>
      {!showOtpDialog ? (
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <input
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter your Mobile Number"
                className="w-full pl-4 p-2 bg-customInput rounded border border-black text-black"
                type="text"
                disabled={isOtpVerified}
              />
              <div className="w-full flex justify-end gap-2">
                <button
                  onClick={() => {
                    setLoginPopup(false);
                    setIsOpen(false);
                  }}
                  className="px-3 py-1 bg-transparent border border-black rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-logo-gradient rounded border"
                >
                  {!isLoading ? (
                    "Send OTP"
                  ) : (
                    <CircularProgress size={15} color="inherit" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="flex flex-col gap-2">
          <input
            required
            placeholder="Enter OTP"
            className="w-full pl-4 p-2 text-black bg-customInput rounded border border-black"
            type="text"
            value={localOtp}
            onChange={handleOtpVerification}
          />
          <div className="w-full flex justify-end gap-2">
            <button
              onClick={() => {
                setLoginPopup(false);
                setIsOpen(false);
              }}
              className="px-3 py-1 bg-transparent border-2 border-black rounded"
            >
              Cancel
            </button>
            <button
              disabled={localOtp === ""}
              onClick={handleVerifyOtp}
              className="px-3 py-1 bg-logo-gradient rounded border"
            >
              {!isLoading ? (
                "Verify OTP"
              ) : (
                <CircularProgress size={15} color="inherit" />
              )}
            </button>
          </div>
        </div>
      )}
      <div id="recaptcha"></div>
    </div>
    // </div>
  );
};

export default LoginDialog;
