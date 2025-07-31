"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Loader,
  Check,
  X,
  RotateCcw,
  Calculator,
  Users,
  DollarSign,
} from "lucide-react";
import { useRouter } from "next/navigation";
// Types
interface MealTime {
  morning: boolean;
  afternoon: boolean;
  night: boolean;
  editable?: boolean;
}

interface Item {
  id: number;
  name: string;
  price: number;
  unite: string;
  mdn?: MealTime;
}

interface Category {
  title: string;
  items: Item[];
}

interface MealSelections {
  [itemId: number]: {
    morning: boolean;
    afternoon: boolean;
    night: boolean;
  };
}

interface MessDaySettings {
  morning: boolean;
  afternoon: boolean;
  night: boolean;
}

// Constants
const MEAL_TIMES = {
  morning: "সকাল",
  afternoon: "দুপুর",
  night: "রাত",
} as const;

// Category data - moved to separate constant for better maintainability
const CATEGORIES: Category[] = [
  {
    title: "তেল/মশলা",
    items: [
      {
        id: 1,
        name: "সয়াবিন তেল",
        price: 100,
        unite: "লিটার",
        mdn: { morning: true, afternoon: false, night: true, editable: false },
      },
      {
        id: 2,
        name: "সরিষার তেল",
        price: 80,
        unite: "লিটার",
        mdn: { morning: false, afternoon: true, night: false, editable: true },
      },
      {
        id: 3,
        name: "পাম তেল",
        price: 90,
        unite: "লিটার",
        mdn: { morning: true, afternoon: true, night: false, editable: false },
      },
      {
        id: 4,
        name: "কোকোনাট তেল",
        price: 120,
        unite: "লিটার",
        mdn: { morning: false, afternoon: false, night: true, editable: true },
      },
      {
        id: 5,
        name: "ঘি",
        price: 200,
        unite: "লিটার",
        mdn: { morning: true, afternoon: false, night: false, editable: true },
      },
      {
        id: 6,
        name: "বাটার",
        price: 150,
        unite: "লিটার",
        mdn: { morning: false, afternoon: true, night: true, editable: false },
      },
      {
        id: 7,
        name: "চিনি",
        price: 50,
        unite: "কেজি",
        mdn: { morning: true, afternoon: true, night: true, editable: true },
      },
      {
        id: 8,
        name: "লবণ",
        price: 20,
        unite: "কেজি",
        mdn: {
          morning: false,
          afternoon: false,
          night: false,
          editable: false,
        },
      },
    ],
  },
  {
    title: "শাক",
    items: [
      {
        id: 9,
        name: "পালং শাক",
        price: 20,
        unite: "কেজি",
        mdn: { morning: false, afternoon: true, night: true, editable: true },
      },
      {
        id: 10,
        name: "লাল শাক",
        price: 25,
        unite: "কেজি",
        mdn: { morning: true, afternoon: false, night: false, editable: true },
      },
      {
        id: 11,
        name: "কলমি শাক",
        price: 18,
        unite: "কেজি",
        mdn: { morning: false, afternoon: true, night: false, editable: true },
      },
      {
        id: 12,
        name: "পুঁই শাক",
        price: 22,
        unite: "কেজি",
        mdn: { morning: true, afternoon: false, night: true, editable: true },
      },
      {
        id: 13,
        name: "ঝিঙ্গে শাক",
        price: 28,
        unite: "কেজি",
        mdn: { morning: true, afternoon: true, night: false, editable: true },
      },
      {
        id: 14,
        name: "নটে শাক",
        price: 19,
        unite: "কেজি",
        mdn: { morning: false, afternoon: false, night: true, editable: true },
      },
      {
        id: 15,
        name: "শ্যাম শাক",
        price: 30,
        unite: "কেজি",
        mdn: { morning: true, afternoon: true, night: true, editable: true },
      },
      {
        id: 16,
        name: "সরিষা শাক",
        price: 26,
        unite: "কেজি",
        mdn: { morning: false, afternoon: true, night: false, editable: true },
      },
    ],
  },
  {
    title: "সবজি",
    items: [
      {
        id: 17,
        name: "আলু",
        price: 30,
        unite: "কেজি",
        mdn: { morning: true, afternoon: true, night: true, editable: true },
      },
      {
        id: 18,
        name: "বেগুন",
        price: 35,
        unite: "কেজি",
        mdn: { morning: false, afternoon: true, night: false, editable: true },
      },
      {
        id: 19,
        name: "টমেটো",
        price: 40,
        unite: "কেজি",
        mdn: { morning: true, afternoon: true, night: true, editable: true },
      },
      {
        id: 20,
        name: "শসা",
        price: 25,
        unite: "কেজি",
        mdn: { morning: true, afternoon: false, night: false, editable: true },
      },
      {
        id: 21,
        name: "করলা",
        price: 32,
        unite: "কেজি",
        mdn: { morning: false, afternoon: true, night: true, editable: true },
      },
      {
        id: 22,
        name: "মিষ্টি কুমড়া",
        price: 27,
        unite: "কেজি",
        mdn: { morning: false, afternoon: false, night: true, editable: true },
      },
      {
        id: 23,
        name: "পটল",
        price: 34,
        unite: "কেজি",
        mdn: { morning: true, afternoon: false, night: false, editable: true },
      },
      {
        id: 24,
        name: "কাঁচা মরিচ",
        price: 80,
        unite: "কেজি",
        mdn: {
          morning: false,
          afternoon: false,
          night: false,
          editable: false,
        },
      },
    ],
  },
  {
    title: "মাছ",
    items: [
      {
        id: 25,
        name: "রুই মাছ",
        price: 250,
        unite: "কেজি",
        mdn: { morning: false, afternoon: true, night: true, editable: true },
      },
      {
        id: 26,
        name: "ইলিশ মাছ",
        price: 800,
        unite: "কেজি",
        mdn: { morning: true, afternoon: false, night: false, editable: false },
      },
      {
        id: 27,
        name: "কাতলা",
        price: 300,
        unite: "কেজি",
        mdn: { morning: true, afternoon: true, night: false, editable: true },
      },
      {
        id: 28,
        name: "পাবদা",
        price: 350,
        unite: "কেজি",
        mdn: { morning: false, afternoon: true, night: true, editable: true },
      },
      {
        id: 29,
        name: "টেংরা",
        price: 400,
        unite: "কেজি",
        mdn: { morning: true, afternoon: false, night: false, editable: true },
      },
      {
        id: 30,
        name: "চিংড়ি",
        price: 600,
        unite: "কেজি",
        mdn: { morning: false, afternoon: true, night: true, editable: true },
      },
      {
        id: 31,
        name: "মাগুর মাছ",
        price: 450,
        unite: "কেজি",
        mdn: { morning: true, afternoon: true, night: false, editable: true },
      },
      {
        id: 32,
        name: "সিলভার কার্প",
        price: 220,
        unite: "কেজি",
        mdn: { morning: false, afternoon: false, night: true, editable: true },
      },
    ],
  },
  {
    title: "মাংস",
    items: [
      {
        id: 33,
        name: "গরুর মাংস",
        price: 700,
        unite: "কেজি",
        mdn: { morning: false, afternoon: false, night: true, editable: true },
      },
      {
        id: 34,
        name: "মুরগি",
        price: 180,
        unite: "কেজি",
        mdn: { morning: true, afternoon: true, night: true, editable: true },
      },
      {
        id: 35,
        name: "খাসির মাংস",
        price: 850,
        unite: "কেজি",
        mdn: { morning: false, afternoon: true, night: false, editable: true },
      },
      {
        id: 36,
        name: "হাঁস",
        price: 400,
        unite: "কেজি",
        mdn: { morning: true, afternoon: false, night: true, editable: true },
      },
      {
        id: 37,
        name: "মুরগি লেগ পিস",
        price: 200,
        unite: "কেজি",
        mdn: { morning: false, afternoon: true, night: false, editable: true },
      },
      {
        id: 38,
        name: "চিকেন উইংস",
        price: 210,
        unite: "কেজি",
        mdn: { morning: false, afternoon: false, night: true, editable: true },
      },
      {
        id: 39,
        name: "মুরগি বুকের মাংস",
        price: 220,
        unite: "কেজি",
        mdn: { morning: true, afternoon: true, night: true, editable: true },
      },
      {
        id: 40,
        name: "হাড় ছাড়া মাংস",
        price: 260,
        unite: "কেজি",
        mdn: { morning: false, afternoon: true, night: true, editable: true },
      },
    ],
  },
  {
    title: "নিত্যপ্রয়োজনীয় খাদ্যপণ্য",
    items: [
      {
        id: 41,
        name: "চাল",
        price: 60,
        unite: "কেজি",
        mdn: { morning: true, afternoon: true, night: true, editable: false },
      },
      {
        id: 42,
        name: "ডাল",
        price: 90,
        unite: "কেজি",
        mdn: { morning: false, afternoon: false, night: true, editable: true },
      },
      {
        id: 43,
        name: "চিনি",
        price: 55,
        unite: "কেজি",
        mdn: { morning: true, afternoon: false, night: true, editable: false },
      },
      {
        id: 44,
        name: "আটা",
        price: 45,
        unite: "কেজি",
        mdn: { morning: false, afternoon: true, night: true, editable: true },
      },
      {
        id: 45,
        name: "ময়দা",
        price: 50,
        unite: "কেজি",
        mdn: { morning: true, afternoon: true, night: false, editable: true },
      },
      {
        id: 46,
        name: "চিড়া",
        price: 35,
        unite: "কেজি",
        mdn: { morning: true, afternoon: false, night: false, editable: true },
      },
      {
        id: 47,
        name: "সুজি",
        price: 40,
        unite: "কেজি",
        mdn: { morning: false, afternoon: true, night: false, editable: true },
      },
      {
        id: 48,
        name: "মুড়ি",
        price: 30,
        unite: "কেজি",
        mdn: { morning: true, afternoon: false, night: false, editable: true },
      },
    ],
  },
];

