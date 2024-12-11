import React, { useState } from "react";
import { NODE_API_ENDPOINT } from "../utils/utils";
import { useDispatch } from "react-redux";
import { login, setUser } from "../features/authSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Password } from "@mui/icons-material";
const AdminLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pass, setpass] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handlelogin = async () => {
    if (phoneNumber.trim() !== "ADMINUSER" || pass.trim() !== "ADMINPASSWORD") {
      console.log(phoneNumber.trim());
      console.log(pass.trim());
      toast.error("Invalid acreditional or error occured");
      return;
    }
    setLoading(true);
    const response = await fetch(`${NODE_API_ENDPOINT}/client/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "auth-token":data.authtoken
      },
      body: JSON.stringify({
        phoneNumber: "2525252525",
        verified: true,
      }),
    });
    console.log(response);
    if (!response.ok) {
      toast.error("invalid acreditional or error occured!!");
      setLoading(false);
      return;
    }
    var { data } = await response.json();
    console.log(data);
    setLoading(false);

    const user = {
      expiresAt: data.expiresAt,
      jwt: data.jwt,
      newGptUser: false,
      phoneNumber: "2525252525",
      stateLocation: data.stateLocation,
    };

    // const jwt = data.jwt;
    dispatch(setUser(user));

    navigate("/");
  };
  return (
    <div className=" h-[100vh] flex items-center justify-center">
      <div className="flex bg-white  bg-opacity-30 rounded-md flex-col w-[50%] h-[50%] gap-5 items-center justify-center">
        <input
          required
          className="px-2 py-3 w-[90%] rounded text-white"
          placeholder="Enter Your Username"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <input
          required
          className="px-2 py-3 w-[90%] rounded text-white"
          placeholder="Enter Your Password"
          value={pass}
          onChange={(e) => setpass(e.target.value)}
        />
        {/* <input></input> */}
        <button
          onClick={handlelogin}
          className="px-6 py-2 bg-customBlack font-sans rounded-md"
        >
          {loading ? "Logging..." : "Login"}
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
