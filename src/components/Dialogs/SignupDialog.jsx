import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Img from "../../assets/Workingchart.png";
import { NODE_API_ENDPOINT } from "../../utils/utils";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "../../features/authSlice";

const SignupDialog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    mobileNumber: "",
  });

  const handleOnchange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    const signupData = await fetch(`${NODE_API_ENDPOINT}/ai-drafter/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!signupData.ok) {
      const errorData = await signupData.json();
      console.error(errorData);
      toast.error(errorData.message);
    }
    const signupDataJSON = await signupData.json();

    console.log(signupDataJSON);

    dispatch(
      setUser({
        username: signupDataJSON.data.user.username,
        email: signupDataJSON.data.user.email,
        mobileNumber: signupDataJSON.data.user.mobileNumber,
        token: signupDataJSON.data.token,
      })
    );
    toast.success("Signup successful!");

    navigate("/pricing");
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
          <form onSubmit={handleSignIn} className="flex flex-col gap-4">
            <h1
              className="text-2xl font-bold text-teal-100"
              style={{
                background: "linear-gradient(180deg, #018081 0%, #00FFA3 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Create An Account
            </h1>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                name="username"
                onChange={handleOnchange}
                value={formData.username}
                className="w-full px-4 py-2 bg-white rounded-sm text-black"
                placeholder="Enter Username"
                required
              />
              <input
                type="email"
                name="email"
                onChange={handleOnchange}
                value={formData.email}
                className="w-full px-4 py-2 bg-white rounded-sm text-black"
                placeholder="Enter Email ID"
                required
              />
              <input
                type="text"
                name="mobileNumber"
                onChange={handleOnchange}
                value={formData.mobileNumber}
                className="w-full px-4 py-2 bg-white rounded-sm text-black"
                placeholder="Enter Mobile Number"
                required
              />
              <input
                type="password"
                name="password"
                onChange={handleOnchange}
                value={formData.password}
                className="w-full px-4 py-2 bg-white rounded-sm text-black"
                placeholder="Enter A Password"
                required
              />
            </div>

            {/* Sign Up Section */}
            <div className="flex justify-between items-center text-sm">
              <p>
                Already registered?{" "}
                <span
                  onClick={() => navigate("/login")}
                  className="font-bold cursor-pointer text-teal-100 hover:underline"
                >
                  Login Here
                </span>
              </p>
              <button
                type="submit"
                className="border px-4 py-2 rounded-md hover:bg-white hover:bg-opacity-25"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupDialog;
