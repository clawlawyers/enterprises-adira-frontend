import React, { useState } from "react";
import NavbarLeft from "../components/Navbar/NavbarLeft";
import NavbarRight from "../components/Navbar/NavbarRight";
import SummaryLoader from "../components/loaders/SummaryLoader";
import UploadSummary from "../components/Dialogs/UploadSummaryDialog";
const Summary = () => {

  const [loading, setLoading] = useState(false);
  const [response , setResponse] = useState("");
  return (
    <main className="flex flex-col justify-start space-y-5 p-5 items-center w-full h-screen">
      <section className="flex flex-row justify-between items-start align-middle w-full">
        <NavbarRight />
        <NavbarLeft />
      </section>
      {loading ? <SummaryLoader /> : 
      <div className="w-full lg:px-52 h-[85vh]  ">
        <UploadSummary text={response} />
      </div>
      }
      
    </main>
  );
};

export default Summary;
