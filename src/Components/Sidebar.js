import React from "react";
import jindo_color2 from "./../assets/Jindo_color2.png";
import hamburger from "../assets/hamburger.png";
import chatIcon from '../assets/chatIcon.png'

const Sidebar = ({
  isOpen,
  toggleSidebar,
  chatHistory,
  currentChatId,
  setCurrentChatId,
  createNewChat,
}) => {
  return (
    <div
      className={`md:static md:translate-x-0 fixed top-0 left-0 h-screen w-64 bg-black text-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full md:w-1/4 md:h-full"
      }`}
    >
      <div className="p-4 flex flex-col space-y-4 h-full">
        <div className="flex justify-between md:justify-center items-center mb-4">
          <button
            onClick={toggleSidebar}
            className="text-gray-800 text-2xl md:hidden"
          >
            <img src={hamburger} alt="Close Sidebar" className="w-12 h-auto" />
          </button>
          <img src={jindo_color2} alt="Jindo Logo" className="w-28 h-auto" />
        </div>
        <hr className="border-gray-600"></hr>
        <button
          className="bg-jindo-blue text-white py-4 px-4 rounded-3xl mx-4 my-8"
          onClick={createNewChat}
        >
          + New Chat
        </button>
        <div className="space-y-2">
          <p className="text-gray-400">TODAY</p>
          {Object.entries(chatHistory).map(([chatId, chat]) => (
            <div
              key={chatId}
              className={`flex items-center space-x-2 cursor-pointer rounded-3xl ${
                chatId === currentChatId ? "bg-gray-700" : ""
              }`}
              onClick={() => setCurrentChatId(chatId)}
            >
              <div className="p-2 rounded-md">
                <img src={chatIcon} alt="chat" className="h-auto" />
              </div>
              <p>
                {new Date(chat.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
