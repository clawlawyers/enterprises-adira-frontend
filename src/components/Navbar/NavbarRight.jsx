import React from "react";

const NavbarRight = ({ showMeu }) => {
  return (
    <div className="flex flex-row    justify-between">
      <div className="flex flex-row gap-3  ">
        <div className=" font-bold font-sans leading-8 text-customDrakBlue text-4xl">
          Adira AI
        </div>
        <div className="text-sm  leading-5 font-sans ">by Claw</div>
      </div>
      {showMeu && (
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="19"
            viewBox="0 0 30 19"
            fill="none"
          >
            <rect width="30" height="3" fill="#D9D9D9" />
            <rect y="8" width="30" height="3" fill="#D9D9D9" />
            <rect y="16" width="30" height="3" fill="#D9D9D9" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default NavbarRight;
