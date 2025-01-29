import React, { useState, useEffect, useRef } from "react";


const AmbientListener = ({
  isAmbientListening,
  setIsAmbientListening,
  setTranscription,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isAmbientListening) {
      startTimer();
      startRecording();
    } else {
      stopTimer();
      stopRecording(); // Ensures the microphone is released
    }
    return () => {
      stopTimer();
      stopRecording();
    };
  }, [isAmbientListening]);

  // Timer Logic
  const startTimer = () => {
    if (!timerRef.current) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1); // Increment elapsed time by 1 second
      }, 1000);
    }
  };
  
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current); // Clear the interval
      timerRef.current = null; // Reset the timer reference to allow restarting
    }
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };


  // Recording Logic
  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error("Audio recording is not supported in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        // Save chunks for transcription
        setAudioChunks(chunks);
      };

      recorder.start();
      setMediaRecorder(recorder);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop(); // Stops recording
      console.log("Recording stopped");
      mediaRecorder.stream.getTracks().forEach((track) => track.stop()); // Stops microphone access
      setIsPaused(true); // Update state to paused
      stopTimer(); // Stop the timer
  
      // Send recorded audio chunks for transcription
      if (audioChunks.length > 0) {
        sendToWhisper(audioChunks)
          .then(() => {
            setAudioChunks([]); // Clear chunks after successful transcription
          })
          .catch((err) => {
            console.error("Error during transcription:", err);
          });
      } else {
        console.warn("No audio chunks available to send for transcription.");
      }
    }
  };

  const resumeRecording = async () => {
    if (isPaused) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const newChunks = [];
  
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            newChunks.push(event.data); // Collect new audio chunks
          }
        };
  
        recorder.onstop = () => {
          setAudioChunks((prevChunks) => [...prevChunks, ...newChunks]); // Append new chunks
        };
  
        recorder.start(); // Start recording
        setMediaRecorder(recorder); // Update state
        setIsPaused(false);
        startTimer(); // Resume timer
      } catch (error) {
        console.error("Error resuming microphone:", error);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      if (mediaRecorder.state === "recording") {
        mediaRecorder.stop();
      }
      if (mediaRecorder.stream) {
        mediaRecorder.stream.getTracks().forEach((track) => track.stop()); // Stop all tracks
      }
      setMediaRecorder(null); // Reset recorder
      setAudioChunks([]); // Clear chunks
      setIsPaused(false);
      stopTimer(); // Stop the timer completely
    }
  };

  const sendToWhisper = async (chunks) => {
    const audioBlob = new Blob(chunks, { type: "audio/wav" });
    console.log("Audio Blob:", audioBlob); // Debug log
    console.log("Audio Blob Type:", audioBlob.type); // Should be "audio/wav"
    console.log("Blob size:", audioBlob.size); // Verify Blob size

    const formData = new FormData();
    formData.append("file", audioBlob, "recording.wav");

    try {
      const response = await fetch("http://127.0.0.1:8000/transcribe/", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to transcribe audio.");
      }
      const data = await response.json();
      setTranscription((prev) => prev + " " + data.transcription); // Append new text    
       } catch (error) {
      console.error("Error sending audio for transcription:", error);
    }
  };

  
  
  const toggleListening = () => {
    if (isAmbientListening) {
      stopRecording(); // Stop everything
      setIsAmbientListening(false);
    } else {
      setIsPaused(false); // Reset paused state
      setIsAmbientListening(true); // Start listening
      startTimer(); // Start the timer
      startRecording(); // Start recording
    }
  };
  

  return (
    <div className="absolute ">
      <div className="flex items-center gap-2 w-full border rounded-md bg-white shadow flex-row h-1/4 max-w-sm p-2">
        {/* Start/Stop Listening Button */}
        <button
          onClick= {toggleListening}
          className={`px-2 py-1 text-xs text-white rounded ${
            isAmbientListening ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {isAmbientListening ? "Stop Listening" : "Start Listening"}
        </button>
  
        {/* Pause/Resume Button and Elapsed Time */}
        {isAmbientListening && (
          <div className="flex flex-row items-center gap-2 flex-grow">
            <button
onClick={isPaused ? resumeRecording : pauseRecording}              
className="px-2 py-1 bg-orange-500 text-xs text-white font-bold rounded-md hover:bg-orange-600"
            >
              {isPaused ? "Resume" : "Pause"}
            </button>
            <div className="text-xs font-medium truncate">
              Elapsed Time: {formatTime(elapsedTime)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
};

export default AmbientListener;
