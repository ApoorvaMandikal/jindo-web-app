import React from "react";

const Transcription = ({ transcription }) => {
  return (
    <div className="p-4 border rounded-lg bg-white shadow row-span-3 overflow-auto">
      <h2 className="text-lg font-bold mb-2">Transcription</h2>
      <p className="text-gray-700 whitespace-pre-wrap">
        {transcription || "No transcription available."}
      </p>
    </div>
  );
};

export default Transcription;
