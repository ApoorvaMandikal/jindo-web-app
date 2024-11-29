import React, { useState } from "react";
import axios from "axios";
import jindo_color2 from "./assets/Jindo_color2.png";
import Rolling from "./assets/Rolling.svg";
import next from "./assets/next.png";

const App = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setResponse("");

    try {
      // Replace with your API Gateway URL
      const apiUrl =
        "https://kc8f44sh7l.execute-api.eu-north-1.amazonaws.com/default/llamaRequest";

      const payload = {
        inputs: query,
        parameters: { max_new_tokens: 300, top_p: 0.9, temperature: 0.6 },
      };

      const res = await axios.post(apiUrl, payload);

      // Handle successful response
      setResponse(res.data.generated_text);
    } catch (err) {
      // Handle errors
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // const cleanResponse = (response) => {
  //   if (!response) return ""; // Handle empty or undefined response

  //   // Step 1: Clean bullet points
  //   let cleanedResponse = response
  //     .replace(/\n+/g, "\n") // Replace multiple newlines with a single newline
  //     .trim(); // Trim leading and trailing spaces

  //   // Convert bullet points into a standard list
  //   cleanedResponse = cleanedResponse.replace(
  //     /\* (.*?)(?=\n|$)/g,
  //     (match, p1) => `- ${p1}`
  //   );

  //   // Step 2: Handle numbered lists (Ingredients, Instructions)
  //   // This regex converts lines starting with numbers to a numbered list format
  //   cleanedResponse = cleanedResponse.replace(
  //     /(\d+)\. (.*?)(?=\n|$)/g,
  //     (match, p1, p2) => `${p1}. ${p2}`
  //   );

  //   // Step 3: Remove or handle any incomplete part at the end
  //   cleanedResponse = cleanedResponse.replace(/(.*?)(?=but$)/g, ""); // Adjust this to handle cases like 'but' at the end

  //   // Step 4: Optional – Split into sections (Ingredients, Instructions)
  //   // You can also separate sections based on known keywords (e.g., Ingredients, Instructions)
  //   const sections = cleanedResponse.split(/(Ingredients:|Instructions:)/); // Splitting into sections
  //   cleanedResponse = sections.join("\n"); // Join sections for proper display

  //   return cleanedResponse;
  // };

  return (
    <div className="flex flex-col font-sans items-center mt-12 h-full p-5 relative">
      <img src={jindo_color2} alt="Your Logo" className="w-44 h-20" />
      <div className="w-full justify-center flex flex-row fixed bottom-0 p-5">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type your query here..."
          rows="1"
          className="m-1 p-1 w-2/4 border border-gray-300 rounded"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center justify-center"
        >
          {loading ? (
            <img src={Rolling} alt="Loading..." className="h-6 w-6" />
          ) : (
            <img src={next} alt="Submit" className="h-6 w-6" />
          )}
        </button>
      </div>

      {response && (
        <div className="mt-6 justify-center">
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">
            Response:
          </h3>
          <pre className="bg-gray-200 p-4 rounded-lg whitespace-pre-wrap break-words">
            {/* {cleanResponse(response)} */}
            {response}
          </pre>
        </div>
      )}
      {error && <div className="flex fixed mt-96 justify-center"><p className="bg-gray-200 p-4 rounded-lg text-red-600">{error}</p> </div>}
    </div>
  );
};

export default App;
