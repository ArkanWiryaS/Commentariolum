import {
  ArrowLeftIcon,
  PenSquareIcon,
  SparklesIcon,
  BookOpenIcon,
  LoaderIcon,
  SaveIcon,
} from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import axios from "axios";
import Navbar from "../components/Navbar";

const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post("http://localhost:5001/api/notes", {
        title,
        content,
      });
      toast.success("Note created successfully");
      navigate("/");
    } catch (error) {
      toast.error("Failed to create note");
      if (error.response.status === 429) {
        toast.error("Too many requests, please try again later");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getWordCount = () =>
    content.split(" ").filter((word) => word.length > 0).length;
  const getCharCount = () => content.length;

  return (
    <>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300">
        <Navbar />

        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 pt-12 pb-8">
            <div className="text-center space-y-6 fade-in-up">
              {/* Back Button & Hero Icon */}
              <div className="flex flex-col items-center gap-6">
                <Link
                  to="/"
                  className="self-start flex items-center gap-2 px-4 py-2 bg-base-100/80 hover:bg-base-100 backdrop-blur-sm border border-base-content/10 hover:border-primary/30 rounded-xl transition-all duration-300 group"
                >
                  <ArrowLeftIcon className="size-4 group-hover:-translate-x-1 transition-transform duration-300" />
                  <span className="font-medium">Back to Notes</span>
                </Link>

                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl scale-150"></div>
                  <div className="relative bg-primary/10 p-6 rounded-full border border-primary/20 backdrop-blur-sm">
                    <PenSquareIcon className="size-12 text-primary" />
                  </div>
                </div>
              </div>

              {/* Hero Text */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold">
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Create New Note
                  </span>
                </h1>
                <p className="text-lg text-base-content/70 max-w-2xl mx-auto leading-relaxed">
                  Capture your thoughts, ideas, and inspirations in a beautiful,
                  organized way.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 pb-16">
          <div className="fade-in-up" style={{ animationDelay: "0.2s" }}>
            {/* Form Card */}
            <div className="relative overflow-hidden bg-base-100 border border-base-content/10 rounded-3xl shadow-xl backdrop-blur-sm">
              {/* Accent Strip */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary rounded-t-3xl"></div>

              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-2xl"></div>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-8">
                {/* Form Header */}
                <div className="flex items-center gap-4 pb-6 border-b border-base-content/10">
                  <div className="p-3 bg-primary/10 text-primary rounded-xl">
                    <BookOpenIcon className="size-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-base-content">
                      Note Details
                    </h2>
                    <p className="text-base-content/60">
                      Fill in the information below to create your note
                    </p>
                  </div>
                </div>

                {/* Title Field */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-semibold text-base-content">
                    <SparklesIcon className="size-4 text-primary" />
                    Title
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter a compelling title for your note..."
                      className="w-full px-4 py-4 bg-base-200/50 border border-base-content/10 rounded-2xl focus:border-primary focus:bg-base-100 transition-all duration-300 text-lg font-medium placeholder:text-base-content/40"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>

                {/* Content Field */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm font-semibold text-base-content">
                      <PenSquareIcon className="size-4 text-primary" />
                      Content
                    </label>
                    <div className="flex items-center gap-4 text-xs text-base-content/60">
                      <span>{getCharCount()} characters</span>
                      <span>•</span>
                      <span>{getWordCount()} words</span>
                    </div>
                  </div>
                  <div className="relative">
                    <textarea
                      placeholder="Write your note content here... Let your thoughts flow freely!"
                      className="w-full px-4 py-4 bg-base-200/50 border border-base-content/10 rounded-2xl focus:border-primary focus:bg-base-100 transition-all duration-300 text-base leading-relaxed placeholder:text-base-content/40 min-h-[200px] resize-none"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={8}
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-base-content/10">
                  <div className="flex items-center gap-2 text-sm text-base-content/60">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Auto-save enabled</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      to="/"
                      className="px-6 py-3 text-base-content/70 hover:text-base-content font-medium rounded-xl "
                    >
                      Cancel
                    </Link>

                    <button
                      type="submit"
                      disabled={loading || !title.trim() || !content.trim()}
                      className="relative px-8 py-3 bg-primary hover:bg-primary/90 text-primary-content font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <LoaderIcon className="size-4 animate-spin" />
                          <span>Creating...</span>
                        </>
                      ) : (
                        <>
                          <SaveIcon className="size-4" />
                          <span>Create Note</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>

              {/* Form Footer Inspiration */}
              <div className="px-8 pb-8">
                <div className="text-center p-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl border border-primary/10">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <SparklesIcon className="size-5 text-primary animate-bounce" />
                    <span className="text-sm font-medium text-primary">
                      Pro Tip
                    </span>
                  </div>
                  <p className="text-sm text-base-content/70">
                    Great notes start with clear titles and detailed content.
                    Take your time to organize your thoughts!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePage;
