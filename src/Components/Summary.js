import React from "react";

const Summary = ({ transcription, summary, generateSummary, loadingSummary }) => {
  return (
    <div className="p-4 border rounded-lg bg-white shadow col-span-1 overflow-auto">
      <h2 className="text-lg font-bold mb-2">Summary</h2>
      {summary ? (
        <p className="text-gray-700 whitespace-pre-wrap">{summary}</p>
      ) : (
        <p className="text-gray-500">No summary generated yet.</p>
      )}
      <button
        onClick={() => generateSummary(transcription)}
        disabled={loadingSummary || !transcription.trim()}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        {loadingSummary ? "Generating..." : "Generate Summary"}
      </button>
    </div>
  );
};

export default Summary;
