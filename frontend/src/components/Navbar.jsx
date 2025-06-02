import React, { useState, useEffect } from "react";
import {
  PlusIcon,
  PaletteIcon,
  BookOpenIcon,
  SparklesIcon,
  XIcon,
  MenuIcon,
  SearchIcon,
  Grid3x3Icon,
  ListIcon,
  CheckIcon,
  TrashIcon,
  DownloadIcon,
} from "lucide-react";
import { Link } from "react-router";

const Navbar = ({ 
  searchTerm, 
  onSearchChange, 
  viewMode, 
  onViewModeChange,
  showBulkActions,
  onToggleBulkActions,
  selectedCount,
  onBulkDelete,
  onBulkExport 
}) => {
  const [currentTheme, setCurrentTheme] = useState("dark");
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const themes = [
    // Dark themes
    {
      name: "dark",
      label: "🌙 Dark",
      description: "Easy on eyes",
      accent: "bg-slate-700",
      preview: "bg-gray-900 border-gray-700",
      category: "Dark"
    },
    {
      name: "forest",
      label: "🌲 Forest",
      description: "Nature inspired",
      accent: "bg-green-600",
      preview: "bg-green-950 border-green-700",
      category: "Dark"
    },
    {
      name: "dracula",
      label: "🦇 Dracula",
      description: "Gothic dark",
      accent: "bg-red-600",
      preview: "bg-red-950 border-red-700",
      category: "Dark"
    },
    {
      name: "synthwave",
      label: "🌈 Synthwave",
      description: "Retro neon",
      accent: "bg-purple-600",
      preview: "bg-purple-950 border-purple-700",
      category: "Dark"
    },
    {
      name: "halloween",
      label: "🎃 Halloween",
      description: "Spooky vibes",
      accent: "bg-orange-600",
      preview: "bg-orange-950 border-orange-700",
      category: "Dark"
    },
    
    
    // Light themes
    
    {
      name: "cupcake",
      label: "🧁 Cupcake",
      description: "Sweet & soft",
      accent: "bg-pink-400",
      preview: "bg-pink-50 border-pink-200",
      category: "Light"
    },
    {
      name: "emerald",
      label: "💚 Emerald",
      description: "Fresh green",
      accent: "bg-emerald-500",
      preview: "bg-emerald-50 border-emerald-200",
      category: "Light"
    },
    {
      name: "corporate",
      label: "💼 Corporate",
      description: "Professional",
      accent: "bg-blue-600",
      preview: "bg-blue-50 border-blue-200",
      category: "Light"
    },
    {
      name: "lofi",
      label: "🎵 Lo-fi",
      description: "Chill vibes",
      accent: "bg-indigo-500",
      preview: "bg-white-950 border-indigo-700",
      category: "Light"
    },
    {
      name: "pastel",
      label: "🎨 Pastel",
      description: "Soft colors",
      accent: "bg-purple-400",
      preview: "bg-purple-50 border-purple-200",
      category: "Light"
    },
    {
      name: "wireframe",
      label: "📐 Wireframe",
      description: "Minimal design",
      accent: "bg-gray-400",
      preview: "bg-gray-50 border-gray-300",
      category: "Light"
    },
    {
      name: "retro",
      label: "📺 Retro",
      description: "Vintage style",
      accent: "bg-amber-500",
      preview: "bg-amber-50 border-amber-200",
      category: "Light"
    },
    {
      name: "garden",
      label: "🌺 Garden",
      description: "Blooming colors",
      accent: "bg-red-500",
      preview: "bg-red-50 border-green-200",
      category: "Light"
    },
    
    // Special themes
    {
      name: "valentine",
      label: "💖 Valentine",
      description: "Love theme",
      accent: "bg-pink-500",
      preview: "bg-pink-950 border-pink-500",
      category: "Special"
    },
    {
      name: "coffee",
      label: "☕ Coffee",
      description: "Warm & cozy",
      accent: "bg-amber-700",
      preview: "bg-amber-950 border-amber-700",
      category: "Special"
    },
    {
      name: "aqua",
      label: "🌊 Aqua",
      description: "Ocean vibes",
      accent: "bg-cyan-500",
      preview: "bg-cyan-950 border-cyan-700",
      category: "Special"
    },
    

    {
      name: "fantasy",
      label: "🦄 Fantasy",
      description: "Magical feel",
      accent: "bg-fuchsia-500",
      preview: "bg-fuchsia-950 border-fuchsia-700",
      category: "Special"
    },
    
    {
      name: "black",
      label: "⚫ Black",
      description: "Pure darkness",
      accent: "bg-gray-600",
      preview: "bg-black border-gray-800",
      category: "Special"
    },
    {
      name: "cyberpunk",
      label: "🤖 Cyberpunk",
      description: "Future noir",
      accent: "bg-cyan-400",
      preview: "bg-gray-900 border-cyan-500",
      category: "Special"
    },
    {
      name: "autumn",
      label: "🍂 Autumn",
      description: "Fall colors",
      accent: "bg-orange-500",
      preview: "bg-orange-950 border-orange-600",
      category: "Special"
    }
  ];

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setCurrentTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const changeTheme = (theme) => {
    setCurrentTheme(theme);
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    window.dispatchEvent(new Event("themeChanged"));
    setIsThemeModalOpen(false);
  };

  const getCurrentThemeInfo = () => {
    return themes.find((theme) => theme.name === currentTheme) || themes[0];
  };

  return (
    <>
      <header className="bg-base-100/95 backdrop-blur-xl border-b border-base-content/10 sticky top-0 z-50 shadow-lg">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo section */}
            <Link to="/" className="flex items-center gap-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                <div className="relative bg-gradient-to-br from-primary/10 to-secondary/10 p-3 rounded-2xl border border-primary/20 group-hover:scale-105 transition-all duration-300 shadow-xl">
                  <BookOpenIcon className="size-8 text-primary group-hover:rotate-12 transition-transform duration-300" />
                  <SparklesIcon className="absolute -top-1 -right-1 size-4 text-secondary animate-pulse" />
                </div>
              </div>

              <div className="space-y-1">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent font-mono tracking-tight">
                  Commentariolum
                </h1>
                <p className="text-xs text-base-content/60 font-medium tracking-wide hidden sm:block">
                  Your Digital Notebook
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Search Bar */}
              <div className="relative">
                <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 size-5 text-base-content/40" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  className="w-80 pl-12 pr-12 py-3 bg-base-200/50 border border-base-content/10 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 placeholder-base-content/40"
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => onSearchChange("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-base-content/60 hover:text-primary"
                  >
                    <XIcon className="size-5" />
                  </button>
                )}
              </div>

              {/* View Toggle */}
              <div className="flex bg-base-200/50 rounded-xl border border-base-content/10 p-1">
                <button
                  onClick={() => onViewModeChange("grid")}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-primary text-primary-content shadow-md"
                      : "text-base-content/60 hover:text-primary hover:bg-base-100"
                  }`}
                >
                  <Grid3x3Icon className="size-5" />
                </button>
                <button
                  onClick={() => onViewModeChange("list")}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-primary text-primary-content shadow-md"
                      : "text-base-content/60 hover:text-primary hover:bg-base-100"
                  }`}
                >
                  <ListIcon className="size-5" />
                </button>
              </div>

              {/* Bulk Actions */}
              <div className="flex items-center gap-2">
                <button
                  className={`btn btn-sm ${
                    showBulkActions ? "btn-secondary" : "btn-ghost"
                  }`}
                  onClick={() => {
                    onToggleBulkActions(!showBulkActions);
                  }}
                >
                  <CheckIcon className="h-4 w-4" />
                  <span className="hidden xl:inline">Select</span>
                </button>

                {showBulkActions && selectedCount > 0 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={onBulkDelete}
                      className="btn btn-sm btn-error gap-2"
                    >
                      <TrashIcon className="h-4 w-4" />
                      <span className="hidden xl:inline">Delete ({selectedCount})</span>
                    </button>
                    <button
                      onClick={onBulkExport}
                      className="btn btn-sm btn-info gap-2"
                    >
                      <DownloadIcon className="h-4 w-4" />
                      <span className="hidden xl:inline">Export</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Theme button */}
              <button
                onClick={() => setIsThemeModalOpen(true)}
                className="flex items-center gap-3 px-4 py-3 bg-base-200/50 hover:bg-base-200 rounded-2xl border border-base-content/10 hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <PaletteIcon className="size-5 text-primary group-hover:rotate-12 transition-transform duration-200" />
                    <div
                      className={`absolute -bottom-1 -right-1 w-3 h-3 ${
                        getCurrentThemeInfo().accent
                      } rounded-full border-2 border-base-100`}
                    ></div>
                  </div>
                  <div className="hidden xl:flex flex-col items-start">
                    <span className="text-sm font-medium text-base-content">
                      {getCurrentThemeInfo().label}
                    </span>
                    <span className="text-xs text-base-content/60">
                      Click to change
                    </span>
                  </div>
                </div>
              </button>

              {/* New note button */}
              <Link
                to="/create"
                className="btn btn-primary gap-3 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group px-6 py-3 rounded-xl border-2 border-primary/20 hover:border-primary/40"
              >
                <div className="relative">
                  <PlusIcon className="size-5 group-hover:rotate-90 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-primary-content/20 rounded-full blur-sm group-hover:blur-md transition-all duration-300"></div>
                </div>
                <span className="hidden xl:inline font-medium">New Note</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-2">
              <Link
                to="/create"
                className="btn btn-primary btn-sm gap-2"
              >
                <PlusIcon className="size-4" />
                <span className="hidden sm:inline">New</span>
              </Link>
              
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-xl bg-base-200/50 hover:bg-base-200 transition-colors"
              >
                <MenuIcon className="size-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="absolute top-0 right-0 w-80 max-w-[90vw] h-full bg-base-100 shadow-2xl transform transition-transform duration-300">
            <div className="p-6 space-y-6">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Menu</h3>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-xl hover:bg-base-200"
                >
                  <XIcon className="size-5" />
                </button>
              </div>

              {/* Mobile Search */}
              <div className="relative">
                <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 size-5 text-base-content/40" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  className="w-full pl-12 pr-12 py-3 bg-base-200/50 border border-base-content/10 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 placeholder-base-content/40"
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => onSearchChange("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-base-content/60 hover:text-primary"
                  >
                    <XIcon className="size-5" />
                  </button>
                )}
              </div>

              {/* Mobile View Toggle */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-base-content/70">View Mode</label>
                <div className="flex bg-base-200/50 rounded-xl border border-base-content/10 p-1">
                  <button
                    onClick={() => onViewModeChange("grid")}
                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg transition-all duration-200 ${
                      viewMode === "grid"
                        ? "bg-primary text-primary-content shadow-md"
                        : "text-base-content/60 hover:text-primary hover:bg-base-100"
                    }`}
                  >
                    <Grid3x3Icon className="size-5" />
                    <span>Grid</span>
                  </button>
                  <button
                    onClick={() => onViewModeChange("list")}
                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg transition-all duration-200 ${
                      viewMode === "list"
                        ? "bg-primary text-primary-content shadow-md"
                        : "text-base-content/60 hover:text-primary hover:bg-base-100"
                    }`}
                  >
                    <ListIcon className="size-5" />
                    <span>List</span>
                  </button>
                </div>
              </div>

              {/* Mobile Bulk Actions */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-base-content/70">Actions</label>
                <div className="space-y-2">
                  <button
                    className={`w-full btn ${
                      showBulkActions ? "btn-secondary" : "btn-ghost"
                    } justify-start`}
                    onClick={() => {
                      onToggleBulkActions(!showBulkActions);
                    }}
                  >
                    <CheckIcon className="h-4 w-4" />
                    {showBulkActions ? "Exit Selection" : "Select Multiple"}
                  </button>

                  {showBulkActions && selectedCount > 0 && (
                    <div className="space-y-2">
                      <button
                        onClick={onBulkDelete}
                        className="w-full btn btn-error justify-start gap-2"
                      >
                        <TrashIcon className="h-4 w-4" />
                        Delete Selected ({selectedCount})
                      </button>
                      <button
                        onClick={onBulkExport}
                        className="w-full btn btn-info justify-start gap-2"
                      >
                        <DownloadIcon className="h-4 w-4" />
                        Export All Notes
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Theme */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-base-content/70">Theme</label>
                <button
                  onClick={() => {
                    setIsThemeModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-4 bg-base-200/50 hover:bg-base-200 rounded-xl border border-base-content/10 hover:border-primary/30 transition-all duration-300"
                >
                  <div className="relative">
                    <PaletteIcon className="size-5 text-primary" />
                    <div
                      className={`absolute -bottom-1 -right-1 w-3 h-3 ${
                        getCurrentThemeInfo().accent
                      } rounded-full border-2 border-base-100`}
                    ></div>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium text-base-content">
                      {getCurrentThemeInfo().label}
                    </span>
                    <span className="text-xs text-base-content/60">
                      Tap to change theme
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Theme modal */}
      {isThemeModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsThemeModalOpen(false)}
          ></div>

          <div className="relative bg-base-100 rounded-3xl shadow-2xl border border-base-content/10 w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b border-base-content/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <PaletteIcon className="size-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-base-content">
                    Choose Your Theme
                  </h2>
                  <p className="text-sm text-base-content/70">
                    Customize your experience with beautiful themes
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsThemeModalOpen(false)}
                className="p-2 hover:bg-base-200 rounded-xl transition-colors"
              >
                <XIcon className="size-6 text-base-content" />
              </button>
            </div>

            {/* Themes content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {/* Theme categories */}
              {["Light", "Dark", "Special"].map((category) => {
                const categoryThemes = themes.filter(theme => theme.category === category);
                return (
                  <div key={category} className="mb-8 last:mb-0">
                    <div className="flex items-center gap-2 mb-4">
                      <h3 className="text-lg font-bold text-base-content">
                      {category === "Light" && "☀️"} 
                        {category === "Dark" && "🌙"} 
                        
                        {category === "Special" && "✨"} 
                        {category} Themes
                      </h3>
                      <div className="flex-1 h-px bg-gradient-to-r from-base-content/20 to-transparent"></div>
                      <span className="text-xs text-base-content/50 bg-base-200/50 px-2 py-1 rounded-full">
                        {categoryThemes.length} themes
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                      {categoryThemes.map((theme) => (
                        <button
                          key={theme.name}
                          onClick={() => changeTheme(theme.name)}
                          className={`
                            group relative p-3 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg
                            ${
                              currentTheme === theme.name
                                ? "border-primary bg-primary/10 shadow-xl ring-2 ring-primary/20"
                                : "border-base-content/10 hover:border-primary/30 hover:bg-base-200/50"
                            }
                          `}
                        >
                          {/* Theme preview */}
                          <div className="relative mb-3">
                            <div
                              className={`w-16 h-12 mx-auto ${theme.preview} rounded-lg border border-base-content/10 relative overflow-hidden flex items-center justify-center`}
                            >
                              <div
                                className={`w-6 h-6 ${theme.accent} rounded-full shadow-lg`}
                              ></div>

                              {/* Active indicator */}
                              {currentTheme === theme.name && (
                                <div className="absolute top-1 right-1">
                                  <div className="w-2.5 h-2.5 bg-primary rounded-full border border-white shadow-lg animate-pulse"></div>
                                </div>
                              )}
                              
                              {/* Hover effect */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                          </div>

                          {/* Theme info */}
                          <div className="text-center">
                            <h4 className="font-medium text-base-content text-sm mb-1 line-clamp-1">
                              {theme.label}
                            </h4>
                            <p className="text-xs text-base-content/60 line-clamp-1">
                              {theme.description}
                            </p>
                          </div>
                          
                          {/* Selection indicator */}
                          {currentTheme === theme.name && (
                            <div className="absolute -top-1 -right-1">
                              <div className="bg-primary text-primary-content rounded-full p-1 shadow-lg">
                                <CheckIcon className="w-3 h-3" />
                              </div>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal footer */}
            <div className="p-6 border-t border-base-content/10 bg-base-200/30">
              <div className="text-center">
                <p className="text-sm text-base-content/70">
                  🎨 Choose from <span className="font-semibold text-primary">{themes.length} beautiful themes</span> • Currently using: {" "}
                  <span className="font-semibold text-primary">
                    {getCurrentThemeInfo().label}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
