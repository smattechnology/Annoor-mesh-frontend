import React, { use, useEffect, useState } from "react";
import Modal from "./Modal";
import api from "@/utils/api";
import UniteAddModal from "./UniteAddModal";
import CategoryAddModal from "./CategoryAddModal";
import ProductSearchInput from "../autocomplete/ProductSearchInput";
import { Product, Unit } from "@/types";
import { Trash } from "lucide-react";

interface ProductsAddModalProps {
  open: boolean;
  onClose: () => void;
  selectedProduct?: Product;
  onSuccess: () => void;
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
  onSuccess,
}) => {
  const [showUniteAddModal, setShowUniteAddModal] = useState<boolean>(false);
  const [showCategoryAddModal, setShowCategoryAddModal] =
    useState<boolean>(false);
  // Form states
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const [selectedUnites, setSelectedUnites] = useState<{
    [unit_id: string]: { unite: Unit; price: number; is_generic?: boolean };
  }>({});

  // Data lists
  const [units, setUnits] = useState<Unit[]>([]);
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
      setUnit(selectedProduct.unit.id);
      setCategory(selectedProduct.category.id);
      setDescription(
        selectedProduct.description ? selectedProduct.description : ""
      );
      selectedProduct.units.forEach((u) => {
        const prev = { ...selectedUnites };
        prev[u.id] = {
          unite: u,
          price: u.price,
        };
        setSelectedUnites(prev);
      });
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

    if (!category) {
      newErrors.category = "Category is required";
    }

    if (Object.keys(selectedUnites).length === 0) {
      newErrors.unit = "At least one unit is required";
    } else {
      const hasGeneric = Object.values(selectedUnites).some(
        (u) => u.is_generic
      );
      if (!hasGeneric) {
        newErrors.unit = "One unit must be marked as generic";
      }
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
      category_id: category,
      description: description?.trim() || "",
      units: Object.values(selectedUnites).map((u) => ({
        unit_id: u.unite.id,
        price: Number(u.price),
        is_generic: u.is_generic ?? false,
      })),
    };

    console.log("Submitting product payload:", payload);

    setIsLoading((prev) => ({ ...prev, formSubmit: true }));

    try {
      const res = await api.post("/product/add", payload);
      if (res.status === 201) {
        onSuccess();
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
    setUnit("");
    setDescription("");
    setCategory("");
    setErrors({});
    setTouched({});
    setSelectedUnites({});
    onClose();
  };

  const handleAutocompleteSelect = (p: Product) => {
    setName(p.name);
    setUnit(p.unit.id);
    setCategory(p.category.id);
    setDescription(p.description ? p.description : "");
    p.units.forEach((u) => {
      const prev = { ...selectedUnites };
      prev[u.id] = {
        unite: u,
        price: u.price,
      };
      setSelectedUnites(prev);
    });
  };

  const handleUniteGenericChange = (unit_id: string, is_generic: boolean) => {
    const updated = Object.fromEntries(
      Object.entries(selectedUnites).map(([id, u]) => [
        id,
        { ...u, is_generic: id === unit_id ? is_generic : false },
      ])
    );
    setSelectedUnites(updated);
    console.log(selectedUnites);
  };

  return (
    <div className="">
      <Modal
        open={open}
        onClose={handleClose}
        size="lg"
        title="Add New Product"
        header
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

          {/* Price and Unit Row */}
          <div className="w-full rounded-lg border border-gray-200 p-4">
            {Object.values(selectedUnites).map((unit) => (
              <div
                className="w-full flex justify-between items-center gap-2"
                key={unit.unite.id}
              >
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="unit_generic"
                    id={unit.unite.id}
                    value={unit.unite.id}
                    checked={unit.is_generic === true}
                    onChange={(e) =>
                      handleUniteGenericChange(unit.unite.id, e.target.checked)
                    }
                  />
                  <label htmlFor={unit.unite.id}>Is Generic</label>
                </span>
                <span>
                  {unit.unite.icon} {unit.unite.label}
                </span>
                <span>{unit.price}</span>

                <button
                  className="p-2 shadow rounded-lg border border-gray-300 hover:bg-red-100 hover:text-red-700"
                  onClick={() => {
                    const prev = { ...selectedUnites };
                    delete prev[unit.unite.id];
                    setSelectedUnites(prev);
                  }}
                >
                  <Trash className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setShowUniteAddModal(true)}
            className="mt-2 text-sm text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>➕</span> Add new Unit
          </button>

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
        units={units}
        setUnits={setUnits}
        selectedUnites={selectedUnites}
        setSelectedUnites={setSelectedUnites}
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
