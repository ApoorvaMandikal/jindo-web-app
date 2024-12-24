import React from "react";
import jindo_color2 from "../assets/Jindo_color2.png"; // Adjust path to your logo image
import hamburger from "../assets/hamburger.png"; // Hamburger icon from react-icons
import { useNavigate } from "react-router-dom";
import { authentication, signOut } from "../firebaseConfig";

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const logout = () => {
    authentication
      .signOut()
      .then(() => {
        navigate("/login"); // Redirect to the login page
      })
      .catch((error) => {
        console.error("Logout error:", error.message);
        alert("Error during logout, please try again.");
      });
  };

  return (
    <div className="w-full flex items-center justify-between md:justify-end p-4 bg-white shadow-md">
      {/* Hamburger Icon */}
      <button
        onClick={toggleSidebar}
        className="text-gray-800 text-2xl md:hidden"
      >
        <img src={hamburger} alt="Sidebar" className="w-12 h-auto" />
      </button>
      {/* Logo */}
      <img
        src={jindo_color2}
        alt="Jindo Logo"
        className="w-32 h-auto md:hidden"
      />
      <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded justify-end">
        {" "}
        Logout{" "}
      </button>
      {/* <Link to="/login">Login</Link> */}
    </div>
  );
};

export default Header;
