import {
  PenSquareIcon,
  Trash2Icon,
  CalendarIcon,
  EyeIcon,
  HeartIcon,
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

  const getRandomGradient = () => {
    const gradients = [
      "from-purple-500/5 to-pink-500/5 border-purple-200/20",
      "from-blue-500/5 to-cyan-500/5 border-blue-200/20",
      "from-green-500/5 to-emerald-500/5 border-green-200/20",
      "from-orange-500/5 to-red-500/5 border-orange-200/20",
      "from-indigo-500/5 to-purple-500/5 border-indigo-200/20",
      "from-teal-500/5 to-green-500/5 border-teal-200/20",
    ];
    const selected =
      gradients[Math.abs(note._id.charCodeAt(0)) % gradients.length];
    const [gradient, border] = selected.split(" border-");
    return { gradient, border };
  };

  const { gradient, border } = getRandomGradient();

  return (
    <Link
      to={`/note/${note._id}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`
        relative overflow-hidden bg-gradient-to-br ${gradient} 
        bg-base-100 border border-${border} rounded-2xl p-6 
        transform transition-all duration-500 ease-out
        hover:scale-105 hover:shadow-2xl hover:shadow-primary/20
        hover:border-primary/30 hover:-translate-y-2
        ${isDeleting ? "opacity-50 scale-95" : ""}
      `}
      >
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
          <div className="w-full h-full bg-gradient-to-br from-primary to-secondary rounded-full blur-3xl"></div>
        </div>

        {/* Top Actions Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
              Note
            </span>
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
              className="p-2 hover:bg-base-200 rounded-lg transition-colors group/btn"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // View action - could navigate to detail
              }}
              title="View note"
            >
              <EyeIcon className="size-4 text-base-content/60 group-hover/btn:text-primary transition-colors" />
            </button>

            <button
              className={`
                p-2 hover:bg-red-50 rounded-lg transition-all duration-200
                ${isDeleting ? "animate-spin" : ""}
              `}
              onClick={(e) => handleDelete(e, note._id)}
              disabled={isDeleting}
              title="Delete note"
            >
              <Trash2Icon className="size-4 text-base-content/60 hover:text-red-500 transition-colors" />
            </button>
          </div>
        </div>

        {/* Note Content */}
        <div className="space-y-4">
          {/* Title */}
          <h3 className="text-xl font-bold text-base-content leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {note.title}
          </h3>

          {/* Content Preview */}
          <p className="text-base-content/70 text-sm leading-relaxed line-clamp-4">
            {truncateContent(note.content)}
          </p>

          {/* Stats & Meta */}
          <div className="flex items-center justify-between pt-4 border-t border-base-content/10">
            <div className="flex items-center gap-2 text-xs text-base-content/60">
              <CalendarIcon className="size-3" />
              <span>{formatDate(note.createdAt)}</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Word Count */}
              <div className="flex items-center gap-1 text-xs text-base-content/50">
                <span>{note.content.split(" ").length} words</span>
              </div>

              {/* Read More Indicator */}
              <div
                className={`
                flex items-center gap-1 text-xs font-medium text-primary
                transition-all duration-300
                ${
                  isHovered
                    ? "translate-x-0 opacity-100"
                    : "translate-x-2 opacity-0"
                }
              `}
              >
                <span>Read more</span>
                <PenSquareIcon className="size-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Hover Shine Effect */}
        <div
          className={`
          absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
          transform transition-transform duration-1000
          ${isHovered ? "translate-x-full" : "-translate-x-full"}
        `}
        ></div>
      </div>
    </Link>
  );
};

export default NoteCard;
