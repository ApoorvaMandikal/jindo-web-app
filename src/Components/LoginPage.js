import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
} from "firebase/auth";
import { authentication } from "./../firebaseConfig";
import jindo_color2 from "../assets/Jindo_color2.png";
import loginlogo from "../assets/loginlogo.png";
import { FaGoogle } from "react-icons/fa";

const LoginPage = () => {
  const navigate = useNavigate();

  console.log("Auth object:", authentication);
  if (!authentication) {
    console.error("Firebase Auth not initialized.");
    alert("Firebase not initialized properly.");
  }
  
  const signInWithFirebase = async (event) => {
    event.preventDefault(); // Prevent default button behavior
    try {
      console.log("Starting Google Sign-In...");
      await setPersistence(authentication, browserSessionPersistence);

      const provider = new GoogleAuthProvider();
      console.log("Attempting sign-in popup...");
      const result = await signInWithPopup(authentication, provider);

      if (result) {
        console.log("User signed in:", result.user);
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      alert(`Sign-in error: ${error.message}`);
    }
  };


  useEffect(() => {
    onAuthStateChanged(authentication, (user) => {
      if (user) {
        navigate("/");
      } else {
        authentication.signOut();
      }
    });
  }, []);

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="w-1/2 items-center justify-center bg-blue-50 hidden md:flex">
        <div className="text-center">
          <img src={loginlogo} alt="AI Bot" className="w-80 mx-auto mb-6" />
          <p className="text-lg text-gray-600">Your AI Veterinary Assistant</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md p-8 m-auto">
          <div className="text-center mb-10">
            <img src={jindo_color2} alt="Jindo Logo" className="w-32 mx-auto" />
            <h2 className="text-2xl font-semibold mt-4">
              Veterinarian AI Assistant
            </h2>
          </div>

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="Email"
                className="mt-1 p-3 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter password"
                  className="mt-1 p-3 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <i className="fas fa-eye text-gray-400"></i>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>
              <div>
                <p className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </p>
              </div>
            </div>

            <div>
              <button
                className="w-full bg-jindo-blue text-white p-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Sign in
              </button>
              <button
                onClick={signInWithFirebase}
                className="w-full mt-6 bg-jindo-blue text-white p-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
              >
                <FaGoogle className="w-4 h-auto mr-3" />
                Sign in with Google
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
