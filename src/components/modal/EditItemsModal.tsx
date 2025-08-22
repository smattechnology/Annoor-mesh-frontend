import React from "react";
import Modal from "./Modal";
import { Category, Product, SelectedCategoryMap } from "@/types";
import { ItemCard } from "@/components/item/ItemCard";

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
  return (
    <Modal
      open={isShowing}
      onClose={() => {
        if (Object.keys(selectedItems[category.id]).length <= 0) {
          const prevSelectedItems = { ...selectedItems };
          delete prevSelectedItems[category.id];
          setSelectedItems(prevSelectedItems);
        }
        setIsShowing(false);
      }}
      title="Edit Items"
      size="xxl"
      header
    >
      <div className="">
        <div className="grid grid-cols-3 gap-4 p-4">
          {Object.values(products).map((product) => (
            <div
              key={product.id}
              className={`border rounded-lg p-4 shadow transition-all duration-200 cursor-pointer ${
                selectedItems[category.id]?.[product.id]
                  ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
              }`}
              role="button"
              onClick={() => onItemSelectToggle(category.id, product.id)}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="">
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
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            if (Object.keys(selectedItems[category.id]).length <= 0) {
              const prevSelectedItems = { ...selectedItems };
              delete prevSelectedItems[category.id];
              setSelectedItems(prevSelectedItems);
            }
            setIsShowing(false);
          }}
        >
          Submit
        </button>
      </div>
    </Modal>
  );
};

export default EditItemsModal;
