"use client";

import MenuModal from "@/components/modal/MenuModal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CategoryMap,
  CategoryPayload,
  ProductMap,
  SelectedCategoryMap,
  SelectedItemMap,
} from "@/types";
import api from "@/utils/api";
import { Coffee, Moon, Sun, Lock, Unlock, Plus, X } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

type MealKey = Record<
  "breakfast" | "lunch" | "dinner",
  {
    isActive: boolean;
    totalMeal?: number;
    mealBudget?: number;
    autoPrice: boolean;
    menu?: SelectedCategoryMap;
  }
>;

const TestPage = () => {
  const [mealTimes, setMealTimes] = useState<MealKey>({
    breakfast: { isActive: true, totalMeal: 0, mealBudget: 0, autoPrice: true },
    lunch: { isActive: false, totalMeal: 0, mealBudget: 0, autoPrice: true },
    dinner: { isActive: false, totalMeal: 0, mealBudget: 0, autoPrice: true },
  });
  const [categories, setCategories] = useState<CategoryMap>({});
  //   const [selectedItems, setSelectedItems] = useState<SelectedCategoryMap>({});

  const [isBudgetLocked, setIsBudgetLocked] = useState(true);
  const [menuModalIsOpen, setMenuModalIsOpen] = useState<{
    isOpen: boolean;
    meal: keyof MealKey;
  }>({ isOpen: false, meal: "breakfast" });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        if (!data || data.length === 0) {
          setCategories({});
          return;
        }

        const categoryMap: CategoryMap = data.reduce((acc, category) => {
          acc[category.id] = {
            ...category,
            products: category.products.reduce((pAcc, product) => {
              pAcc[product.id] = product;
              return pAcc;
            }, {} as ProductMap),
          };
          return acc;
        }, {} as CategoryMap);

        setCategories(categoryMap);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
      }
    };

    loadCategories();
  }, []);

  const toggleMealTime = (key: keyof MealKey) => {
    setMealTimes((prev) => {
      const currentActiveCount = Object.values(prev).filter(
        (meal) => meal.isActive
      ).length;
      if (prev[key].isActive && currentActiveCount === 1) return prev;
      return {
        ...prev,
        [key]: { ...prev[key], isActive: !prev[key].isActive },
      };
    });
  };

  const updateMealField = (
    meal: keyof MealKey,
    field: "mealBudget" | "totalMeal",
    value: number
  ) => {
    setMealTimes((prev) => ({
      ...prev,
      [meal]: { ...prev[meal], [field]: value },
    }));
  };

  const fetchCategories = async (): Promise<CategoryPayload[]> => {
    const req = await api.get("/product/get/category/all");
    return req.data;
  };

  // Random product selection
  const get_random_products = useCallback(
    (category_id: string) => {
      const category = categories[category_id];
      if (!category) return null;

      const products = Object.values(category.products);
      switch (category.rand_select) {
        case "STATIC":
          if (products.length === 0) return null;
          return [products[Math.floor(Math.random() * products.length)].id];
        case "DYNAMIC":
          const n =
            Math.floor(Math.random() * (category.max - category.min + 1)) +
            category.min;
          const shuffled = [...products].sort(() => 0.5 - Math.random());
          return shuffled
            .slice(0, Math.min(n, products.length))
            .map((p) => p.id);
        default:
          return null;
      }
    },
    [categories]
  );

  const handleCategorySelectToggle = (
    category_id: string,
    mealTime: keyof MealKey
  ) => {
    const newSelectedItems = { ...mealTimes[mealTime].menu };
    if (newSelectedItems[category_id]) {
      delete newSelectedItems[category_id];
    } else {
      const randomProducts = get_random_products(category_id);
      if (!randomProducts) return;

      newSelectedItems[category_id] = randomProducts.reduce(
        (acc, productId) => {
          acc[productId] = {
            quantity: 0,
            bld: {
              breakfast: false,
              lunch: false,
              dinner: false,
            },
            unit: categories[category_id].products[productId].unit,
          };
          return acc;
        },
        {} as SelectedItemMap
      );
    }
    setMealTimes((prev) => ({
      ...prev,
      [mealTime]: {
        ...prev[mealTime],
        menu: newSelectedItems,
      },
    }));
  };

  const handleItemSelectToggle = (
    category_id: string,
    item_id: string,
    meal: keyof MealKey
  ) => {
    setMealTimes((prev) => {
      // Get current menu for the meal
      const currentMenu = prev[meal].menu || {};

      // Get current selected items for the category or empty object
      const categoryItems = currentMenu[category_id] || {};

      // Toggle the item: if exists, remove it; if not, add it
      const updatedCategoryItems = { ...categoryItems };
      if (updatedCategoryItems[item_id]) {
        delete updatedCategoryItems[item_id];
      } else {
        updatedCategoryItems[item_id] = {
          quantity: 0,
          bld: {
            breakfast: false,
            lunch: false,
            dinner: false,
          },
          unit: categories[category_id].products[item_id].unit,
        }; // or any value you want to store
      }

      // Update the menu
      const updatedMenu: SelectedCategoryMap = {
        ...currentMenu,
        [category_id]: updatedCategoryItems,
      };

      return {
        ...prev,
        [meal]: {
          ...prev[meal],
          menu: updatedMenu,
        },
      };
    });
  };

  return (
    <div className="w-full h-full lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:py-6 flex flex-col gap-6">
      {/* Main Card */}
      <Card className="shadow-lg border border-gray-200 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Meal Planner</CardTitle>
          <CardDescription>
            Choose your meal types and switch between manual or detailed
            budgeting.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-8">
          {/* Meal Time Buttons */}
          <div className="w-full flex gap-2">
            {(["breakfast", "lunch", "dinner"] as const).map((meal) => (
              <Button
                key={meal}
                variant={mealTimes[meal].isActive ? "default" : "outline"}
                className={`flex-1 py-6 text-base rounded-xl ${
                  mealTimes[meal].isActive
                    ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                    : ""
                }`}
                onClick={() => toggleMealTime(meal)}
              >
                {meal === "breakfast" && <Coffee className="w-5 h-5 mr-2" />}
                {meal === "lunch" && <Sun className="w-5 h-5 mr-2" />}
                {meal === "dinner" && <Moon className="w-5 h-5 mr-2" />}
                {meal.charAt(0).toUpperCase() + meal.slice(1)}
              </Button>
            ))}
          </div>

          {/* Lock/Unlock Budget */}
          <div className="flex items-center justify-between p-4 border rounded-xl bg-gray-50">
            <div className="flex flex-col">
              <span className="text-sm font-medium">Budget Mode</span>
              <span className="text-xs text-gray-500">
                {isBudgetLocked
                  ? "Manual total budget (only total meals allowed)."
                  : "Detailed budgeting (set per meal budget & meals)."}
              </span>
            </div>
            <Button
              type="button"
              variant={isBudgetLocked ? "default" : "outline"}
              size="icon"
              className="rounded-xl"
              onClick={() => setIsBudgetLocked((prev) => !prev)}
            >
              {isBudgetLocked ? (
                <Lock className="w-5 h-5" />
              ) : (
                <Unlock className="w-5 h-5" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Meal Cards */}
      {(["breakfast", "lunch", "dinner"] as const).map(
        (meal) =>
          mealTimes[meal].isActive && (
            <Card key={meal} className="border rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  {meal.charAt(0).toUpperCase() + meal.slice(1)} Meal
                </CardTitle>
                <CardDescription>
                  {isBudgetLocked
                    ? "Enter total meal count only."
                    : "Set per meal budget & total meals."}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col gap-6">
                {isBudgetLocked ? (
                  <div className="flex flex-col gap-2">
                    <Label>Total Meals</Label>
                    <Input
                      type="number"
                      value={mealTimes[meal].totalMeal || ""}
                      onChange={(e) =>
                        updateMealField(meal, "totalMeal", +e.target.value)
                      }
                      placeholder="Enter number"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Per Meal Budget */}
                    <div className="flex flex-col gap-2">
                      <Label>Per Meal Budget</Label>
                      <Input
                        type="number"
                        value={mealTimes[meal].mealBudget || ""}
                        onChange={(e) =>
                          updateMealField(meal, "mealBudget", +e.target.value)
                        }
                        placeholder="Enter budget"
                      />
                    </div>

                    {/* Total Meals */}
                    <div className="flex flex-col gap-2">
                      <Label>Total Meals</Label>
                      <Input
                        type="number"
                        value={mealTimes[meal].totalMeal || ""}
                        onChange={(e) =>
                          updateMealField(meal, "totalMeal", +e.target.value)
                        }
                        placeholder="Enter number"
                      />
                    </div>

                    {/* Computed Total */}
                    <div className="flex flex-col justify-center gap-1 bg-gray-50 rounded-lg px-3 py-2 border">
                      <span className="text-sm font-medium text-gray-700">
                        Total Budget
                      </span>
                      <span className="text-base font-semibold text-blue-600">
                        {(mealTimes[meal].mealBudget || 0) *
                          (mealTimes[meal].totalMeal || 0)}{" "}
                        ৳
                      </span>
                    </div>
                  </div>
                )}
                <div className="flex justify-end items-center gap-2">
                  {!isBudgetLocked && (
                    <Button
                      type="button"
                      variant={
                        mealTimes[meal].autoPrice ? "default" : "outline"
                      }
                      size="icon"
                      className="rounded-xl"
                      onClick={() =>
                        setMealTimes((prev) => ({
                          ...prev,
                          [meal]: {
                            ...prev[meal],
                            autoPrice: !prev[meal].autoPrice,
                          },
                        }))
                      }
                    >
                      <Plus />
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="rounded-xl"
                    onClick={() =>
                      setMenuModalIsOpen({ isOpen: true, meal: meal })
                    }
                  >
                    <Plus />
                  </Button>
                </div>
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {meal &&
                    mealTimes[meal].menu &&
                    Object.entries(mealTimes[meal].menu).map(
                      ([categoryId, productsMap]) =>
                        Object.entries(productsMap).map(
                          ([productId, productData]) => {
                            const product =
                              categories[categoryId].products[productId];
                            return (
                              <Card key={productId} className="relative">
                                {/* Close Button */}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute top-2 right-2 z-10"
                                  onClick={() => {
                                    handleItemSelectToggle(
                                      categoryId,
                                      productId,
                                      meal
                                    );
                                  }}
                                >
                                  <X className="w-4 h-4 text-gray-500 hover:text-red-600" />
                                </Button>

                                <CardHeader className="flex flex-col gap-1">
                                  <h3 className="text-sm font-semibold">
                                    {product.name}
                                  </h3>
                                  <p className="text-xs text-gray-500">
                                    {categories[categoryId].label}
                                  </p>
                                  <p className="text-sm font-medium text-gray-900">
                                    ৳{product.unit.price} / {product.unit.label}
                                  </p>
                                </CardHeader>

                                {!isBudgetLocked &&
                                  !mealTimes[meal].autoPrice && (
                                    <CardFooter>
                                      <div className="w-full flex items-center gap-3">
                                        <div className="flex items-center gap-2 w-2/5">
                                          <input
                                            type="number"
                                            maxLength={3}
                                            onInput={(e) => {
                                              const input =
                                                e.target as HTMLInputElement;
                                              if (input.value.length > 3) {
                                                input.value = input.value.slice(
                                                  0,
                                                  3
                                                );
                                              }
                                              input.value = input.value.replace(
                                                /^0+(?=\d)/,
                                                ""
                                              );
                                            }}
                                            onChange={(e) => {
                                              const raw = e.target.value;
                                              const value = parseInt(raw, 10);
                                              /* handle input value change */
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            text-center no-spinner text-sm"
                                            placeholder="000"
                                          />
                                        </div>

                                        <select
                                          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                          defaultValue={product.unit.id}
                                        >
                                          {product.units.map((unit) => (
                                            <option
                                              key={unit.id}
                                              value={unit.id}
                                            >
                                              {unit.icon} {unit.label}
                                            </option>
                                          ))}
                                        </select>
                                      </div>
                                    </CardFooter>
                                  )}
                              </Card>
                            );
                          }
                        )
                    )}
                </div>
              </CardContent>
            </Card>
          )
      )}

      {/* Placeholder for Manual Budget Input */}
      {isBudgetLocked && (
        <Card className="border rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Manual Total Budget
            </CardTitle>
            <CardDescription>
              (Future) Add total budget input here when required.
            </CardDescription>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      )}
      <MenuModal
        isOpen={menuModalIsOpen.isOpen}
        meal={menuModalIsOpen.meal}
        onClose={() => setMenuModalIsOpen({ isOpen: false, meal: "breakfast" })}
        categories={categories}
        selectedCategory={mealTimes[menuModalIsOpen.meal].menu}
        handleCategorySelectToggle={handleCategorySelectToggle}
      />
    </div>
  );
};

export default TestPage;
