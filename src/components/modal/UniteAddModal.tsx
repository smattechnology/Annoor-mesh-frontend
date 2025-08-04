import React, { useState } from "react";
import Modal from "./Modal";
import api from "@/utils/api"; // make sure your API utility is correctly imported

interface ErrorDetails {
  details: string;
}

interface ErrorState {
  [key: string]: ErrorDetails;
}

interface UniteAddModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (id: string) => void;
}

interface Touched {
  [key: string]: boolean;
}

const UniteAddModal: React.FC<UniteAddModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [errors, setErrors] = useState<ErrorState>({});
  const [touched, setTouched] = useState<Touched>({});
  const [label, setLabel] = useState<string>("");
  const [emoji, setEmoji] = useState<string>("");
  const [isLoading, setIsLoading] = useState<{ formSubmit: boolean }>({
    formSubmit: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLabel(value);

    if (errors.label) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated.label;
        return updated;
      });
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const validateForm = () => {
    const newErrors: ErrorState = {};
    if (!label.trim()) {
      newErrors.label = { details: "Label is required" };
    }
    if (!emoji.trim()) {
      newErrors.emoji = { details: "Emoji is required" };
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({ label: true });

    if (!validateForm()) return;

    const payload = {
      label: label.trim(),
      icon: emoji.trim(),
    };

    setIsLoading((prev) => ({ ...prev, formSubmit: true }));

    try {
      const res = await api.post("/product/add/unite", payload); // replace endpoint if different
      if (res.status === 201) {
        onSuccess(res.data.id);
        handleClose();
      }
    } catch (err) {
      console.error("Unit creation failed", err);
      setErrors({
        label: { details: "Something went wrong while adding the unit." },
      });
    } finally {
      setIsLoading((prev) => ({ ...prev, formSubmit: false }));
    }
  };

  const handleClose = () => {
    setLabel("");
    setEmoji("");
    setErrors({});
    setTouched({});
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} size="sm" title="Add New Unit">
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Label Input */}
          <div className="space-y-2">
            <label
              htmlFor="label"
              className="block text-sm font-medium text-gray-700"
            >
              Unit Label <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="label"
                name="label"
                value={label}
                onChange={handleInputChange}
                onBlur={() => handleBlur("label")}
                placeholder="Enter unit label (e.g., Kilogram)"
                className={`block w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  errors.label && touched.label
                    ? "border-red-300 bg-red-50 focus:border-red-500"
                    : "border-gray-200 focus:border-blue-500 bg-white"
                }`}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-400">⚖️</span>
              </div>
            </div>

            {errors.label && touched.label && (
              <p className="text-red-600 text-sm flex items-center gap-1">
                <span className="text-red-500">⚠️</span>
                {errors.label.details}
              </p>
            )}
          </div>
          {/* Emoji Input */}
          <div className="space-y-2">
            <label
              htmlFor="emoji"
              className="block text-sm font-medium text-gray-700"
            >
              Emoji <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="emoji"
                name="emoji"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                onBlur={() => handleBlur("emoji")}
                placeholder="Enter an emoji (e.g., ⚖️)"
                maxLength={2}
                className={`block w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  errors.emoji && touched.emoji
                    ? "border-red-300 bg-red-50 focus:border-red-500"
                    : "border-gray-200 focus:border-blue-500 bg-white"
                }`}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-2xl">{emoji || "🔤"}</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1 pl-1">
              Only a single emoji is recommended 💡
            </p>
            {errors.emoji && touched.emoji && (
              <p className="text-red-600 text-sm flex items-center gap-1">
                <span className="text-red-500">⚠️</span>
                {errors.emoji.details}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading.formSubmit}
              className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading.formSubmit}
              className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
            >
              {isLoading.formSubmit ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <span>✨</span>
                  Add Unit
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default UniteAddModal;
