import React from "react";
import jindo_color2 from "./../assets/Jindo_color2.png";
import chat from "./../assets/chat.png";

const Sidebar = () => {
  return (
    <div className="hidden md:block w-1/4 h-full">
      {/* Sidebar */}
      <div className="bg-black text-white p-4 flex flex-col space-y-4 h-full">
        <img
          src={jindo_color2}
          alt="Jindo Logo"
          className="w-28 h-auto mx-auto my-4"
        />
        <hr className="border-gray-600"></hr>
        <button className="bg-jindo-blue text-white py-4 px-4 rounded-3xl mx-4 my-8">
          + New Chat
        </button>
        <div className="space-y-2">
          <p className="text-gray-400">TODAY</p>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-md">
              <img src={chat} alt="chat" className="h-auto" />
            </div>
            <p>Sammy, 7:30AM</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-md">
              <img src={chat} alt="chat" className="h-auto" />
            </div>
            <p>Bobby, 7:00AM</p>
          </div>
        </div>
        <div className="space-y-2 mt-4">
          <p className="text-gray-400">YESTERDAY</p>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-md">
              <img src={chat} alt="chat" className="h-auto" />
            </div>
            <p>Romo, 10:00AM</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-md">
              <img src={chat} alt="chat" className="h-auto" />
            </div>
            <p>Abby, 9:30AM</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
