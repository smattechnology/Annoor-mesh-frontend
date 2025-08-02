"use client";
import { BUDGET_THRESHOLDS, FOOD_CATEGORIES, MESS_INFO } from "@/constants";
import { Item, ItemMap } from "@/types";
import { useState, useEffect, useMemo } from "react";
import { CategoryMap } from "@/types";
import ProductSection from "@/components/item/ProductSection";
import { Calculator, DollarSign, Users } from "lucide-react";
import { BudgetSummary } from "@/components/item/BudgetSummary";
import { BudgetStatus } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import ItemMessHeader from "@/components/item/ItemMessHeader";

export default function Page() {
  const [selectedData, setSelectedData] = useState<CategoryMap>({});
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [budgetPerStudent, setBudgetPerStudent] = useState<number>(0);
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.push("/");
      } else {
        router.push("/auth");
      }
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    const initialData = FOOD_CATEGORIES.reduce((acc, category) => {
      const itemMap: Record<number, Item & { key: string }> =
        category.items.reduce((itemAcc, item) => {
          itemAcc[item.id] = {
            ...item,
            key: item.id.toString(), // assuming item.key exists
          };
          return itemAcc;
        }, {} as Record<number, Item & { key: string }>);

      acc[category.id] = {
        id: category.id,
        title: category.title,
        items: itemMap,
      };

      return acc;
    }, {} as CategoryMap);

    setSelectedData(initialData);
  }, []);

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

    Object.values(selectedData).forEach((category) => {
      Object.values(category.items).forEach((item) => {
        const bld = item.bld;
        const price = (item.pp ?? 0) > 0;
        if (price && (bld?.breakfast || bld?.lunch || bld?.dinner)) {
          count += 1;
        }
      });
    });

    return count;
  }, [selectedData]);

  const resetSelection = () => {
    const newData: CategoryMap = {};

    Object.entries(selectedData).forEach(([categoryId, category]) => {
      const updatedItems: ItemMap = {};

      Object.entries(category.items).forEach(([itemId, item]) => {
        updatedItems[Number(itemId)] = {
          ...item,
          pp: 0,
          bld: {
            breakfast: false,
            lunch: false,
            dinner: false,
          },
        };
      });

      newData[Number(categoryId)] = {
        ...category,
        items: updatedItems,
      };
    });

    setSelectedData(newData);
  };

  return (
    <div className="w-ful lg:max-w-7xl mx-auto">
      <ItemMessHeader
        budgetPerStudent={budgetPerStudent}
        setBudgetPerStudent={setBudgetPerStudent}
        totalStudents={totalStudents}
        setTotalStudents={setTotalStudents}
        totalBudget={totalBudget}
        setTotalBudget={setTotalBudget}
        totalPrice={totalPrice}
        selectedData={selectedData}
      />

      <div className="p-4">
        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={resetSelection}
        >
          Reset
        </button>
      </div>
      <ProductSection
        selectedData={selectedData}
        setSelectedData={setSelectedData}
        setTotalPrice={setTotalPrice}
      />
    </div>
  );
}
