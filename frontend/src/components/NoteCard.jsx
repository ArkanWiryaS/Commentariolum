import {
  PenSquareIcon,
  Trash2Icon,
  CalendarIcon,
  EyeIcon,
  HeartIcon,
  BookOpenIcon,
  ClockIcon,
} from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import axios from "axios";

const NoteCard = ({ note, setNotes }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await axios.delete(`http://localhost:5001/api/notes/${id}`);
      toast.success("Note deleted successfully");
      setNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (error) {
      console.log("Delete error:", error);
      toast.error("Failed to delete note");
      setIsDeleting(false);
    }
  };

  const truncateContent = (content, maxLength = 120) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + "...";
  };

  const getCardVariant = () => {
    const variants = [
      "variant-1",
      "variant-2",
      "variant-3",
      "variant-4",
      "variant-5",
      "variant-6",
    ];
    return variants[Math.abs(note._id.charCodeAt(0)) % variants.length];
  };

  const getWordCount = () => note.content.split(" ").length;
  const getReadingTime = () => Math.ceil(getWordCount() / 200);

  const variant = getCardVariant();

  return (
    <Link
      to={`/note/${note._id}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <article
        className={`
        relative overflow-hidden 
        bg-base-100 hover:bg-base-200/50
        border border-base-content/10 hover:border-primary/30
        rounded-2xl p-6
        shadow-md hover:shadow-xl hover:shadow-primary/10
        transform transition-all duration-300 ease-out
        hover:scale-[1.02] hover:-translate-y-1
        ${isDeleting ? "opacity-50 scale-95" : ""}
      `}
      >
        {/* Accent Strip */}
        <div
          className={`
            absolute top-0 left-0 w-full h-1 bg-gradient-to-r 
            ${variant === "variant-1" ? "from-primary to-secondary" : ""}
            ${variant === "variant-2" ? "from-secondary to-accent" : ""}
            ${variant === "variant-3" ? "from-accent to-primary" : ""}
            ${variant === "variant-4" ? "from-info to-success" : ""}
            ${variant === "variant-5" ? "from-warning to-error" : ""}
            ${variant === "variant-6" ? "from-success to-info" : ""}
            rounded-t-2xl
          `}
        ></div>

        {/* Header */}
        <header className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
              <BookOpenIcon className="size-4" />
            </div>
            <div>
              <div className="text-xs font-medium text-primary uppercase tracking-wider">
                Note
              </div>
              <div className="flex items-center gap-2 text-xs text-base-content/60 mt-1">
                <CalendarIcon className="size-3" />
                <span>{formatDate(note.createdAt)}</span>
              </div>
            </div>
          </div>

          <div
            className={`
            flex items-center gap-1 transition-all duration-300
            ${
              isHovered
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-2"
            }
          `}
          >
            <button
              className="p-2 hover:bg-base-300 text-base-content/60 hover:text-base-content rounded-lg transition-all duration-200"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              title="View note"
            >
              <EyeIcon className="size-4" />
            </button>

            <button
              className={`
                p-2 hover:bg-error/10 text-base-content/60 hover:text-error rounded-lg transition-all duration-200
                ${isDeleting ? "animate-pulse" : ""}
              `}
              onClick={(e) => handleDelete(e, note._id)}
              disabled={isDeleting}
              title="Delete note"
            >
              <Trash2Icon className="size-4" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="space-y-4">
          <h3 className="text-xl font-bold text-base-content leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {note.title}
          </h3>

          <p className="text-base-content/70 text-sm leading-relaxed line-clamp-3">
            {truncateContent(note.content)}
          </p>
        </main>

        {/* Footer */}
        <footer className="flex items-center justify-between pt-4 mt-4 border-t border-base-content/10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-xs text-base-content/60">
              <span className="font-medium">{getWordCount()}</span>
              <span>words</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-base-content/60">
              <ClockIcon className="size-3" />
              <span>{getReadingTime()} min</span>
            </div>
          </div>

          <div
            className={`
            flex items-center gap-1 text-xs font-semibold text-primary
            transition-all duration-300
            ${
              isHovered
                ? "translate-x-0 opacity-100"
                : "translate-x-3 opacity-0"
            }
          `}
          >
            <span>Read more</span>
            <PenSquareIcon className="size-3" />
          </div>
        </footer>

        {/* Hover Glow Effect */}
        <div
          className={`
          absolute inset-0 bg-primary/5 rounded-2xl
          opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none
        `}
        ></div>
      </article>
    </Link>
  );
};

export default NoteCard;
