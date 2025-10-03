import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";

// Public Pages
import LandingPage from "./pages/LandingPage";
import StudentRegistration from "./pages/StudentRegistration";
import TryoutPage from "./pages/TryoutPage";
import ResultPage from "./pages/ResultPage";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageCategories from "./pages/admin/ManageCategories";
import ManageQuestions from "./pages/admin/ManageQuestions";
import ViewResults from "./pages/admin/ViewResults";

const App = () => {
  const [currentTheme, setCurrentTheme] = useState("coffee");

  useEffect(() => {
    // Get saved theme from localStorage or use default
    const savedTheme = localStorage.getItem("theme") || "coffee";
    setCurrentTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  // Listen for theme changes
  useEffect(() => {
    const handleThemeChange = () => {
      const newTheme = localStorage.getItem("theme") || "coffee";
      setCurrentTheme(newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
    };

    window.addEventListener("storage", handleThemeChange);
    window.addEventListener("themeChanged", handleThemeChange);

    return () => {
      window.removeEventListener("storage", handleThemeChange);
      window.removeEventListener("themeChanged", handleThemeChange);
    };
  }, []);

  return (
    <AuthProvider>
      <div data-theme={currentTheme}>
        <Toaster position="top-center" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<StudentRegistration />} />
          <Route path="/tryout/:sessionId" element={<TryoutPage />} />
          <Route path="/result/:sessionId" element={<ResultPage />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute>
                <ManageCategories />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/questions"
            element={
              <ProtectedRoute>
                <ManageQuestions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/results"
            element={
              <ProtectedRoute>
                <ViewResults />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  );
};

export default App;
