import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Components/Sidebar";
import Header from "./Components/Header";
import { MdEdit } from "react-icons/md";
import Chatbot from "./Components/Chatbot";

const App = ({ isGuest, setIsGuest }) => {
  // const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState({});
  const [currentChatId, setCurrentChatId] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (initialized) {
      localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
      localStorage.setItem("currentChatId", currentChatId);
    }
  }, [chatHistory, currentChatId, initialized]);

  useEffect(() => {
    const savedChatHistory =
      JSON.parse(localStorage.getItem("chatHistory")) || {};
    const savedCurrentChatId = localStorage.getItem("currentChatId");

    if (Object.keys(savedChatHistory).length && savedCurrentChatId) {
      setChatHistory(savedChatHistory);
      setCurrentChatId(savedCurrentChatId);
    } else {
      const defaultChatId = Date.now().toString();
      const defaultChat = { date: new Date().toISOString(), messages: [] };
      const defaultHistory = { [defaultChatId]: defaultChat };

      setChatHistory(defaultHistory);
      setCurrentChatId(defaultChatId);
      localStorage.setItem("chatHistory", JSON.stringify(defaultHistory));
      localStorage.setItem("currentChatId", defaultChatId);
    }
    setInitialized(true); 
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);


  const createNewChat = () => {
    const newChatId = Date.now().toString();
    const newChat = { date: new Date().toISOString(), messages: [], name: generateChatName(input || '') };

    setChatHistory((prev) => {
      const updatedHistory = { ...prev, [newChatId]: newChat };
      localStorage.setItem("chatHistory", JSON.stringify(updatedHistory));
      localStorage.setItem("currentChatId", newChatId);
      return updatedHistory;
    });

    setCurrentChatId(newChatId);
  };



  const generateChatName = (message) => {
    if (!message) return "New Chat";
    const words = message.split(' ');
    words[0] = words[0].charAt(0).toUpperCase()+ words[0].slice(1);
    const truncated = words.slice(0, 6).join(' '); 
    return truncated + (words.length > 6 ? '...' : '');
  };

 
  const handleEditClick = () => {
    setIsEditing(true); 
  };

  
  const deleteChat = (chatID) => {
    const updatedHistory = { ...chatHistory };
    delete updatedHistory[chatID]; 
    
    localStorage.setItem("chatHistory", JSON.stringify(updatedHistory));
    
    if (currentChatId === chatID) {
      const remainingChats = Object.keys(updatedHistory);
      setCurrentChatId(remainingChats.length ? remainingChats[0] : null);
    }
    
    setChatHistory(updatedHistory);
  };


  return (
    <div className="flex h-screen font-sans">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        chatHistory={chatHistory}
        currentChatId={currentChatId}
        setCurrentChatId={setCurrentChatId}
        createNewChat={createNewChat}
        onDeleteChat={deleteChat}
      />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header
          toggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          isGuest={isGuest}
          setIsGuest={setIsGuest}
        />

        <Chatbot
                  chatHistory={chatHistory}
                  setChatHistory={setChatHistory}
                  currentChatId={currentChatId}
                  setCurrentChatId={setCurrentChatId}
                />
      </div>
    </div>
  );
};

export default App;
