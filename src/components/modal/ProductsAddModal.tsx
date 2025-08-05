import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import api from "@/utils/api";
import UniteAddModal from "./UniteAddModal";
import CategoryAddModal from "./CategoryAddModal";
import ProductSearchInput from "../ProductSearchInput";
import { Product } from "@/types";

interface ProductsAddModalProps {
  open: boolean;
  onClose: () => void;
  selectedProduct?: Product;
}

interface ProductFormData {
  name: string;
  price: number | string;
  unit: string;
  description?: string;
  category?: string;
}

interface SelectOption {
  id: string;
  value: string;
  label: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

interface LoadingState {
  fetchUnites?: boolean;
  fetchCategories?: boolean;
  formSubmit?: boolean;
}

const ProductsAddModal: React.FC<ProductsAddModalProps> = ({
  open,
  onClose,
  selectedProduct,
}) => {
  const [showUniteAddModal, setShowUniteAddModal] = useState<boolean>(false);
  const [showCategoryAddModal, setShowCategoryAddModal] =
    useState<boolean>(false);
  // Form states
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | string>("");
  const [unit, setUnit] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  // Data lists
  const [units, setUnits] = useState<SelectOption[]>([]);
  const [categories, setCategories] = useState<SelectOption[]>([]);

  const [searchFound, setSearchFound] = useState<boolean>(false);
  const [autoCompleteEnabled, setAutoCompleteEnabled] =
    useState<boolean>(false);
  // State control
  const [errors, setErrors] = useState<Partial<ProductFormData>>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof ProductFormData, boolean>>
  >({});
  const [isLoading, setIsLoading] = useState<LoadingState>({});

  // Fetch units and categories
  useEffect(() => {
    if (open) {
      fetchUnits();
      fetchCategories();
    }
  }, [open]);

  useEffect(() => {
    if (selectedProduct) {
      setName(selectedProduct.name);
      setPrice(selectedProduct.price);
      setUnit(selectedProduct.unit.id);
      setCategory(selectedProduct.category.id);
      setDescription(
        selectedProduct.description ? selectedProduct.description : ""
      );
    }
  }, [selectedProduct]);

  const fetchUnits = async () => {
    setIsLoading((prev) => ({ ...prev, fetchUnites: true }));
    try {
      const { data } = await api.get("/product/get/unite/all");
      setUnits(data || []);
    } catch (err) {
      console.error("Failed to fetch units", err);
    } finally {
      setIsLoading((prev) => ({ ...prev, fetchUnites: false }));
    }
  };

  const fetchCategories = async () => {
    setIsLoading((prev) => ({ ...prev, fetchCategories: true }));
    try {
      const { data } = await api.get("/product/get/category/all");
      setCategories(data || []);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    } finally {
      setIsLoading((prev) => ({ ...prev, fetchCategories: false }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ProductFormData> = {};

    if (!name.trim()) {
      newErrors.name = "Product name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Product name must be at least 2 characters";
    }

    if (!price || Number(price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (!unit) {
      newErrors.unit = "Unit is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof ProductFormData,
    value: string | number
  ) => {
    switch (field) {
      case "name":
        setName(value as string);
        break;
      case "price":
        setPrice(value);
        break;
      case "unit":
        setUnit(value as string);
        break;
      case "description":
        setDescription(value as string);
        break;
      case "category":
        setCategory(value as string);
        break;
    }

    // Clear errors on field change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: keyof ProductFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      name: true,
      price: true,
      unit: true,
      description: true,
      category: true,
    });

    if (!validateForm()) return;

    const payload = {
      name: name.trim(),
      price: parseFloat(price.toString()),
      unite_id: unit,
      category_id: category || undefined,
      description: description?.trim() || undefined,
    };

    setIsLoading((prev) => ({ ...prev, formSubmit: true }));

    try {
      const res = await api.post("/product/add", payload);
      if (res.status === 201) {
        handleClose();
      }
    } catch (err) {
      console.error("Product creation failed", err);
    } finally {
      setIsLoading((prev) => ({ ...prev, formSubmit: false }));
    }
  };

  const handleClose = () => {
    // Reset all form states
    setName("");
    setPrice("");
    setUnit("");
    setDescription("");
    setCategory("");
    setErrors({});
    setTouched({});
    onClose();
  };

  const handleAutocompleteSelect = (p: Product) => {
    setName(p.name);
    setPrice(p.price);
    setUnit(p.unit.id);
    setCategory(p.category.id);
    setDescription(p.description ? p.description : "");
  };

  return (
    <div className="">
      <Modal
        open={open}
        onClose={handleClose}
        size="lg"
        title="Add New Product"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div className="space-y-2 relative">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Product Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onClick={() => setAutoCompleteEnabled(true)}
                onChange={(e) => handleInputChange("name", e.target.value)}
                onBlur={() => {
                  handleBlur("name");
                  setAutoCompleteEnabled(false);
                }}
                placeholder="Enter product name (e.g., Basmati Rice)"
                className={`block w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  (errors.name && touched.name) ||
                  (searchFound && selectedProduct?.name !== name)
                    ? "border-red-300 bg-red-50 focus:border-red-500"
                    : "border-gray-200 focus:border-blue-500 bg-white"
                }`}
              />
              <ProductSearchInput
                input={name}
                onSelectProduct={handleAutocompleteSelect}
                setIsFound={(found) => setSearchFound(found)}
                enable={autoCompleteEnabled}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-400">📦</span>
              </div>
            </div>
            {errors.name && touched.name && (
              <p className="text-red-600 text-sm flex items-center gap-1">
                <span className="text-red-500">⚠️</span>
                {errors.name}
              </p>
            )}
          </div>

          {/* Price and Unit Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Price */}
            <div className="space-y-2">
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Price (৳) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  onBlur={() => handleBlur("price")}
                  onWheel={(e) => e.currentTarget.blur()}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className={`block w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    errors.price && touched.price
                      ? "border-red-300 bg-red-50 focus:border-red-500"
                      : "border-gray-200 focus:border-blue-500 bg-white"
                  }`}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gray-400">৳</span>
                </div>
              </div>
              {errors.price && touched.price && (
                <p className="text-red-600 text-sm flex items-center gap-1">
                  <span className="text-red-500">⚠️</span>
                  {errors.price}
                </p>
              )}
            </div>

            {/* Unit */}
            <div className="space-y-2">
              <label
                htmlFor="unit"
                className="block text-sm font-medium text-gray-700"
              >
                Unit <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="unit"
                  name="unit"
                  value={unit}
                  onChange={(e) => handleInputChange("unit", e.target.value)}
                  onBlur={() => handleBlur("unit")}
                  className={`block w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    errors.unit && touched.unit
                      ? "border-red-300 bg-red-50 focus:border-red-500"
                      : "border-gray-200 focus:border-blue-500 bg-white"
                  }`}
                >
                  {isLoading?.fetchUnites ? (
                    <option value="">Loading...</option>
                  ) : (
                    <option value="">Select a unit</option>
                  )}
                  {units?.map((unitOption) => (
                    <option key={unitOption.id} value={unitOption.id}>
                      {unitOption.icon} {unitOption.label}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={() => setShowUniteAddModal(true)}
                className="mt-2 text-sm text-blue-600 hover:underline flex items-center gap-1"
              >
                <span>➕</span> Add new unit
              </button>
              {errors.unit && touched.unit && (
                <p className="text-red-600 text-sm flex items-center gap-1">
                  <span className="text-red-500">⚠️</span>
                  {errors.unit}
                </p>
              )}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <div className="relative">
              <select
                id="category"
                name="category"
                value={category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#cbd5e1 #f1f5f9",
                }}
                className="block w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 bg-white [&>option]:py-2 [&>option]:px-3 [&>option]:bg-white [&>option]:text-gray-900 [&>option:hover]:bg-blue-50 [&>option:checked]:bg-blue-100 [&>option:checked]:text-blue-900"
              >
                {isLoading?.fetchCategories ? (
                  <option value="">Loading....</option>
                ) : (
                  <option value="">Select a category</option>
                )}

                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={() => setShowCategoryAddModal(true)}
              className="mt-2 text-sm text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>➕</span> Add new Category
            </button>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Additional details about the product (optional)"
              rows={3}
              className="block w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 bg-white placeholder-gray-400 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading?.formSubmit}
              className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading?.formSubmit}
              className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
            >
              {isLoading?.formSubmit ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <span>✨</span>
                  Add Product
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>
      <UniteAddModal
        open={showUniteAddModal}
        onClose={() => {
          setShowUniteAddModal(false);
        }}
        onSuccess={(id) => {
          fetchUnits();
          setUnit(id);
        }}
      />
      <CategoryAddModal
        open={showCategoryAddModal}
        onClose={() => {
          setShowCategoryAddModal(false);
        }}
        onSuccess={(id) => {
          fetchCategories();
          setCategory(id);
        }}
      />
    </div>
  );
};

export default ProductsAddModal;
