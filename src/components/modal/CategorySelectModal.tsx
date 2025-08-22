import React from "react";
import Modal from "./Modal";
import { CategoryMap, SelectedCategoryMap } from "@/types";
import { CheckCircle2 } from "lucide-react";

interface CategorySelectModalProps {
  catSelectIsOpen: boolean;
  setCatSelectIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedItems: SelectedCategoryMap;
  categories: CategoryMap;
  onToggle: (categoryId: string) => void;
}

const CategorySelectModal: React.FC<CategorySelectModalProps> = ({
  catSelectIsOpen,
  setCatSelectIsOpen,
  selectedItems,
  categories,
  onToggle,
}) => {
  return (
    <Modal
      open={catSelectIsOpen}
      onClose={() => setCatSelectIsOpen(false)}
      size="lg"
      title="Select Categories"
      header
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Object.keys(categories).map((categoryId) => {
          const isSelected = !!selectedItems[categoryId];
          const category = categories[categoryId];

          return (
            <div
              key={categoryId}
              role="button"
              onClick={() => onToggle(categoryId)}
              className={`relative group flex flex-col items-center justify-center p-6 rounded-2xl border transition-all cursor-pointer shadow-sm
                ${
                  isSelected
                    ? "bg-blue-600 border-blue-600 text-white shadow-md"
                    : "bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md"
                }`}
            >
              {/* Category Icon */}
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-xl mb-3
                  ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-blue-50 text-blue-600"
                  }`}
              >
                {category.icon ? (
                  <span className="w-6 h-6">{category.icon}</span>
                ) : (
                  <span className="font-bold text-lg">{category.label[0]}</span>
                )}
              </div>

              {/* Label */}
              <h2
                className={`text-base font-semibold text-center ${
                  isSelected ? "text-white" : "text-slate-800"
                }`}
              >
                {category.label}
              </h2>

              {/* Selection Checkmark */}
              {isSelected && (
                <CheckCircle2 className="absolute top-3 right-3 h-5 w-5 text-white drop-shadow" />
              )}
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

export default CategorySelectModal;
