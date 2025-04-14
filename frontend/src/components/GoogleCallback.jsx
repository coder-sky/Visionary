import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
//import { AuthContext } from "../context/AuthContext";

const GoogleCallback = () => {
  //const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const response = await fetch("http://localhost:8500/api/auth/google/callback", {
          method: "GET",
          credentials: "include", // Sends cookies if using httpOnly cookies
        });

        const data = await response.json();
        console.log(data)
        if (data.token) {
          localStorage.setItem("token", data.token); // Store JWT token
          //setUser(data.user); // Update user context
          //navigate("/dashboard"); // Redirect to dashboard
        } else {
          console.error("Google login failed:", data.message);
          //navigate("/login"); // Redirect to login if failed
        }
      } catch (error) {
        console.error("Error fetching Google login data:", error);
        //navigate("/login");
      }
    };

    handleGoogleCallback();
  }, [navigate]);

  return <p>Processing login...</p>;
};

export default GoogleCallback;
