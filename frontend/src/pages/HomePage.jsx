import React, { useState, useEffect } from "react";
import {
  SearchIcon,
  PlusIcon,
  Grid3x3Icon,
  ListIcon,
  XIcon,
  TrashIcon,
  CheckIcon,
  CheckCheckIcon,
  DownloadIcon,
  EditIcon,
  CopyIcon,
  CalendarIcon,
  TagIcon,
  FolderIcon,
  FilterIcon,
  SortAscIcon,
  SortDescIcon,
  BookmarkIcon,
  FileTextIcon,
  ClockIcon,
  EyeIcon,
  SettingsIcon,
  ChevronDownIcon,
} from "lucide-react";
import { Link } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";

import Navbar from "../components/Navbar";
import NoteCard from "../components/NoteCard";
import CategoryManager from "../components/CategoryManager";

// DraggableNoteCard component with drag functionality
const DraggableNoteCard = ({ note, setNotes, viewMode, isSelected }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: note._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`${isDragging ? "opacity-50" : ""}`}
    >
      <NoteCard
        note={note}
        setNotes={setNotes}
        viewMode={viewMode}
        isSelected={isSelected}
        isDraggable={true}
      />
    </div>
  );
};

// DroppableCategory component for sidebar categories
const DroppableCategory = ({ 
  category, 
  isSelected, 
  onClick, 
  getCategoryIcon, 
  getCategoryColorClass 
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `category-${category._id}`,
  });

  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      className={`
        relative p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 
        ${isSelected 
          ? "border-primary bg-primary/10 shadow-md" 
          : "border-base-content/10 hover:border-primary/30 hover:bg-base-200/50"
        }
        ${isOver ? "border-primary bg-primary/20 scale-105" : ""}
      `}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${getCategoryColorClass(category.color)}`}>
          {getCategoryIcon(category.icon)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-base-content truncate">
            {category.name}
          </h3>
          <p className="text-xs text-base-content/60">
            {category.noteCount || 0} notes
          </p>
        </div>
      </div>
      
      {isOver && (
        <div className="absolute inset-0 bg-primary/10 rounded-xl border-2 border-primary border-dashed animate-pulse"></div>
      )}
    </div>
  );
};

const HomePage = () => {
  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isManageCategoriesOpen, setIsManageCategoriesOpen] = useState(false);

  // Screen size management for responsive design
  const [screenSize, setScreenSize] = useState("desktop");

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) setScreenSize("mobile");
      else if (width < 1024) setScreenSize("tablet");
      else setScreenSize("desktop");
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchNotes(), fetchCategories()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const fetchNotes = async () => {
    try {
      console.log("Fetching notes...");
      const response = await axios.get("http://localhost:5001/api/notes");
      console.log("Notes fetched:", response.data);
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
      setError("Failed to fetch notes");
      toast.error("Failed to fetch notes");
    }
  };

  const fetchCategories = async () => {
    try {
      console.log("Fetching categories...");
      const response = await axios.get("http://localhost:5001/api/categories");
      console.log("Categories fetched:", response.data);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    }
  };

  const getSortedNotes = () => {
    console.log("getSortedNotes called with:", { 
      selectedCategory, 
      searchTerm, 
      sortBy,
      totalNotes: notes.length,
      categories: categories.length 
    });

    let filtered = [...notes];

    // Category filtering - Fixed to handle both object and string categoryId
    if (selectedCategory !== "all") {
      if (selectedCategory === "uncategorized") {
        filtered = filtered.filter(note => {
          const hasCategory = note.categoryId && 
            (typeof note.categoryId === 'object' ? note.categoryId._id : note.categoryId);
          console.log("Uncategorized filter - Note:", note.title, "hasCategory:", hasCategory);
          return !hasCategory;
        });
      } else {
        filtered = filtered.filter(note => {
          const noteCategoryId = typeof note.categoryId === 'object' 
            ? note.categoryId?._id 
            : note.categoryId;
          const matches = noteCategoryId === selectedCategory;
          console.log("Category filter - Note:", note.title, "noteCategoryId:", noteCategoryId, "selectedCategory:", selectedCategory, "matches:", matches);
          return matches;
        });
      }
    }

    // Search filtering
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(searchLower) ||
          note.content.toLowerCase().includes(searchLower)
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    console.log("Filtered notes:", filtered.length, filtered.map(n => ({ title: n.title, categoryId: n.categoryId })));
    return filtered;
  };

  const handleSelectNote = (noteId) => {
    if (selectedNotes.includes(noteId)) {
      setSelectedNotes(selectedNotes.filter((id) => id !== noteId));
    } else {
      setSelectedNotes([...selectedNotes, noteId]);
    }
  };

  const handleSelectAll = () => {
    const currentNotes = getSortedNotes();
    if (selectedNotes.length === currentNotes.length) {
      setSelectedNotes([]);
    } else {
      setSelectedNotes(currentNotes.map((note) => note._id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedNotes.length === 0) return;

    if (
      !confirm(
        `Are you sure you want to delete ${selectedNotes.length} note(s)?`
      )
    ) {
      return;
    }

    try {
      await Promise.all(
        selectedNotes.map((noteId) =>
          axios.delete(`http://localhost:5001/api/notes/${noteId}`)
        )
      );

      await Promise.all([fetchNotes(), fetchCategories()]);
      setSelectedNotes([]);
      toast.success(`${selectedNotes.length} note(s) deleted successfully`);
    } catch (error) {
      console.error("Error deleting notes:", error);
      toast.error("Failed to delete notes");
    }
  };

  const exportNote = (note) => {
    const content = `# ${note.title}\n\n${note.content}\n\n---\nCreated: ${new Date(
      note.createdAt
    ).toLocaleDateString()}\nUpdated: ${new Date(
      note.updatedAt
    ).toLocaleDateString()}`;

    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${note.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Note exported successfully");
  };

  const exportAllNotes = () => {
    // If bulk actions are active and notes are selected, export only selected notes
    const notesToExport = showBulkActions && selectedNotes.length > 0 
      ? notes.filter(note => selectedNotes.includes(note._id))
      : notes;
      
    if (notesToExport.length === 0) {
      toast.error("No notes to export");
      return;
    }

    const content = notesToExport
      .map(
        (note) =>
          `# ${note.title}\n\n${note.content}\n\n---\nCreated: ${new Date(
            note.createdAt
          ).toLocaleDateString()}\nUpdated: ${new Date(
            note.updatedAt
          ).toLocaleDateString()}\n\n`
      )
      .join("\n");

    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    
    const filename = showBulkActions && selectedNotes.length > 0
      ? `selected_notes_${new Date().toISOString().split("T")[0]}.md`
      : `all_notes_${new Date().toISOString().split("T")[0]}.md`;
    a.download = filename;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    const message = showBulkActions && selectedNotes.length > 0
      ? `${selectedNotes.length} selected note(s) exported successfully`
      : "All notes exported successfully";
    toast.success(message);
  };

  const duplicateNote = async (note) => {
    try {
      const duplicatedNote = {
        title: `${note.title} (Copy)`,
        content: note.content,
        categoryId: note.categoryId,
      };

      await axios.post("http://localhost:5001/api/notes", duplicatedNote);
      await Promise.all([fetchNotes(), fetchCategories()]);
      toast.success("Note duplicated successfully");
    } catch (error) {
      console.error("Error duplicating note:", error);
      toast.error("Failed to duplicate note");
    }
  };

  const getCategoryIcon = (iconName) => {
    const iconMap = {
      folder: FolderIcon,
      tag: () => <span>🏷️</span>,
      bookmark: () => <span>🔖</span>,
      // Add more icon mappings as needed
    };
    const IconComponent = iconMap[iconName?.toLowerCase()] || FolderIcon;
    return <IconComponent className="size-4" />;
  };

  const getCategoryColorClass = (color) => {
    const colorMap = {
      // DaisyUI compatibility  
      primary: "bg-primary/10 text-primary border-primary/20",
      secondary: "bg-secondary/10 text-secondary border-secondary/20",
      accent: "bg-accent/10 text-accent border-accent/20",
      info: "bg-info/10 text-info border-info/20",
      success: "bg-success/10 text-success border-success/20",
      warning: "bg-warning/10 text-warning border-warning/20",
      error: "bg-error/10 text-error border-error/20",
      neutral: "bg-neutral/10 text-neutral border-neutral/20",
    };
    return colorMap[color] || colorMap.primary;
  };

  const getSelectedCategoryName = () => {
    if (selectedCategory === "all") return "All Notes";
    if (selectedCategory === "uncategorized") return "Uncategorized";
    const category = categories.find(cat => cat._id === selectedCategory);
    return category?.name || "Unknown Category";
  };

  const getUncategorizedCount = () => {
    return notes.filter(note => !note.categoryId || 
      (typeof note.categoryId === 'object' && !note.categoryId._id) ||
      (typeof note.categoryId === 'string' && !note.categoryId)
    ).length;
  };

  const handleCategoryChange = async () => {
    console.log("Category change detected, refetching data...");
    await fetchNotes();
    await fetchCategories();
  };

  const handleToggleBulkActions = (value) => {
    setShowBulkActions(value);
    if (!value) {
      setSelectedNotes([]);
    }
  };

  const sortedNotes = getSortedNotes();

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-base-content/70">Loading your notes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <p className="text-error text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary mt-4"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navbar */}
      <Navbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showBulkActions={showBulkActions}
        onToggleBulkActions={handleToggleBulkActions}
        selectedCount={selectedNotes.length}
        onBulkDelete={handleBulkDelete}
        onBulkExport={exportAllNotes}
      />

      {/* Main Content */}
      <div className="px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Title & Stats */}
              <div>
                <h1 className="text-3xl font-bold text-base-content mb-2">
                  {getSelectedCategoryName()}
                </h1>
                <div className="flex items-center gap-4 text-sm text-base-content/60">
                  <span>{sortedNotes.length} notes</span>
                  {selectedCategory === "all" && (
                    <>
                      <span>•</span>
                      <span>{categories.length} categories</span>
                    </>
                  )}
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                {/* Category Filter */}
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="btn btn-outline btn-sm gap-2">
                    <FilterIcon className="size-4" />
                    <span className="hidden sm:inline">Category</span>
                    <ChevronDownIcon className="size-4" />
                  </div>
                  <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow-lg border border-base-content/10">
                    <li>
                      <button
                        onClick={() => setSelectedCategory("all")}
                        className={selectedCategory === "all" ? "active" : ""}
                      >
                        <FolderIcon className="size-4" />
                        All Notes ({notes.length})
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setSelectedCategory("uncategorized")}
                        className={selectedCategory === "uncategorized" ? "active" : ""}
                      >
                        <FolderIcon className="size-4" />
                        Uncategorized ({getUncategorizedCount()})
                      </button>
                    </li>
                    <div className="divider my-1"></div>
                    {categories.map((category) => (
                      <li key={category._id}>
                        <button
                          onClick={() => setSelectedCategory(category._id)}
                          className={selectedCategory === category._id ? "active" : ""}
                        >
                          {getCategoryIcon(category.icon)}
                          <span>{category.name}</span>
                          <span className="text-xs text-base-content/50">
                            ({category.noteCount || 0})
                          </span>
                        </button>
                      </li>
                    ))}
                    <div className="divider my-1"></div>
                    <li>
                      <button
                        onClick={() => setIsManageCategoriesOpen(true)}
                        className="text-primary"
                      >
                        <SettingsIcon className="size-4" />
                        Manage Categories
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Sort Options */}
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="btn btn-outline btn-sm gap-2">
                    {sortBy === "newest" && <SortDescIcon className="size-4" />}
                    {sortBy === "oldest" && <SortAscIcon className="size-4" />}
                    {sortBy === "title" && <SortAscIcon className="size-4" />}
                    <span className="hidden sm:inline">Sort</span>
                    <ChevronDownIcon className="size-4" />
                  </div>
                  <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-10 w-40 p-2 shadow-lg border border-base-content/10">
                    <li>
                      <button
                        onClick={() => setSortBy("newest")}
                        className={sortBy === "newest" ? "active" : ""}
                      >
                        <SortDescIcon className="size-4" />
                        Newest
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setSortBy("oldest")}
                        className={sortBy === "oldest" ? "active" : ""}
                      >
                        <SortAscIcon className="size-4" />
                        Oldest
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setSortBy("title")}
                        className={sortBy === "title" ? "active" : ""}
                      >
                        <SortAscIcon className="size-4" />
                        Title
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Bulk Actions Bar */}
          {showBulkActions && (
            <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">
                    {selectedNotes.length} notes selected
                  </span>
                  <button
                    onClick={handleSelectAll}
                    className="btn btn-xs btn-outline"
                  >
                    {selectedNotes.length === sortedNotes.length ? "Deselect All" : "Select All"}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={exportAllNotes}
                    disabled={selectedNotes.length === 0}
                    className="btn btn-sm btn-outline gap-2"
                  >
                    <DownloadIcon className="size-4" />
                    Export
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    disabled={selectedNotes.length === 0}
                    className="btn btn-sm btn-error gap-2"
                  >
                    <TrashIcon className="size-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notes Grid */}
          {sortedNotes.length === 0 ? (
            <div className="text-center py-16">
              <div className="max-w-sm mx-auto">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-base-content mb-2">
                  {searchTerm ? "No notes found" : selectedCategory === "all" ? "No notes yet" : "No notes in this category"}
                </h3>
                <p className="text-base-content/60 mb-6">
                  {searchTerm 
                    ? `No notes match "${searchTerm}"`
                    : selectedCategory === "all" 
                      ? "Create your first note to get started"
                      : "This category is empty"
                  }
                </p>
                {!searchTerm && (
                  <Link to="/create" className="btn btn-primary gap-2">
                    <PlusIcon className="size-4" />
                    Create Note
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className={`grid gap-4 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            }`}>
              {sortedNotes.map((note) => (
                <NoteCard
                  key={note._id}
                  note={note}
                  setNotes={setNotes}
                  viewMode={viewMode}
                  isSelected={selectedNotes.includes(note._id)}
                  onSelect={handleSelectNote}
                  onExport={exportNote}
                  onDuplicate={duplicateNote}
                  showBulkActions={showBulkActions}
                  getCategoryName={(categoryId) => {
                    if (!categoryId) return null;
                    const id = typeof categoryId === 'object' ? categoryId._id : categoryId;
                    const category = categories.find(cat => cat._id === id);
                    return category?.name || null;
                  }}
                  getCategoryIcon={(categoryId) => {
                    if (!categoryId) return null;
                    const id = typeof categoryId === 'object' ? categoryId._id : categoryId;
                    const category = categories.find(cat => cat._id === id);
                    return category ? getCategoryIcon(category.icon) : null;
                  }}
                  getCategoryColorClass={(categoryId) => {
                    if (!categoryId) return "";
                    const id = typeof categoryId === 'object' ? categoryId._id : categoryId;
                    const category = categories.find(cat => cat._id === id);
                    return category ? getCategoryColorClass(category.color) : "";
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Category Manager Modal */}
      {isManageCategoriesOpen && (
        <CategoryManager
          categories={categories}
          onClose={() => setIsManageCategoriesOpen(false)}
          onCategoryChange={handleCategoryChange}
        />
      )}
    </div>
  );
};

export default HomePage;
