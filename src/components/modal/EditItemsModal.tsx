import React, { useCallback } from "react";
import Modal from "./Modal";
import { Category, Product, SelectedCategoryMap } from "@/types";

interface EditItemsModalProps {
  isShowing: boolean;
  setIsShowing: React.Dispatch<React.SetStateAction<boolean>>;
  category: Category;
  products: Record<string, Product>;
  selectedItems: SelectedCategoryMap;
  setSelectedItems: React.Dispatch<React.SetStateAction<SelectedCategoryMap>>;
  onItemSelectToggle: (category_id: string, product_id: string) => void;
}

const EditItemsModal: React.FC<EditItemsModalProps> = ({
  isShowing,
  setIsShowing,
  category,
  products,
  selectedItems,
  setSelectedItems,
  onItemSelectToggle,
}) => {
  const handleClose = useCallback(() => {
    if (
      !selectedItems[category.id] ||
      Object.keys(selectedItems[category.id]).length === 0
    ) {
      const prevSelectedItems = { ...selectedItems };
      delete prevSelectedItems[category.id];
      setSelectedItems(prevSelectedItems);
    }
    setIsShowing(false);
  }, [category.id, selectedItems, setSelectedItems, setIsShowing]);

  return (
    <Modal
      open={isShowing}
      onClose={handleClose}
      title="Edit Items"
      size="xxl"
      header
    >
      <div className="flex flex-col gap-4">
        {/* Grid of Products */}
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
          {Object.values(products).map((product) => {
            const isSelected =
              selectedItems[category.id]?.[product.id] ?? false;

            return (
              <div
                key={product.id}
                className={`border rounded-lg p-4 shadow transition-all duration-200 cursor-pointer focus:outline-none ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                }`}
                role="button"
                tabIndex={0}
                onClick={() => onItemSelectToggle(category.id, product.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onItemSelectToggle(category.id, product.id);
                  }
                }}
              >
                <div>
                  <h3
                    id={`item-${product.id}-name`}
                    className="font-semibold text-sm text-gray-900 truncate"
                  >
                    {product.name}
                  </h3>
                  <p
                    id={`item-${product.id}-price`}
                    className="text-xs text-gray-600 mt-1"
                  >
                    <span className="font-medium">
                      ৳{product.unit.price.toLocaleString("en-BD")}
                    </span>
                    <span className="text-gray-500">
                      {" "}
                      / {product.unit?.label}
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end">
          <button
            onClick={handleClose}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition-all duration-200"
          >
            Submit
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditItemsModal;
