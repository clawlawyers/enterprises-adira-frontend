import { useEffect, useState } from "react";
import { FaRegCopy, FaCheck } from "react-icons/fa"; // Copy and Check Icons
import { NODE_API_ENDPOINT } from "../utils/utils";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedQuestion, setCopiedQuestion] = useState(null); // Tracks which question was copied
  const doc_id = useSelector((state) => state.document.docId);
  const [questions, setQuestions] = useState([]);

  // // List of questions
  // const questions = [
  //   "What was the motive behind the murder?",
  //   "Were there any eyewitnesses to the crime?",
  //   "What evidence links the suspect to the murder?",
  //   "What was the timeline of events leading to the murder?",
  //   "Are there any alibis provided by the suspect?",
  //   "Has the murder weapon been recovered?",
  //   "Were there any signs of struggle at the crime scene?",
  //   "Was the victim involved in any disputes?",
  //   "What is the suspect's history or background?",
  //   "Are there any security camera recordings?",
  // ];

  // Copy to clipboard function
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text); // Copies the text to clipboard
    setCopiedQuestion(text); // Sets the copied question
    setTimeout(() => setCopiedQuestion(null), 2000); // Resets the state after 2 seconds
  };

  useEffect(() => {
    const getRecommendedQuestion = async () => {
      const questions = await fetch(
        `${NODE_API_ENDPOINT}/ai-drafter/recommend_question`,
        {
          method: "POST",
          body: JSON.stringify({ doc_id }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!questions.ok) {
        toast.error("Error fetching recommended questions");
        console.error("Error fetching recommended questions");
        return;
      }
      const data = await questions.json();
      console.log(data);
      console.log(data.data.fetchedData.question);
      setQuestions(data.data.fetchedData.question);
    };

    getRecommendedQuestion();
  }, []);

  return (
    <div className="relative w-80 mx-auto mt-10">
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg flex justify-between items-center shadow-md"
      >
        Recommended Questions
        <span
          className={`transform transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          ▼
        </span>
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="absolute bottom-full mb-2 w-full bg-white rounded-lg shadow-md max-h-72 overflow-y-auto">
          {questions.map((question, index) => (
            <div
              key={index}
              className="flex justify-between items-center px-4 py-3 border-b last:border-b-0 hover:bg-gray-100 cursor-pointer"
              onClick={() => copyToClipboard(question)}
            >
              {/* Question Text */}
              <span className="text-gray-700">{question}</span>

              {/* Icon: Changes based on copied state */}
              {copiedQuestion === question ? (
                <FaCheck className="text-teal-600" /> // Check icon for copied state
              ) : (
                <FaRegCopy
                  className="text-gray-500 hover:text-teal-600"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent parent click
                    copyToClipboard(question);
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
