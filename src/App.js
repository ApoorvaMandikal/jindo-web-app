import React, { useState, useEffect } from "react";
import axios from "axios";
import Rolling from "./assets/Rolling.svg";
import next from "./assets/next.png";
import micIcon from "./assets/micIcon.png";
import Sidebar from "./Components/Sidebar";
import Header from "./Components/Header";
import { MdEdit } from "react-icons/md";

const App = ({ isGuest, setIsGuest }) => {
  // const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [recognitionInstance, setRecognitionInstance] = useState(null);
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
    setInitialized(true); // Ensure re-render after initialization
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  async function sendMessageToLlama2(conversation) {
    try {
      const response = await axios.post("http://localhost:11434/api/generate", {
        model: "llama2",
        prompt: conversation[conversation.length - 1].content, // Send the last user message as the prompt
        stream: false,
      });

      // Extract the assistant's response
      return response.data.response; // Extract the "response" field
    } catch (error) {
      console.error("Error communicating with LLaMA 2:", error.message);
      throw new Error("Error connecting to the assistant.");
    }
  }

  const createNewChat = () => {
    const newChatId = Date.now().toString(); // Unique chat ID
    const newChat = { date: new Date().toISOString(), messages: [], name: generateChatName(input || '') };

    setChatHistory((prev) => {
      const updatedHistory = { ...prev, [newChatId]: newChat };
      localStorage.setItem("chatHistory", JSON.stringify(updatedHistory));
      localStorage.setItem("currentChatId", newChatId);
      return updatedHistory;
    });

    setCurrentChatId(newChatId);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
  
    // Ensure currentChatId is valid
    if (!currentChatId) {
      const defaultChatId = Date.now().toString();
      const defaultChat = { date: new Date().toISOString(), messages: [] };
  
      setChatHistory((prev) => ({
        ...prev,
        [defaultChatId]: defaultChat,
      }));
      setCurrentChatId(defaultChatId);
  
      localStorage.setItem(
        "chatHistory",
        JSON.stringify({
          ...chatHistory,
          [defaultChatId]: defaultChat,
        })
      );
      localStorage.setItem("currentChatId", defaultChatId);
    }
  
    setLoading(true); // Start loading
    setError(""); // Clear errors
  
    const newMessage = { role: "user", content: input };
  
    // Update chat name if it's the first message
    if (chatHistory[currentChatId]?.messages.length === 0) {
      setChatHistory((prev) => {
        const updatedChat = {
          ...prev[currentChatId],
          name: generateChatName(input),  // First message becomes the chat name
          messages: [...prev[currentChatId].messages, newMessage],
        };
        return { ...prev, [currentChatId]: updatedChat };
      });
    } else {
      setChatHistory((prev) => {
        const updatedChat = {
          ...prev[currentChatId],
          messages: [...(prev[currentChatId]?.messages || []), newMessage],
        };
        return { ...prev, [currentChatId]: updatedChat };
      });
    }
  
    try {
      const assistantReply = await sendMessageToLlama2([
        ...(chatHistory[currentChatId]?.messages || []),
        newMessage,
      ]);
  
      setChatHistory((prev) => {
        const updatedChat = {
          ...prev[currentChatId],
          messages: [
            ...(prev[currentChatId]?.messages || []),
            { role: "assistant", content: assistantReply },
          ],
        };
        const updatedHistory = { ...prev, [currentChatId]: updatedChat };
        localStorage.setItem("chatHistory", JSON.stringify(updatedHistory));
        return updatedHistory;
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      setInput(""); // Clear input
    }
  };
  

  const generateChatName = (message) => {
    if (!message) return "New Chat";
    const words = message.split(' ');
    words[0] = words[0].charAt(0).toUpperCase()+ words[0].slice(1);
    const truncated = words.slice(0, 6).join(' '); // First 6 words
    return truncated + (words.length > 6 ? '...' : '');
  };

  const startListening = () => {
    if (isEditing) return;
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    if (isListening) {
      // Stop recognition
      if (recognitionInstance) {
        recognitionInstance.stop();
        setIsListening(false);
      }
    } else {
      // Start recognition
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript); // Update recognized text
      };

      recognition.onerror = (event) => {
        alert(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };

      recognition.start();
      setRecognitionInstance(recognition); // Save the instance to stop later
    }
  };

  const handleEditClick = () => {
    setIsEditing(true); // Enable editing when edit button is clicked
  };

  
  const deleteChat = (chatID) => {
    const updatedHistory = { ...chatHistory };
    delete updatedHistory[chatID];  // Remove the chat from the object
    
    localStorage.setItem("chatHistory", JSON.stringify(updatedHistory));
    
    // If the deleted chat was the current one, reset to the first available chat
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

      {/* Backdrop */}
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

        {/* Chat Section */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="w-full p-4 flex flex-col space-y-4">
            {(chatHistory[currentChatId]?.messages || []).map(
              (message, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      message.role === "user"
                        ? "bg-jindo-blue text-white self-end"
                        : "bg-gray-200 text-gray-800 self-start"
                    }`}
                  >
                    {(message.content || "").split("\n").map((line, idx) => (
                        <p key={idx} className="mb-1">
                          {line}
                        </p>
                      ))}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
        {error && (
          <div className="text-red-600 text-sm text-center">
            <p>{error}</p>
          </div>
        )}

        {/* Input Section */}
        <div
          className={`p-4 flex items-center justify-center ${
            chatHistory[currentChatId]?.messages?.length ? "mt-auto" : "h-full"
          }`}
        >
          <div className="w-4/5 md:w-3/5 h-14">
            {/* <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Jindo AI using voice or text"
              className="w-full p-3 pr-10 border border-gray-300 rounded-3xl"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            /> */}
            <button
              onClick={startListening}
              className={`transform h-full p-2 ml-2 border border-black rounded-3xl flex items-center justify-center relative w-full ${
                isListening ? "bg-jindo-orange text-white" : ""
              }`}
              disabled={isEditing}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  sendMessage();
                  setIsEditing(false);
                }
              }}
              
            >
              <img
                src={micIcon}
                alt="Mic"
                className="left-3 h-6 w-6"
              />
              {isListening ? (
                <span className="text-white text-center w-full">Listening...</span>
              ) : input || isEditing ? (
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)} // Update the input text as user types
                  onClick={() =>  setIsEditing(true)} // Focus the input if not in edit mode
                  className="text-jindo-orange bg-transparent border-none focus:ring-0 w-full h-full"
                  disabled={!isEditing} // Disable editing if not in edit mode

                />
              ) : (
                <span className="text-jindo-orange font-bold text-center w-full">
                  Tap to ask Jindo a question
                </span>
              )}
            </button>
          </div>

          {/* Send Message Button */}
          <button
            onClick={sendMessage}
            disabled={loading}
            className="ml-2 p-3 text-white rounded-md"
          >
            {loading ? (
              <img src={Rolling} alt="Loading..." className="h-6 w-6" />
            ) : (
              <img src={next} alt="Submit" className="h-6 w-6" />
            )}
          </button>

          {/* Edit Button */}
          {input && !isEditing && (
            <button
              onClick={handleEditClick} // Enable editing
              className="ml-2 p-3 rounded-md"
            >
              <MdEdit className="h-6 w-6" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
