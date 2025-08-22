import { Category, MealTime, ProductMap, SelectedCategoryMap } from "@/types";
import React, { useState } from "react";
import { ItemCard } from "./ItemCard";
import {
  Delete,
  DeleteIcon,
  Edit,
  RefreshCcw,
  Repeat,
  Trash,
} from "lucide-react";
import { on } from "events";
import EditItemsModal from "../modal/EditItemsModal";

interface ItemRowProps {
  category: Category;
  selectedItems: SelectedCategoryMap;
  setSelectedItems: React.Dispatch<React.SetStateAction<SelectedCategoryMap>>;
  onItemSelectToggle: (categoryId: string, productId: string) => void;
  onItemDelete: (productId: string) => void;
  // onItemAutoToggle: (productId: string) => void;
  isAuto: boolean;
  onItemBldToggle: (productId: string, bld: MealTime) => void;
  onItemQuantityChange: (productId: string, pp: number) => void;
  onDelete?: () => void;
  onEdit?: () => void;
  onRefresh?: () => void;
}

const ItemRow: React.FC<ItemRowProps> = ({
  category,
  selectedItems,
  setSelectedItems,
  onItemSelectToggle,
  onItemDelete,
  // onItemAutoToggle,
  isAuto,
  onItemBldToggle,
  onItemQuantityChange,
  onDelete,
  onEdit,
  onRefresh,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  if (selectedItems[category.id])
    return (
      <div
        key={category.id}
        className="p-5 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {category.label}
            </h2>
            <span className=" ">{category.icon}</span>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center gap-2">
            <span
              className="p-2 shadow cursor-pointer rounded-lg border border-gray-300 hover:bg-blue-100 hover:text-blue-700"
              onClick={() => setIsOpen(true)}
            >
              <Edit className="h-5 w-5" />
            </span>
            <span
              className="p-2 shadow cursor-pointer rounded-lg border border-gray-300 hover:bg-blue-100 hover:text-blue-700"
              onClick={onRefresh}
            >
              <Repeat className="h-5 w-5" />
            </span>
            <button
              className="p-2 shadow rounded-lg border border-gray-300 hover:bg-red-100 hover:text-red-700"
              onClick={onDelete}
            >
              <Trash className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="w-full grid grid-cols-3 lg:grid-cols-3 gap-2">
          {selectedItems[category.id] &&
            Object.keys(selectedItems[category.id]).map((product_id) => (
              <ItemCard
                key={product_id}
                auto={isAuto}
                product={category.products[product_id]}
                selectedItem={selectedItems[category.id][product_id]}
                onDelete={() => onItemDelete(product_id)}
                isAuto={isAuto}
                onToggle={(bld) => {
                  onItemBldToggle(product_id, bld);
                }}
                omQuantityChange={(pp) => {
                  onItemQuantityChange(product_id, pp);
                }}
              />
            ))}
        </div>
        <EditItemsModal
          isShowing={isOpen}
          setIsShowing={setIsOpen}
          category={category}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          products={category.products}
          onItemSelectToggle={onItemSelectToggle}
        />
      </div>
    );
};

export default ItemRow;
