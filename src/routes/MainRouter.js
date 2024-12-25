import { React, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import App from "./../App";
import LoginPage from "./../Components/LoginPage";
import { onAuthStateChanged } from "firebase/auth";
import { authentication } from "../firebaseConfig";

const MainRouter = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authentication, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe(); 
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            user || isGuest ? (
              <App isGuest={isGuest} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/login" element={<LoginPage setIsGuest={setIsGuest} isGuest={isGuest} />} />
      </Routes>
    </Router>
  );
};

export default MainRouter;
