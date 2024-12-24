import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./../App";
import LoginPage from "./../Components/LoginPage"; 

const MainRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginPage />} /> 
      </Routes>
    </Router>
  );
};

export default MainRouter;