const INFO = {
  name: "ছাত্রাবাস স্মাট মেস",
  established: "2021-08-01",
  type: "Boys Mess",
  owner: {
    name: "Abir Hasan",
    contact: "+8801712345678",
    email: "abir@smatmess.com",
  },
  address: {
    street: "House 12, Road 7",
    area: "Uttara Sector 10",
    city: "Dhaka",
    postalCode: "1230",
    country: "Bangladesh",
  },
  contact: {
    phone: "+880961234567",
    email: "info@smatmess.com",
    facebook: "https://facebook.com/smatmess",
    website: "https://smatmess.com",
  },
  capacity: 50,
  mealTiming: {
    breakfast: "7:30 AM - 9:00 AM",
    lunch: "1:00 PM - 2:30 PM",
    dinner: "8:00 PM - 9:30 PM",
  },
  offDays: ["Friday"],
  notes: "All meals are served fresh. Monthly and daily plans available.",
};

// Custom hooks
const useMealSelections = () => {
  const [mealSelections, setMealSelections] = useState<MealSelections>({});
  const [initialState, setInitialState] = useState<MealSelections>({});
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  const toggleItem = useCallback((item: Item) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      const isSelected = newSet.has(item.id);

      if (isSelected) {
        newSet.delete(item.id);
        setMealSelections((prevMeals) => {
          const updated = { ...prevMeals };
          delete updated[item.id];
          return updated;
        });
      } else {
        newSet.add(item.id);
        if (item.mdn) {
          const newSelection = {
            morning: item.mdn.morning,
            afternoon: item.mdn.afternoon,
            night: item.mdn.night,
          };

          setMealSelections((prev) => ({
            ...prev,
            [item.id]: newSelection,
          }));

          setInitialState((prev) => ({
            ...prev,
            [item.id]: newSelection,
          }));
        }
      }

      return newSet;
    });
  }, []);

  const handleMealChange = useCallback(
    (
      id: number,
      mealTime: keyof Omit<MealTime, "editable">,
      value: boolean
    ) => {
      setMealSelections((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          [mealTime]: value,
        },
      }));
    },
    []
  );

  const handleClear = useCallback(() => {
    setMealSelections({});
    setSelectedItems(new Set());
    setInitialState({});
  }, []);

  const handleCancel = useCallback(() => {
    setMealSelections({ ...initialState });
    setSelectedItems(new Set(Object.keys(initialState).map(Number)));
  }, [initialState]);

  return {
    mealSelections,
    selectedItems,
    initialState,
    toggleItem,
    handleMealChange,
    handleClear,
    handleCancel,
  };
};

