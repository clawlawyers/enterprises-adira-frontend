import React from "react";

const Pricing = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-screen relative p-2 overflow-hidden">
      <div className="w-full h-screen absolute p-3 rounded-lg">
        {/* Video background */}
        <video
          className="w-full h-full object-cover opacity-65 rounded-lg"
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
      <div
        className="flex flex-col h-screen w-full  z-20 p-2 gap-3 bg-black bg-opacity-20 rounded-lg"
        // style={{ boxShadow: "0 0 1px white, 0 0 1px white, 0 0 1px white" }}
      >
        <div className="h-full w-full grid md:grid-cols-[30%_70%] items-center justify-center p-5">
          <h1
            className="text-5xl font-bold"
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
          <div className="border rounded-lg w-full p-2 bg-[#018081] bg-opacity-20">
            <h1 className="text-center font-bold text-3xl">ENTERPRISE PLAN</h1>
            <div className="w-[80%] m-auto grid md:grid-cols-3 gap-5 items-center justify-center py-5">
              <ul className="list-disc">
                <li>Generate 60+ documents</li>
                <li>All Ready-Made Templates</li>
                <li>Prompt Drafting</li>
                <li>Download without Watermark</li>
              </ul>
              <ul className="list-disc">
                <li>Summarize Document</li>
                <li>Summarize Clauses Individually</li>
                <li>Edit Document with AI</li>
                <li>Upload Your Own Document</li>
              </ul>
              <ul className="list-disc">
                <li>Analyze Any Document</li>
                <li>Upload Document with Prompt</li>
                <li>Full Access to LegalGPT</li>
                <li>Full Access to Case Search</li>
              </ul>
            </div>
            <div className="w-full flex gap-3 justify-center items-baseline">
              <p className="line-through text-gray-500">₹ 6999/-</p>
              <h1 className="text-white font-bold text-2xl">₹ 5999/-</h1>
              <button className="px-8 py-1 rounded-lg border bg-[#018081] hover:bg-opacity-40">
                Get It Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
