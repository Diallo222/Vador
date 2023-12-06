import React, { useEffect, useState } from "react";
import { styles } from "../../../styles";
import { vador, menu } from "../../assets";

const Navbar = (props) => {
  const { onSectionChange, menuOpened, setMenuOpened, changeBg } = props;
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);

  return (
    <nav
      className={`${
        styles.paddingX
      } w-full flex items-center py-2 fixed top-0 z-20 ${
        changeBg &&  "bg-white"
      } `}
    >
      <div className="w-full flex  items-center mx-auto">
        <div
          className="flex items-center justify-center  pl-12"
        >
          <img src={vador} alt="logo" className="w-12 h-12 object-contain" />
          <p className=" text-[20px] font-Jedi4 font-serif text-black">
          </p>
        </div>
{/* 
  <div className="mx-auto self-center hidden sm:flex flex-row gap-20 font-medium text-black  ">
        <MenuButton label="Home" onClick={() => onSectionChange(0)} />
            <MenuButton label="Collections" onClick={() => onSectionChange(1)} />
            <MenuButton label="About" onClick={() => onSectionChange(2)} />
        </div>

        <div className="sm:hidden flex flex-1 justify-end items-center pr-5">
          <img
            src={menu}
            alt="menu"
            className="w-[28px] h-[28px] object-contain"
            onClick={() => setToggle(!toggle)}
          />

          <div
            className={`${
              !toggle ? "hidden" : "flex"
            } p-6 bg-white absolute top-20 right-0 mx-4 my-2 min-w-[140px] z-10 rounded-xl`}
          >
            <div className=" flex justify-end items-start flex-1 flex-col gap-4">
               
            <MenuButton label="Home" onClick={() => {onSectionChange(0) ; setToggle(!toggle)}} />
            <MenuButton label="Collections" onClick={() => {onSectionChange(1) ; setToggle(!toggle)}} />
            <MenuButton lab      el="About" onClick={() => {onSectionChange(2) ; setToggle(!toggle)}} />
            </div>
          </div>
        </div> */}
      </div>
    </nav>
  );
};
const MenuButton = (props) => {
  const { label, onClick } = props;
  return (
    <button
      onClick={onClick}
      className="text-[13px] text-black font-bold cursor-pointer hover:text-indigo-600 active:border-none  bg-none"
    >
      {label}
    </button>
  );
};
export default Navbar;
