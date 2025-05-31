import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import api from "../../lib/axios";
import toast from "react-hot-toast";
import {
  ArrowLeftIcon,
  LoaderIcon,
  Trash2Icon,
  SaveIcon,
  EditIcon,
  CalendarIcon,
  ClockIcon,
} from "lucide-react";

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getWordCount = (text) => {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  const getReadingTime = (text) => {
    const words = getWordCount(text);
    const minutes = Math.ceil(words / 200); // Average reading speed
    return minutes;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-primary/30 rounded-full animate-pulse"></div>
            <LoaderIcon className="absolute inset-0 m-auto animate-spin size-10 text-primary" />
          </div>
          <p className="mt-4 text-base-content/70 font-medium">
            Loading your note...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300">
      {/* Header with glassmorphism effect */}
      <div className="sticky top-0 z-10 backdrop-blur-md bg-base-100/70 border-b border-base-content/10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-base-100/60 hover:bg-base-100/80 border border-base-content/20 transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              <ArrowLeftIcon className="h-5 w-5 text-base-content/70 group-hover:text-primary transition-colors" />
              <span className="font-medium text-base-content group-hover:text-primary">
                Back to Notes
              </span>
            </Link>

            <button
              onClick={handleDelete}
              disabled={deleting}
              className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-error/10 hover:bg-error/20 border border-error/30 text-error hover:text-error transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleting ? (
                <LoaderIcon className="h-5 w-5 animate-spin" />
              ) : (
                <Trash2Icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
              )}
              <span className="font-medium">
                {deleting ? "Deleting..." : "Delete Note"}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Note metadata card */}
          <div className="mb-6 p-6 rounded-2xl bg-base-100/60 backdrop-blur-sm border border-base-content/10 shadow-lg">
            <div className="flex flex-wrap items-center gap-6 text-sm text-base-content/60">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-primary" />
                <span>Created: {formatDate(note.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="h-4 w-4 text-secondary" />
                <span>Updated: {formatDate(note.updatedAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <EditIcon className="h-4 w-4 text-accent" />
                <span>{getWordCount(note.content)} words</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-warning rounded-full"></span>
                <span>{getReadingTime(note.content)} min read</span>
              </div>
            </div>
          </div>

          {/* Main editing card */}
          <div className="bg-base-100/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-base-content/10 overflow-hidden">
            <div className="p-8">
              {/* Title section */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-base-content/80 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Note Title
                </label>
                <input
                  type="text"
                  placeholder="Enter your note title..."
                  className="w-full px-6 py-4 text-2xl font-bold bg-base-200/50 border-2 border-base-content/20 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-300 placeholder-base-content/40 text-base-content"
                  value={note.title}
                  onChange={(e) => setNote({ ...note, title: e.target.value })}
                />
              </div>

              {/* Content section */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-base-content/80 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  Note Content
                </label>
                <textarea
                  placeholder="Start writing your thoughts..."
                  className="w-full px-6 py-4 h-96 bg-base-200/50 border-2 border-base-content/20 rounded-2xl focus:border-secondary focus:ring-4 focus:ring-secondary/20 transition-all duration-300 placeholder-base-content/40 resize-none text-base-content leading-relaxed"
                  value={note.content}
                  onChange={(e) =>
                    setNote({ ...note, content: e.target.value })
                  }
                />
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-4">
                <Link
                  to="/"
                  className="px-6 py-3 rounded-xl bg-base-200 hover:bg-base-300 text-base-content font-medium transition-all duration-300 hover:shadow-lg"
                >
                  Cancel
                </Link>
                <button
                  className="group px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-content font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
                  disabled={saving}
                  onClick={handleSave}
                >
                  {saving ? (
                    <>
                      <LoaderIcon className="h-5 w-5 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <SaveIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
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
    </div>
  );
};
export default NoteDetailPage;
