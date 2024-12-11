import React, { useRef, useEffect, useState } from "react";
import UserModal from "../Modals/UserModal";
import { useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import loginIcon from "../../assets/icons/loginIcon.gif";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import CircularProgress from "@mui/material/CircularProgress";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";

const HomeNav = ({ className }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [otp, setOtp] = useState("");
  const [hasFilled, setHasFilled] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [isFirst, setIsfirst] = useState(true);
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);

  const navigation = useNavigate();
  const path = useLocation();

  console.log(path.pathname);
  var homename = "";
  if (path.pathname == "/") {
    homename = "CLAW HOME";
  } else {
    homename = "HOME";
  }
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <div
        className={`${className} flex items-center flex-row justify-end gap-3`}
      >
        <a
          href={homename != "HOME" ? "https://clawlaw-dev.netlify.app/" : "/"}
          className="px-5 py-2  border-customBlue rounded-full border-[2px]"
          onClick={path.pathname != "/" ? () => navigation("/") : null}
        >
          <div className="flex flex-row items-center gap-2">
            {homename != "HOME" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="18"
                viewBox="0 0 20 18"
                fill="none"
              >
                <path
                  d="M10 0C10 0 3.814 5.34 0.357 8.232C0.246997 8.32785 0.15837 8.44575 0.0968683 8.57805C0.0353666 8.71036 0.00236362 8.85412 0 9C0 9.26522 0.105357 9.51957 0.292893 9.70711C0.48043 9.89464 0.734784 10 1 10H3V17C3 17.2652 3.10536 17.5196 3.29289 17.7071C3.48043 17.8946 3.73478 18 4 18H7C7.26522 18 7.51957 17.8946 7.70711 17.7071C7.89464 17.5196 8 17.2652 8 17V13H12V17C12 17.2652 12.1054 17.5196 12.2929 17.7071C12.4804 17.8946 12.7348 18 13 18H16C16.2652 18 16.5196 17.8946 16.7071 17.7071C16.8946 17.5196 17 17.2652 17 17V10H19C19.2652 10 19.5196 9.89464 19.7071 9.70711C19.8946 9.51957 20 9.26522 20 9C19.9986 8.85132 19.9634 8.70491 19.897 8.57185C19.8307 8.43879 19.7349 8.32257 19.617 8.232C16.184 5.34 10 0 10 0Z"
                  fill="#00969A"
                />
              </svg>
            )}
            <span className="font-sans">{homename}</span>
          </div>
        </a>
        {/* <div  onClick={handleOpen}  className="px-5 py-2 font-sans  border-customBlue rounded-full border-[2px]">
  LOGIN
</div> */}
        {/* <button

        className="px-5 py-2 border-customBlue rounded-full border-[2px]"
        onClick={() => navigation("/manageDoc")}
      >
        My Files
      </button> */}
        {/* <UserModal /> */}
      </div>
      {/* 
    <Modal
    open={open}
    onClose={handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <Box sx={style}>
      <div className="bg-customBlue bg-opacity-100 p-3 grid md:grid-cols-2 gap-4 rounded-lg border">
        <img className="w-auto h-auto rounded-none" src={loginIcon} />
        {true ? (
          <form onSubmit={handleSend}  className="flex flex-col gap-3 py-5">
            <p className="m-0 flex-none">Phone Number</p>
            <input
              required
              className="px-2 py-3 rounded text-black"
              placeholder="Enter Your Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded px-5 bg-customBlack"
                // style={{ background: "linear-gradient(90deg,#1D2330,#00C37B)" }}
              >
                {otpLoading ? (
                  <CircularProgress size={15} color="inherit" />
                ) : (
                  "Send OTP"
                )}
              </button>
            </div>
          </form>
        ) : (
          <form className="flex flex-col gap-3 py-5">
            <p className="m-0 flex-none">OTP</p>
            <input
              required
              className="px-2 py-3 rounded text-black"
              placeholder="Enter OTP"
              // value={otp}
              // onChange={(e) => setOtp(e.target.value)}
            />
            <div className="flex flex-col md:flex-row justify-end gap-3">
              <button
                // onClick={handleRetryClick}
                // disabled={isDisabled}
                className="bg-transparent border rounded px-5"
              >
                {/* {isDisabled ? `Wait ${countdown} seconds...` : "Retry"} 
              </button>
              <button
                type="submit"
                className="rounded px-5"
                style={{ background: "linear-gradient(90deg,#1D2330,#00C37B)" }}
              >
                {true ? ( ""
                  // <CircularProgress size={15} color="inherit" />
                ) : (
                  "Verify OTP"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </Box>
  </Modal>
  */}
    </>
  );
};

export default HomeNav;
