import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { CategoryMap, SelectedCategoryMap } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

type MealKey = Record<
  "breakfast" | "lunch" | "dinner",
  {
    isActive: boolean;
    totalMeal?: number;
    mealBudget?: number;
    menu?: SelectedCategoryMap;
  }
>;

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  meal: keyof MealKey;
  categories: CategoryMap;
  selectedCategory: SelectedCategoryMap | undefined;
  handleCategorySelectToggle: (
    category_id: string,
    meal: keyof MealKey
  ) => void;
}

const MenuModal: React.FC<MenuModalProps> = ({
  isOpen,
  onClose,
  meal,
  categories,
  selectedCategory,
  handleCategorySelectToggle,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Meal Menu Selection for{" "}
            {meal.charAt(0).toUpperCase() + meal.slice(1)}
          </DialogTitle>
          <DialogDescription>Select your meal menu</DialogDescription>
        </DialogHeader>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
          {Object.values(categories).map((category) => {
            const isActive = selectedCategory && selectedCategory[category.id];

            return (
              <Card
                key={category.id}
                className={`border rounded-2xl shadow-sm transition-shadow cursor-pointer
                  ${
                    isActive
                      ? "border-blue-600 bg-blue-50 shadow-md"
                      : "hover:shadow-md"
                  }`}
                onClick={() => {
                  handleCategorySelectToggle(category.id, meal);
                }}
              >
                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                  {/* Category Icon */}
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full ${
                      isActive ? "bg-blue-200" : "bg-gray-50"
                    }`}
                  >
                    <span className="w-6 h-6">{category.icon}</span>
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold">
                      {category.label}
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-500">
                      {category.rand_select === "STATIC"
                        ? "Static selection"
                        : "Dynamic selection"}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-col gap-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Products</span>
                    <span className="font-medium">
                      {Object.keys(category.products).length}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <DialogFooter className="flex justify-end gap-2 pt-4 bg-white">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={onClose}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MenuModal;
