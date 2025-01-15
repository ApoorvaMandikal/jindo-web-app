import React from "react";

const AmbientListener = ({ isListening, setIsListening, setTranscription }) => {
  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      // Stop Whisper (to be implemented)
    } else {
      setIsListening(true);
      // Start Whisper for transcription (to be implemented)
      setTranscription("Listening for ambient conversation..."); // Placeholder
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow">
      <h2 className="text-lg font-bold mb-2">Ambient Listening</h2>
      <button
        onClick={toggleListening}
        className={`px-4 py-2 text-white rounded ${
          isListening ? "bg-red-500" : "bg-green-500"
        }`}
      >
        {isListening ? "Stop Listening" : "Start Listening"}
      </button>
    </div>
  );
};

export default AmbientListener;
