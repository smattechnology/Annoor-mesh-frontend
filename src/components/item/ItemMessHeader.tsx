import { BUDGET_THRESHOLDS, MESS_INFO } from "@/constants";
import { BudgetStatus, SelectedItems } from "@/types";
import { Calculator, DollarSign, Users } from "lucide-react";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { BudgetSummary } from "./BudgetSummary";

interface ItemMessHeaderProps {
  selectedItems: SelectedItems;
  budgetPerStudent: number;
  totalStudents: number;
  setBudgetPerStudent: Dispatch<SetStateAction<number>>;
  setTotalStudents: Dispatch<SetStateAction<number>>;
}

const ItemMessHeader: React.FC<ItemMessHeaderProps> = ({
  selectedItems,
  budgetPerStudent,
  totalStudents,
  setBudgetPerStudent,
  setTotalStudents,
}) => {
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [totalBudget, setTotalBudget] = useState<number>(0);

  useEffect(() => {
    setTotalBudget(
      (budgetPerStudent ? budgetPerStudent : 0) *
        (totalStudents ? totalStudents : 0)
    );
  }, [budgetPerStudent, totalStudents]);

  const remainingBudget = useMemo(
    () => totalBudget - totalPrice,
    [totalBudget, totalPrice]
  );

  const budgetStatus: BudgetStatus = useMemo(() => {
    if (totalBudget === 0) return "no-budget";

    const isOverBudget = totalPrice > totalBudget;
    const budgetUtilization = totalPrice / totalBudget;

    if (isOverBudget) return "over-budget";
    if (budgetUtilization > BUDGET_THRESHOLDS.HIGH_UTILIZATION)
      return "high-utilization";
    if (remainingBudget < totalBudget * BUDGET_THRESHOLDS.LOW_REMAINING)
      return "low-remaining";

    return "normal";
  }, [totalBudget, totalPrice, remainingBudget]);

  const getSelectedItemCount = useMemo(() => {
    let count = 0;
    let total = 0;

    Object.values(selectedItems).forEach((item) => {
      const price = item.price ?? 0;
      if (price > 0) {
        count += 1;
        const mealTime =
          (item.bld?.breakfast ? 1 : 0) +
          (item.bld?.lunch ? 1 : 0) +
          (item.bld?.dinner ? 1 : 0);
        const subTotal = price * mealTime;
        total += subTotal;
      }
    });
    setTotalPrice(total);
    return count;
  }, [selectedItems]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold">{MESS_INFO.name}</h2>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-100">Capacity</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Mess Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Mess Information
              </h3>
            </div>

            {/* Basic Information */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Address:</span>
                <span className="text-right max-w-48 text-gray-900">
                  {MESS_INFO.address.street}, {MESS_INFO.address.area}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">City:</span>
                <span className="text-gray-900">
                  {MESS_INFO.address.city} - {MESS_INFO.address.postalCode}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Contact:</span>
                <span className="text-gray-900">{MESS_INFO.phone}</span>
              </div>
            </div>
          </div>

          {/* Budget Configuration */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Calculator className="h-4 w-4 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Budget Configuration
              </h3>
            </div>

            {/* Budget Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="budget-per-student"
                  className="block text-sm font-medium text-gray-700 mb-1 text-nowrap"
                >
                  Per Student Budget (৳)
                </label>
                <input
                  id="budget-per-student"
                  type="number"
                  min="0"
                  value={budgetPerStudent || ""}
                  onChange={(e) => {
                    setBudgetPerStudent(Number(e.target.value));
                  }}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="total-students"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Total Students
                </label>
                <input
                  id="total-students"
                  type="number"
                  min="0"
                  value={totalStudents || ""}
                  onChange={(e) => {
                    setTotalStudents(Number(e.target.value));
                  }}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Total Budget Display */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Budget
              </label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium text-gray-900">
                ৳ {totalBudget.toLocaleString("en-BD")}
              </div>
            </div>
          </div>

          {/* Meal Settings & Summary */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Meal Settings & Summary
              </h3>
            </div>

            {/* Active Meal Times */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Active Meal Times
              </label>
            </div>

            {/* Budget Summary */}
            <BudgetSummary
              selectedItemsCount={getSelectedItemCount}
              totalSelectionPrice={totalPrice}
              totalBudget={totalBudget}
              remainingBudget={remainingBudget}
              budgetStatus={budgetStatus}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemMessHeader;
