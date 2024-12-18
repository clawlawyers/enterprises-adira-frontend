import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Img from "../../assets/Workingchart.png";
import { useDispatch } from "react-redux";
import { NODE_API_ENDPOINT } from "../../utils/utils";
import { setPlanData, setUser } from "../../features/authSlice";
import toast from "react-hot-toast";

const LoginDialog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleOnchange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLoin = async (e) => {
    e.preventDefault();

    const loginData = await fetch(`${NODE_API_ENDPOINT}/ai-drafter/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!loginData.ok) {
      const errorData = await loginData.json();
      console.error(errorData);
      toast.error(errorData.message);
    }
    const loginDataJSON = await loginData.json();

    console.log(loginDataJSON);

    dispatch(
      setUser({
        username: loginDataJSON.data.user.username,
        email: loginDataJSON.data.user.email,
        mobileNumber: loginDataJSON.data.user.mobileNumber,
        token: loginDataJSON.data.token,
      })
    );

    dispatch(setPlanData(loginDataJSON.data.plan));
    toast.success("Login successful!");

    navigate("/");
  };

  return (
    <div className="w-full max-w-[896px] mt-2 mx-auto bg-teal-800 rounded-md ">
      <p className="text-center bg-teal-500 font-bold text-white p-1 text-sm rounded-tr-md rounded-tl-md">
        ENTERPRISE VERSION
      </p>

      {/* Main Container */}
      <div className="flex flex-wrap sm:flex-nowrap items-center px-4 gap-4">
        {/* Image Section (40%) */}
        <div className="flex-[4] w-full sm:w-auto flex justify-center">
          <img
            src={Img}
            alt="Illustration"
            className="w-full max-w-[300px] sm:max-w-full rounded-md object-contain"
          />
        </div>

        {/* Form Section (60%) */}
        <div className="flex-[6] w-full sm:w-auto">
          <div className="flex flex-col gap-4">
            <h1
              className="text-2xl font-bold text-teal-100"
              style={{
                background: "linear-gradient(180deg, #018081 0%, #00FFA3 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Enter Login Credentials
            </h1>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={formData.username}
                name="username"
                onChange={handleOnchange}
                className="w-full px-4 py-2 bg-white rounded-sm text-black"
                placeholder="Enter Username"
                required
              />
              <input
                type="password"
                value={formData.password}
                name="password"
                onChange={handleOnchange}
                className="w-full px-4 py-2 bg-white rounded-sm text-black"
                placeholder="Enter Password"
                required
              />
            </div>

            {/* Login Section */}
            <div className="flex justify-between items-center text-sm">
              <p>
                Not yet registered?{" "}
                <span
                  onClick={() => navigate("/signup")}
                  className="font-bold cursor-pointer text-teal-100 hover:underline"
                >
                  Sign Up Here
                </span>
              </p>
              <button
                className="border px-4 py-2 rounded-md hover:bg-white hover:bg-opacity-25"
                onClick={handleLoin}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginDialog;
