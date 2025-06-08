import {
  TrashIcon,
  DownloadIcon,
  CopyIcon,
  EyeIcon,
  ClockIcon,
  FolderIcon,
} from "lucide-react";
import React from "react";
import { Link } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";

const NoteCard = ({
  note,
  setNotes,
  viewMode = "grid",
  isSelected = false,
  onSelect,
  onExport,
  onDuplicate,
  showBulkActions = false,
  getCategoryName,
  getCategoryIcon,
  getCategoryColorClass,
}) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();

    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await axios.delete(`https://202.74.74.144/api/notes/${id}`);
        setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
        toast.success("Note deleted successfully");
      } catch (error) {
        console.error("Error deleting note:", error);
        toast.error("Failed to delete note");
      }
    }
  };

  const handleCardClick = (e) => {
    if (showBulkActions) {
      e.preventDefault();
      onSelect(note._id);
    }
    // If not in bulk actions mode, allow normal navigation via Link
  };

  const truncateContent = (content, maxLength = 120) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  const getCardVariant = () => {
    if (viewMode === "list") {
      return "w-full bg-base-100 border border-base-content/10 rounded-xl p-4 hover:border-primary/30 hover:shadow-md transition-all duration-300";
    }
    return `bg-base-100 border border-base-content/10 rounded-xl p-4 hover:border-primary/30 hover:shadow-md transition-all duration-300 ${
      isSelected ? "ring-2 ring-primary border-primary" : ""
    }`;
  };

  const getWordCount = () => note.content.split(" ").length;
  const getReadingTime = () => Math.ceil(getWordCount() / 200);

  const getCategoryInfo = () => {
    if (!note.categoryId) return null;

    const categoryName = getCategoryName(note.categoryId);
    const categoryIcon = getCategoryIcon(note.categoryId);
    const categoryColorClass = getCategoryColorClass(note.categoryId);

    if (!categoryName) return null;

    return {
      name: categoryName,
      icon: categoryIcon,
      colorClass: categoryColorClass,
    };
  };

  const categoryInfo = getCategoryInfo();

  const cardContent = (
    <div className={getCardVariant()} onClick={handleCardClick}>
      {/* Selection checkbox for bulk actions */}
      {showBulkActions && (
        <div className="mb-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(note._id)}
            className="checkbox checkbox-primary"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Category Badge */}
      {categoryInfo && (
        <div className="flex items-center gap-2 mb-3">
          <div
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${categoryInfo.colorClass}`}
          >
            {categoryInfo.icon}
            <span>{categoryInfo.name}</span>
          </div>
        </div>
      )}

      {/* Note Content */}
      <div className="space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-base-content text-lg leading-tight line-clamp-2">
          {note.title}
        </h3>

        {/* Content Preview */}
        <p className="text-base-content/70 text-sm leading-relaxed line-clamp-3">
          {truncateContent(note.content)}
        </p>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-base-content/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <ClockIcon className="size-3" />
              <span>{formatDate(note.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <EyeIcon className="size-3" />
              <span>{getReadingTime()} min read</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-base-content/10">
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onExport(note);
            }}
            className="btn btn-xs btn-ghost text-base-content/60 hover:text-primary"
            title="Export note"
          >
            <DownloadIcon className="size-3" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDuplicate(note);
            }}
            className="btn btn-xs btn-ghost text-base-content/60 hover:text-primary"
            title="Duplicate note"
          >
            <CopyIcon className="size-3" />
          </button>
        </div>

        <button
          onClick={(e) => handleDelete(e, note._id)}
          className="btn btn-xs btn-ghost text-base-content/60 hover:text-error"
          title="Delete note"
        >
          <TrashIcon className="size-3" />
        </button>
      </div>
    </div>
  );

  // Wrap with Link only if not in bulk actions mode
  if (showBulkActions) {
    return cardContent;
  }

  return (
    <Link to={`/note/${note._id}`} className="block">
      {cardContent}
    </Link>
  );
};

export default NoteCard;
