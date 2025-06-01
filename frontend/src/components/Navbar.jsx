import React, { useState, useEffect } from "react";
import {
  PlusIcon,
  PaletteIcon,
  BookOpenIcon,
  SparklesIcon,
  XIcon,
} from "lucide-react";
import { Link } from "react-router";

const Navbar = () => {
  const [currentTheme, setCurrentTheme] = useState("forest");
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  const themes = [
    {
      name: "dark",
      label: "🌙 Dark",
      description: "Easy on eyes",
      accent: "bg-slate-700",
      preview: "bg-gray-900 border-gray-700",
    },
    {
      name: "forest",
      label: "🌲 Forest",
      description: "Nature inspired",
      accent: "bg-green-600",
      preview: "bg-green-950 border-green-700",
    },
    {
      name: "coffee",
      label: "☕ Coffee",
      description: "Warm & cozy",
      accent: "bg-amber-700",
      preview: "bg-amber-950 border-amber-700",
    },
    {
      name: "halloween",
      label: "🎃 Halloween",
      description: "Spooky vibes",
      accent: "bg-orange-600",
      preview: "bg-orange-950 border-orange-700",
    },
    {
      name: "dracula",
      label: "🦇 Dracula",
      description: "Gothic dark",
      accent: "bg-red-600",
      preview: "bg-red-950 border-red-700",
    },
    {
      name: "valentine",
      label: "💖 Valentine",
      description: "Love theme",
      accent: "bg-pink-500",
      preview: "bg-pink-950 border-pink-500",
    },
  ];

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "forest";
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
        <div className="mx-auto max-w-7xl px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo section */}
            <Link to="/" className="flex items-center gap-2 sm:gap-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl sm:rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                <div className="relative bg-gradient-to-br from-primary/10 to-secondary/10 p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-primary/20 group-hover:scale-105 transition-all duration-300 shadow-xl">
                  <BookOpenIcon className="size-6 sm:size-8 text-primary group-hover:rotate-12 transition-transform duration-300" />
                  <SparklesIcon className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 size-3 sm:size-4 text-secondary animate-pulse" />
                </div>
              </div>

              <div className="space-y-0.5 sm:space-y-1">
                {/* Mobile: Show shorter title */}
                <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 font-mono to-primary bg-clip-text text-transparent tracking-tight">
                  <span className="block sm:hidden">Commentar.</span>
                  <span className="hidden sm:block">Commentariolum</span>
                </h1>
                <p className="text-xs text-base-content/60 font-medium tracking-wide hidden sm:block">
                  Your Digital Notebook
                </p>
                <p className="text-xs text-base-content/60 font-medium tracking-wide block sm:hidden">
                  Notes
                </p>
              </div>
            </Link>

            {/* Navigation section */}
            <div className="flex items-center gap-1.5 sm:gap-3 lg:gap-4">
              {/* Theme button */}
              <button
                onClick={() => setIsThemeModalOpen(true)}
                className="flex items-center gap-1 sm:gap-2 lg:gap-3 px-2 sm:px-3 lg:px-4 py-2 sm:py-3 bg-base-200/50 hover:bg-base-200 rounded-xl sm:rounded-2xl border border-base-content/10 hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="relative">
                    <PaletteIcon className="size-4 sm:size-5 text-primary group-hover:rotate-12 transition-transform duration-200" />
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-2 h-2 sm:w-3 sm:h-3 ${
                        getCurrentThemeInfo().accent
                      } rounded-full border border-base-100 sm:border-2`}
                    ></div>
                  </div>

                  {/* Desktop: Show full theme info */}
                  <div className="hidden lg:flex flex-col items-start">
                    <span className="text-sm font-medium text-base-content">
                      {getCurrentThemeInfo().label}
                    </span>
                    <span className="text-xs text-base-content/60">
                      Click to change
                    </span>
                  </div>

                  {/* Tablet: Show just theme name */}
                  <div className="hidden sm:block lg:hidden">
                    <span className="text-xs sm:text-sm font-medium text-base-content">
                      {getCurrentThemeInfo().label}
                    </span>
                  </div>
                </div>
              </button>

              {/* New note button */}
              <Link
                to="/create"
                className="btn btn-primary gap-1 sm:gap-2 lg:gap-3 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-xl border border-primary/20 hover:border-primary/40 text-sm sm:text-base"
              >
                <div className="relative">
                  <PlusIcon className="size-4 sm:size-5 group-hover:rotate-90 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-primary-content/20 rounded-full blur-sm group-hover:blur-md transition-all duration-300"></div>
                </div>
                {/* Desktop & Tablet: Show "New Note" */}
                <span className="hidden sm:inline font-medium">New Note</span>
                {/* Mobile: Show "New" */}
                <span className="inline sm:hidden font-medium text-xs">
                  New
                </span>
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
      </header>

      {/* Theme modal */}
      {isThemeModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsThemeModalOpen(false)}
          ></div>

          <div className="relative bg-base-100 rounded-2xl sm:rounded-3xl shadow-2xl border border-base-content/10 w-full max-w-sm sm:max-w-4xl mx-3 sm:mx-4 max-h-[90vh] overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-base-content/10">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg sm:rounded-xl">
                  <PaletteIcon className="size-5 sm:size-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold text-base-content">
                    Choose Your Theme
                  </h2>
                  <p className="text-xs sm:text-sm text-base-content/70">
                    Customize your experience with beautiful themes
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsThemeModalOpen(false)}
                className="p-1.5 sm:p-2 hover:bg-base-200 rounded-lg sm:rounded-xl transition-colors"
              >
                <XIcon className="size-5 sm:size-6 text-base-content" />
              </button>
            </div>

            {/* Themes grid */}
            <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4">
                {themes.map((theme) => (
                  <button
                    key={theme.name}
                    onClick={() => changeTheme(theme.name)}
                    className={`
                      group relative p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 hover:scale-105
                      ${
                        currentTheme === theme.name
                          ? "border-primary bg-primary/10 shadow-xl"
                          : "border-base-content/10 hover:border-primary/30 hover:bg-base-200/50"
                      }
                    `}
                  >
                    {/* Theme preview */}
                    <div
                      className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto ${theme.preview} rounded-lg sm:rounded-xl mb-2 sm:mb-3 border border-base-content/10 relative overflow-hidden flex items-center justify-center`}
                    >
                      <div
                        className={`absolute top-1.5 sm:top-2 left-1.5 sm:left-2 w-2 h-2 sm:w-3 sm:h-3 ${theme.accent} rounded-full`}
                      ></div>
                      <div
                        className={`absolute top-1.5 sm:top-2 right-1.5 sm:right-2 w-1.5 h-1.5 sm:w-2 sm:h-2 ${theme.accent} rounded-full opacity-60`}
                      ></div>
                      <div
                        className={`absolute bottom-1.5 sm:bottom-2 left-1.5 sm:left-2 right-1.5 sm:right-2 h-1.5 sm:h-2 ${theme.accent} rounded-full opacity-40`}
                      ></div>

                      {currentTheme === theme.name && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <div className="bg-primary text-primary-content px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium">
                            ✓ Active
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Theme info */}
                    <div className="text-center space-y-0.5 sm:space-y-1">
                      <div className="text-sm sm:text-lg font-medium">
                        {theme.label}
                      </div>
                      <div className="text-xs text-base-content/60">
                        {theme.description}
                      </div>
                      <div
                        className={`w-3 h-3 sm:w-4 sm:h-4 ${theme.accent} rounded-full mx-auto mt-1 sm:mt-2 shadow-lg`}
                      ></div>
                    </div>

                    <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                ))}
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 p-4 sm:p-6 border-t border-base-content/10 bg-base-200/30">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-base-content/60 order-2 sm:order-1">
                <SparklesIcon className="size-3 sm:size-4" />
                <span>Theme preferences are saved automatically</span>
              </div>
              <button
                onClick={() => setIsThemeModalOpen(false)}
                className="btn btn-primary btn-sm w-full sm:w-auto order-1 sm:order-2"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
