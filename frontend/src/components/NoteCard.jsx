import {
  PenSquareIcon,
  Trash2Icon,
  CalendarIcon,
  EyeIcon,
  HeartIcon,
  BookOpenIcon,
  ClockIcon,
  FolderIcon,
  TagIcon,
} from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import axios from "axios";

const NoteCard = ({
  note,
  setNotes,
  viewMode = "grid",
  isSelected = false,
}) => {
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

  // Category utility functions
  const getCategoryIcon = (iconName) => {
    const iconMap = {
      'Folder': FolderIcon,
      'Tag': TagIcon,
    };
    return iconMap[iconName] || FolderIcon;
  };

  const getCategoryColorClass = (color) => {
    const colorMap = {
      'primary': 'text-primary bg-primary/10 border-primary/20',
      'secondary': 'text-secondary bg-secondary/10 border-secondary/20',
      'accent': 'text-accent bg-accent/10 border-accent/20',
      'info': 'text-info bg-info/10 border-info/20',
      'success': 'text-success bg-success/10 border-success/20',
      'warning': 'text-warning bg-warning/10 border-warning/20',
      'error': 'text-error bg-error/10 border-error/20',
      'neutral': 'text-neutral bg-neutral/10 border-neutral/20',
    };
    return colorMap[color] || colorMap.primary;
  };

  const variant = getCardVariant();

  // List view layout
  if (viewMode === "list") {
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
          rounded-xl p-6
          shadow-sm hover:shadow-md hover:shadow-primary/10
          transform transition-all duration-300 ease-out
          hover:scale-[1.01]
          ${isDeleting ? "opacity-50 scale-95" : ""}
          ${isSelected ? "ring-2 ring-primary ring-offset-2" : ""}
          flex items-center gap-6
        `}
        >
          {/* Accent Strip */}
          <div
            className={`
              absolute left-0 top-0 w-1 h-full bg-gradient-to-b 
              ${variant === "variant-1" ? "from-primary to-secondary" : ""}
              ${variant === "variant-2" ? "from-secondary to-accent" : ""}
              ${variant === "variant-3" ? "from-accent to-primary" : ""}
              ${variant === "variant-4" ? "from-info to-success" : ""}
              ${variant === "variant-5" ? "from-warning to-error" : ""}
              ${variant === "variant-6" ? "from-success to-info" : ""}
              rounded-l-xl
            `}
          ></div>

          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <BookOpenIcon className="size-6" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-base-content leading-tight group-hover:text-primary transition-colors duration-300 truncate">
                  {note.title}
                </h3>
                {/* Category Badge */}
                {note.categoryId && (
                  <div className="flex items-center gap-1 mt-1">
                    {React.createElement(getCategoryIcon(note.categoryId.icon), {
                      className: `size-3 ${getCategoryColorClass(note.categoryId.color).split(' ')[0]}`
                    })}
                    <span className={`text-xs px-2 py-1 rounded-md ${getCategoryColorClass(note.categoryId.color)} font-medium`}>
                      {note.categoryId.name}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs text-base-content/60 ml-4">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="size-3" />
                  <span>{formatDate(note.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">{getWordCount()}</span>
                  <span>words</span>
                </div>
                <div className="flex items-center gap-1">
                  <ClockIcon className="size-3" />
                  <span>{getReadingTime()} min</span>
                </div>
              </div>
            </div>

            <p className="text-base-content/70 text-sm leading-relaxed line-clamp-2">
              {truncateContent(note.content, 200)}
            </p>
          </div>

          {/* Actions */}
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
        </article>
      </Link>
    );
  }

  // Grid view layout (default)
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
        ${isSelected ? "ring-2 ring-primary ring-offset-2" : ""}
        h-full flex flex-col
      `}
      >
        {/* Top accent line */}
        <div
          className={`
            absolute top-0 left-0 w-full h-1 bg-gradient-to-r 
            ${variant === "variant-1" ? "from-primary to-secondary" : ""}
            ${variant === "variant-2" ? "from-secondary to-accent" : ""}
            ${variant === "variant-3" ? "from-accent to-primary" : ""}
            ${variant === "variant-4" ? "from-info to-success" : ""}
            ${variant === "variant-5" ? "from-warning to-error" : ""}
            ${variant === "variant-6" ? "from-success to-info" : ""}
          `}
        ></div>

        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-20 h-20 opacity-20">
          <div
            className={`
              w-full h-full rounded-full blur-2xl 
              ${variant === "variant-1" ? "bg-primary/30" : ""}
              ${variant === "variant-2" ? "bg-secondary/30" : ""}
              ${variant === "variant-3" ? "bg-accent/30" : ""}
              ${variant === "variant-4" ? "bg-info/30" : ""}
              ${variant === "variant-5" ? "bg-warning/30" : ""}
              ${variant === "variant-6" ? "bg-success/30" : ""}
            `}
          ></div>
        </div>

        {/* Header with category */}
        <div className="relative z-10 mb-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-base-content leading-tight group-hover:text-primary transition-colors duration-300 line-clamp-2 mb-2">
                {note.title}
              </h3>
              {/* Category Badge */}
              {note.categoryId && (
                <div className="flex items-center gap-2">
                  {React.createElement(getCategoryIcon(note.categoryId.icon), {
                    className: `size-4 ${getCategoryColorClass(note.categoryId.color).split(' ')[0]}`
                  })}
                  <span className={`text-xs px-2 py-1 rounded-lg ${getCategoryColorClass(note.categoryId.color)} font-medium`}>
                    {note.categoryId.name}
                  </span>
                </div>
              )}
            </div>
            
            {/* Quick action buttons */}
            <div
              className={`
                flex items-center gap-1 transition-all duration-300
                ${
                  isHovered
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-1"
                }
              `}
            >
              <button
                className="p-1.5 hover:bg-base-300 text-base-content/60 hover:text-base-content rounded-lg transition-all duration-200"
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
                  p-1.5 hover:bg-error/10 text-base-content/60 hover:text-error rounded-lg transition-all duration-200
                  ${isDeleting ? "animate-pulse" : ""}
                `}
                onClick={(e) => handleDelete(e, note._id)}
                disabled={isDeleting}
                title="Delete note"
              >
                <Trash2Icon className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content preview */}
        <div className="relative z-10 flex-1 mb-4">
          <p className="text-base-content/70 text-sm leading-relaxed line-clamp-4">
            {truncateContent(note.content)}
          </p>
        </div>

        {/* Footer with metadata */}
        <div className="relative z-10 pt-4 border-t border-base-content/10">
          <div className="flex items-center justify-between text-xs text-base-content/60">
            <div className="flex items-center gap-1">
              <CalendarIcon className="size-3" />
              <span>{formatDate(note.createdAt)}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="font-medium">{getWordCount()}</span>
                <span>words</span>
              </div>
              <div className="flex items-center gap-1">
                <ClockIcon className="size-3" />
                <span>{getReadingTime()} min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
      </article>
    </Link>
  );
};

export default NoteCard;
