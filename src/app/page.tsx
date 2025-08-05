"use client";
import { BUDGET_THRESHOLDS, MESS_INFO } from "@/constants";
import { Category, MealTime, SelectedItems } from "@/types";
import { useState, useEffect, useMemo } from "react";
import ProductSection from "@/components/item/ProductSection";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import ItemMessHeader from "@/components/item/ItemMessHeader";
import api from "@/utils/api";

export default function Page() {
  const [data, setData] = useState<Category[] | []>([]);
  const [selectedItems, setSelectedItems] = useState<SelectedItems>({});

  const [mealBudget, setMealBudget] = useState<number>(0);
  const [totalMeal, setTotalMeal] = useState<number>(0);

  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/auth");
      }
      fetchCategoriesWithProducts();
    }
  }, [isLoading, user, router]);

  const fetchCategoriesWithProducts = async () => {
    try {
      const req = await api.get("/product/get/by_category");
      if (req.status !== 200) return;

      const req_data: Category[] = req.data;
      setData(req_data);
    } catch (error) {
      console.error("Failed to fetch categories with products", error);
    }
  };

  const toggleMeal = (productId: string, meal: keyof MealTime) => {
    setSelectedItems((prev) => {
      const prevItem = prev[productId] || {};
      const prevBld = prevItem.bld || {
        breakfast: false,
        lunch: false,
        dinner: false,
      };

      // Toggle the selected meal
      const updatedBld: MealTime = {
        ...prevBld,
        [meal]: !prevBld[meal],
      };

      const allFalse =
        !updatedBld.breakfast && !updatedBld.lunch && !updatedBld.dinner;

      // If all are false, remove the item
      if (allFalse) {
        const { [productId]: _, ...rest } = prev;
        return rest;
      }

      // Otherwise, update the item
      return {
        ...prev,
        [productId]: {
          ...prevItem,
          bld: updatedBld,
        },
      };
    });
  };

  const setPortionPrice = (productId: string, price: number) => {
    setSelectedItems((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        price,
      },
    }));
  };

  const handleSubmit = async () => {
    const items = Object.entries(selectedItems).map(([productId, data]) => ({
      product_id: productId,
      price: data.price ?? 0,
      bld: {
        breakfast: data.bld?.breakfast ?? false,
        lunch: data.bld?.lunch ?? false,
        dinner: data.bld?.dinner ?? false,
      },
    }));
    console.log(items);

    const payload = {
      user_id: user?.id,
      mess_id: "a9b5dfb3-257e-4e3e-9472-cd169ddf708c",
      meal_budget: mealBudget,
      total_meal: totalMeal,
      items: items,
    };

    const req = await api.post("/order/add", payload);

    if (req.status !== 201) return;

    const data = req.data;

    console.log(data);
  };

  return (
    <div className="w-ful lg:max-w-7xl mx-auto">
      <ItemMessHeader
        selectedItems={selectedItems}
        setBudgetPerStudent={setMealBudget}
        setTotalStudents={setTotalMeal}
        budgetPerStudent={mealBudget}
        totalStudents={totalMeal}
      />

      <div className="p-4">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
      <ProductSection
        data={data}
        selectedItems={selectedItems}
        toggleMeal={toggleMeal}
        onPriceChange={setPortionPrice}
      />
    </div>
  );
}
