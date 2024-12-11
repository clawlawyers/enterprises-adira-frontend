import React from "react";

const CustomSelect = ({
  className,
  options,
  placeholder,
  onChange,
  onSubmit,
  loading,
  value,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className={`${className} flex flex-row justify-center gap-5 items-center w-full`}
    >
      <select
        className="p-2 w-full bg-slate-200 rounded-md text-neutral-800 border-2 outline-none border-teal-500 text-sm"
        onChange={onChange}
        disabled={loading}
        value={value}
        required
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option
              .split(" ")
              .map((x) => {
                return x[0].toUpperCase() + x.slice(1);
              })
              .join(" ")}
          </option>
        ))}
      </select>
      {onSubmit ? (
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

export default CustomSelect;
