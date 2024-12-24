import {React, useState, useEffect} from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import App from "./../App";
import LoginPage from "./../Components/LoginPage"; 
import {onAuthStateChanged} from "firebase/auth"
import { authentication } from "../firebaseConfig";

const MainRouter = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(authentication, (currentUser) => {
          setUser(currentUser);
          setLoading(false);
        });
    
        return () => unsubscribe(); // Cleanup on unmount
      }, []);

  return (
    <Router>
      <Routes>
      <Route path ="/" element={user ? <App /> : <Navigate to="/login" replace />}/>
      <Route path="/login" element={<LoginPage />} /> 
      </Routes>
    </Router>
  );
};

export default MainRouter;
