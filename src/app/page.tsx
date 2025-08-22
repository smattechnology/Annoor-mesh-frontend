"use client";
import { BUDGET_THRESHOLDS } from "@/constants";
import {
  Category,
  CategoryMap,
  CategoryPayload,
  MealTime,
  ProductMap,
  SelectedCategoryMap,
  SelectedItemError,
  SelectedItemMap,
  Unit,
} from "@/types";
import { useState, useEffect, use, useCallback, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import ItemMessHeader from "@/components/item/ItemMessHeader";
import api from "@/utils/api";
import {
  Calculator,
  Loader,
  Plus,
  RotateCcw,
  Send,
  Coffee,
  Sun,
  Moon,
  DollarSign,
  Users,
  AlertCircle,
  Shuffle,
} from "lucide-react";
import CategoryAddModal from "@/components/modal/CategoryAddModal";
import CategorySelectModal from "@/components/modal/CategorySelectModal";
import ItemRow from "@/components/item/ItemRow";
import OrderSummery from "@/components/modal/OrderSummery";
import PreSubmitSummaryModal from "@/components/modal/OrderSummery";

export default function Page() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [categories, setCategories] = useState<CategoryMap>({});
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  const [catSelectIsOpen, setCatSelectIsOpen] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<SelectedCategoryMap>({});
  const [selectedItemError, setSelectedItemError] = useState<SelectedItemError>(
    {}
  );
  const [auto, setAuto] = useState<boolean>(true);
  const [orderSummeryIsOpen, setOrderSummeryIsOpen] = useState<boolean>(false);

  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [remainingBudget, setRemainingBudget] = useState<number>(0);

  const [rootBld, setRootBld] = useState<MealTime>({
    breakfast: true,
    lunch: false,
    dinner: false,
  });

  const [budgetPerMeal, setBudgetPerMeal] = useState<number>(0);

  const [totalMeal, setTotalMeal] = useState<number>(0);

  useEffect(() => {
    if (auto) return;
    let total = 0;
    Object.values(selectedItems).forEach((products) => {
      Object.values(products).forEach((item) => {
        let subTotal = item.unit.price * item.quantity;
        const mealTIme =
          (item.bld.breakfast ? 1 : 0) +
          (item.bld.lunch ? 1 : 0) +
          (item.bld.dinner ? 1 : 0);
        if (mealTIme > 0) total += subTotal * mealTIme;
      });
    });
    setTotalCost(total);
    setRemainingBudget(totalBudget - totalCost);
  }, [selectedItems, auto, totalBudget]);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/auth");
      }
      const loadCategories = async () => {
        try {
          const data = await fetchCategories();
          if (!data || data.length === 0) {
            setCategories({});
            setLoadingCategories(false);
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
          setLoadingCategories(false);
        }
      };

      loadCategories();
    }
  }, [isLoading, user, router]);

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

  const handleSelectToggle = (category_id: string) => {
    const newSelectedItems = { ...selectedItems };
    if (newSelectedItems[category_id]) {
      delete newSelectedItems[category_id];
    } else {
      const randomProducts = get_random_products(category_id);
      if (!randomProducts) return;

      newSelectedItems[category_id] = randomProducts.reduce(
        (acc, productId) => {
          acc[productId] = {
            quantity: 0,
            bld: { ...rootBld },
            unit: categories[category_id].products[productId].unit,
          };
          return acc;
        },
        {} as SelectedItemMap
      );
    }
    setSelectedItems(newSelectedItems);
  };

  const handleItemSelectToggle = (category_id: string, product_id: string) => {
    const prevSelectedItems = { ...selectedItems };
    if (prevSelectedItems[category_id]?.[product_id]) {
      delete prevSelectedItems[category_id][product_id];
      setSelectedItems(prevSelectedItems);
    } else {
      setSelectedItems({
        ...prevSelectedItems,
        [category_id]: {
          ...prevSelectedItems[category_id],
          [product_id]: {
            quantity: 0,
            bld: { ...rootBld },
            unit: categories[category_id].products[product_id].unit,
          },
        },
      });
    }
  };

  const handleCategoryDelete = (category_id: string) => {
    const newSelectedItems = { ...selectedItems };
    if (!newSelectedItems[category_id]) return;
    delete newSelectedItems[category_id];
    setSelectedItems(newSelectedItems);
  };
  const handleCategoryItemRefresh = (category_id: string) => {
    const randomProducts = get_random_products(category_id);
    if (!randomProducts) return;
    const newSelectedItems = { ...selectedItems };

    newSelectedItems[category_id] = randomProducts.reduce((acc, productId) => {
      acc[productId] = {
        quantity: 0,
        bld: { ...rootBld },
        unit: categories[category_id].products[productId].unit,
      };
      return acc;
    }, {} as SelectedItemMap);
    setSelectedItems(newSelectedItems);
  };

  const handleItemDelete = (category_id: string, product_id: string) => {
    const newSelectedItems = { ...selectedItems };
    if (!newSelectedItems[category_id][product_id]) return;
    delete newSelectedItems[category_id][product_id];
    if (Object.keys(newSelectedItems[category_id]).length === 0) {
      delete newSelectedItems[category_id];
    }
    setSelectedItems(newSelectedItems);
  };

  // const handleItemAutoTOggle = (category_id: string, product_id: string) => {
  //   const newSelectedItems = { ...selectedItems };
  //   if (!newSelectedItems[category_id][product_id]) return;
  //   newSelectedItems[category_id][product_id].auto =
  //     !newSelectedItems[category_id][product_id].auto;
  //   setSelectedItems(newSelectedItems);
  // };

  const handleItemBldToggle = (
    category_id: string,
    product_id: string,
    bld: MealTime
  ) => {
    const newSelectedItems = { ...selectedItems };
    if (!newSelectedItems[category_id][product_id]) return;
    newSelectedItems[category_id][product_id].bld = bld;
    setSelectedItems(newSelectedItems);
  };

  const handleItemQuantityToggle = (
    category_id: string,
    product_id: string,
    quantity: number
  ) => {
    const newSelectedItems = { ...selectedItems };
    if (!newSelectedItems[category_id][product_id]) return;
    newSelectedItems[category_id][product_id].quantity = quantity;
    setSelectedItems(newSelectedItems);
  };

  const isSubmitDisabled: boolean = useMemo(() => {
    // If no items selected
    if (Object.keys(selectedItems).length === 0) return true;

    // If root meals are not one selected
    if (!rootBld.breakfast && !rootBld.lunch && !rootBld.dinner) return true;

    // If auto is false, check that all selected items have valid quantity and unit
    if (!auto) {
      const invalidItemExists = Object.values(selectedItems).some((products) =>
        Object.values(products).some((item) => item.quantity <= 0 || !item.unit)
      );
      if (invalidItemExists) return true;
    }

    // Finally, ensure budgetPerMeal and totalMeal are positive
    return !(budgetPerMeal > 0 && totalMeal > 0);
  }, [selectedItems, auto, budgetPerMeal, totalMeal, rootBld]);

  const handleOrderSubmit = async () => {
    try {
      const items: {
        product_id: string;
        auto: boolean;
        quantity: number;
        bld: any;
        unit_id: string | undefined;
      }[] = [];

      Object.values(selectedItems).forEach((products) => {
        Object.keys(products).forEach((item_id) => {
          const product = products[item_id];

          items.push({
            product_id: item_id,
            auto: auto,
            quantity: Number(product.quantity),
            bld: product.bld,
            unit_id: product.unit?.id,
          });
        });
      });

      if (items.length === 0) {
        console.error("No valid items to submit.");
        return;
      }

      const payload = {
        user_id: user?.id,
        mess_id: user?.allocated_mess?.id,
        totalMeal,
        budgetPerMeal,
        items,
      };

      const res = await api.post("/order/add", payload);
      if (res.status === 201) {
        setOrderSummeryIsOpen(false);
        setSelectedItems({});
        setCatSelectIsOpen(false);
        setBudgetPerMeal(0);
        setTotalMeal(0);
        alert("Order submitted successfully!");
      } else {
        console.error("Order submission failed:", res.data);
      }
    } catch (error) {
      console.error("Order submission failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">
            Loading your mess details...
          </p>
        </div>
      </div>
    );
  }

  if (!user?.allocated_mess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-200">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            No Mess Allocated
          </h2>
          <p className="text-slate-600 mb-6">
            You don't have access to any mess facility. Please contact your
            administrator for assistance.
          </p>
          <button
            onClick={() => router.push("/contact")}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
          >
            Contact Admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mess Header */}
        <ItemMessHeader
          messInfo={user.allocated_mess}
          selectedItems={selectedItems}
          auto={auto}
          mealTimes={rootBld}
          setMealTimes={setRootBld}
          budgetPerStudent={budgetPerMeal}
          totalStudents={totalMeal}
          setBudgetPerStudent={setBudgetPerMeal}
          setTotalStudents={setTotalMeal}
          totalBudget={totalBudget}
          setTotalBudget={setTotalBudget}
        />

        {/* Items Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <div className="w-full flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              Selected Items
            </h2>
            <div className="flex justify-between items-center gap-2">
              <button
                onClick={() => setAuto(!auto)}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-gray-300 transition-colors font-semibold shadow-sm ${
                  auto ? "bg-blue-600 text-white" : "bg-slate-100"
                }`}
              >
                <Shuffle className="h-4 w-4" />
              </button>
              <button
                onClick={() => setCatSelectIsOpen(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold shadow-sm"
              >
                <Plus className="h-4 w-4" />
              </button>
              <button
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-semibold"
                onClick={() => {
                  setSelectedItems({});
                }}
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {Object.keys(selectedItems).length > 0 ? (
            <div className="w-full flex flex-col gap-4">
              {Object.keys(selectedItems).map((category_id) => (
                <ItemRow
                  key={category_id}
                  category={categories[category_id]}
                  selectedItems={selectedItems}
                  setSelectedItems={setSelectedItems}
                  onItemSelectToggle={(category_id, product_id) =>
                    handleItemSelectToggle(category_id, product_id)
                  }
                  onItemDelete={(product_id) =>
                    handleItemDelete(category_id, product_id)
                  }
                  isAuto={auto}
                  onItemBldToggle={(product_id, bld) =>
                    handleItemBldToggle(category_id, product_id, bld)
                  }
                  onItemQuantityChange={(product_id, pp) =>
                    handleItemQuantityToggle(category_id, product_id, pp)
                  }
                  onDelete={() => handleCategoryDelete(category_id)}
                  onRefresh={() => handleCategoryItemRefresh(category_id)}
                />
              ))}
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
              <div className="w-full flex items-end justify-end">
                <button
                  disabled={isSubmitDisabled}
                  className={`px-6 py-3 rounded-xl transition-colors font-semibold shadow-md flex items-center gap-2 ${
                    !isSubmitDisabled
                      ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                      : "bg-slate-100 text-slate-700"
                  }`}
                  onClick={() => setOrderSummeryIsOpen(true)}
                >
                  <Send className="h-5 w-5" /> Submit Order
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>
                No items selected yet. Click "Add Categories" to get started.
              </p>
            </div>
          )}
        </div>

        {/* Uncomment and style your modals */}
        <CategorySelectModal
          catSelectIsOpen={catSelectIsOpen}
          setCatSelectIsOpen={setCatSelectIsOpen}
          categories={categories}
          selectedItems={selectedItems}
          onToggle={handleSelectToggle}
        />
        <PreSubmitSummaryModal
          open={orderSummeryIsOpen}
          onClose={() => setOrderSummeryIsOpen(false)}
          onConfirm={handleOrderSubmit}
          currency="৳"
          categories={categories}
          selectedItems={selectedItems}
          auto={auto}
          budgetPerMeal={budgetPerMeal}
          totalMeal={totalMeal}
          totalBudget={totalBudget}
        />
      </div>
    </div>
  );
}
