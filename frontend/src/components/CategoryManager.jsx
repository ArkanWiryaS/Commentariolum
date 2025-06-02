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
  FolderPlusIcon,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const CategoryManager = ({ isOpen, onClose, onCategoryChange }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "primary",
    icon: "Folder",
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
    { value: "Folder", label: "Folder", component: FolderIcon },
    { value: "Tag", label: "Tag", component: TagIcon },
    { value: "FolderPlus", label: "Folder Plus", component: FolderPlusIcon },
  ];

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/categories");
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      color: "primary",
      icon: "Folder",
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
          `http://localhost:5001/api/categories/${editingId}`,
          formData
        );
        setCategories((prev) =>
          prev.map((cat) => (cat._id === editingId ? response.data : cat))
        );
        toast.success("Category updated successfully");
      } else {
        response = await axios.post(
          "http://localhost:5001/api/categories",
          formData
        );
        setCategories((prev) => [response.data, ...prev]);
        toast.success("Category created successfully");
      }

      resetForm();
      onCategoryChange?.();
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error(
        error.response?.data?.message || "Failed to save category"
      );
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
      await axios.delete(`http://localhost:5001/api/categories/${categoryId}`);
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
      Folder: FolderIcon,
      Tag: TagIcon,
      FolderPlus: FolderPlusIcon,
    };
    return iconMap[iconName] || FolderIcon;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative bg-base-100 rounded-3xl shadow-2xl border border-base-content/10 w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-base-content/10">
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

        <div className="flex h-[calc(90vh-120px)]">
          {/* Categories List */}
          <div className="flex-1 p-6 overflow-y-auto border-r border-base-content/10">
            <div className="flex items-center justify-between mb-6">
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

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <LoaderIcon className="size-8 animate-spin text-primary" />
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-12">
                <FolderIcon className="size-16 text-base-content/30 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-base-content/70 mb-2">
                  No categories yet
                </h4>
                <p className="text-sm text-base-content/50 mb-4">
                  Create your first category to organize your notes
                </p>
                <button
                  onClick={() => setIsCreating(true)}
                  className="btn btn-primary btn-sm gap-2"
                >
                  <PlusIcon className="size-4" />
                  Create Category
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {categories.map((category) => {
                  const IconComponent = getIconComponent(category.icon);
                  return (
                    <div
                      key={category._id}
                      className="p-4 bg-base-200/50 rounded-xl border border-base-content/10 hover:bg-base-200 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg bg-${category.color}/10 text-${category.color}`}
                          >
                            <IconComponent className="size-5" />
                          </div>
                          <div>
                            <h4 className="font-medium text-base-content">
                              {category.name}
                            </h4>
                            {category.description && (
                              <p className="text-sm text-base-content/60">
                                {category.description}
                              </p>
                            )}
                            <p className="text-xs text-base-content/50">
                              {category.noteCount} notes
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEdit(category)}
                            className="p-2 hover:bg-base-300 rounded-lg transition-colors"
                            title="Edit category"
                          >
                            <PenSquareIcon className="size-4 text-base-content/60" />
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(category._id, category.name)
                            }
                            className="p-2 hover:bg-error/10 text-error rounded-lg transition-colors"
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

          {/* Create/Edit Form */}
          {isCreating && (
            <div className="w-80 bg-base-50 flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-base-content/10">
                <h3 className="text-lg font-semibold text-base-content">
                  {editingId ? "Edit Category" : "Create Category"}
                </h3>
                <button
                  onClick={resetForm}
                  className="p-1 hover:bg-base-200 rounded-lg transition-colors"
                >
                  <XIcon className="size-5 text-base-content/60" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-base-content/80 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="e.g., Work, Personal, Ideas"
                      className="w-full px-3 py-2 bg-base-200/50 border border-base-content/10 rounded-lg focus:border-primary focus:bg-base-100 transition-all"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-base-content/80 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="Brief description of this category"
                      className="w-full px-3 py-2 bg-base-200/50 border border-base-content/10 rounded-lg focus:border-primary focus:bg-base-100 transition-all resize-none"
                      rows={3}
                    />
                  </div>

                  {/* Color */}
                  <div>
                    <label className="block text-sm font-medium text-base-content/80 mb-2">
                      Color
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, color: color.value })
                          }
                          className={`p-3 rounded-lg border-2 transition-all ${
                            formData.color === color.value
                              ? "border-base-content/30 scale-105"
                              : "border-base-content/10 hover:border-base-content/20"
                          }`}
                        >
                          <div
                            className={`w-6 h-6 ${color.class} rounded-md mx-auto`}
                          ></div>
                          <div className="text-xs mt-1">{color.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Icon */}
                  <div>
                    <label className="block text-sm font-medium text-base-content/80 mb-2">
                      Icon
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
                            className={`p-3 rounded-lg border-2 transition-all ${
                              formData.icon === icon.value
                                ? "border-primary bg-primary/10"
                                : "border-base-content/10 hover:border-base-content/20"
                            }`}
                          >
                            <IconComponent className="size-6 mx-auto mb-1" />
                            <div className="text-xs">{icon.label}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full btn btn-primary gap-2 mt-6"
                  >
                    <SaveIcon className="size-4" />
                    {editingId ? "Update Category" : "Create Category"}
                  </button>
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