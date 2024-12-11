import React, { useEffect, useState } from "react";
// import SummaryDisplay from "../ui/SummaryDIsplay";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";

import { getSummary } from "../../actions/Summary";
import { useSelector } from "react-redux";
import rehypeRaw from "rehype-raw";

import loaderGif from "../../assets/icons/2.gif";
import toast from "react-hot-toast";
import Markdown from "react-markdown";
import { formatPdfText, formatText, trimQuotes } from "../../utils/utils";
import PDFDownloadButton from "../../PdfDownloader/SummaryPdfDoc";
import { NODE_API_ENDPOINT } from "../../utils/utils";

const UploadSummary = () => {
  const [text, setText] = useState("");
  // console.log(text);
  const [loading, setLoading] = useState(false);
  const [downloading, setdownLoading] = useState(true);
  const doc_id = useSelector((state) => state.document.docId);
  const currentUser = useSelector((state) => state.auth.user);

  let navigate = useNavigate();
  let Sumarypath = localStorage.getItem("SummaryPath");

  const generatePDF = () => {
    const summaryText = document.getElementById("summary-text").innerText;

    const doc = new jsPDF();

    const pageHeight = doc.internal.pageSize.height;
    const margin = 10;
    let y = 30; // Starting y position after the heading

    const heading = "Document Summary";
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 128, 128);

    doc.text(heading, margin, 20);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);

    const lines = doc.splitTextToSize(summaryText, 180);

    lines.forEach((line) => {
      if (y + margin > pageHeight) {
        doc.addPage();
        y = margin; // Reset y position for the new page
      }
      doc.text(line, margin, y);
      y += 10; // Move y down for the next line
    });

    doc.save("document_summary.pdf");
  };

  const handleNavigate = () => {
    if (Sumarypath === "/DocPreview") {
      navigate("/DocPreview");
    } else navigate("/Snippets");
  };

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await getSummary(doc_id, currentUser.jwt);
      // console.log(res);
      let temp = String.raw`${res.data.data.fetchedData.summary}`;

      console.log(temp);

      setText(trimQuotes(temp));
    } catch (e) {
      console.log(e);
      toast.error("Failed to fetch ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [doc_id]);

  const handlepdfdownload = async () => {
    setdownLoading(false);
    try {
      const response = await fetch(
        `${NODE_API_ENDPOINT}/ai-drafter/api/get_pdf`,
        {
          // Replace with your backend URL
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.jwt}`,
          },
          body: JSON.stringify({ document: text }),
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
      setdownLoading(true);
    }
  };

  return (
    <main className="flex flex-row justify-center rounded-md scale-95 p-4 items-center w-full h-full bg-customBlack">
      <section className="flex-1 h-full w-full">
        {/* <SummaryDisplay /> */}
        <div className="bg-card-gradient bg-cover rounded-md border border-white flex flex-col items-center justify-center h-full w-full p-2">
          <div className="flex flex-col w-full justify-start items-start h-[80vh] gap-3 p-2 ">
            <div className="flex flex-row pt-3">
              <p className="text-3xl font-semibold text-teal-500">Adira AI</p>
              <sup className="pl-2 pt-4">by Claw</sup>
            </div>
            {loading ? (
              <div className="flex flex-col h-full items-center justify-center w-full">
                <img
                  className="flex flex-row justify-center items-center w-40 h-40"
                  src={loaderGif}
                  alt="Loading..."
                />
              </div>
            ) : (
              <div
                id="summary-text"
                className="h-full overflow-y-auto scrollbar-hide p-2"
              >
                <Markdown
                  className=" text-sm hide-scrollbar  h-full w-full overflow-y-auto overflow-wrap break-word word-wrap break-word"
                  rehypePlugins={[rehypeRaw]}
                >
                  {formatText(
                    text
                      .replace(/\\u20b9/g, "₹")
                      .replace(/\u20b9/g, "₹")
                      .replaceAll("u20B9", "₹")
                  )}
                </Markdown>
              </div>
            )}
          </div>
        </div>
      </section>
      <section className="flex-1 h-full scale-90 flex flex-col justify-between pt-32 py-5 items-center ">
        <div className="flex flex-col space-y-5 justify-center items-center text-center">
          <h3 className="font-semibold text-4xl">Document Summary</h3>
          <p className="text-sm font-light">
            This Document summary is generated by{" "}
            <span className="text-teal-400 font-normal">Adira AI.</span>
            Download your document summary and use it for your reference.
          </p>
        </div>
        {/* buttons */}
        <div className="w-full flex flex-row items-center scale-90 gap-3">
          <button
            onClick={handleNavigate}
            className="w-full py-2 bg-card-gradient  text-white font-bold rounded-md"
          >
            Go Back
          </button>
          {/* <button
            className="bg-card-gradient text-white font-bold p-3 px-10 rounded-md"
            onClick={generatePDF}
          >
            Download PDF
          </button> */}
          {downloading ? (
            // <PDFDownloadButton pdfDownloadText={formatPdfText(ediText)} />
            <button
              className="w-full py-2 transition ease-in-out duration-1000  hover:scale-110 rounded-md border-2 border-teal-700"
              onClick={handlepdfdownload}
            >
              Download
            </button>
          ) : (
            <div className="w-full py-2 rounded-md border-2 border-teal-700">
              Downloading
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default UploadSummary;
