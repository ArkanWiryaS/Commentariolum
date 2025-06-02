import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import RateLimitedUI from "../components/RateLimitedUI";
import CategoryManager from "../components/CategoryManager";
import axios from "axios";
import toast from "react-hot-toast";
import NoteCard from "../components/NoteCard";
import {
  PlusIcon,
  LayoutGridIcon,
  LayoutListIcon,
  SearchIcon,
  CheckIcon,
  Trash2Icon,
  DownloadIcon,
  CopyIcon,
  FolderIcon,
  MenuIcon,
  XIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SettingsIcon,
  FolderPlusIcon,
  TagIcon,
  BookOpenIcon,
  SparklesIcon,
  LoaderIcon,
  FilterIcon,
  ListIcon,
  TrashIcon,
} from "lucide-react";
import { Link } from "react-router";

// Drag and Drop imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Draggable Note Card component
const DraggableNoteCard = ({ note, setNotes, viewMode, isSelected }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: note._id,
    data: {
      type: 'note',
      note,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <NoteCard
        note={note}
        setNotes={setNotes}
        viewMode={viewMode}
        isSelected={isSelected}
      />
    </div>
  );
};

// Droppable Category component
const DroppableCategory = ({ 
  category, 
  isSelected, 
  onClick, 
  sidebarCollapsed, 
  getCategoryIcon, 
  getCategoryColorClass 
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: category.id,
    data: {
      type: 'category',
      category,
    },
  });

  const IconComponent = getCategoryIcon(category.icon);

  return (
    <button
      ref={setNodeRef}
      onClick={onClick}
      className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-200 ${
        isSelected
          ? "bg-primary/10 text-primary border border-primary/20"
          : "hover:bg-base-200/80 text-base-content/80 hover:text-base-content"
      } ${isOver ? "bg-primary/20 border-primary/30 shadow-lg" : ""}`}
    >
      <div className={`p-2 rounded-lg ${getCategoryColorClass(category.color)}`}>
        <IconComponent className="size-4" />
      </div>
      {!sidebarCollapsed && (
        <>
          <div className="flex-1 text-left min-w-0">
            <div className="font-medium truncate">{category.name}</div>
          </div>
          <span className="text-xs bg-base-content/10 text-base-content/60 px-2 py-1 rounded-full">
            {category.noteCount}
          </span>
        </>
      )}
    </button>
  );
};

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [sortBy, setSortBy] = useState("latest");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchNotes(), fetchCategories()]);
    };
    fetchData();
  }, []);

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

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/categories");
      setCategories(res.data);
    } catch (error) {
      console.log("Error fetching categories:", error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const getSortedNotes = () => {
    let sortedNotes = [...notes];

    // Filter by category
    if (selectedCategoryId === "uncategorized") {
      sortedNotes = sortedNotes.filter(
        (note) => !note.categoryId || note.categoryId === null
      );
    } else if (selectedCategoryId) {
      sortedNotes = sortedNotes.filter(
        (note) => note.categoryId?._id === selectedCategoryId
      );
    }

    // Filter by search query
    if (searchTerm.trim()) {
      sortedNotes = sortedNotes.filter(
        (note) =>
          note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.content.toLowerCase().includes(searchTerm.toLowerCase())
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
      // Refresh categories to update counts
      fetchCategories();
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
        categoryId: note.categoryId?._id || null,
      };
      const response = await axios.post(
        "http://localhost:5001/api/notes",
        newNote
      );
      setNotes((prev) => [response.data, ...prev]);
      toast.success("Note duplicated successfully!");
      // Refresh categories to update counts
      fetchCategories();
    } catch (error) {
      console.log("Error duplicating note:", error);
      toast.error("Failed to duplicate note");
    }
  };

  // Category functions
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

  const getSelectedCategoryName = () => {
    if (selectedCategoryId === "uncategorized") return "Uncategorized";
    const category = categories.find(cat => cat._id === selectedCategoryId);
    return category ? category.name : "All Notes";
  };

  const getUncategorizedCount = () => {
    return notes.filter(note => !note.categoryId || note.categoryId === null).length;
  };

  const handleCategoryChange = () => {
    fetchCategories();
  };

  // Drag and drop handler
  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) return;

    const noteId = active.id;
    const targetCategoryId = over.id === 'uncategorized' ? null : over.id;

    // Find the note being dragged
    const noteToUpdate = notes.find(note => note._id === noteId);
    if (!noteToUpdate) return;

    // If dropping on the same category, do nothing
    const currentCategoryId = noteToUpdate.categoryId?._id || null;
    if (currentCategoryId === targetCategoryId) return;

    try {
      // Update note in backend
      const response = await axios.put(`http://localhost:5001/api/notes/${noteId}`, {
        title: noteToUpdate.title,
        content: noteToUpdate.content,
        categoryId: targetCategoryId,
      });

      // Update local state
      setNotes(prevNotes => 
        prevNotes.map(note => 
          note._id === noteId ? response.data : note
        )
      );

      // Refresh categories to update note counts
      fetchCategories();

      toast.success(
        targetCategoryId 
          ? `Note moved to ${categories.find(cat => cat._id === targetCategoryId)?.name || 'category'}` 
          : 'Note moved to uncategorized'
      );
    } catch (error) {
      console.error('Error moving note:', error);
      toast.error('Failed to move note');
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

        .fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300">
          <Navbar />
          {isRateLimited && <RateLimitedUI />}

          <div className="flex">
            {/* Category Sidebar */}
            <div className={`${
              sidebarCollapsed ? 'w-16' : 'w-80'
            } transition-all duration-300 bg-base-100/50 backdrop-blur-sm border-r border-base-content/10 min-h-[calc(100vh-80px)] sticky top-20 z-10`}>
              
              {/* Sidebar Header */}
              <div className="p-4 border-b border-base-content/10">
                <div className="flex items-center justify-between">
                  {!sidebarCollapsed && (
                    <div className="flex items-center gap-2">
                      <FolderIcon className="size-5 text-primary" />
                      <h3 className="font-semibold text-base-content">Categories</h3>
                    </div>
                  )}
                  <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="p-2 hover:bg-base-200 rounded-lg transition-colors"
                  >
                    {sidebarCollapsed ? 
                      <ChevronRightIcon className="size-4" /> : 
                      <ChevronLeftIcon className="size-4" />
                    }
                  </button>
                </div>
              </div>

              {/* Sidebar Content */}
              <div className="p-4 space-y-3">
                {!sidebarCollapsed && (
                  <>
                    {/* Manage Categories Button */}
                    <button
                      onClick={() => setShowCategoryManager(true)}
                      className="w-full flex items-center gap-3 px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors"
                    >
                      <SettingsIcon className="size-4" />
                      <span className="font-medium">Manage Categories</span>
                    </button>

                    {/* All Notes - Droppable */}
                    <DroppableCategory
                      category={{
                        id: 'all',
                        name: 'All Notes',
                        icon: 'Folder',
                        color: 'primary',
                        noteCount: notes.length
                      }}
                      isSelected={selectedCategoryId === null}
                      onClick={() => setSelectedCategoryId(null)}
                      sidebarCollapsed={sidebarCollapsed}
                      getCategoryIcon={getCategoryIcon}
                      getCategoryColorClass={getCategoryColorClass}
                    />

                    {/* Uncategorized - Droppable */}
                    <DroppableCategory
                      category={{
                        id: 'uncategorized',
                        name: 'Uncategorized',
                        icon: 'Folder',
                        color: 'neutral',
                        noteCount: getUncategorizedCount()
                      }}
                      isSelected={selectedCategoryId === "uncategorized"}
                      onClick={() => setSelectedCategoryId("uncategorized")}
                      sidebarCollapsed={sidebarCollapsed}
                      getCategoryIcon={getCategoryIcon}
                      getCategoryColorClass={getCategoryColorClass}
                    />

                    {/* Category List - Droppable */}
                    <div className="space-y-1">
                      {loading ? (
                        <div className="space-y-2">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-10 bg-base-content/10 rounded-lg animate-pulse"></div>
                          ))}
                        </div>
                      ) : (
                        categories.map((category) => (
                          <DroppableCategory
                            key={category._id}
                            category={{
                              id: category._id,
                              name: category.name,
                              icon: category.icon,
                              color: category.color,
                              noteCount: category.noteCount
                            }}
                            isSelected={selectedCategoryId === category._id}
                            onClick={() => setSelectedCategoryId(category._id)}
                            sidebarCollapsed={sidebarCollapsed}
                            getCategoryIcon={getCategoryIcon}
                            getCategoryColorClass={getCategoryColorClass}
                          />
                        ))
                      )}
                    </div>
                  </>
                )}

                {sidebarCollapsed && (
                  <div className="space-y-2">
                    {/* Manage Categories Button - Collapsed */}
                    <button
                      onClick={() => setShowCategoryManager(true)}
                      className="w-full flex justify-center p-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors"
                      title="Manage Categories"
                    >
                      <SettingsIcon className="size-4" />
                    </button>

                    {/* Categories - Collapsed - Droppable */}
                    {categories.map((category) => (
                      <DroppableCategory
                        key={category._id}
                        category={{
                          id: category._id,
                          name: category.name,
                          icon: category.icon,
                          color: category.color,
                          noteCount: category.noteCount
                        }}
                        isSelected={selectedCategoryId === category._id}
                        onClick={() => setSelectedCategoryId(category._id)}
                        sidebarCollapsed={sidebarCollapsed}
                        getCategoryIcon={getCategoryIcon}
                        getCategoryColorClass={getCategoryColorClass}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
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
                        <FolderIcon className="size-4 text-secondary" />
                        <span>{categories.length} Categories</span>
                      </div>
                      <div className="w-px h-4 bg-base-content/20"></div>
                      <div className="flex items-center gap-2">
                        <BookOpenIcon className="size-4 text-accent" />
                        <span>Always Organized</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
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
                                {getSelectedCategoryName()}
                              </h2>
                              <div className="flex items-center gap-3 mt-2">
                                <p className="text-lg text-base-content/70">
                                  {filteredNotes.length}{" "}
                                  {filteredNotes.length === 1 ? "note" : "notes"} 
                                  {selectedCategoryId ? " in this category" : " in your collection"}
                                </p>
                                <div className="flex items-center gap-1">
                                  <SparklesIcon className="size-4 text-primary animate-pulse" />
                                  <span className="text-sm text-primary font-medium">
                                    {filteredNotes.length > 5 ? "Productive!" : "Growing"}
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
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                          <button
                            onClick={() => setSearchTerm("")}
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
                              <LayoutGridIcon className="h-4 w-4" />
                            </button>
                            <button
                              className={`btn btn-sm transition-all duration-200 ${
                                viewMode === "list" ? "btn-primary" : "btn-ghost"
                              }`}
                              onClick={() => setViewMode("list")}
                            >
                              <LayoutListIcon className="h-4 w-4" />
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
                      {searchTerm && (
                        <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl">
                          <p className="text-sm text-primary">
                            {filteredNotes.length === 0
                              ? "No notes found"
                              : `Found ${filteredNotes.length} note${
                                  filteredNotes.length !== 1 ? "s" : ""
                                }`}{" "}
                            matching "{searchTerm}"
                          </p>
                        </div>
                      )}

                      {/* Category Filter Info */}
                      {selectedCategoryId && (
                        <div className="p-4 bg-secondary/10 border border-secondary/20 rounded-xl flex items-center justify-between">
                          <p className="text-sm text-secondary">
                            Showing notes in "{getSelectedCategoryName()}" category
                          </p>
                          <button
                            onClick={() => setSelectedCategoryId(null)}
                            className="btn btn-sm btn-ghost text-secondary hover:bg-secondary/20"
                          >
                            <XIcon className="size-4" />
                            Clear Filter
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Notes Grid/List with Enhanced Layout */}
                    <div className="relative">
                      {/* Grid Background Pattern */}
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 rounded-3xl blur-3xl -z-10"></div>

                      {filteredNotes.length === 0 && (searchTerm || selectedCategoryId) ? (
                        // Search/Filter Empty State
                        <div className="text-center py-20">
                          <div className="max-w-md mx-auto space-y-6">
                            <SearchIcon className="size-16 text-base-content/40 mx-auto" />
                            <div className="space-y-2">
                              <h3 className="text-2xl font-bold text-base-content">
                                No notes found
                              </h3>
                              <p className="text-base-content/70">
                                {searchTerm 
                                  ? "Try adjusting your search terms or create a new note."
                                  : "No notes in this category yet. Create a new note and assign it to this category."
                                }
                              </p>
                            </div>
                            <div className="flex gap-2 justify-center">
                              {searchTerm && (
                                <button
                                  onClick={() => setSearchTerm("")}
                                  className="btn btn-outline"
                                >
                                  Clear Search
                                </button>
                              )}
                              {selectedCategoryId && (
                                <button
                                  onClick={() => setSelectedCategoryId(null)}
                                  className="btn btn-outline"
                                >
                                  Show All Notes
                                </button>
                              )}
                              <Link to="/create" className="btn btn-primary">
                                Create Note
                              </Link>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <SortableContext
                          items={filteredNotes.map(note => note._id)}
                          strategy={verticalListSortingStrategy}
                        >
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
                                className="transform transition-all duration-500 hover:z-10 relative fade-in-up"
                                style={{
                                  animationDelay: `${index * 100}ms`,
                                }}
                              >
                                <DraggableNoteCard
                                  note={note}
                                  setNotes={setNotes}
                                  viewMode={viewMode}
                                  isSelected={selectedNotes.includes(note._id)}
                                  onSelect={
                                    showBulkActions
                                      ? () => handleSelectNote(note._id)
                                      : undefined
                                  }
                                  onExport={() => exportNote(note)}
                                  onDuplicate={() => duplicateNote(note)}
                                />
                              </div>
                            ))}
                          </div>
                        </SortableContext>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Category Manager Modal */}
          <CategoryManager
            isOpen={isCategoryManagerOpen}
            onClose={() => setIsCategoryManagerOpen(false)}
            onCategoryChange={handleCategoryChange}
          />
        </div>
      </DndContext>
    </>
  );
};

export default HomePage;
