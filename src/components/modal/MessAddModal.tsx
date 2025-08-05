import React, { useEffect, useState } from "react";
import { X, Building2, MapPin } from "lucide-react";
import { MessData, MessType } from "@/types";
import api from "@/utils/api";

interface MessAddModalProps {
  open: boolean;
  onClose: () => void;
  selectedMess?: MessData;
}

const MessAddModal: React.FC<MessAddModalProps> = ({
  open,
  onClose,
  selectedMess,
}) => {
  const [form, setForm] = useState<MessData>({
    id: "",
    name: "",
    type: "BOYS_MESS", // ✅ Valid value of type MessType
    phone: "",
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    address: {
      id: "",
      street: "",
      area: "",
      city: "",
      postalCode: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    owner: {
      id: "",
      name: "",
      phone: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  });

  const [activeTab, setActiveTab] = useState("basic");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  useEffect(() => {
    if (open) {
      if (selectedMess) {
        setForm(selectedMess);
      } else {
        setForm({
          id: "",
          name: "",
          type: "BOYS_MESS", // required valid MessType
          phone: "",
          status: "active",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          address: {
            id: "",
            street: "",
            area: "",
            city: "",
            postalCode: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          owner: {
            id: "",
            name: "",
            phone: "",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        });
      }
    }
  }, [open, selectedMess]);

  const handleChange = (
    section: string,
    key: string,
    value: any,
    nestedKey?: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [section]: nestedKey
        ? {
            ...(prev[section as keyof typeof prev] as any),
            [key]: {
              ...(prev[section as keyof typeof prev] as any)[key],
              [nestedKey]: value,
            },
          }
        : {
            ...(prev[section as keyof typeof prev] as any),
            [key]: value,
          },
    }));

    const errorKey = `${section}.${key}${nestedKey ? `.${nestedKey}` : ""}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({
        ...prev,
        [errorKey]: "",
      }));
    }
    if (submitError) {
      setSubmitError(null); // Clear general submit error on input change
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors["name"] = "Mess name is required";
    if (!form.owner.name.trim())
      newErrors["owner.name"] = "Owner name is required";
    if (!form.owner.phone.trim())
      newErrors["owner.contact"] = "Owner contact is required";
    if (!form.address.city.trim())
      newErrors["address.city"] = "City is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSubmitError(null);

    try {
      const res = await api.post("/mess/add", form);
      if (res.status === 201 || res.status === 200) {
        console.log("Created Mess:", res.data.data);
        onClose();
      } else {
        setSubmitError("Unexpected server response. Please try again.");
      }
    } catch (error: any) {
      if (error.response?.data?.detail) {
        setSubmitError(error.response.data.detail);
      } else {
        setSubmitError("Failed to submit. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "basic", label: "Basic Info", icon: Building2 },
    { id: "location", label: "Location", icon: MapPin },
  ];

  const handleClose = () => {
    setForm({
      id: "",
      name: "",
      type: "BOYS_MESS", // ✅ Valid value of type MessType
      phone: "",
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      address: {
        id: "",
        street: "",
        area: "",
        city: "",
        postalCode: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      owner: {
        id: "",
        name: "",
        phone: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Add New Mess
              </h2>
              <p className="text-sm text-gray-500">
                Fill in the details to register a new mess
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto border-b border-gray-200 px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                disabled={loading}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                } disabled:opacity-50`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {submitError && (
              <p className="text-red-600 mb-4 text-center font-semibold">
                {submitError}
              </p>
            )}
            {activeTab === "basic" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mess Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mess Name *
                  </label>
                  <input
                    type="text"
                    disabled={loading}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors["name"] ? "border-red-300" : "border-gray-300"
                    }`}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter mess name"
                  />
                  {errors["name"] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors["name"]}
                    </p>
                  )}
                </div>

                {/* Mess Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mess Type
                  </label>
                  <select
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={form.type || ""}
                    onChange={(e) =>
                      setForm({ ...form, type: e.target.value as MessType })
                    }
                  >
                    <option value="" disabled>
                      Select Mess Type
                    </option>
                    <option value="BOYS_MESS">Boys Mess</option>
                    <option value="GIRLS_MESS">Girls Mess</option>
                  </select>
                </div>

                {/* Mess Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mess Phone
                  </label>
                  <input
                    type="tel"
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    placeholder="+880XXXXXXXXX"
                  />
                </div>

                {/* Owner Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Owner Name *
                  </label>
                  <input
                    type="text"
                    disabled={loading}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors["owner.name"]
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                    value={form.owner.name}
                    onChange={(e) =>
                      handleChange("owner", "name", e.target.value)
                    }
                    placeholder="Enter owner's full name"
                  />
                  {errors["owner.name"] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors["owner.name"]}
                    </p>
                  )}
                </div>

                {/* Owner Contact */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    disabled={loading}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors["owner.contact"]
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                    value={form.owner.phone}
                    onChange={(e) =>
                      handleChange("owner", "phone", e.target.value)
                    }
                    placeholder="+880XXXXXXXXX"
                  />
                  {errors["owner.contact"] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors["owner.contact"]}
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "location" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={form.address.street}
                    onChange={(e) =>
                      handleChange("address", "street", e.target.value)
                    }
                    placeholder="House/Road/Street"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area/Locality
                  </label>
                  <input
                    type="text"
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={form.address.area}
                    onChange={(e) =>
                      handleChange("address", "area", e.target.value)
                    }
                    placeholder="Area or locality"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    disabled={loading}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors["address.city"]
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                    value={form.address.city}
                    onChange={(e) =>
                      handleChange("address", "city", e.target.value)
                    }
                    placeholder="City name"
                  />
                  {errors["address.city"] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors["address.city"]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={form.address.postalCode}
                    onChange={(e) =>
                      handleChange("address", "postalCode", e.target.value)
                    }
                    placeholder="1234"
                  />
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <div className="flex items-center gap-4">
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                const currentIndex = tabs.findIndex(
                  (tab) => tab.id === activeTab
                );
                if (currentIndex > 0) {
                  setActiveTab(tabs[currentIndex - 1].id);
                } else {
                  handleClose();
                }
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {activeTab === tabs[0].id ? "Cancel" : "Previous"}
            </button>

            {activeTab === tabs[tabs.length - 1].id ? (
              <button
                type="submit"
                disabled={loading}
                onClick={handleSubmit}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Mess"}
              </button>
            ) : (
              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  const currentIndex = tabs.findIndex(
                    (tab) => tab.id === activeTab
                  );
                  if (currentIndex < tabs.length - 1) {
                    setActiveTab(tabs[currentIndex + 1].id);
                  }
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessAddModal;
