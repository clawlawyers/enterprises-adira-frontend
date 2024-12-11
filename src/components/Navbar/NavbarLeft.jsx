import React from "react";
import UserModal from "../Modals/UserModal";
import HomeIcon from "../../assets/svg/HomeIcon";
import { useLocation, useNavigate } from "react-router-dom";
import Back from "../../assets/svg/Frame 44.svg";

const NavbarLeft = () => {
  let navigate = useNavigate();
  let location = useLocation();

  const isSnippetPath = location.pathname.startsWith("/Snippets/");

  return (
    <div className="flex flex-row justify-end items-start gap-2 ">
      <div
        className="cursor-pointer hover:scale-105 duration-200"
        onClick={() => navigate(-1)}
      >
        <img src={Back} alt="back" />
      </div>

      <HomeIcon
        className="cursor-pointer hover:scale-105 duration-200"
        onClick={() => navigate("/")}
      />
      {/* <UserModal/> */}
    </div>
  );
};

export default NavbarLeft;
