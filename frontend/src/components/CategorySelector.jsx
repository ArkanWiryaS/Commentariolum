import React, { useState, useEffect } from "react";
import {
  FolderIcon,
  ChevronDownIcon,
  TagIcon,
  XIcon,
  CheckIcon,
} from "lucide-react";
import axios from "axios";

const CategorySelector = ({ 
  selectedCategoryId, 
  onSelectCategory, 
  className = "" 
}) => {
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/categories");
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = categories.find(cat => cat._id === selectedCategoryId);

  const getIconComponent = (iconName) => {
    const iconMap = {
      'Folder': FolderIcon,
      'Tag': TagIcon,
    };
    return iconMap[iconName] || FolderIcon;
  };

  const getColorClass = (color) => {
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

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-semibold text-base-content/80 mb-2">
        <div className="flex items-center gap-2">
          <FolderIcon className="size-4 text-primary" />
          Category
        </div>
      </label>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 bg-base-200/50 border border-base-content/10 rounded-xl focus:border-primary focus:bg-base-100 transition-all duration-300 text-left flex items-center justify-between hover:bg-base-100"
        >
          <div className="flex items-center gap-3">
            {selectedCategory ? (
              <>
                {React.createElement(getIconComponent(selectedCategory.icon), {
                  className: `size-5 ${getColorClass(selectedCategory.color).split(' ')[0]}`
                })}
                <div>
                  <span className="font-medium text-base-content">
                    {selectedCategory.name}
                  </span>
                  {selectedCategory.description && (
                    <div className="text-xs text-base-content/60">
                      {selectedCategory.description}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <FolderIcon className="size-5 text-base-content/40" />
                <span className="text-base-content/60">Select a category (optional)</span>
              </>
            )}
          </div>
          <ChevronDownIcon 
            className={`size-5 text-base-content/60 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </button>

        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            ></div>
            <div className="absolute top-full left-0 right-0 mt-2 bg-base-100 border border-base-content/10 rounded-xl shadow-xl z-20 max-h-60 overflow-y-auto">
              {/* No Category Option */}
              <button
                type="button"
                onClick={() => {
                  onSelectCategory(null);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-base-200/50 transition-colors duration-200 flex items-center gap-3 border-b border-base-content/5"
              >
                <XIcon className="size-5 text-base-content/40" />
                <div>
                  <span className="font-medium text-base-content/70">No Category</span>
                  <div className="text-xs text-base-content/50">
                    Keep this note uncategorized
                  </div>
                </div>
                {!selectedCategoryId && (
                  <CheckIcon className="size-4 text-primary ml-auto" />
                )}
              </button>

              {loading ? (
                <div className="px-4 py-6 text-center text-base-content/60">
                  Loading categories...
                </div>
              ) : categories.length === 0 ? (
                <div className="px-4 py-6 text-center text-base-content/60">
                  No categories yet. Create one first!
                </div>
              ) : (
                categories.map((category) => {
                  const IconComponent = getIconComponent(category.icon);
                  const isSelected = category._id === selectedCategoryId;
                  
                  return (
                    <button
                      key={category._id}
                      type="button"
                      onClick={() => {
                        onSelectCategory(category._id);
                        setIsOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-base-200/50 transition-colors duration-200 flex items-center gap-3"
                    >
                      <div className={`p-2 rounded-lg ${getColorClass(category.color)}`}>
                        <IconComponent className="size-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-base-content">
                          {category.name}
                        </div>
                        {category.description && (
                          <div className="text-xs text-base-content/60 truncate">
                            {category.description}
                          </div>
                        )}
                        <div className="text-xs text-base-content/50">
                          {category.noteCount} notes
                        </div>
                      </div>
                      {isSelected && (
                        <CheckIcon className="size-4 text-primary" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CategorySelector; 