import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import NoteDetailPage from "./pages/NoteDetailPage";

const App = () => {
  const [currentTheme, setCurrentTheme] = useState("dark");

  useEffect(() => {
    // Get saved theme from localStorage or use default
    const savedTheme = localStorage.getItem("theme") || "dark";
    setCurrentTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  // Listen for theme changes from navbar
  useEffect(() => {
    const handleThemeChange = () => {
      const newTheme = localStorage.getItem("theme") || "dark";
      setCurrentTheme(newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
    };

    // Listen for storage changes from other components
    window.addEventListener("storage", handleThemeChange);

    // Custom event listener for theme changes within the same page
    window.addEventListener("themeChanged", handleThemeChange);

    return () => {
      window.removeEventListener("storage", handleThemeChange);
      window.removeEventListener("themeChanged", handleThemeChange);
    };
  }, []);

  return (
    <div data-theme={currentTheme}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/note/:id" element={<NoteDetailPage />} />
      </Routes>
    </div>
  );
};

export default App;
