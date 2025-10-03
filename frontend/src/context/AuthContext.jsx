import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem("adminToken");
    const adminData = localStorage.getItem("adminData");
    
    if (token && adminData) {
      setAdmin(JSON.parse(adminData));
      // Set default authorization header
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post("http://localhost:5001/api/auth/login", {
        username,
        password,
      });

      const { token, ...adminData } = response.data;

      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminData", JSON.stringify(adminData));
      
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      setAdmin(adminData);
      
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    delete axios.defaults.headers.common["Authorization"];
    setAdmin(null);
  };

  const value = {
    admin,
    loading,
    login,
    logout,
    isAuthenticated: !!admin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

