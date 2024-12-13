import React, { useState } from "react";
import axios from "axios";
import jindo_color2 from "./assets/Jindo_color2.png";
import Rolling from "./assets/Rolling.svg";
import next from "./assets/next.png";
import micIcon from "./assets/micIcon.png";
import Sidebar from "./Components/Sidebar";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isListening, setIsListening] = useState(false);

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

  // const sendMessage = async () => {
  //   if (!input.trim()) return;

  //   // Add user message to the conversation
  //   const newMessages = [...messages, { role: "user", content: input }];
  //   setMessages(newMessages);

  //   try {
  //     // Use the helper function to get a response from LLaMA 2
  //     const assistantReply = await sendMessageToLlama2(newMessages);

  //     // Update state with assistant's response
  //     setMessages((prevMessages) => [
  //       ...prevMessages,
  //       { role: "assistant", content: assistantReply },
  //     ]);
  //   } catch (error) {
  //     setMessages((prevMessages) => [
  //       ...prevMessages,
  //       { role: "assistant", content: "Error connecting to the assistant." },
  //     ]);
  //   } finally {
  //     setInput(""); // Clear input
  //   }
  // };

  const sendMessage = async () => {
    if (!input.trim()) return;

    setLoading(true); // Start loading
    setError(""); // Clear previous errors

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);

    try {
      const assistantReply = await sendMessageToLlama2(newMessages);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: assistantReply },
      ]);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false); // End loading
      setInput(""); // Clear input
    }
  };

  const startListening = () => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript); // Update input field with the recognized text
    };

    recognition.onerror = (event) => {
      setError(`Speech recognition error: ${event.error}`);
    };

    recognition.start();
  };

  return (
    <div className="flex h-screen font-sans">
      <Sidebar />
      <div className="flex-1 p-6">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={jindo_color2} alt="Jindo Logo" className="w-32 h-auto" />
        </div>

        {/* Chat Window */}
        <div className="w-full p-4 flex flex-col space-y-4 h-4/6 overflow-y-auto">
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.role === "user"
                    ? "bg-jindo-blue text-white self-end"
                    : "bg-gray-200 text-gray-800 self-start"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>

        {/* Input Section */}
        <div className="mt-12 flex items-center justify-center">
          <div className="relative w-3/5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Jindo AI using voice or text"
            className="w-full p-3 pr-10 border border-gray-300 rounded-3xl"
          ></input>
          <button onClick={startListening} className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full hover:bg-gray-300 ml-2">
            <img
              src={micIcon}
              alt="Mic"
              className={`h-6 w-6 ${
                isListening ? "bg-red-500 rounded-full" : ""
              }`}
            />
          </button>
          </div>
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
        </div>

        {error && (
          <div className="text-red-600 mt-4 text-sm">
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
