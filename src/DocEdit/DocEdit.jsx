import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HomeNav from "../components/Navbar/HomeNav";
import NavbarRight from "../components/Navbar/NavbarRight";
import NavbarLeft from "../components/Navbar/NavbarLeft";
import { useDispatch, useSelector } from "react-redux";
import loaderGif from "../assets/icons/2.gif";
import EditSidebar from "../components/ui/EditSidebar";
import Back from "../assets/icons/back-arrow.png";
import { useNavigate } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { formatPdfText, trimQuotes } from "../utils/utils";
import Accordion from "@mui/material/Accordion";
import Markdown from "react-markdown";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { breakout } from "../actions/createDoc";
import { setBreakoutData } from "../features/breakoutSlice";
import axios from "axios";
import { NODE_API_ENDPOINT } from "../utils/utils";
import { formatText } from "../utils/utils";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import PDFDownloadButton from "../PdfDownloader/PdfDoc";
import { Close, Edit } from "@mui/icons-material";
import { setIsGenerateDocCalledFalse } from "../features/DocumentSlice";
import chatbot from "../assets/icons/chatbot.svg";
import faq from "../assets/icons/FAQ.svg";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import toast from "react-hot-toast";
import "./DocEdit.css";
import { Tooltip } from "@mui/material";

