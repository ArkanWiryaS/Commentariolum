import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import RateLimitedUI from "../components/RateLimitedUI";
import axios from "axios";
import toast from "react-hot-toast";
import NoteCard from "../components/NoteCard";
import {
  PlusIcon,
  BookOpenIcon,
  SparklesIcon,
  LoaderIcon,
  SearchIcon,
  FilterIcon,
  GridIcon,
  ListIcon,
  DownloadIcon,
  TrashIcon,
  CopyIcon,
} from "lucide-react";
import { Link } from "react-router";

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("latest");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/notes");
        console.log(res.data);
        setNotes(res.data);
      } catch (error) {
        console.log("Error fetching notes:", error);
        if (error.response?.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error("Failed to load notes");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const getSortedNotes = () => {
    let sortedNotes = [...notes];

    // Filter by search query
    if (searchQuery.trim()) {
      sortedNotes = sortedNotes.filter(
        (note) =>
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    switch (sortBy) {
      case "latest":
        return sortedNotes.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case "oldest":
        return sortedNotes.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      case "a-z":
        return sortedNotes.sort((a, b) =>
          a.title.toLowerCase().localeCompare(b.title.toLowerCase())
        );
      default:
        return sortedNotes;
    }
  };

  // Bulk Actions
  const handleSelectNote = (noteId) => {
    setSelectedNotes((prev) => {
      if (prev.includes(noteId)) {
        return prev.filter((id) => id !== noteId);
      } else {
        return [...prev, noteId];
      }
    });
  };

  const handleSelectAll = () => {
    const visibleNotes = getSortedNotes();
    if (selectedNotes.length === visibleNotes.length) {
      setSelectedNotes([]);
    } else {
      setSelectedNotes(visibleNotes.map((note) => note._id));
    }
  };

  const handleBulkDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedNotes.length} notes?`
      )
    )
      return;

    try {
      await Promise.all(
        selectedNotes.map((noteId) =>
          axios.delete(`http://localhost:5001/api/notes/${noteId}`)
        )
      );
      setNotes((prev) =>
        prev.filter((note) => !selectedNotes.includes(note._id))
      );
      setSelectedNotes([]);
      setShowBulkActions(false);
      toast.success(`${selectedNotes.length} notes deleted successfully`);
    } catch (error) {
      console.log("Error deleting notes:", error);
      toast.error("Failed to delete some notes");
    }
  };

  // Export functionality
  const exportNote = (note) => {
    const content = `# ${note.title}\n\n${
      note.content
    }\n\n---\nCreated: ${new Date(
      note.createdAt
    ).toLocaleString()}\nUpdated: ${new Date(note.updatedAt).toLocaleString()}`;

    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${note.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Note exported successfully!");
  };

  const exportAllNotes = () => {
    const allContent = getSortedNotes()
      .map(
        (note) =>
          `# ${note.title}\n\n${note.content}\n\n---\nCreated: ${new Date(
            note.createdAt
          ).toLocaleString()}\nUpdated: ${new Date(
            note.updatedAt
          ).toLocaleString()}\n\n`
      )
      .join("\n");

    const blob = new Blob([allContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `all_notes_${new Date().toISOString().split("T")[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("All notes exported successfully!");
  };

  // Duplicate note
  const duplicateNote = async (note) => {
    try {
      const newNote = {
        title: `${note.title} (Copy)`,
        content: note.content,
      };
      const response = await axios.post(
        "http://localhost:5001/api/notes",
        newNote
      );
      setNotes((prev) => [response.data, ...prev]);
      toast.success("Note duplicated successfully!");
    } catch (error) {
      console.log("Error duplicating note:", error);
      toast.error("Failed to duplicate note");
    }
  };

  const filteredNotes = getSortedNotes();

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

        @keyframes shimmer {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }

        .shimmer {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          background-size: 200px 100%;
          animation: shimmer 1.5s infinite;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300">
        <Navbar />
        {isRateLimited && <RateLimitedUI />}

        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 pt-16 pb-12">
            <div className="text-center space-y-8">
              {/* Hero Icon */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl scale-150"></div>
                  <div className="relative bg-primary/10 p-6 rounded-full border border-primary/20 backdrop-blur-sm">
                    <BookOpenIcon className="size-12 text-primary" />
                  </div>
                </div>
              </div>

              {/* Hero Text */}
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold">
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Your Digital
                  </span>
                  <br />
                  <span className="text-base-content">Notebook</span>
                </h1>
                <p className="text-xl text-base-content/70 max-w-2xl mx-auto leading-relaxed">
                  Capture your thoughts, organize your ideas, and never lose
                  track of what matters most.
                </p>
              </div>

              {/* Quick Stats */}
              <div className="flex justify-center items-center gap-8 text-sm text-base-content/60">
                <div className="flex items-center gap-2">
                  <SparklesIcon className="size-4 text-primary" />
                  <span>
                    {notes.length} {notes.length === 1 ? "Note" : "Notes"}
                  </span>
                </div>
                <div className="w-px h-4 bg-base-content/20"></div>
                <div className="flex items-center gap-2">
                  <BookOpenIcon className="size-4 text-secondary" />
                  <span>Always Organized</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 pb-16">
          {/* Enhanced Loading State */}
          {loading && (
            <div className="text-center py-20">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-primary/10 rounded-3xl blur-2xl scale-110 animate-pulse"></div>
                <div className="relative bg-base-100/80 backdrop-blur-sm px-10 py-8 rounded-3xl shadow-2xl border border-base-content/10">
                  <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                      <LoaderIcon className="size-12 text-primary animate-spin" />
                      <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg animate-pulse"></div>
                    </div>
                    <div className="space-y-2">
                      <span className="text-xl font-medium text-base-content block">
                        Loading your notes...
                      </span>
                      <p className="text-base-content/60 text-sm">
                        Preparing your digital sanctuary
                      </p>
                    </div>
                    {/* Loading bars animation */}
                    <div className="flex gap-2">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="w-2 h-8 bg-primary/30 rounded-full animate-pulse"
                          style={{ animationDelay: `${i * 0.2}s` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Empty State */}
          {notes.length === 0 && !loading && !isRateLimited && (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto space-y-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl scale-125 animate-pulse"></div>
                  <div className="relative bg-base-100/90 backdrop-blur-sm p-12 rounded-3xl border border-base-content/10 shadow-2xl">
                    <BookOpenIcon className="size-20 text-base-content/40 mx-auto" />
                    <div className="absolute top-4 right-4">
                      <SparklesIcon className="size-6 text-primary/60 animate-bounce" />
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-3xl font-bold text-base-content">
                    Start Your Journey
                  </h3>
                  <p className="text-lg text-base-content/70">
                    Create your first note and begin organizing your thoughts.
                  </p>
                </div>
                <Link
                  to="/create"
                  className="btn btn-primary btn-lg gap-3 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
                >
                  <PlusIcon className="size-5 group-hover:rotate-90 transition-transform duration-300" />
                  Create Your First Note
                </Link>
              </div>
            </div>
          )}

          {/* Enhanced Filter/Sort/Search Options */}
          {notes.length > 0 && !isRateLimited && (
            <div className="space-y-12">
              {/* Section Header */}
              <div className="relative">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-8 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
                        <BookOpenIcon className="size-8 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-base-content to-base-content/70 bg-clip-text text-transparent">
                          Your Notes
                        </h2>
                        <div className="flex items-center gap-3 mt-2">
                          <p className="text-lg text-base-content/70">
                            {notes.length}{" "}
                            {notes.length === 1 ? "note" : "notes"} in your
                            collection
                          </p>
                          <div className="flex items-center gap-1">
                            <SparklesIcon className="size-4 text-primary animate-pulse" />
                            <span className="text-sm text-primary font-medium">
                              {notes.length > 5 ? "Productive!" : "Growing"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      to="/create"
                      className="btn btn-primary btn-lg gap-3 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group rounded-xl"
                    >
                      <PlusIcon className="size-5 group-hover:rotate-90 transition-transform duration-300" />
                      New Note
                    </Link>
                  </div>
                </div>

                {/* Background decoration */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-2xl -z-10"></div>
              </div>

              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-base-content/40" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search notes by title or content..."
                    className="w-full pl-12 pr-4 py-3 bg-base-100/50 border-2 border-base-content/10 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-300 placeholder-base-content/40"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-base-content/60 hover:text-primary"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Controls Row */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-base-100/30 backdrop-blur-sm rounded-xl border border-base-content/10">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-base-content/70">
                      Sort by:
                    </span>
                    <div className="flex gap-2">
                      <button
                        className={`btn btn-sm transition-all duration-200 rounded-xl ${
                          sortBy === "latest"
                            ? "btn-primary"
                            : "btn-ghost hover:btn-outline hover:btn-primary"
                        }`}
                        onClick={() => setSortBy("latest")}
                      >
                        Latest
                      </button>
                      <button
                        className={`btn btn-sm transition-all duration-200 rounded-xl ${
                          sortBy === "oldest"
                            ? "btn-primary"
                            : "btn-ghost hover:btn-outline hover:btn-primary"
                        }`}
                        onClick={() => setSortBy("oldest")}
                      >
                        Oldest
                      </button>
                      <button
                        className={`btn btn-sm transition-all duration-200 rounded-xl ${
                          sortBy === "a-z"
                            ? "btn-primary"
                            : "btn-ghost hover:btn-outline hover:btn-primary"
                        }`}
                        onClick={() => setSortBy("a-z")}
                      >
                        A-Z
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* View Toggle */}
                    <div className="flex gap-1 p-1 bg-base-200 rounded-lg">
                      <button
                        className={`btn btn-sm transition-all duration-200 ${
                          viewMode === "grid" ? "btn-primary" : "btn-ghost"
                        }`}
                        onClick={() => setViewMode("grid")}
                      >
                        <GridIcon className="h-4 w-4" />
                      </button>
                      <button
                        className={`btn btn-sm transition-all duration-200 ${
                          viewMode === "list" ? "btn-primary" : "btn-ghost"
                        }`}
                        onClick={() => setViewMode("list")}
                      >
                        <ListIcon className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Bulk Actions Toggle */}
                    <button
                      className={`btn btn-sm transition-all duration-200 ${
                        showBulkActions ? "btn-secondary" : "btn-ghost"
                      }`}
                      onClick={() => {
                        setShowBulkActions(!showBulkActions);
                        setSelectedNotes([]);
                      }}
                    >
                      <FilterIcon className="h-4 w-4" />
                      Select
                    </button>

                    {/* Export Button */}
                    <button
                      className="btn btn-sm btn-ghost hover:btn-outline hover:btn-success"
                      onClick={exportAllNotes}
                    >
                      <DownloadIcon className="h-4 w-4" />
                      Export All
                    </button>

                    <div className="flex items-center gap-2 text-sm text-base-content/60">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>
                        {filteredNotes.length} of {notes.length} notes
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bulk Actions Bar */}
                {showBulkActions && (
                  <div className="p-4 bg-secondary/10 border border-secondary/20 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={handleSelectAll}
                      >
                        {selectedNotes.length === filteredNotes.length
                          ? "Deselect All"
                          : "Select All"}
                      </button>
                      <span className="text-sm text-base-content/70">
                        {selectedNotes.length} selected
                      </span>
                    </div>

                    {selectedNotes.length > 0 && (
                      <div className="flex gap-2">
                        <button
                          className="btn btn-sm btn-error"
                          onClick={handleBulkDelete}
                        >
                          <TrashIcon className="h-4 w-4" />
                          Delete ({selectedNotes.length})
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Search Results Info */}
                {searchQuery && (
                  <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl">
                    <p className="text-sm text-primary">
                      {filteredNotes.length === 0
                        ? "No notes found"
                        : `Found ${filteredNotes.length} note${
                            filteredNotes.length !== 1 ? "s" : ""
                          }`}{" "}
                      matching "{searchQuery}"
                    </p>
                  </div>
                )}
              </div>

              {/* Notes Grid/List with Enhanced Layout */}
              <div className="relative">
                {/* Grid Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 rounded-3xl blur-3xl -z-10"></div>

                {filteredNotes.length === 0 && searchQuery ? (
                  // Search Empty State
                  <div className="text-center py-20">
                    <div className="max-w-md mx-auto space-y-6">
                      <SearchIcon className="size-16 text-base-content/40 mx-auto" />
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-base-content">
                          No notes found
                        </h3>
                        <p className="text-base-content/70">
                          Try adjusting your search terms or create a new note.
                        </p>
                      </div>
                      <button
                        onClick={() => setSearchQuery("")}
                        className="btn btn-primary"
                      >
                        Clear Search
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`grid gap-8 p-1 ${
                      viewMode === "grid"
                        ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                        : "grid-cols-1 max-w-4xl mx-auto"
                    }`}
                  >
                    {filteredNotes.map((note, index) => (
                      <div
                        key={note._id}
                        className="transform transition-all duration-500 hover:z-10 relative"
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animation: "fadeInUp 0.6s ease-out forwards",
                        }}
                      >
                        {/* Selection Checkbox */}
                        {showBulkActions && (
                          <div className="absolute top-2 left-2 z-20">
                            <input
                              type="checkbox"
                              checked={selectedNotes.includes(note._id)}
                              onChange={() => handleSelectNote(note._id)}
                              className="checkbox checkbox-primary"
                            />
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="absolute top-2 right-2 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => duplicateNote(note)}
                            className="btn btn-xs btn-ghost bg-base-100/80 hover:bg-base-100"
                            title="Duplicate note"
                          >
                            <CopyIcon className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => exportNote(note)}
                            className="btn btn-xs btn-ghost bg-base-100/80 hover:bg-base-100"
                            title="Export note"
                          >
                            <DownloadIcon className="h-3 w-3" />
                          </button>
                        </div>

                        <div className="group">
                          <NoteCard
                            note={note}
                            setNotes={setNotes}
                            viewMode={viewMode}
                            isSelected={selectedNotes.includes(note._id)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Inspiration Section */}
              <div className="text-center pt-16 pb-8">
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-2xl scale-150"></div>
                    <div className="relative bg-base-100/50 backdrop-blur-sm px-8 py-4 rounded-2xl border border-base-content/10 shadow-2xl">
                      <div className="flex items-center justify-center gap-3">
                        <SparklesIcon className="size-6 text-primary animate-bounce" />
                        <span className="text-lg font-medium bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                          Keep writing, keep growing
                        </span>
                        <SparklesIcon
                          className="size-6 text-secondary animate-bounce"
                          style={{ animationDelay: "0.5s" }}
                        />
                      </div>
                    </div>
                  </div>

                  <p className="text-base-content/60 max-w-md mx-auto">
                    Every note is a step forward in your journey of knowledge
                    and creativity.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;
