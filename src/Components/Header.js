import React from "react";
import jindo_color2 from "../assets/Jindo_color2.png"; // Adjust path to your logo image
import hamburger from "../assets/hamburger.png"; // Hamburger icon from react-icons
import { Link } from "react-router-dom";

const Header = ({ toggleSidebar }) => {
  return (
    <div className="w-full flex items-center justify-between md:justify-center p-4 bg-white shadow-md">
      {/* Hamburger Icon */}
      <button
        onClick={toggleSidebar}
        className="text-gray-800 text-2xl md:hidden"
      >
        <img src={hamburger} alt="Sidebar" className="w-12 h-auto" />
      </button>
      {/* Logo */}
      <img src={jindo_color2} alt="Jindo Logo" className="w-32 h-auto md:hidden" />
      <Link to="/login">Login</Link>
    </div>
  );
};

export default Header;
