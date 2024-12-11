import React, { useState, useEffect } from "react";
import "./TipsComponent.css";

const items = [
  "Get Pro in Drafting: Make use of the “Pro” functionality of the AI drafter feature to draft a document with accounting for the relevant information from your arguments, counter-arguments and judgements.",
  "Explore  LegalGPT: Dive Deep in legal research for better preparation by using LegalGPT.",
  "Refine Arguments: Don’t forget to use the AI Assistant to identify grey areas and holes in your case to give yourself an edge.",
  "Use Objection Insights: Evaluate the objections to draft a better argument.",
  "Know it All: Explore tutorials to make the most of advanced AI features.",
  "Download History: After every session we encourage you to download your session, as we do not store any of your data for privacy reasons.",
  "Adapt to Updates: Stay informed about new features and updates to enhance your experience.",
  "Leverage the AI Judge: Make use of the multi-angle judgments to curate your arguments accordingly.",
  "Make a Foundation: Use the First Draft feature to save time on creating a foundation for your case.",
  "Understand better: Try to use the “Switch Side” option in AI Lawyer to actually get in the shoes of your opposing counsel to better evaluate your position.",
];

const TipsComponent = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
        setFade(false);
      }, 1000);
    }, 4000);

    return () => clearInterval(intervalId);
  }, [items.length]);
  return (
    <div
      className={`fade-item ${
        fade ? "fade-out" : "fade-in"
      } text-sm font-semibold text-center`}
    >
      {items[currentIndex]}
    </div>
  );
};

export default TipsComponent;