// Mess Info Header Component
const MessInfoHeader: React.FC<{
  budgetPerStudent: number;
  setBudgetPerStudent: (value: number) => void;
  totalStudents: number;
  setTotalStudents: (value: number) => void;
  totalBudget: number;
  messDay: MessDaySettings;
  setMessDay: (settings: MessDaySettings) => void;
  selectedItemsCount: number;
  totalSelectionPrice: number;
  remainingBudget: number;
}> = React.memo(
  ({
    budgetPerStudent,
    setBudgetPerStudent,
    totalStudents,
    setTotalStudents,
    totalBudget,
    messDay,
    setMessDay,
    selectedItemsCount,
    totalSelectionPrice,
    remainingBudget,
  }) => {
    const handleBudgetChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(0, parseInt(e.target.value) || 0);
        setBudgetPerStudent(value);
      },
      [setBudgetPerStudent]
    );

    const handleStudentsChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(0, parseInt(e.target.value) || 0);
        setTotalStudents(value);
      },
      [setTotalStudents]
    );

    const handleMessDayChange = useCallback(
      (mealType: keyof MessDaySettings, checked: boolean) => {
        setMessDay((prev) => ({
          ...prev,
          [mealType]: checked,
        }));
      },
      [setMessDay]
    );

    const isOverBudget = totalSelectionPrice > totalBudget;
    const budgetUtilization =
      totalBudget > 0 ? (totalSelectionPrice / totalBudget) * 100 : 0;

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{INFO.name}</h2>
              <p className="text-blue-100 text-sm">
                Established:{" "}
                {new Date(INFO.established).toLocaleDateString("bn-BD")} •{" "}
                {INFO.type}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-100">Capacity</p>
              <p className="text-xl font-semibold">{INFO.capacity} Students</p>
            </div>
          </div>
        </div>

        {/* Content */}
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

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Address:</span>
                  <span className="text-right max-w-48 text-gray-900">
                    {INFO.address.street}, {INFO.address.area}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">City:</span>
                  <span className="text-gray-900">
                    {INFO.address.city} - {INFO.address.postalCode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Contact:</span>
                  <span className="text-gray-900">{INFO.contact.phone}</span>
                </div>
              </div>

              {/* Meal Timings */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-sm text-gray-900 mb-2">
                  Meal Timings
                </h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Breakfast:</span>
                    <span>{INFO.mealTiming.breakfast}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lunch:</span>
                    <span>{INFO.mealTiming.lunch}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dinner:</span>
                    <span>{INFO.mealTiming.dinner}</span>
                  </div>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Per Student Budget (৳)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={budgetPerStudent || ""}
                    onChange={handleBudgetChange}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Students
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={totalStudents || ""}
                    onChange={handleStudentsChange}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
              <div className="pt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Budget
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium text-gray-900">
                  ৳ {totalBudget.toLocaleString("en-BD")}
                </div>
              </div>
              {/* Budget Status
              {totalBudget > 0 && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Budget Utilization
                    </span>
                    <span
                      className={`text-sm font-semibold ${
                        isOverBudget
                          ? "text-red-600"
                          : budgetUtilization > 80
                          ? "text-amber-600"
                          : "text-green-600"
                      }`}
                    >
                      {budgetUtilization.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isOverBudget
                          ? "bg-red-500"
                          : budgetUtilization > 80
                          ? "bg-amber-500"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )} */}
            </div>

            {/* Meal Day Settings & Summary */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Meal Settings & Summary
                </h3>
              </div>

              {/* Mess Day Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Active Meal Times
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(
                    Object.keys(MEAL_TIMES) as Array<keyof MessDaySettings>
                  ).map((mealType) => (
                    <label
                      key={mealType}
                      className={`flex items-center justify-center gap-2 p-2 border rounded-lg cursor-pointer transition-all ${
                        messDay[mealType]
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={messDay[mealType]}
                        onChange={(e) =>
                          handleMessDayChange(mealType, e.target.checked)
                        }
                        className="sr-only"
                      />
                      <span className="text-sm font-medium">
                        {MEAL_TIMES[mealType]}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Selection Summary */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedItemsCount}
                    </div>
                    <div className="text-xs text-blue-600">Items Selected</div>
                  </div>
                  <div
                    className={`p-3 rounded-lg text-center ${
                      isOverBudget ? "bg-red-50" : "bg-green-50"
                    }`}
                  >
                    <div
                      className={`text-2xl font-bold ${
                        isOverBudget ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      ৳{totalSelectionPrice.toLocaleString("en-BD")}
                    </div>
                    <div
                      className={`text-xs ${
                        isOverBudget ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      Total Cost
                    </div>
                  </div>
                </div>

                {totalBudget > 0 && (
                  <div
                    className={`p-3 rounded-lg text-center ${
                      isOverBudget
                        ? "bg-red-50"
                        : remainingBudget < totalBudget * 0.2
                        ? "bg-amber-50"
                        : "bg-gray-50"
                    }`}
                  >
                    <div
                      className={`text-lg font-semibold ${
                        isOverBudget
                          ? "text-red-600"
                          : remainingBudget < totalBudget * 0.2
                          ? "text-amber-600"
                          : "text-gray-700"
                      }`}
                    >
                      ৳{Math.abs(remainingBudget).toLocaleString("en-BD")}
                    </div>
                    <div
                      className={`text-xs ${
                        isOverBudget
                          ? "text-red-600"
                          : remainingBudget < totalBudget * 0.2
                          ? "text-amber-600"
                          : "text-gray-600"
                      }`}
                    >
                      {isOverBudget ? "Over Budget" : "Remaining Budget"}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

MessInfoHeader.displayName = "MessInfoHeader";

// Meal time checkbox component
const MealTimeCheckbox: React.FC<{
  id: number;
  mealTime: keyof Omit<MealTime, "editable">;
  checked: boolean;
  disabled: boolean;
  onChange: (
    id: number,
    mealTime: keyof Omit<MealTime, "editable">,
    value: boolean
  ) => void;
}> = React.memo(({ id, mealTime, checked, disabled, onChange }) => (
  <label
    className={`flex items-center gap-1 cursor-pointer ${
      disabled ? "opacity-50 cursor-not-allowed" : "hover:text-blue-600"
    }`}
  >
    <input
      type="checkbox"
      disabled={disabled}
      checked={checked}
      onChange={(e) => onChange(id, mealTime, e.target.checked)}
      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
      aria-label={`${MEAL_TIMES[mealTime]} meal selection`}
    />
    <span className="text-xs select-none">{MEAL_TIMES[mealTime]}</span>
  </label>
));

MealTimeCheckbox.displayName = "MealTimeCheckbox";

// Item card component
const ItemCard: React.FC<{
  item: Item;
  isSelected: boolean;
  mealSelection: { morning: boolean; afternoon: boolean; night: boolean };
  onToggle: (item: Item) => void;
  onMealChange: (
    id: number,
    mealTime: keyof Omit<MealTime, "editable">,
    value: boolean
  ) => void;
}> = React.memo(
  ({ item, isSelected, mealSelection, onToggle, onMealChange }) => (
    <div
      className={`border rounded-lg p-4 shadow transition-all duration-200 hover:shadow-md ${
        isSelected
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <label className="flex items-center gap-3 mb-3 cursor-pointer">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggle(item)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 hidden"
          aria-describedby={`item-${item.id}-price`}
        />
        <div className="flex-1">
          <span className="font-medium text-sm text-gray-900 block">
            {item.name}
          </span>
          <p
            id={`item-${item.id}-price`}
            className="text-xs text-gray-600 mt-1"
          >
            {item.price} টাকা / {item.unite}
          </p>
        </div>
      </label>

      {isSelected && item.mdn && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex gap-3 flex-wrap text-xs">
            {(
              Object.keys(MEAL_TIMES) as Array<keyof Omit<MealTime, "editable">>
            ).map((mealTime) => (
              <MealTimeCheckbox
                key={mealTime}
                id={item.id}
                mealTime={mealTime}
                checked={mealSelection[mealTime]}
                disabled={!item.mdn?.editable}
                onChange={onMealChange}
              />
            ))}
          </div>
          {!item.mdn.editable && (
            <p className="text-xs text-gray-500 mt-2 italic">
              * Meal times are preset for this item
            </p>
          )}
        </div>
      )}
    </div>
  )
);

ItemCard.displayName = "ItemCard";

// Action buttons component
const ActionButtons: React.FC<{
  onSave: () => void;
  onClear: () => void;
  onCancel: () => void;
  hasSelections: boolean;
  hasChanges: boolean;
  isLoading?: boolean;
}> = React.memo(
  ({
    onSave,
    onClear,
    onCancel,
    hasSelections,
    hasChanges,
    isLoading = false,
  }) => (
    <div className="flex flex-wrap gap-3 justify-center">
      <button
        onClick={onSave}
        disabled={!hasSelections || isLoading}
        className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
        aria-label="Save current selections"
      >
        <Check size={16} />
        {isLoading ? "Saving..." : "Save Selections"}
      </button>

      <button
        onClick={onClear}
        disabled={!hasSelections || isLoading}
        className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
        aria-label="Clear all selections"
      >
        <X size={16} />
        Clear All
      </button>

      <button
        onClick={onCancel}
        disabled={!hasChanges || isLoading}
        className="flex items-center gap-2 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
        aria-label="Cancel changes and restore previous state"
      >
        <RotateCcw size={16} />
        Cancel Changes
      </button>
    </div>
  )
);

ActionButtons.displayName = "ActionButtons";

// Loading component
const LoadingSpinner: React.FC = () => (
  <div
    className="w-full h-screen flex justify-center items-center bg-gray-50"
    role="status"
    aria-label="Loading application"
  >
    <div className="text-center">
      <Loader className="animate-spin text-blue-600 mx-auto mb-4" size={32} />
      <p className="text-gray-600">Loading your food selection...</p>
    </div>
  </div>
);

// Main Component
const FoodSelectionPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [budgetPerStudent, setBudgetPerStudent] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [messDay, setMessDay] = useState<MessDaySettings>({
    morning: true,
    afternoon: true,
    night: true,
  });

  const { user, isLoading } = useAuth();
  const router = useRouter();

  const {
    mealSelections,
    selectedItems,
    initialState,
    toggleItem,
    handleMealChange,
    handleClear,
    handleCancel,
  } = useMealSelections();

  // Memoized calculations
  const hasSelections = useMemo(() => selectedItems.size > 0, [selectedItems]);
  const hasChanges = useMemo(
    () => JSON.stringify(mealSelections) !== JSON.stringify(initialState),
    [mealSelections, initialState]
  );

  const totalBudget = useMemo(
    () => budgetPerStudent * totalStudents,
    [budgetPerStudent, totalStudents]
  );

  const totalPrice = useMemo(() => {
    return Array.from(selectedItems).reduce((total, itemId) => {
      const item = CATEGORIES.flatMap((cat) => cat.items).find(
        (item) => item.id === itemId
      );
      return total + (item?.price || 0);
    }, 0);
  }, [selectedItems]);

  const remainingBudget = useMemo(
    () => totalBudget - totalPrice,
    [totalBudget, totalPrice]
  );

  // Auth redirect effect
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth");
    }
  }, [isLoading, user, router]);

  // Save handler with error handling
  const handleSave = useCallback(async () => {
    if (!hasSelections) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // TODO: Replace with actual API call
      console.log("Selections saved:", {
        selections: mealSelections,
        totalItems: selectedItems.size,
        totalPrice,
        budgetInfo: {
          budgetPerStudent,
          totalStudents,
          totalBudget,
          remainingBudget,
        },
        messDay,
        timestamp: new Date().toISOString(),
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Optional: Show success message or redirect
      // router.push('/success');
    } catch (error) {
      console.error("Save error:", error);
      setSubmitError("Failed to save selections. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    hasSelections,
    mealSelections,
    selectedItems,
    totalPrice,
    budgetPerStudent,
    totalStudents,
    totalBudget,
    remainingBudget,
    messDay,
  ]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Food Selection
          </h1>
          <p className="text-gray-600">
            Choose your meals for different times of the day
          </p>
        </div>

        {/* Mess Info Header */}
        <MessInfoHeader
          budgetPerStudent={budgetPerStudent}
          setBudgetPerStudent={setBudgetPerStudent}
          totalStudents={totalStudents}
          setTotalStudents={setTotalStudents}
          totalBudget={totalBudget}
          messDay={messDay}
          setMessDay={setMessDay}
          selectedItemsCount={selectedItems.size}
          totalSelectionPrice={totalPrice}
          remainingBudget={remainingBudget}
        />

        {/* Error message */}
        {submitError && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {submitError}
          </div>
        )}

        {/* Categories */}
        <div className="space-y-8 mb-8">
          {CATEGORIES.map((category) => (
            <section
              key={category.title}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                {category.title}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {category.items.map((item) => {
                  const isSelected = selectedItems.has(item.id);
                  const mealSelection = mealSelections[item.id] || {
                    morning: false,
                    afternoon: false,
                    night: false,
                  };

                  return (
                    <ItemCard
                      key={item.id}
                      item={item}
                      isSelected={isSelected}
                      mealSelection={mealSelection}
                      onToggle={toggleItem}
                      onMealChange={handleMealChange}
                    />
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Note (optional)
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            rows={3}
            placeholder="Write any special instructions or notes here..."
          />
        </div>

        {/* Action Buttons */}
        <div className="bg-white p-4 rounded-lg shadow-lg border">
          <ActionButtons
            onSave={handleSave}
            onClear={handleClear}
            onCancel={handleCancel}
            hasSelections={hasSelections}
            hasChanges={hasChanges}
            isLoading={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

FoodSelectionPage.displayName = "FoodSelectionPage";

export default FoodSelectionPage;
