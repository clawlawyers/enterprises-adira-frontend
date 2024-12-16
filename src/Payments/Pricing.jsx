import React, { useState } from "react";
import Return from "../../src/assets/return.png";
import Home from "../../src/assets/home1.png";
import { NODE_API_ENDPOINT } from "../utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { setPlanData } from "../features/authSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Pricing = () => {
  const [receipt, setReceipt] = useState(`receipt_${Date.now()}`);
  const currentUser = useSelector((state) => state.auth.user);
  const planData = useSelector((state) => state.auth.planData);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const PayHandler = async () => {
    if (planData !== null) {
      toast.error("You have already Plan");
      return;
    }
    setLoading(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onerror = () => {
      setLoading(false);
      alert("Razorpay SDK failed to load. Are you online?");
    };
    script.onload = async () => {
      try {
        const result = await axios.post(
          `${NODE_API_ENDPOINT}/payment/create-order`,
          {
            amount: 5999,
            currency: "INR",
            receipt: receipt,
            billingCycle: "MONTHLY",
            phoneNumber: currentUser.mobileNumber,
            planName: "Pro",
          }
        );

        if (!result || !result.data.razorpayOrder) {
          throw new Error("Failed to create Razorpay order");
        }

        const { amount, id, currency } = result.data.razorpayOrder;
        const orderId = result.data.createdOrder._id;

        console.log(result.data.createdOrder);

        const currentDate = new Date();
        const futureDate = new Date(currentDate);
        futureDate.setDate(currentDate.getDate() + 60); // Adding 60 days to the current date

        const options = {
          key: "rzp_test_UWcqHHktRV6hxM",
          amount: String(amount),
          currency: currency,
          name: "CLAW LEGALTECH PRIVATE LIMITED",
          description: "Transaction",
          order_id: id,
          handler: async function (response) {
            console.log(response);
            const data = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              phoneNumber: currentUser.phoneNumber,
              _id: orderId,
              planId: "675e462ebd3aeada8dce681a",
              createdAt: currentDate,
              expiresAt: futureDate,
              amount: 5999,
            };

            console.log(response);

            const result = await axios.post(
              `${NODE_API_ENDPOINT}/payment/verifyPayment`,
              data
            );
            alert("Payment successfully done");
            setLoading(false);
            dispatch(setPlanData(result.data.plan));
            // dispatch(setActivePlanDetails(result.data.plan.plan));
            // dispatch(retrieveActivePlanUser());
          },
          prefill: {
            name: currentUser?.username,
            email: currentUser?.email,
            contact: currentUser?.mobileNumber,
          },
          theme: {
            color: "#3399cc",
          },
        };

        console.log(options);

        const paymentObject = new window.Razorpay(options);

        console.log(paymentObject);
        paymentObject.open();
        navigate("/");
      } catch (error) {
        setLoading(false);
        alert(error.message);
      } finally {
        setLoading(false);
        // dispatch(resetTalkToExpert(null));
      }
    };
    document.body.appendChild(script);
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen relative p-4 overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          className="w-full h-full object-cover opacity-70"
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

      {/* Content Section */}
      <div className="relative z-10 w-full h-full flex flex-col gap-6 p-6 bg-black bg-opacity-40 rounded-lg">
        {/* Header */}
        <div className="flex justify-between cursor-pointer items-center w-full">
          <p className="text-teal-500 text-3xl font-bold">
            Adira AI
            <sup className="text-white text-sm font-light"> by CLAW</sup>
          </p>
          <div className="flex gap-4">
            <img
              src={Return}
              alt="Return"
              className="h-8 w-8 cursor-pointer hover:opacity-80 transition duration-300"
            />
            <img
              src={Home}
              alt="Home"
              className="h-8 w-8 cursor-pointer hover:opacity-80 transition duration-300"
            />
          </div>
        </div>

        {/* Pricing Section */}
        <div className="flex flex-col md:flex-row m-auto items-center justify-center text-center w-full h-screen p-4 gap-8">
          {/* Left Section: Heading */}
          <div className="w-full md:w-2/5 p-0 flex justify-start items-start">
            <h1
              className="text-5xl font-bold p-0 text-left"
              style={{
                background:
                  "linear-gradient(to bottom, rgb(0, 128, 128) 0%, #00FFA3 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Pricing Plan For Enterprise Version
            </h1>
          </div>

          {/* Right Section: Pricing and Features */}
          <div className="w-full md:w-3/5 bg-[#018081] border-white border transition bg-opacity-20 rounded-lg p-6 shadow-lg">
            {/* Plan Title */}
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              ENTERPRISE PLAN
            </h2>

            {/* Features Grid */}
            <div className="grid grid-cols-1 px-3 md:grid-cols-3 gap-6 mb-6 text-white">
              <ul className="list-disc space-y-2 text-left">
                <li>Generate 60+ documents</li>
                <li>All Ready-Made Templates</li>
                <li>Prompt Drafting</li>
                <li>Download without Watermark</li>
              </ul>
              <ul className="list-disc space-y-2 text-left">
                <li>Summarize Document</li>
                <li>Summarize Clauses Individually</li>
                <li>Edit Document with AI</li>
                <li>Upload Your Own Document</li>
              </ul>
              <ul className="list-disc space-y-2 text-left">
                <li>Analyze Any Document</li>
                <li>Upload Document with Prompt</li>
                <li>Full Access to LegalGPT</li>
                <li>Full Access to Case Search</li>
              </ul>
            </div>

            {/* Pricing Details */}
            <div className="flex flex-col md:flex-row items-center justify-center text-center gap-4 text-white">
              <p className="line-through text-gray-400 text-xl">₹ 6999/-</p>
              <h1 className="text-4xl font-bold">₹ 5999/-</h1>
              <button
                onClick={PayHandler}
                className="px-8 py-2 bg-[#018081] rounded-lg hover:bg-opacity-60 transition duration-300 text-white font-medium"
              >
                Get It Now
              </button>
            </div>
          </div>
        </div>

        <div className="w-full mt-8">
          {/* Horizontal Line */}
          <hr className="border-t border-white border-opacity-30 mb-4" />

          {/* Footer Content */}
          <p className="text-white text-opacity-80 text-center text-sm">
            Adira AI is a Proprietary Legal-Based Generative AI developed by
            <span className="font-semibold"> CLAW Legal Tech</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