const DocEdit = ({ onSave }) => {
  // const faqData = [
  //   { title: "asdasd", data: "asdsad" },
  //   { title: "asdasd", data: "asdsad" },
  //   { title: "asdasd", data: "asdsad" },
  //   { title: "asdasd", data: "asdsad" },
  // ];

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ediText = useSelector((state) => state.document.uploadDocText);

  console.log(ediText);
  const isGenerateDocCall = useSelector(
    (state) => state.document.IsGenerateDocCalled
  );
  const currentUser = useSelector((state) => state.auth.user);
  // console.log(ediText);
  const texteditable = useSelector((state) => state.document.uploadDocText);
  const PlanData = useSelector((state) => state.auth.PlanData);
  const doc_id = useSelector((state) => state.document.docId);

  const [faqData, setfaqData] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeSidebar, setActiveSidebar] = useState("preview");
  const [receipt, setReceipt] = useState(`receipt_${Date.now()}`);
  const [readyDownload, setReadyDownload] = useState(false);
  const [downlaodText, setDownloadText] = useState(ediText);
  const [savebutton, setsavebutton] = useState(true);
  const [chatbotDisplay, setchatbotDisplay] = useState(true);
  const [chatbotDisplay2, setchatbotDisplay2] = useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const [chatbotSwitch, setchatbotSwitch] = React.useState(true);
  const [customerType, setCustomerType] = useState("");
  const [showMore1, setshowMore1] = useState(false);
  const [showMore2, setshowMore2] = useState(false);
  const [pageNo, setPageNo] = useState(0);
  const [noOfPages, setnoOfPages] = useState(0);
  const [payemnetComplete, setpayemnetComplete] = useState(false);
  const [Hour, setHour] = useState(null);
  const [faqLoading, setFaqLOading] = useState(false);
  const [price, setPrice] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    query: "",
    comments: "",
    hour: null,
    enddate: null,
    startdate: null,
    date: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(formData);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick2 = async (event) => {
    setAnchorEl2(event.currentTarget);
    setFaqLOading(true);
    const res = await axios.post(
      `${NODE_API_ENDPOINT}/ai-drafter/anomaly_questions`,
      { doc_id: doc_id }
    );
    let data = [];
    var ques = res.data.data.fetcheAnomalyQuestions.anomaly_questions;
    Object.keys(ques).forEach((i) => {
      const obj = {
        title: i,
        data: ques[i],
      };
      data.push(obj);
    });
    setfaqData(data);
    setFaqLOading(false);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const open2 = Boolean(anchorEl2);
  const id2 = open2 ? "simple-popover" : undefined;

  console.log(doc_id);
  let count = 0;
  useEffect(() => {
    // console.log(ediText);
    if (ediText != null) {
      var data = ediText
        .replaceAll("\\\\n\\\\n", "<br/>")
        .replaceAll("\\\\n", "<br/>")
        .replaceAll("\\n\\n", "<br/>")
        .replaceAll("\\n", "<br/>")
        .replaceAll("\n", "<br/>")
        .replaceAll("\\", "")
        .replaceAll('"', "")
        .replaceAll(":", " :")
        .replaceAll("#", "")
        .replaceAll(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replaceAll("u20b9", "₹")
        .replaceAll(/\*([^*]+)\*/g, "<strong>$1</strong>")
        .replace(/\\u20B9/g, "₹")
        .replace(/\u20B9/g, "₹");
    }
    setText(data);
  }, [ediText]);

  useEffect(() => {
    if (isGenerateDocCall) {
      breakoutFunc();
    }
  }, []);

  const handleEditClick = () => {
    setActiveSidebar("edit");
  };

  const handlePreviewClick = () => {
    localStorage.setItem("SummaryPath", "/DocPreview");
    navigate("/summary");
  };

  const handleSave = () => {
    navigate("/Snippets");
  };

  const breakoutFunc = async () => {
    // setLoading(true);
    setsavebutton(false);
    try {
      const res = await breakout(doc_id, currentUser.jwt);

      if ((res.status = 204)) {
        setsavebutton(true);
      }
      dispatch(setBreakoutData(res.data));
      await axios.post(
        `${NODE_API_ENDPOINT}/ai-drafter/generate_db`,
        {
          doc_id: doc_id,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.jwt}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (e) {
      console.log("breakout failed", e);
    } finally {
      setLoading(false);
      dispatch(setIsGenerateDocCalledFalse());
    }
  };
  const handlepdfdownload = async () => {
    // setLoading(true);
    try {
      const sendableDoc = ediText
        .replaceAll("\\\\n\\\\n", "\n  \n")
        .replaceAll("\\\\n", "\n")
        .replaceAll("\\n\\n", "\n \n")
        .replaceAll("\\n", "\n")
        .replaceAll("\n", "\n")
        .replaceAll("\\", "")
        .replaceAll('"', "")
        .replaceAll(":", " :")
        .replaceAll("#", "")
        .replaceAll('"', "");
      const response = await fetch(
        `${NODE_API_ENDPOINT}/ai-drafter/api/get_pdf`,
        {
          // Replace with your backend URL
          method: "POST",

          headers: {
            Authorization: `Bearer ${currentUser.jwt}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ document: sendableDoc }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      // Assuming the backend sends the PDF as a blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Create a link to download the PDF
      const a = document.createElement("a");
      a.href = url;
      a.download = "Document.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setLoading(false);
    }
  };
  let temp =
    'Here is a detailed Lease Agreement customized based on the provided details:\n\nLEASE AGREEMENT\n\nThis Lease Agreement is made and entered into on [DATE] by and between:\n\nLessor: [LESSOR\'S NAME], having its registered office at [LESSOR\'S ADDRESS] (hereinafter referred to as the "Lessor")\n\nAND\n\nLessee: [LESSEE\'S NAME], having its registered office at [LESSEE\'S ADDRESS] (hereinafter referred to as the "Lessee")\n\nDESCRIPTION OF PREMISES\nThe Lessor hereby leases to the Lessee the following property: [DETAILED DESCRIPTION OF LEASED PREMISES, INCLUDING ADDRESS, LEGAL DESCRIPTION, AND ANY UNIQUE IDENTIFIERS]. The leased premises is more particularly described and depicted in the attached Schedule A, which is incorporated herein by reference.\n\nLEASE TERM\nThe term of this Lease shall be for a period of [X] years, commencing on [START DATE] and ending on [END DATE] (the "Lease Term"), unless sooner terminated as provided herein. The Lessee shall have the option to renew this Lease for an additional [X] year term, subject to the terms and conditions set forth in the "Renewal" section below.\n\nMONTHLY RENT\nThe Lessee shall pay to the Lessor a monthly rent of Rs. [AMOUNT] (the "Monthly Rent"). The Monthly Rent shall be due and payable on the [DAY] day of each calendar month during the Lease Term.\n\nPAYMENT TERMS\nThe Lessee shall pay the Monthly Rent and all other sums due under this Lease in advance, without demand, deduction, or offset. Payments shall be made by [PAYMENT METHOD, e.g., check, electronic transfer, etc.]. A late fee of [X]% of the Monthly Rent shall be charged for any payment received after the [DAY] day of the month. In the event of non-payment, the Lessor shall have the right to terminate this Lease in accordance with the "Termination" section below.\n\nSECURITY DEPOSIT\nUpon execution of this Lease, the Lessee shall pay to the Lessor a security deposit in the amount of Rs. [AMOUNT] (the "Security Deposit"). The Security Deposit shall be held by the Lessor as security for the faithful performance by the Lessee of all the terms, covenants, and conditions of this Lease. The Security Deposit shall be returned to the Lessee, without interest, within [X] days after the expiration or earlier termination of this Lease, provided that the Lessee has fully performed all of its obligations under this Lease.\n\nUSE OF PROPERTY\nThe Lessee shall use and occupy the leased premises solely for the purpose of [PERMITTED USE] and for no other purpose without the prior written consent of the Lessor. The Lessee shall not use the leased premises for any unlawful or hazardous purpose, and shall comply with all applicable laws, rules, and regulations governing the use and occupation of the property.\n\nMAINTENANCE AND REPAIRS\nThe Lessee shall, at its own cost and expense, keep and maintain the leased premises in good condition and repair, including all structural and non-structural components, and shall make all necessary repairs and replacements. The Lessor shall be responsible for any major structural repairs to the building, provided that such repairs are not necessitated by the Lessee\'s negligence or misuse of the premises. The Lessee shall promptly notify the Lessor of any needed repairs or maintenance.\n\nUTILITIES AND SERVICES\nThe Lessee shall be responsible for the payment of all utility services provided to the leased premises, including but not limited to electricity, water, gas, telephone, internet, and any other services. The Lessee shall also be responsible for the payment of all applicable taxes, fees, and other charges associated with the use and occupation of the property.\n\nTERMINATION\nEither party may terminate this Lease by providing the other party with [X] months\' prior written notice. The Lessor shall have the right to terminate this Lease immediately upon the occurrence of any of the following events: (i) the Lessee\'s failure to pay the Monthly Rent or any other sums due hereunder, (ii) the Lessee\'s breach of any other term, covenant, or condition of this Lease, or (iii) the Lessee\'s insolvency, bankruptcy, or assignment for the benefit of creditors.\n\nRENEWAL\nUpon the expiration of the initial Lease Term, the Lessee shall have the option to renew this Lease for an additional [X] year term, provided that the Lessee gives the Lessor written notice of its intent to renew at least [X] months prior to the expiration of the current Lease Term. The Monthly Rent for the renewal term shall be increased by [X]% of the current Monthly Rent.\n\nINSURANCE\nThe Lessee shall, at its own cost and expense, maintain a comprehensive general liability insurance policy with limits of not less than Rs. [AMOUNT] per occurrence and Rs. [AMOUNT] in the aggregate, naming the Lessor as an additional insured. The Lessee shall also maintain property insurance covering the leased premises and all of the Lessee\'s personal property located therein.\n\nSETTLEMENT\nUpon the expiration or earlier termination of this Lease, the Lessee shall surrender the leased premises in the same condition as it was at the commencement of the Lease Term, ordinary wear and tear excepted. The Lessor shall have the right to deduct from the Security Deposit any amounts necessary to repair any damage to the leased premises or to clean the premises. Any remaining balance of the Security Deposit shall be returned to the Lessee within [X] days of the termination or expiration of this Lease.\n\nGOVERNING LAW\nThis Lease Agreement shall be governed by and construed in accordance with the laws of the [STATE/PROVINCE] of [NAME]. The parties agree to submit to the exclusive jurisdiction of the courts of [CITY/JURISDICTION] for the resolution of any disputes arising under this Lease.\n\nENTIRE AGREEMENT\nThis Lease Agreement, including the attached Schedule A, constitutes the entire agreement between the parties and supersedes all prior agreements, understandings, and negotiations, whether oral or written, with respect to the subject matter hereof. This Lease may be amended or modified only by a written instrument signed by both the Lessor and the Lessee.\n\nMISCELLANEOUS\nThis Lease Agreement shall be binding upon and inure to the benefit of the parties hereto and their respective heirs, successors, and permitted assigns. If any provision of this Lease is found to be invalid or unenforceable, the remaining provisions shall continue to be valid and enforceable. This Lease may be executed in counterparts, each of which shall be deemed an original, and all of which together shall constitute one and the same instrument.\n\nIN WITNESS WHEREOF, the parties have executed this Lease Agreement as of the date first written above.\n\nLESSOR:\n[LESSOR\'S NAME]\n\nBy: _____________________________\nName: [NAME]\nTitle: [TITLE]\n\nLESSEE:\n[LESSEE\'S NAME]\n\nBy: _____________________________\nName: [NAME]\nTitle: [TITLE]\n\nWITNESSES:\n1. _____________________________\nName: [NAME]\n\n2. _____________________________\nName: [NAME]\n\nNOTARY PUBLIC:\n_____________________________\nName: [NAME]\nSeal:';

  const setSwitch = (e) => {
    // console.log("asdas")
    setchatbotSwitch(false);
  };

  const handleNext1 = (e) => {
    e.preventDefault();
    setPageNo(1);
  };

  const handleNext2 = (e) => {
    if (formData.startdate == null || formData.date == null) {
      toast.error("select a date and a hour");
      return;
    }

    setPageNo(3);
  };

  const handleDateChange = (date, date2, i) => {
    setFormData({ ...formData, ["enddate"]: date2, ["startdate"]: date });
    setHour(i);
    console.log(formData);
  };

  const rows = [];
  for (let i = 0; i < 20; i++) {
    const time = 10 + Number((i / 2).toFixed());
    const time1 = 10 + Number(((i + 1) / 2).toFixed());

    rows.push(
      <div
        onClick={() =>
          handleDateChange(
            time + ":" + `${i % 2 == 0 ? "30" : "00"}:00`,
            time1 + ":" + `${(i + 1) % 2 == 0 ? "30" : "00"}:00`,
            i
          )
        }
        className={`border  text-center cursor-pointer ${
          Hour == i ? "border-green-400" : "border-white"
        }  rounded p-1`}
      >
        <span className="rounded">
          {time + ":" + `${i % 2 == 0 ? "30" : "00"}`}
        </span>
      </div>
    );
  }

  const handleRazorpay = async (event) => {
    // Prevent page refresh
    if (event) event.preventDefault();
    try {
      console.log("Loading Razorpay...");
      // setLoading(true);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onerror = () => {
        // setLoading(false);
        alert(
          "Failed to load Razorpay SDK. Please check your internet connection."
        );
      };

      script.onload = async () => {
        console.log("Razorpay script loaded successfully");

        try {
          let amountdata = 0;

          if (showMore1) {
            amountdata =
              699 + (noOfPages < 20 ? noOfPages * 200 : noOfPages * 100);
          } else {
            amountdata = noOfPages < 20 ? noOfPages * 200 : noOfPages * 100;
          }

          const result = await axios.post(
            `${NODE_API_ENDPOINT}/payment/talk-to-expert-createOrder`,
            {
              amount: amountdata,
              currency: "INR",
              receipt: receipt,
            }
          );

          if (!result || !result.data.razorpayOrder) {
            throw new Error("Failed to create Razorpay order");
          }

          const { amount, id, currency } = result.data.razorpayOrder;

          const options = {
            key: "rzp_test_UWcqHHktRV6hxM",
            amount: String(amount),
            currency,
            name: "CLAW LEGALTECH PRIVATE LIMITED",
            description: "Transaction",
            order_id: id,
            handler: async (response) => {
              try {
                console.log("Payment response:", response);

                const data = {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  phoneNumber: currentUser?.phoneNumber,
                  meetingData: {
                    doc_id: doc_id,
                    User_name: formData.name,
                    email_id: formData.email,
                    contact_no: formData.mobile,
                    meeting_date: formData.date,
                    start_time: formData.startdate,
                    end_time: formData.enddate,
                    user_query: formData.query,
                    additional_details: formData.comments,
                    number_of_pages: noOfPages,
                    customer_type: customerType,
                  },
                };

                const verificationResult = await axios.post(
                  `${NODE_API_ENDPOINT}/payment/talk-to-expert-verifyOrder`,
                  data
                );

                console.log(verificationResult);

                alert(verificationResult.data.data.fetchedMeeting);
                // setPaymentVerified(true);
                // dispatch(retrieveActivePlanUser());
              } catch (error) {
                console.error("Order verification failed:", error);
                alert("Payment verification failed. Please contact support.");
              } finally {
                // setLoading(false);
              }
            },
            prefill: {
              name: currentUser?.name,
              email: currentUser?.email,
              contact: currentUser?.phoneNumber,
            },
            theme: {
              color: "#3399cc",
            },
          };

          const paymentObject = new window.Razorpay(options);
          paymentObject.open();
        } catch (error) {
          console.error("Error during Razorpay initialization:", error);
          alert("Payment process failed. Please try again.");
        } finally {
          // setLoading(false);
        }
      };

      document.body.appendChild(script);
    } catch (error) {
      console.error("Unexpected error in handleRazorpay:", error);
      // setLoading(false);
    }
  };

  // const handleRazorpay = async () => {
  //   console.log("hi");
  //   const script = document.createElement("script");
  //   script.src = "https://checkout.razorpay.com/v1/checkout.js";
  //   script.onerror = () => {
  //     setLoading(false);
  //     alert("Razorpay SDK failed to load. Are you online?");
  //   };
  //   script.onload = async () => {
  //     console.log("hi");

  //     try {
  //       let amountdata = 0;
  //       if (showMore1) {
  //         amountdata =
  //           699 + (noOfPages < 20 ? noOfPages * 200 : noOfPages * 100);
  //       } else {
  //         amountdata = noOfPages < 20 ? noOfPages * 200 : noOfPages * 100;
  //       }

  //       const result = await axios.post(
  //         `${NODE_API_ENDPOINT}/payment/talk-to-expert-createOrde`,
  //         {
  //           amount: amountdata,
  //           currency: "INR",
  //           receipt: receipt,
  //         }
  //       );

  //       console.log(result);

  //       const { amount, id, currency } = result.data.razorpayOrder;
  //       const { _id } = result.data.createdOrder;

  //       const options = {
  //         key: "rzp_test_UWcqHHktRV6hxM",
  //         amount: String(amount),
  //         currency: currency,
  //         name: "CLAW LEGALTECH PRIVATE LIMITED",
  //         description: "Transaction",
  //         order_id: id,
  //         handler: async function (response) {
  //           console.log(response);
  //           const createdAt = new Date(paymentDetails?.createdAt);
  //           const resultDate = new Date(createdAt);
  //           const data = {
  //             razorpay_order_id: response.razorpay_order_id,
  //             razorpay_payment_id: response.razorpay_payment_id,
  //             razorpay_signature: response.razorpay_signature,
  //             phoneNumber: formData.phoneNumber,
  //             meetingData: {
  //               doc_id: doc_id,
  //               User_name: formData.name,
  //               email_id: formData.email,
  //               contact_no: formData.mobile,
  //               meeting_date: formData.date,
  //               start_time: formData.startdate,
  //               end_time: formData.enddate,
  //               user_query: formData.query,
  //               additional_details: formData.comments,
  //               number_of_pages: noOfPages,
  //               customer_type: customerType,
  //             },
  //             // refferalCode: paymentDetails?.refferalCode,
  //             // couponCode: paymentDetails?.couponCode,
  //             // existingSubscription: paymentDetails?.existingSubscription,
  //             // // amount: paymentDetails?.refundAmount
  //             // //   ? paymentDetails?.refundAmount
  //             // //   : paymentDetails?.totalPrice,
  //             // amount: paymentDetails?.totalPrice,
  //             // trialDays: paymentDetails?.trialDays,
  //           };

  //           console.log(response);

  //           const result = await axios.post(
  //             `${NODE_API_ENDPOINT}/payment/talk-to-expert-verifyOrder`,
  //             data
  //           );
  //           alert(result.data.status);
  //           setLoading(false);
  //           setPaymentVerified(true);
  //           dispatch(retrieveActivePlanUser());
  //         },
  //         prefill: {
  //           name: currentUser?.name,
  //           email: currentUser?.email,
  //           contact: currentUser?.phoneNumber,
  //         },
  //         theme: {
  //           color: "#3399cc",
  //         },
  //       };

  //       console.log(options);

  //       const paymentObject = new window.Razorpay(options);

  //       console.log(paymentObject);
  //       paymentObject.open();
  //     } catch (error) {
  //       setLoading(false);
  //       alert(error.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  // };

  const handlesubmitchatbot = async () => {
    try {
      const requestBody = {
        doc_id: doc_id,
        User_name: formData.name,
        email_id: formData.email,
        contact_no: formData.mobile,
        meeting_date: formData.date,
        start_time: formData.startdate,
        end_time: formData.enddate,
        user_query: formData.query,
        additional_details: formData.comments,
        number_of_pages: "10",
        customer_type: customerType,
      };
      const res = await axios.post(
        `${NODE_API_ENDPOINT}/ai-drafter/api/telegram_bot`,
        requestBody
      );
      console.log(res);
      if ((res.status = 200)) {
        setpayemnetComplete(true);
      }
    } catch (e) {}
  };

  const chatbotData = [
    <div className="h-96 overflow-auto scrollbar-hide">
      <p className="text-sm  mb-2">
        Talk to an Expert Lawyer at your convenient time by entering some
        important details below
      </p>
      <form onSubmit={handleNext1} className="text-sm bg-white p-2 rounded-md">
        <div className="mb-2 text-xs">
          <input
            type="text"
            required
            value={formData.name}
            name="name"
            onChange={handleChange}
            placeholder="Enter Your Full Name"
            className="w-full p-2 rounded-md bg-[#004343] text-white placeholder-gray-400"
          />
        </div>
        <div className="mb-2">
          <input
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            name="email"
            placeholder="Enter Your Email ID"
            className="w-full p-2 rounded-md bg-[#004343] text-white placeholder-gray-400"
          />
        </div>
        <div className="mb-2">
          <input
            type="text"
            required
            value={formData.mobile}
            name="mobile"
            onChange={handleChange}
            placeholder="Enter Your Mobile Number"
            className="w-full p-2 rounded-md bg-[#004343] text-white placeholder-gray-400"
          />
        </div>
        <div className="mb-2">
          <input
            type="text"
            name="query"
            required
            value={formData.query}
            onChange={handleChange}
            placeholder="Put Your Query Heading"
            className="w-full p-2 rounded-md bg-[#004343] text-white placeholder-gray-400"
          />
        </div>
        <div className="mb-2">
          <textarea
            required
            value={formData.comments}
            name="comments"
            onChange={handleChange}
            placeholder="Specify Your Query or Add any Additional Comments"
            className="w-full p-2 rounded-md bg-[#004343] text-white placeholder-gray-400 resize-none"
            rows="4"
          ></textarea>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="w-[50%]  bg-logo-gradient p-2 rounded-md text-white font-semibold hover:bg-teal-700"
          >
            Next
          </button>
        </div>
      </form>
    </div>,
    <div className="h-96 overflow-auto scrollbar-hide">
      <p className="text-sm  mb-3">
        Talk to an Expert Lawyer at your convenient time by entering some
        important details below
      </p>

      <div className="text-[10px] mb-20 flex flex-col gap-3 bg-white p-2 rounded-md">
        <div className="flex p-4 bg-[#004343] rounded-lg">
          <input
            type="date"
            name="date"
            onChange={handleChange}
            className="bg-[#004343] w-full text-sm text-white focus:outline-none"
          ></input>
        </div>
        <Accordion
          style={{
            backgroundColor: "#004343",
            font: "",
            boxShadow: "0px",
            "border-radius": "5px",
          }}
          className=" rounded-md bg-[#004343]"
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon className="text-white" />}
            aria-controls="panel1-content"
            id="panel1-header"
            style={{
              backgroundColor: "rgba(34, 34, 34,",
              // backgroundColor:"rgba(34, 34, 34, 0.8)",
              fontSize: 14,
              boxShadow: "0px",
              color: "white",
            }}
          >
            Select A Time Slot
          </AccordionSummary>
          <AccordionDetails>
            <div className="grid text-xs text-white grid-cols-4 gap-1">
              {rows.map((val) => val)}
            </div>
          </AccordionDetails>
        </Accordion>

        <div className="flex justify-end">
          <button
            onClick={handleNext2}
            className="w-[50%]   bg-logo-gradient p-2 rounded-md text-white font-semibold hover:bg-teal-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>,
    <div className="h-96 overflow-auto scrollbar-hide">
      <p className="text-sm  mb-2">
        Talk to an Expert Lawyer at your convenient time by entering some
        important details below
      </p>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3  p-4 rounded-md bg-[#004343]">
          <div className="text-[15px] font-bold">
            Talk To An Dedicated Expert
          </div>
          <div>
            <ul className="list-disc text-xs list-inside">
              <li>1 : 1 Interaction with A Top Lawyer</li>
              <li>Dedicated Time Slot</li>
              <li>All Legal Query Consultation</li>
              <li>Other Legal Document Consultation</li>
            </ul>
          </div>
          {showMore2 && (
            <>
              <div className="text-[15px] font-bold">
                Document Generated ByAdira AI
              </div>
              <div>
                <ul className="list-disc text-xs list-inside">
                  <li>1:1 Consultation on Document Generated</li>
                  <li>Legal Advice & Doubt Clearance Document</li>
                  <li>Related Query Solving</li>
                </ul>
              </div>
            </>
          )}
          <div className="text-right">
            {!showMore2 ? (
              <>
                <span className="text-[15px] font-bold">₹ 699 </span>
                <span className="text-xs "> / slot</span>
              </>
            ) : (
              <>
                <span className="text-[15px] font-bold">
                  ₹ {699 + (noOfPages < 20 ? noOfPages * 200 : noOfPages * 100)}
                </span>
                <span className="text-xs "> / slot</span>
              </>
            )}
          </div>
        </div>
        <div
          onClick={() => {
            setCustomerType("consulting");
            handleRazorpay();
            // handlesubmitchatbot();
          }}
          className="text-center cursor-pointer p-3 font-bold bg-logo-gradient rounded"
        >
          Proceed with Booking
        </div>
        {!showMore2 && (
          <div className="flex gap-3">
            <div className="w-2/3 text-xs">
              Consultation on Document Generated by ADIRA AI
            </div>
            <button
              onMouseDown={async () => {
                setCustomerType(
                  "consulting and vetting of document generated by Adira"
                );

                setshowMore2(true);
              }}
              className="flex text-xs items-center gap-2 rounded border justify-center  w-1/3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="8"
                height="8"
                viewBox="0 0 8 8"
                fill="none"
              >
                <path
                  d="M7.33333 3.33333H4.66667V0.666667C4.66667 0.489856 4.59643 0.320287 4.4714 0.195262C4.34638 0.070238 4.17681 0 4 0C3.82319 0 3.65362 0.070238 3.5286 0.195262C3.40357 0.320287 3.33333 0.489856 3.33333 0.666667V3.33333H0.666667C0.489856 3.33333 0.320287 3.40357 0.195262 3.5286C0.070238 3.65362 0 3.82319 0 4C0 4.17681 0.070238 4.34638 0.195262 4.4714C0.320287 4.59643 0.489856 4.66667 0.666667 4.66667H3.33333V7.33333C3.33333 7.51014 3.40357 7.67971 3.5286 7.80474C3.65362 7.92976 3.82319 8 4 8C4.17681 8 4.34638 7.92976 4.4714 7.80474C4.59643 7.67971 4.66667 7.51014 4.66667 7.33333V4.66667H7.33333C7.51014 4.66667 7.67971 4.59643 7.80474 4.4714C7.92976 4.34638 8 4.17681 8 4C8 3.82319 7.92976 3.65362 7.80474 3.5286C7.67971 3.40357 7.51014 3.33333 7.33333 3.33333Z"
                  fill="white"
                />
              </svg>
              <span>Add</span>
            </button>
          </div>
        )}
      </div>
    </div>,
    <div className="h-96 overflow-auto scrollbar-hide">
      <p className="text-sm  mb-2">
        Choose one option from the below available facililties :
      </p>
      <div className="flex flex-col gap-3">
        <div
          onClick={() => setPageNo(4)}
          className="flex cursor-pointer flex-col border-2 border-white p-2 rounded bg-teal-900"
        >
          <div className="text-white  text-sm font-bold border-b-2 pb-1">
            Document Related Consultation
          </div>
          <div className="text-white pt-1 text-xs  ">
            For Consultation with our Expert on Legal Documents that you
            generated or might want to have.
          </div>
        </div>
        <div
          onClick={() => {
            setCustomerType("consulting");
            setPageNo(2);
          }}
          className="flex flex-col cursor-pointer border-2 border-white p-2 rounded bg-teal-900"
        >
          <div className="text-white text-sm font-bold border-b-2 pb-1">
            Basic Legal Consultation
          </div>
          <div className="text-white pt-1 text-xs ">
            For Consultation with our Expert on Legal Matters that of any type
            and gain legal advice on topics of your choice
          </div>
        </div>
      </div>
      <div className="pb-[100px]"></div>
    </div>,
    <div className="h-96 overflow-auto scrollbar-hide">
      <div className="flex flex-col gap-1">
        <p>Document Related Consultation</p>
        <p className="text-xs  mb-4">
          For Consultation with our Expert on Legal Documents that you generated
          or might want to have.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3  p-4 rounded-md bg-[#004343]">
          <div className="text-[15px] font-bold">
            Document Generated By Adira AI
          </div>
          <div>
            <ul className="list-disc text-xs list-inside">
              <li>1:1 Consultation on Document Generated</li>
              <li>Legal Advice & Doubt Clearance Document</li>
              <li>Related Query Solving</li>
            </ul>
          </div>
          <div
            onClick={async () => {
              setCustomerType("only vetting of document generated by Adira");
              const res = await axios.post(
                `${NODE_API_ENDPOINT}/ai-drafter/api/get_pdf_count`,
                {
                  document: ediText,
                }
              );
              console.log(res);
              const pages = res.data.no_of_pages;
              setnoOfPages(pages);
              setPageNo(5);
            }}
            className="text-center cursor-pointer text-[15px] p-2 border-2 py-1 rounded-md bg-logo-gradient"
          >
            Proceed
          </div>
        </div>
        <div className="flex flex-col gap-3  p-4 rounded-md bg-[#004343]">
          <div className="text-[15px] font-bold">
            Consultation on an ExistingLegal Document
          </div>
          <div>
            <ul className="list-disc text-xs list-inside">
              <li>Legal Document Analysis</li>
              <li>Legal Advice & Doubt Clearance</li>
              <li>Legal Document Update Assistance</li>
            </ul>
          </div>
          <div
            onClick={() => {
              setCustomerType("consulting");
              setPageNo(2);
            }}
            className="text-center cursor-pointer text-[15px] p-2 border-2 py-1 rounded-md bg-logo-gradient"
          >
            Proceed
          </div>
        </div>
      </div>
    </div>,
    <div className="h-96 overflow-auto scrollbar-hide">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3  p-4 rounded-md bg-[#004343]">
          <div className="text-[15px] font-bold">
            Document Generated By Adira AI
          </div>
          <div>
            <ul className="list-disc text-xs list-inside">
              <li>1:1 Consultation on Document Generated</li>
              <li>Legal Advice & Doubt Clearance Document</li>
              <li>Related Query Solving</li>
            </ul>
          </div>
          {showMore1 && (
            <>
              <div className="text-[15px] font-bold">
                Talk To An Dedicated Expert
              </div>
              <div>
                <ul className="list-disc text-xs list-inside">
                  <li>1 : 1 Interaction with A Top Lawyer</li>
                  <li>Dedicated Time Slot</li>
                  <li>All Legal Query Consultation</li>
                  <li>Other Legal Document Consultation</li>
                </ul>
              </div>
            </>
          )}
          <div
            title="Plan Explaination :
₹ 200 / Page  for Total Pages upto 20
₹ 100  /  Page for Pages More Than 20"
            className="flex flex-row justify-between items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
            >
              <path
                d="M7.5 15C3.375 15 0 11.625 0 7.5C0 3.375 3.375 0 7.5 0C11.625 0 15 3.375 15 7.5C15 11.625 11.625 15 7.5 15ZM7.5 1.25C4.0625 1.25 1.25 4.0625 1.25 7.5C1.25 10.9375 4.0625 13.75 7.5 13.75C10.9375 13.75 13.75 10.9375 13.75 7.5C13.75 4.0625 10.9375 1.25 7.5 1.25Z"
                fill="white"
              />
              <path
                d="M6.87472 11.25C6.62472 11.25 6.43722 11.125 6.24972 10.9375C5.93722 10.5 6.18722 9.875 6.87472 8.1875C6.99972 7.9375 7.12472 7.625 7.24972 7.375C6.99972 7.5625 6.62472 7.5625 6.37472 7.3125C6.12472 7.0625 6.12472 6.6875 6.37472 6.4375C6.49972 6.375 7.24972 5.625 8.12472 5.625C8.37472 5.625 8.56222 5.75 8.74972 5.9375C9.06222 6.375 8.81222 7 8.12472 8.6875C7.99972 8.9375 7.87472 9.25 7.74972 9.5C7.99972 9.3125 8.37472 9.3125 8.62472 9.5625C8.87472 9.8125 8.87472 10.1875 8.62472 10.4375C8.49972 10.5 7.74972 11.25 6.87472 11.25Z"
                fill="white"
              />
              <path
                d="M8.4375 4.99976C8.95527 4.99976 9.375 4.58002 9.375 4.06226C9.375 3.54449 8.95527 3.12476 8.4375 3.12476C7.91973 3.12476 7.5 3.54449 7.5 4.06226C7.5 4.58002 7.91973 4.99976 8.4375 4.99976Z"
                fill="white"
              />
              <path
                d="M8.43774 5.3125C7.75024 5.3125 7.18774 4.75 7.18774 4.0625C7.18774 3.375 7.75024 2.8125 8.43774 2.8125C9.12524 2.8125 9.68774 3.375 9.68774 4.0625C9.68774 4.75 9.12524 5.3125 8.43774 5.3125ZM8.43774 3.4375C8.06274 3.4375 7.81274 3.6875 7.81274 4.0625C7.81274 4.4375 8.06274 4.6875 8.43774 4.6875C8.81274 4.6875 9.06274 4.4375 9.06274 4.0625C9.06274 3.6875 8.81274 3.4375 8.43774 3.4375Z"
                fill="white"
              />
            </svg>
            <div>
              {!showMore1 ? (
                <>
                  <span className="text-[15px] font-bold">
                    ₹ {noOfPages < 20 ? noOfPages * 200 : noOfPages * 100}
                  </span>
                  <span className="text-xs "> / slot</span>
                </>
              ) : (
                <>
                  <span className="text-[15px] font-bold">
                    ₹{" "}
                    {699 + (noOfPages < 20 ? noOfPages * 200 : noOfPages * 100)}
                  </span>
                  <span className="text-xs "> / slot</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div
          onClick={() => {
            handleRazorpay();
            // handlesubmitchatbot();
          }}
          className="text-center cursor-pointer p-3 font-bold bg-logo-gradient rounded"
        >
          Proceed with Booking
        </div>
        {!showMore1 && (
          <div className="flex items-center gap-3">
            <div className="w-2/3 text-xs">
              Basic Consultation on Legal Matters
            </div>

            <button
              onClick={() => {
                setCustomerType(
                  "consulting and vetting of document generated by Adira"
                );
                setshowMore1(true);
              }}
              className="flex text-xs items-center gap-2 rounded border justify-center  w-1/3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="8"
                height="8"
                viewBox="0 0 8 8"
                fill="none"
              >
                <path
                  d="M7.33333 3.33333H4.66667V0.666667C4.66667 0.489856 4.59643 0.320287 4.4714 0.195262C4.34638 0.070238 4.17681 0 4 0C3.82319 0 3.65362 0.070238 3.5286 0.195262C3.40357 0.320287 3.33333 0.489856 3.33333 0.666667V3.33333H0.666667C0.489856 3.33333 0.320287 3.40357 0.195262 3.5286C0.070238 3.65362 0 3.82319 0 4C0 4.17681 0.070238 4.34638 0.195262 4.4714C0.320287 4.59643 0.489856 4.66667 0.666667 4.66667H3.33333V7.33333C3.33333 7.51014 3.40357 7.67971 3.5286 7.80474C3.65362 7.92976 3.82319 8 4 8C4.17681 8 4.34638 7.92976 4.4714 7.80474C4.59643 7.67971 4.66667 7.51014 4.66667 7.33333V4.66667H7.33333C7.51014 4.66667 7.67971 4.59643 7.80474 4.4714C7.92976 4.34638 8 4.17681 8 4C8 3.82319 7.92976 3.65362 7.80474 3.5286C7.67971 3.40357 7.51014 3.33333 7.33333 3.33333Z"
                  fill="white"
                />
              </svg>
              <span className="py-1">Add</span>
            </button>
          </div>
        )}
      </div>
    </div>,
  ];
  return (
    <main className="h-screen font-sans w-full">
      <section className="flex flex-col p-5 space-y-5 items-center w-full h-full">
        {/* Navbar */}
        <div className="w-full justify-between items-center flex flex-row">
          <NavbarRight />
          <NavbarLeft />
        </div>

        <div className="flex flex-row w-full space-x-5  rounded-md h-[90%] justify-center items-start">
          <div className="flex flex-col bg-customBlack rounded-md w-[70%] h-full space-y-5 justify-between p-5">
            <div className="flex-1 h-full overflow-auto border-white bg-card-gradient flex flex-col justify-center  items-center border-2 rounded-md w-full">
              {loading ? (
                <img
                  className="flex flex-row justify-center items-center w-40 h-40"
                  src={loaderGif}
                  alt="Loading..."
                />
              ) : (
                <p
                  className=" text-sm hide-scrollbar p-2 h-full w-full overflow-y-auto overflow-wrap break-word word-wrap break-word"
                  // rehypePlugins={[rehypeRaw]}
                  dangerouslySetInnerHTML={{
                    __html: text,

                    // .replace(/\\n/, "<br></br>")
                    // .replace(/\\n\\n/, "<br></br><br></br>"),
                    // .replace(/\\/g, "") ,
                  }}
                >
                  {/* {trimQuotes(
                    formatText(
                      text
                        .replace(/\u20B9/g, "₹")
                        .replace(/\\n/, "<br></br>")
                        .replace(/\\n\\n/, "<br></br><br></br>")
                      // .replace(/\\/g, "")
                    )
                  )} */}
                </p>
              )}
            </div>
            <div className="flex flex-row  justify-between">
              <div className="flex gap-3">
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  sx={{
                    "& .MuiPaper-root": {
                      borderRadius: "1rem",
                    },
                    "& .MuiPaper-root::-webkit-scrollbar": {
                      display: "none",
                    },
                  }}
                  className="flex w-[30%] bg-transparent overflow-auto hide-scrollbar   rounded-2xl  "
                >
                  {!payemnetComplete ? (
                    // <div className="p-4 rounded-2xl flex overflow-auto flex-col hide-scrollbar gap-4  bg-btn-gradient">
                    <div className="max-w-sm mx-auto h-full flex flex-col gap-3 hide-scrollbar bg-[#00232F] border-2 border-[#00A9AB]  text-white rounded-2xl p-6 shadow-lg">
                      <div className="flex border-b-2 border-b-[#004343] pb-2 justify-around flex-row gap-2 scrollbar-hide  items-center ">
                        <img src={chatbot} alt="" />

                        <h2 className="text-[15px] scrollbar-hide font-semibold">
                          How Can We Help You Today ?
                        </h2>
                        {pageNo != 0 ? (
                          <div
                            onClick={() => {
                              const page = pageNo - 1 >= 0 ? pageNo - 1 : 0;
                              setPageNo(page);
                            }}
                            className="cursor-pointer h-6 w-6 mt-[2px] p-1 border-2 border-white rounded-full"
                          >
                            <img src={Back} alt="back" />
                          </div>
                        ) : (
                          ""
                        )}
                        <Close
                          onClick={handleClose}
                          className="cursor-pointer"
                        />
                      </div>
                      {/* <hr className="bg-[#004343] border border-[#004343]" /> */}

                      {chatbotData[pageNo]}
                      {/* <form className="text-[10px] bg-white p-2 rounded-md">
                      <div className="mb-2 text-xs">
                        <input
                          type="text"
                          placeholder="Enter Your Full Name"
                          className="w-full p-2 rounded-md bg-[#004343] text-white placeholder-gray-400"
                        />
                      </div>
                      <div className="mb-2">
                        <input
                          type="email"
                          placeholder="Enter Your Email ID"
                          className="w-full p-2 rounded-md bg-[#004343] text-white placeholder-gray-400"
                        />
                      </div>
                      <div className="mb-2">
                        <input
                          type="text"
                          placeholder="Enter Your Mobile Number"
                          className="w-full p-2 rounded-md bg-[#004343] text-white placeholder-gray-400"
                        />
                      </div>
                      <div className="mb-2">
                        <input
                          type="text"
                          placeholder="Put Your Query Heading"
                          className="w-full p-2 rounded-md bg-[#004343] text-white placeholder-gray-400"
                        />
                      </div>
                      <div className="mb-2">
                        <textarea
                          placeholder="Specify Your Query or Add any Additional Comments"
                          className="w-full p-2 rounded-md bg-[#004343] text-white placeholder-gray-400 resize-none"
                          rows="4"
                        ></textarea>
                      </div>
                      <div className="flex justify-end">

                        <button
                          type="submit"
                          className="w-[50%]  bg-logo-gradient p-2 rounded-md text-white font-semibold hover:bg-teal-700"
                        >
                          Next
                        </button>
                      </div>
                    </form> */}
                      {/* </div> */}
                      {/* 
                  <div onclick={() => console.log("as")} className="p-1 rounded-sm flex justify-around bg-white">

                    <button onMouseDown={setSwitch} className="text-white rounded-md text-[12px] w-[50%] p-1   bg-[#004343] ">Talk To An Expert</button>
                    <button onclick={() => console.log("as")} className="text-[#004343] text-[12px] w-[50%] p-1  ">FAQs</button>
                  </div> */}
                    </div>
                  ) : (
                    <div className="p-4 h-full text-white rounded-2xl flex overflow-auto flex-col hide-scrollbar gap-4  bg-btn-gradient border-2">
                      {/* <div className="flex gap-10 items-center justify-center flex-col"> */}
                      <div className="flex justify-end w-full items-end">
                        <Close
                          className="cursor-pointer"
                          onClick={() => {
                            setpayemnetComplete(false);
                            setPageNo(0);
                            handleClose();
                          }}
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-center items-center">
                        <img className="h-20 w-20" src={chatbot}></img>
                        <div className="flex-1 flex flex-col items-center">
                          <div className="text-md font-bold">
                            Your Session is booked with our Expert
                          </div>
                          <div className="text-xs">
                            Please Check Your Mail for all the session details
                          </div>
                        </div>
                        <div className="pb-[200px]"></div>
                      </div>
                    </div>
                  )}
                </Popover>

                <Popover
                  id={id2}
                  open={open2}
                  anchorEl={anchorEl2}
                  onClose={handleClose2}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  sx={{
                    "& .MuiPaper-root": {
                      borderRadius: "1rem", // Custom border radius
                    },
                    "& .MuiPaper-root::-webkit-scrollbar": {
                      display: "none",
                    },
                  }}
                  className="flex w-[40%] bg-transparent overflow-auto hide-scrollbar   rounded-2xl  "
                >
                  {/* <div className="p-4 rounded-2xl flex overflow-auto flex-col hide-scrollbar gap-4  bg-btn-gradient"> */}
                  <div className="max-w-sm mx-auto flex flex-col gap-3 hide-scrollbar bg-[#00232F] border-2 border-[#00A9AB] text-white rounded-2xl p-6 shadow-lg">
                    <div className="flex border-b-2 border-b-[#004343] pb-1 justify-between flex-row gap-2 scrollbar-hide  items-start">
                      {/* <img src={chatbot} alt="" /> */}

                      <h2 className="text-[15px] scrollbar-hide font-semibold mb-4">
                        Frequently Asked Questions
                      </h2>
                      <Close
                        className="cursor-pointer"
                        onClick={handleClose2}
                      />
                    </div>
                    <div className="flex flex-col gap-2 overflow-auto h-96 scrollbar-hide">
                      {faqLoading ? (
                        <div className="h-full w-full flex flex-col gap-2">
                          <div className="w-full h-12 bg-[#004343] animate-pulse  rounded-lg"></div>
                          <div className="w-full h-12 bg-[#004343] animate-pulse  rounded-lg"></div>
                          <div className="w-full h-12 bg-[#004343] animate-pulse  rounded-lg"></div>
                        </div>
                      ) : (
                        faqData.map((val, i) => {
                          return (
                            <Accordion
                              style={{
                                backgroundColor: "#004343",
                                font: "",
                                boxShadow: "0px",
                                "border-radius": "5px",
                              }}
                              className=" rounded-md bg-[#004343]"
                            >
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon></ExpandMoreIcon>}
                                aria-controls="panel1-content"
                                id="panel1-header"
                                style={{
                                  // backgroundColor:"rgba(34, 34, 34, 0.8)",
                                  font: "",
                                  boxShadow: "0px",
                                  color: "white",
                                  borderRadius: "0.5rem",
                                }}
                                className="rounded-md uppercase"
                              >
                                {val.title.split("_").join(" ")}
                              </AccordionSummary>
                              <AccordionDetails className="bg-white rounded-lg">
                                {val.data}
                              </AccordionDetails>
                            </Accordion>
                          );
                        })
                      )}
                    </div>
                  </div>
                  {/* 
                  <div onclick={() => console.log("as")} className="p-1 rounded-sm flex justify-around bg-white">

                    <button onMouseDown={setSwitch} className="text-white rounded-md text-[12px] w-[50%] p-1   bg-[#004343] ">Talk To An Expert</button>
                    <button onclick={() => console.log("as")} className="text-[#004343] text-[12px] w-[50%] p-1  ">FAQs</button>
                  </div> */}
                  {/* </div> */}
                </Popover>
                <Tooltip title="Talk To Expert">
                  <img onClick={handleClick} src={chatbot} alt="" />
                </Tooltip>
                {chatbotDisplay && (
                  <Tooltip title="FAQs">
                    <img onClick={handleClick2} src={faq} alt="" />
                  </Tooltip>
                )}
              </div>

              <div className="w-[80%] flex justify-evenly items-center gap-3">
                {!loading ? (
                  <button
                    className="py-2 w-full transition ease-in-out duration-1000  hover:scale-110 rounded-md border-2 border-teal-700"
                    onClick={() => {
                      if (PlanData?.isDownloadWithWaterMark) {
                        handlepdfdownload();
                      } else {
                        toast.error("PLEASE UPGRADE YOUR PLAN");
                      }
                    }}
                  >
                    Download
                  </button>
                ) : (
                  <div className="py-2 rounded-md border-2 border-teal-700">
                    Downloading
                  </div>
                )}
                <button
                  className="py-3 w-full text-sm transition ease-in-out duration-1000  hover:scale-110 rounded-md  bg-card-gradient text-white font-semibold"
                  onClick={handleEditClick}
                >
                  Edit Document With AI
                </button>
                <button
                  className="py-2 w-full transition ease-in-out duration-1000  hover:scale-110 rounded-md border-2 border-teal-700"
                  onClick={() => {
                    if (PlanData?.isSummerizeDocument) {
                      handlePreviewClick();
                    } else {
                      toast.error("PLEASE UPGRADE YOUR PLAN");
                    }
                  }}
                >
                  Summary
                </button>
                {savebutton ? (
                  <button
                    onClick={() => {
                      if (PlanData?.isSnippet) {
                        handleSave();
                      } else {
                        toast.error("PLEASE UPGRADE YOUR PLAN");
                      }
                    }}
                    className="py-2 w-full transition ease-in-out duration-1000  hover:scale-110 rounded-md border-2 border-teal-700"
                  >
                    Save
                  </button>
                ) : (
                  <div className="py-2 w-full send-button rounded-md border-2 border-teal-700">
                    Loading...
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-[30%] h-full overflow-hidden bg-customBlack rounded-md p-5">
            <AnimatePresence mode="wait">
              {activeSidebar === "edit" ? (
                <motion.div
                  key="edit"
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-transparent rounded-md w-full h-full"
                >
                  <EditSidebar />
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="p-4 bg-transparent rounded-md w-full h-full flex flex-col items-center justify-center "
                >
                  <h1 className="font-semibold text-xl">Document Preview</h1>
                  <p className="text-sm text-center">
                    Please check the Document Preview before proceeding with{" "}
                    <span className="text-teal-500 font-semibold">
                      Adira AI Drafter
                    </span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DocEdit;
