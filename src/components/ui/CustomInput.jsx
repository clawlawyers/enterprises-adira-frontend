import React from "react";
import { useRef, useEffect } from "react";
const CustomInput = ({
  className,
  btn,
  placeholder,
  onChange,
  onSubmit,
  loading,
  value,
  required,
}) => {
  const textareaRef = useRef(null);
  useEffect(() => {
    if (textareaRef.current) {
      // This ensures the height is adjusted on initial render
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);
  const handleInputChange = (e) => {
    // Reset height before calculating new height to avoid growing infinitely
    textareaRef.current.style.height = "auto";
    // Adjust the height based on the content
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;

    onChange(e);
  };
  return (
    <form
      onSubmit={onSubmit}
      className={`${className} flex flex-row justify-center gap-5 items-center w-full`}
    >
      <textarea
        ref={textareaRef}
        type="text"
        placeholder={`${placeholder}`}
        className="p-2 w-full bg-slate-200 rounded-md text-neutral-800 border-2 outline-none border-teal-500 overflow-y-auto resize-none"
        onChange={onChange}
        disabled={loading}
        value={value}
        required={required}
        rows={1}
        style={{ maxHeight: "100px" }}
      />
      {btn ? (
        <button
          disabled={loading}
          type="submit"
          className={`${
            loading ? "pointer-events-none opacity-75 cursor-progress" : ""
          } bg-btn-gradient p-2 px-9 rounded-md`}
        >
          Send
        </button>
      ) : (
        <></>
      )}
    </form>
  );
};

export default CustomInput;
