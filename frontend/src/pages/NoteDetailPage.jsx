import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import api from "../../lib/axios";
import toast from "react-hot-toast";
import {
  ArrowLeftIcon,
  LoaderIcon,
  Trash2Icon,
  EditIcon,
  SaveIcon,
  BookOpenIcon,
  SparklesIcon,
  CalendarIcon,
  ClockIcon,
  PenSquareIcon,
} from "lucide-react";
import Navbar from "../components/Navbar";

const NoteDetailPage = () => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setNote(res.data);
      } catch (error) {
        console.log("Error in fetching note", error);
        toast.error("Failed to fetch the note");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    setDeleting(true);
    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted successfully");
      navigate("/");
    } catch (error) {
      console.log("Error deleting the note:", error);
      toast.error("Failed to delete note");
    } finally {
      setDeleting(false);
    }
  };

  const handleSave = async () => {
    if (!note.title.trim() || !note.content.trim()) {
      toast.error("Please add a title or content");
      return;
    }

    setSaving(true);

    try {
      await api.put(`/notes/${id}`, note);
      toast.success("Note updated successfully");
      navigate("/");
    } catch (error) {
      console.log("Error saving the note:", error);
      toast.error("Failed to update note");
    } finally {
      setSaving(false);
    }
  };

  const getWordCount = () => {
    if (!note?.content) return 0;
    return note.content.split(" ").filter((word) => word.length > 0).length;
  };

  const getCharCount = () => {
    return note?.content?.length || 0;
  };

  const getReadingTime = () => {
    const wordsPerMinute = 200;
    const words = getWordCount();
    const time = Math.ceil(words / wordsPerMinute);
    return time < 1 ? "< 1 min read" : `${time} min read`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <>
        <style jsx>{`
          @keyframes pulse {
            0%,
            100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
          .pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
        `}</style>

        <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300">
          <Navbar />
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl scale-150"></div>
                <div className="relative bg-primary/10 p-6 rounded-full border border-primary/20 backdrop-blur-sm">
                  <LoaderIcon className="size-12 text-primary animate-spin" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-base-content">
                  Loading your note...
                </h3>
                <p className="text-base-content/60">
                  Please wait while we fetch your content
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

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

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300">
        <Navbar />

        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 pt-12 pb-8">
            <div className="fade-in-up">
              {/* Navigation & Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <Link
                  to="/"
                  className="flex items-center gap-2 px-4 py-2 bg-base-100/80 hover:bg-base-100 backdrop-blur-sm border border-base-content/10 hover:border-primary/30 rounded-xl transition-all duration-300 group"
                >
                  <ArrowLeftIcon className="size-4 group-hover:-translate-x-1 transition-transform duration-300" />
                  <span className="font-medium">Back to Notes</span>
                </Link>

                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 bg-error/10 hover:bg-error/20 text-error border border-error/20 hover:border-error/40 rounded-xl transition-all duration-300 group"
                >
                  <Trash2Icon className="size-4 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-medium">Delete Note</span>
                </button>
              </div>

              {/* Hero Content */}
              <div className="text-center space-y-6">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl scale-150"></div>
                  <div className="relative bg-primary/10 p-6 rounded-full border border-primary/20 backdrop-blur-sm float">
                    <EditIcon className="size-12 text-primary" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl font-bold">
                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      Edit Note
                    </span>
                  </h1>
                  <p className="text-lg text-base-content/70 max-w-2xl mx-auto leading-relaxed">
                    Refine your thoughts and make your note even better
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 pb-16">
          <div className="fade-in-up" style={{ animationDelay: "0.2s" }}>
            {/* Note Metadata Card */}
            <div className="mb-6 p-6 bg-base-100/60 backdrop-blur-sm border border-base-content/10 rounded-2xl">
              <div className="flex flex-wrap items-center gap-6 text-sm text-base-content/70">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="size-4 text-primary" />
                  <span>Created: {formatDate(note.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="size-4 text-secondary" />
                  <span>{getReadingTime()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpenIcon className="size-4 text-accent" />
                  <span>{getWordCount()} words</span>
                </div>
                {note.updatedAt !== note.createdAt && (
                  <div className="flex items-center gap-2">
                    <EditIcon className="size-4 text-info" />
                    <span>Updated: {formatDate(note.updatedAt)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Edit Form Card */}
            <div className="relative overflow-hidden bg-base-100 border border-base-content/10 rounded-3xl shadow-xl backdrop-blur-sm">
              {/* Accent Strip */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary rounded-t-3xl"></div>

              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-2xl"></div>
              </div>

              <div className="p-8 space-y-8">
                {/* Form Header */}
                <div className="flex items-center gap-4 pb-6 border-b border-base-content/10">
                  <div className="p-3 bg-primary/10 text-primary rounded-xl">
                    <BookOpenIcon className="size-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-base-content">
                      Edit Note Details
                    </h2>
                    <p className="text-base-content/60">
                      Make changes to your note content below
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
                      value={note.title}
                      onChange={(e) =>
                        setNote({ ...note, title: e.target.value })
                      }
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
                      className="w-full px-4 py-4 bg-base-200/50 border border-base-content/10 rounded-2xl focus:border-primary focus:bg-base-100 transition-all duration-300 text-base leading-relaxed placeholder:text-base-content/40 min-h-[300px] resize-none"
                      value={note.content}
                      onChange={(e) =>
                        setNote({ ...note, content: e.target.value })
                      }
                      rows={12}
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-base-content/10">
                  <div className="flex items-center gap-2 text-sm text-base-content/60">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span>Auto-save enabled</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      to="/"
                      className="px-6 py-3 text-base-content/70 hover:text-base-content font-medium rounded-xl transition-colors duration-300"
                    >
                      Cancel
                    </Link>

                    <button
                      onClick={handleSave}
                      disabled={
                        saving || !note.title.trim() || !note.content.trim()
                      }
                      className="relative px-8 py-3 bg-primary hover:bg-primary/90 text-primary-content font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {saving ? (
                        <>
                          <LoaderIcon className="size-4 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <SaveIcon className="size-4" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Footer Inspiration */}
              <div className="px-8 pb-8">
                <div className="text-center p-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl border border-primary/10">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <SparklesIcon className="size-5 text-primary animate-bounce" />
                    <span className="text-sm font-medium text-primary">
                      Editing Tip
                    </span>
                  </div>
                  <p className="text-sm text-base-content/70">
                    Take your time to refine your ideas. Great notes evolve with
                    thoughtful editing!
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom gradient accent */}
            <div className="h-2 bg-gradient-to-r from-primary via-secondary to-accent"></div>
          </div>

          {/* Tips section */}
          <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
            <h3 className="font-semibold text-base-content mb-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              Writing Tips
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-base-content/70">
              <div className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>
                  Use clear, descriptive titles for better organization
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-secondary">•</span>
                <span>Break long content into paragraphs for readability</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-accent">•</span>
                <span>
                  Your changes are automatically saved when you click Save
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-warning">•</span>
                <span>Use the word count to track your writing progress</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NoteDetailPage;
