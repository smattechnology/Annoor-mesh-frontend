import React, { useMemo } from "react";
import { CategoryMap, SelectedCategoryMap } from "@/types"; // Adjust path if needed
import Modal from "./Modal";

type PreSubmitSummaryProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  categories: CategoryMap;
  selectedItems: SelectedCategoryMap;
  currency?: string;
  auto: boolean;
  budgetPerMeal: number;
  totalMeal: number;
  totalBudget: number;
};

export default function PreSubmitSummaryModal({
  open,
  onClose,
  onConfirm,
  categories,
  selectedItems,
  currency = "৳",
  auto,
  budgetPerMeal,
  totalMeal,
  totalBudget,
}: PreSubmitSummaryProps) {
  const { grouped, totals } = useMemo(() => {
    const groupedData: Record<
      string,
      {
        name: string;
        qty?: number;
        unit?: string;
        price?: number;
        subtotal?: number;
      }[]
    > = {};
    let totalAmount = 0;
    let totalItems = 0;

    for (const categoryId in selectedItems) {
      const category = categories[categoryId];
      if (!category) continue;
      const selectedMap = selectedItems[categoryId];

      for (const productId in selectedMap) {
        const selection = selectedMap[productId];
        const product = category.products[productId];
        if (!product) continue;

        const subtotal = auto ? 0 : selection.quantity * product.price;
        if (!auto) totalAmount += subtotal;
        totalItems++;

        if (!groupedData[category.label]) groupedData[category.label] = [];
        groupedData[category.label].push({
          name: product.name,
          qty: auto ? undefined : selection.quantity,
          unit: auto ? undefined : selection.unit.label,
          price: auto ? undefined : product.price,
          subtotal: auto ? undefined : subtotal,
        });
      }
    }

    return {
      grouped: groupedData,
      totals: {
        totalAmount,
        totalItems,
        totalCategories: Object.keys(groupedData).length,
      },
    };
  }, [categories, selectedItems, auto]);

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose} size="xl">
      {/* <div className="fixed inset-0 z-50 min-h-screen overflow-hidden flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4"> */}
      {/* <div className="w-full sm:max-w-3xl bg-white rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden"> */}
      <div className="px-4 sm:px-6 py-4 border-b flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold">Review & Confirm</h2>
          <p className="text-xs sm:text-sm text-gray-500">
            {auto
              ? "Admin will finalize details for these selections."
              : "Check details before submitting products."}
          </p>
        </div>
        <button
          onClick={onClose}
          className="rounded-xl px-2 py-1 text-sm border hover:bg-gray-50"
        >
          Close
        </button>
      </div>

      <div className="px-4 sm:px-6 py-3 grid grid-cols-3 gap-2 text-center border-b">
        <div>
          <div className="text-base sm:text-lg font-semibold">
            {totals.totalCategories}
          </div>
          <div className="text-[10px] sm:text-xs text-gray-500">Categories</div>
        </div>
        <div>
          <div className="text-base sm:text-lg font-semibold">
            {totals.totalItems}
          </div>
          <div className="text-[10px] sm:text-xs text-gray-500">Items</div>
        </div>
        <div>
          <div className="text-base sm:text-lg font-semibold">
            {auto
              ? "Auto"
              : `${currency}${totals.totalAmount.toLocaleString()}`}
          </div>
          <div className="text-[10px] sm:text-xs text-gray-500">
            Estimated Total
          </div>
        </div>
      </div>

      {/* Budget Summary Row */}
      <div className="grid grid-cols-3 gap-4 text-center mb-4 border-t pt-4">
        <div>
          <p className="text-sm text-gray-500">Budget per Meal</p>
          <p className="font-semibold">
            {currency}
            {budgetPerMeal.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Meals</p>
          <p className="font-semibold">{totalMeal}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Budget</p>
          <p className="font-semibold">
            {currency}
            {totalBudget.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="max-h-[60vh] overflow-y-auto px-4 sm:px-6 py-4">
        {Object.entries(grouped).map(([categoryLabel, list]) => (
          <div key={categoryLabel} className="mb-5">
            <h3 className="text-sm sm:text-base font-semibold mb-2">
              {categoryLabel}
            </h3>
            <div className="divide-y rounded-xl border">
              {list.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                >
                  <div className="font-medium">{item.name}</div>
                  {!auto && (
                    <div className="flex items-center gap-3">
                      <div>
                        {item.qty} {item.unit}
                      </div>
                      <div className="text-gray-500">
                        @ {currency}
                        {item.price}
                      </div>
                      <div className="font-semibold">
                        {currency}
                        {item.subtotal?.toLocaleString()}
                      </div>
                    </div>
                  )}
                  {auto && (
                    <div className="text-gray-500 italic text-sm">
                      Auto Plan - Details to be set by Admin
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 sm:px-6 py-4 border-t flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-xl border hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={onConfirm}
          disabled={totals.totalItems === 0}
          className="px-4 py-2 rounded-xl bg-black text-white disabled:opacity-40"
        >
          Confirm & Submit
        </button>
      </div>
      {/* </div> */}
      {/* </div> */}
    </Modal>
  );
}
