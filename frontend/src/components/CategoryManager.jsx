import React, { useState, useEffect } from "react";
import {
  FolderIcon,
  PlusIcon,
  XIcon,
  PenSquareIcon,
  Trash2Icon,
  TagIcon,
  SaveIcon,
  LoaderIcon,
  BookmarkIcon,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const CategoryManager = ({
  categories: initialCategories,
  onClose,
  onCategoryChange,
}) => {
  const [categories, setCategories] = useState(initialCategories || []);
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "primary",
    icon: "folder",
  });

  const colorOptions = [
    { value: "primary", label: "Primary", class: "bg-primary" },
    { value: "secondary", label: "Secondary", class: "bg-secondary" },
    { value: "accent", label: "Accent", class: "bg-accent" },
    { value: "info", label: "Info", class: "bg-info" },
    { value: "success", label: "Success", class: "bg-success" },
    { value: "warning", label: "Warning", class: "bg-warning" },
    { value: "error", label: "Error", class: "bg-error" },
    { value: "neutral", label: "Neutral", class: "bg-neutral" },
  ];

  const iconOptions = [
    { value: "folder", label: "Folder", component: FolderIcon },
    { value: "tag", label: "Tag", component: TagIcon },
    { value: "bookmark", label: "Bookmark", component: BookmarkIcon },
  ];

  useEffect(() => {
    if (initialCategories) {
      setCategories(initialCategories);
    }
  }, [initialCategories]);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      color: "primary",
      icon: "folder",
    });
    setIsCreating(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      let response;
      if (editingId) {
        response = await axios.put(
          `https://202.74.74.144/api/categories/${editingId}`,
          formData
        );
        setCategories((prev) =>
          prev.map((cat) => (cat._id === editingId ? response.data : cat))
        );
        toast.success("Category updated successfully");
      } else {
        response = await axios.post(
          "https://202.74.74.144/api/categories",
          formData
        );
        setCategories((prev) => [response.data, ...prev]);
        toast.success("Category created successfully");
      }

      resetForm();
      onCategoryChange?.();
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error(error.response?.data?.message || "Failed to save category");
    }
  };

  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      description: category.description || "",
      color: category.color,
      icon: category.icon,
    });
    setEditingId(category._id);
    setIsCreating(true);
  };

  const handleDelete = async (categoryId, categoryName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${categoryName}"? All notes in this category will become uncategorized.`
      )
    ) {
      return;
    }

    try {
      await axios.delete(`https://202.74.74.144/api/categories/${categoryId}`);
      setCategories((prev) => prev.filter((cat) => cat._id !== categoryId));
      toast.success("Category deleted successfully");
      onCategoryChange?.();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  };

  const getIconComponent = (iconName) => {
    const iconMap = {
      folder: FolderIcon,
      tag: TagIcon,
      bookmark: BookmarkIcon,
    };
    return iconMap[iconName] || FolderIcon;
  };

  const getCategoryColorClass = (color) => {
    const colorMap = {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative bg-base-100 rounded-3xl shadow-2xl border border-base-content/10 w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-base-content/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <FolderIcon className="size-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-base-content">
                Manage Categories
              </h2>
              <p className="text-sm text-base-content/70">
                Organize your notes with custom categories
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-base-200 rounded-xl transition-colors"
          >
            <XIcon className="size-6 text-base-content" />
          </button>
        </div>

        {/* Content Area - Scrollable */}
        <div className="flex flex-col lg:flex-row flex-1 min-h-0">
          {/* Categories List */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between p-6 pb-4 flex-shrink-0">
              <h3 className="text-lg font-semibold text-base-content">
                Categories ({categories.length})
              </h3>
              <button
                onClick={() => setIsCreating(true)}
                className="btn btn-primary btn-sm gap-2"
              >
                <PlusIcon className="size-4" />
                New Category
              </button>
            </div>

            <div className="flex-1 px-6 pb-6 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <LoaderIcon className="size-8 animate-spin text-primary" />
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-12">
                  <FolderIcon className="size-16 text-base-content/30 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-base-content mb-2">
                    No Categories Yet
                  </h4>
                  <p className="text-base-content/60 mb-4">
                    Create your first category to organize your notes
                  </p>
                  <button
                    onClick={() => setIsCreating(true)}
                    className="btn btn-primary gap-2"
                  >
                    <PlusIcon className="size-4" />
                    Create Category
                  </button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {categories.map((category) => {
                    const IconComponent = getIconComponent(category.icon);
                    return (
                      <div
                        key={category._id}
                        className="p-4 bg-base-200/50 rounded-xl border border-base-content/10 hover:bg-base-200/80 transition-all duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-lg ${getCategoryColorClass(
                                category.color
                              )}`}
                            >
                              <IconComponent className="size-5" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-base-content">
                                {category.name}
                              </h4>
                              {category.description && (
                                <p className="text-sm text-base-content/60">
                                  {category.description}
                                </p>
                              )}
                              <p className="text-xs text-base-content/50">
                                {category.noteCount || 0} notes
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(category)}
                              className="btn btn-ghost btn-sm"
                              title="Edit category"
                            >
                              <PenSquareIcon className="size-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleDelete(category._id, category.name)
                              }
                              className="btn btn-ghost btn-sm text-error hover:bg-error hover:text-error-content"
                              title="Delete category"
                            >
                              <Trash2Icon className="size-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Create/Edit Form */}
          {isCreating && (
            <div className="lg:w-96 border-t lg:border-t-0 lg:border-l border-base-content/10 bg-base-50 flex flex-col">
              <div className="flex items-center justify-between p-6 pb-4 flex-shrink-0">
                <h3 className="text-lg font-semibold text-base-content">
                  {editingId ? "Edit Category" : "Create Category"}
                </h3>
                <button onClick={resetForm} className="btn btn-ghost btn-sm">
                  <XIcon className="size-4" />
                </button>
              </div>

              <div className="flex-1 px-6 pb-6 overflow-y-auto">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name Field */}
                  <div>
                    <label className="label">
                      <span className="label-text font-medium">Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Category name"
                      className="input input-bordered w-full"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  {/* Description Field */}
                  <div>
                    <label className="label">
                      <span className="label-text font-medium">
                        Description
                      </span>
                    </label>
                    <textarea
                      placeholder="Category description (optional)"
                      className="textarea textarea-bordered w-full"
                      rows={3}
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Color Picker */}
                  <div>
                    <label className="label">
                      <span className="label-text font-medium">Color</span>
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, color: color.value })
                          }
                          className={`
                            p-3 rounded-lg border-2 transition-all duration-200
                            ${
                              formData.color === color.value
                                ? "border-primary scale-110"
                                : "border-base-content/20 hover:border-base-content/40"
                            }
                          `}
                        >
                          <div
                            className={`w-6 h-6 rounded-full mx-auto ${color.class}`}
                          ></div>
                          <span className="text-xs mt-1 block">
                            {color.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Icon Picker */}
                  <div>
                    <label className="label">
                      <span className="label-text font-medium">Icon</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {iconOptions.map((icon) => {
                        const IconComponent = icon.component;
                        return (
                          <button
                            key={icon.value}
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, icon: icon.value })
                            }
                            className={`
                              p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-1
                              ${
                                formData.icon === icon.value
                                  ? "border-primary bg-primary/10"
                                  : "border-base-content/20 hover:border-base-content/40"
                              }
                            `}
                          >
                            <IconComponent className="size-5" />
                            <span className="text-xs">{icon.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="btn btn-primary w-full gap-2"
                    >
                      <SaveIcon className="size-4" />
                      {editingId ? "Update Category" : "Create Category"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;
