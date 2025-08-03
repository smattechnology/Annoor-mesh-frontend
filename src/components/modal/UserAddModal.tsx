import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { UserData } from "@/types";
import api from "@/utils/api";

interface UserAddModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (userData: UserFormData) => void;
  selectedUser?: UserData;
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

const UserAddModal: React.FC<UserAddModalProps> = ({
  open,
  onClose,
  onSubmit,
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
    }
  }, [selectedUser]);

  // Role options from backend RoleEnum
  const roles = [
    { value: "admin", label: "অ্যাডমিন (Admin)", icon: "👑" },
    { value: "user", label: "ব্যবহারকারী (User)", icon: "👤" },
  ];

  // Status options from backend StatusEnum
  const statusOptions = [
    { value: "active", label: "সক্রিয় (Active)", icon: "✅" },
    { value: "disabled", label: "নিষ্ক্রিয় (Disabled)", icon: "⏸️" },
    { value: "deleted", label: "মুছে ফেলা (Deleted)", icon: "🗑️" },
    { value: "banned", label: "নিষিদ্ধ (Banned)", icon: "🚫" },
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<UserFormData> = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username =
        "Username can only contain letters, numbers, and underscores";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    // Status validation
    if (!formData.status) {
      newErrors.status = "Status is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof UserFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: keyof UserFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const payload = {
        id: selectedUser?.id,
        email: selectedUser?.email != formData.email ? formData.email : "",
        role: selectedUser?.role != formData.role ? formData.role : "",
        status: selectedUser?.status != formData.status ? formData.status : "",
        name: selectedUser?.name != formData.name ? formData.name : "",
        dob: selectedUser?.dob != formData.dob ? formData.dob : "",
        address:
          selectedUser?.address != formData.address ? formData.address : "",
      };
      const res = await api.post("/user/update", payload);
      if (res.status == 200) {
        const data = res.data;
        console.log(data);
      }
    } catch (err: any) {
    } finally {
      setIsLoading(false);
    }

    // Mark all required fields as touched for validation display
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
      // Reset form on successful submission
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
      setTouched({});
      setErrors({});
    }
  };

  const handleClose = () => {
    // Reset form when closing
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
    setTouched({});
    setErrors({});
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} size="xxxl" title="Add New User">
      <div className="h-full max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
        <form onSubmit={handleSubmit} className="space-y-6 p-2">
          {/* Account Information Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-blue-600">🔐</span>
              Account Information
            </h3>

            {/* Email */}
            <div className="space-y-2 mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  placeholder="user@example.com"
                  className={`
                  block w-full px-4 py-3 rounded-xl border-2 transition-all duration-200
                  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  ${
                    errors.email && touched.email
                      ? "border-red-300 bg-red-50 focus:border-red-500"
                      : "border-gray-200 focus:border-blue-500 bg-white"
                  }
                `}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gray-400">📧</span>
                </div>
              </div>
              {errors.email && touched.email && (
                <p className="text-red-600 text-sm flex items-center gap-1">
                  <span className="text-red-500">⚠️</span>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Username and Password Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Username */}
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    disabled={selectedUser?.username ? true : false}
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={(e) =>
                      handleInputChange("username", e.target.value)
                    }
                    onBlur={() => handleBlur("username")}
                    placeholder="Enter unique username"
                    className={`
                  block w-full px-4 py-3 rounded-xl border-2 transition-all duration-200
                  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  ${
                    errors.username && touched.username
                      ? "border-red-300 bg-red-50 focus:border-red-500"
                      : "border-gray-200 focus:border-blue-500 bg-white"
                  }
                `}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-400">👤</span>
                  </div>
                </div>
                {errors.username && touched.username && (
                  <p className="text-red-600 text-sm flex items-center gap-1">
                    <span className="text-red-500">⚠️</span>
                    {errors.username}
                  </p>
                )}
              </div>
              {/* Password */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    onBlur={() => handleBlur("password")}
                    placeholder="Enter secure password"
                    className={`
                    block w-full px-4 py-3 pr-12 rounded-xl border-2 transition-all duration-200
                    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    ${
                      errors.password && touched.password
                        ? "border-red-300 bg-red-50 focus:border-red-500"
                        : "border-gray-200 focus:border-blue-500 bg-white"
                    }
                  `}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  >
                    <span>{showPassword ? "🙈" : "👁️"}</span>
                  </button>
                </div>
                {errors.password && touched.password && (
                  <p className="text-red-600 text-sm flex items-center gap-1">
                    <span className="text-red-500">⚠️</span>
                    {errors.password}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-green-600">👤</span>
              Personal Information
            </h3>

            {/* Date of Birth and Address Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Display Name */}
              <div className="space-y-2 mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Display Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter display name (optional)"
                    className="block w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 bg-white placeholder-gray-400"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-400">🏷️</span>
                  </div>
                </div>
              </div>
              {/* Date of Birth */}
              <div className="space-y-2">
                <label
                  htmlFor="dob"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date of Birth
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="dob"
                    name="dob"
                    value={formData.dob}
                    onChange={(e) => handleInputChange("dob", e.target.value)}
                    className="block w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 bg-white"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-gray-400">📅</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Address */}
            <div className="space-y-2">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Enter address (optional)"
                className="block w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 bg-white placeholder-gray-400"
              />
            </div>
          </div>

          {/* System Settings Section */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-purple-600">⚙️</span>
              System Settings
            </h3>

            {/* Role and Status Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Role */}
              <div className="space-y-2">
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700"
                >
                  Role <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={(e) => handleInputChange("role", e.target.value)}
                    onBlur={() => handleBlur("role")}
                    style={{
                      scrollbarWidth: "thin",
                      scrollbarColor: "#cbd5e1 #f1f5f9",
                    }}
                    className={`
                    block w-full px-4 py-3 rounded-xl border-2 transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    [&>option]:py-2 [&>option]:px-3 [&>option]:bg-white [&>option]:text-gray-900
                    [&>option:hover]:bg-blue-50 [&>option:checked]:bg-blue-100 [&>option:checked]:text-blue-900
                    ${
                      errors.role && touched.role
                        ? "border-red-300 bg-red-50 focus:border-red-500"
                        : "border-gray-200 focus:border-blue-500 bg-white"
                    }
                  `}
                  >
                    {roles.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.icon} {role.label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.role && touched.role && (
                  <p className="text-red-600 text-sm flex items-center gap-1">
                    <span className="text-red-500">⚠️</span>
                    {errors.role}
                  </p>
                )}
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700"
                >
                  Status <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                    onBlur={() => handleBlur("status")}
                    style={{
                      scrollbarWidth: "thin",
                      scrollbarColor: "#cbd5e1 #f1f5f9",
                    }}
                    className={`
                    block w-full px-4 py-3 rounded-xl border-2 transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    [&>option]:py-2 [&>option]:px-3 [&>option]:bg-white [&>option]:text-gray-900
                    [&>option:hover]:bg-blue-50 [&>option:checked]:bg-blue-100 [&>option:checked]:text-blue-900
                    ${
                      errors.status && touched.status
                        ? "border-red-300 bg-red-50 focus:border-red-500"
                        : "border-gray-200 focus:border-blue-500 bg-white"
                    }
                  `}
                  >
                    {statusOptions.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.icon} {status.label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.status && touched.status && (
                  <p className="text-red-600 text-sm flex items-center gap-1">
                    <span className="text-red-500">⚠️</span>
                    {errors.status}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating User...
                </>
              ) : (
                <>
                  <span>👥</span>
                  Create User
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default UserAddModal;
