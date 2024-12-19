import React, { useState } from "react";
import ClawLogo from "../assets/clawlogo2.png";
import { Link } from "react-router-dom";

const Header = () => {
  const [isOpenmenu, setIsOpenmenu] = useState(false);
  const toggleMenu = () => {
    setIsOpenmenu(!isOpenmenu);
  };

  return (
    <header className="bg-gradient-to-r from-teal-700/40 to-teal-900/40 px-4 md:px-8 py-2 my-1 flex items-center justify-between transition rounded-md">
      {/* Logo Section */}
      <div className="text-white font-bold text-sm md:text-lg tracking-wide">
        <span className="font-extrabold text-2xl">
          <img src={ClawLogo} className="w-auto h-5 md:h-6" alt="Logoimg" />
        </span>
      </div>

      {/* Navigation Section */}
      <nav className="hidden md:flex items-center gap-8">
        <Link
          to="https://www.clawlaw.in/pricing"
          className="text-sm md:text-base text-white hover:text-teal-300 transition duration-200">
          Pricing
        </Link>
        <button className="px-6 py-2 bg-transparent border-2 border-teal-300 text-sm md:text-base text-teal-300 rounded-full hover:bg-teal-800 hover:text-white hover:border-white transition duration-200">
          LogIn
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <button className="text-white focus:outline-none" onClick={toggleMenu}>
          {/* Mobile Menu Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
        {isOpenmenu && (
          <div className="absolute right-0 mt-2 w-40 bg-teal-800/90 rounded-md shadow-lg py-2">
            <Link
              to="https://www.clawlaw.in/pricing"
              className="block px-4 py-2 text-sm md:text-base text-white hover:bg-teal-700 hover:text-teal-300 transition duration-200">
              Pricing
            </Link>
            <button className="block w-full text-left px-4 py-2 bg-transparent border-none text-sm md:text-base text-teal-300 hover:bg-teal-700 hover:text-teal-900 transition duration-200">
              LogIn
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
