import React, { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Crown,
  Users,
  Calendar,
  MapPin,
  Sparkles,
  Save,
  X,
  Check,
  Building2,
} from "lucide-react";
import Modal from "./Modal";
import MessSearchInput from "../autocomplete/MessSearchInput";
import { MessData } from "@/types";
import api from "@/utils/api";

interface UserData {
  id?: string;
  username: string;
  email: string;
  role: string;
  status: string;
  name?: string;
  dob?: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
  allocated_mess?: MessData;
}

interface UserFormData {
  username: string;
  email: string;
  password: string;
  role: string;
  status: string;
  name?: string;
  dob?: string;
  address?: string;
}

interface UserAddModalProps {
  open: boolean;
  onClose: () => void;
  selectedUser?: UserData;
}

const UserAddModal: React.FC<UserAddModalProps> = ({
  open,
  onClose,
  selectedUser,
}) => {
  const [formData, setFormData] = useState<UserFormData>({
    username: selectedUser ? selectedUser.username : "",
    email: selectedUser ? selectedUser.email : "",
    password: "",
    role: selectedUser ? selectedUser.role : "user",
    status: selectedUser ? selectedUser.status : "active",
    name: selectedUser ? selectedUser.name : "",
    dob: selectedUser ? selectedUser.dob : "",
    address: selectedUser ? selectedUser.address : "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<UserFormData>>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof UserFormData, boolean>>
  >({});
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [mess, setMess] = useState("");
  const [searchFound, setSearchFound] = useState<boolean>(false);
  const [autoCompleteEnabled, setAutoCompleteEnabled] =
    useState<boolean>(false);

  // Tab configuration
  const tabs = [
    { id: "basic", label: "Basic Info", icon: User },
    { id: "permissions", label: "Role & Status", icon: Crown },
    { id: "details", label: "Personal Details", icon: MapPin },
  ];

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        username: selectedUser.username || "",
        email: selectedUser.email || "",
        password: "",
        role: selectedUser.role || "user",
        status: selectedUser.status || "active",
        name: selectedUser.name || "",
        dob: selectedUser.dob || "",
        address: selectedUser.address || "",
      });
      if (selectedUser.allocated_mess) {
        setMess(selectedUser.allocated_mess.name);
        setAutoCompleteEnabled(false);
      }
    }
  }, [selectedUser]);

  const roles = [
    {
      value: "admin",
      label: "অ্যাডমিন",
      subtitle: "Admin",
      icon: Crown,
      color: "from-purple-500 to-pink-500",
      description: "Full system access",
    },
    {
      value: "user",
      label: "ব্যবহারকারী",
      subtitle: "User",
      icon: User,
      color: "from-blue-500 to-cyan-500",
      description: "Standard user access",
    },
  ];

  const statusOptions = [
    {
      value: "active",
      label: "সক্রিয়",
      subtitle: "Active",
      color: "bg-green-100 text-green-800 border-green-200",
      dot: "bg-green-400",
    },
    {
      value: "disabled",
      label: "নিষ্ক্রিয়",
      subtitle: "Disabled",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      dot: "bg-yellow-400",
    },
    {
      value: "deleted",
      label: "মুছে ফেলা",
      subtitle: "Deleted",
      color: "bg-red-100 text-red-800 border-red-200",
      dot: "bg-red-400",
    },
    {
      value: "banned",
      label: "নিষিদ্ধ",
      subtitle: "Banned",
      color: "bg-gray-100 text-gray-800 border-gray-200",
      dot: "bg-gray-400",
    },
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<UserFormData> = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username =
        "Username can only contain letters, numbers, and underscores";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!selectedUser && !formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    if (!formData.status) {
      newErrors.status = "Status is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof UserFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: keyof UserFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      username: true,
      email: true,
      password: true,
      role: true,
      status: true,
      name: true,
      dob: true,
      address: true,
    });

    if (validateForm()) {
      setIsLoading(true);

      setIsLoading(false);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      role: "user",
      status: "active",
      name: "",
      dob: "",
      address: "",
    });
    setMess("");
    setIsLoading(false);
    setSearchFound(false);
    setAutoCompleteEnabled(false);
    setTouched({});
    setErrors({});
    setActiveTab("basic");
    onClose();
  };

  const handleAutocompleteSelect = async (mess?: MessData) => {
    if (mess) {
      setMess(mess.name);
      setSearchFound(true);
      setAutoCompleteEnabled(false);
      if (selectedUser) {
        const req = await api.post(
          `/user/update/mess?user_id=${selectedUser.id}&mess_id=${mess.id}`
        );
        if (req.status === 200) {
          handleClose();
        }
      }
    }
  };

  if (!open) return null;

  return (
    <Modal open={open} onClose={handleClose} size="xl">
      {/* <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"> */}
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {selectedUser ? "Update User" : "Add New User"}
            </h2>
            <p className="text-sm text-gray-500">
              {selectedUser
                ? "Modify user details and permissions"
                : "Fill in the details to register a new user"}
            </p>
          </div>
        </div>
        <button
          onClick={handleClose}
          disabled={isLoading}
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
              disabled={isLoading}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id
                  ? "text-indigo-600 border-indigo-600"
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
        <div className="space-y-6">
          {/* Basic Info Tab */}
          {activeTab === "basic" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <User className="w-4 h-4 mr-2 text-indigo-500" />
                  Username *
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  onBlur={() => handleBlur("username")}
                  disabled={isLoading}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                    errors.username && touched.username
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter username"
                />
                {errors.username && touched.username && (
                  <p className="text-red-500 text-sm">{errors.username}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Mail className="w-4 h-4 mr-2 text-indigo-500" />
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  disabled={isLoading}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                    errors.email && touched.email
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter email address"
                />
                {errors.email && touched.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              {!selectedUser ? (
                <div className="md:col-span-2 space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Lock className="w-4 h-4 mr-2 text-indigo-500" />
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      onBlur={() => handleBlur("password")}
                      disabled={isLoading}
                      className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                        errors.password && touched.password
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-500 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && touched.password && (
                    <p className="text-red-500 text-sm">{errors.password}</p>
                  )}
                </div>
              ) : (
                <div className="md:col-span-2 space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Lock className="w-4 h-4 mr-2 text-indigo-500" />
                    Allocated Mess
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={mess}
                      onChange={(e) => {
                        setAutoCompleteEnabled(true);
                        setMess(e.target.value);
                      }}
                      disabled={isLoading}
                      className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors border-gray-300`}
                      placeholder="Enter mess name"
                    />
                    <MessSearchInput
                      input={mess}
                      onSelectProduct={handleAutocompleteSelect}
                      setIsFound={(found) => setSearchFound(found)}
                      enable={autoCompleteEnabled}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Role & Status Tab */}
          {activeTab === "permissions" && (
            <div className="space-y-8">
              {/* Role Selection */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Crown className="w-4 h-4 mr-2 text-indigo-500" />
                  User Role *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {roles.map((role) => (
                    <div
                      key={role.value}
                      onClick={() => handleInputChange("role", role.value)}
                      className={`
                          relative p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-lg
                          ${
                            formData.role === role.value
                              ? "border-indigo-500 bg-indigo-50 shadow-md"
                              : "border-gray-200 hover:border-indigo-300"
                          }
                        `}
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`p-3 rounded-xl bg-gradient-to-r ${role.color}`}
                        >
                          <role.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            {role.label}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {role.subtitle}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {role.description}
                          </p>
                        </div>
                      </div>
                      {formData.role === role.value && (
                        <div className="absolute top-4 right-4">
                          <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Selection */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-indigo-500" />
                  Account Status *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {statusOptions.map((status) => (
                    <div
                      key={status.value}
                      onClick={() => handleInputChange("status", status.value)}
                      className={`
                          relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md
                          ${
                            formData.status === status.value
                              ? `${status.color} border-current shadow-sm`
                              : "border-gray-200 hover:border-gray-300"
                          }
                        `}
                    >
                      <div className="text-center">
                        <div
                          className={`w-4 h-4 rounded-full ${status.dot} mx-auto mb-2`}
                        ></div>
                        <h5 className="font-semibold text-sm">
                          {status.label}
                        </h5>
                        <p className="text-xs text-gray-600">
                          {status.subtitle}
                        </p>
                      </div>
                      {formData.status === status.value && (
                        <div className="absolute -top-1 -right-1">
                          <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Personal Details Tab */}
          {activeTab === "details" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <User className="w-4 h-4 mr-2 text-indigo-500" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Enter full name"
                />
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dob || ""}
                  onChange={(e) => handleInputChange("dob", e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2 space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <MapPin className="w-4 h-4 mr-2 text-indigo-500" />
                  Address
                </label>
                <textarea
                  value={formData.address || ""}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  disabled={isLoading}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                  placeholder="Enter complete address"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
        <div className="flex items-center gap-4">
          <button
            type="button"
            disabled={isLoading}
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
              type="button"
              disabled={isLoading}
              onClick={handleSubmit}
              className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg hover:from-indigo-600 hover:to-purple-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-50 flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{selectedUser ? "Updating..." : "Creating..."}</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{selectedUser ? "Update User" : "Create User"}</span>
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              disabled={isLoading}
              onClick={() => {
                const currentIndex = tabs.findIndex(
                  (tab) => tab.id === activeTab
                );
                if (currentIndex < tabs.length - 1) {
                  setActiveTab(tabs[currentIndex + 1].id);
                }
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all disabled:opacity-50"
            >
              Next
            </button>
          )}
        </div>
      </div>
      {/* </div>
      </div> */}
    </Modal>
  );
};

export default UserAddModal;
