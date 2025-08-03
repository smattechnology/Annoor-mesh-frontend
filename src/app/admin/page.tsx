"use client";
import DashboardContent from "@/components/section/admin/DashboardContent";
import MessContent from "@/components/section/admin/Mess";
import ProductsContent from "@/components/section/admin/ProductsContent";
import UsersContent from "@/components/section/admin/UsersContent";
import { useAuth } from "@/contexts/AuthContext";
import {
  Loader,
  LayoutDashboard,
  Users,
  Package,
  LogOut,
  Home,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function AdminPage() {
  const [selectedTab, setSelectedTab] = useState<
    "dashboard" | "users" | "products" | "mess"
  >("dashboard");
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        if (user.role !== "admin") {
          router.push("/");
        }
      } else {
        router.push("/");
      }
    }
  }, [isLoading, user, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case "dashboard":
        return <DashboardContent />;
      case "users":
        return <UsersContent />;
      case "products":
        return <ProductsContent />;
      case "mess":
        return <MessContent />;
      default:
        return <DashboardContent />;
    }
  };

  const sidebarItems = [
    {
      icon: <LayoutDashboard size={18} />,
      label: "Dashboard",
      isActive: selectedTab === "dashboard",
      onClick: () => setSelectedTab("dashboard"),
    },
    {
      icon: <Users size={18} />,
      label: "Users",
      isActive: selectedTab === "users",
      onClick: () => setSelectedTab("users"),
    },
    {
      icon: <Package size={18} />,
      label: "Products",
      isActive: selectedTab === "products",
      onClick: () => setSelectedTab("products"),
    },
    {
      icon: <Package size={18} />,
      label: "Mess",
      isActive: selectedTab === "mess",
      onClick: () => setSelectedTab("mess"),
    },
  ];

  return isLoading ? (
    <div className="w-full h-screen flex justify-center items-center">
      <Loader className="animate-spin text-blue-500" size={24} />
    </div>
  ) : (
    <div className="w-full h-screen flex gap-4 bg-gray-50">
      {/* Sidebar */}
      <div className="w-1/5 h-full p-4 rounded-e-lg border border-gray-300 shadow-sm bg-white">
        <div className="flex flex-col h-full">
          <h1 className="text-xl font-bold text-gray-800 mb-8 p-2">
            Admin Panel
          </h1>

          <nav className="flex-1">
            <ul className="space-y-2">
              {sidebarItems.map((item, index) => (
                <li key={index}>
                  <button
                    onClick={item.onClick}
                    className={`flex items-center gap-2 w-full p-2 rounded-md transition-colors ${
                      item.isActive
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-2 mt-4">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 p-2 text-blue-500 hover:bg-red-50 rounded-md transition-colors mt-auto cursor-pointer"
            >
              <Home size={18} />
              <span>Back to home</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors mt-auto cursor-pointer"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-4/5 h-full p-6 rounded-s-lg border border-gray-300 shadow-sm bg-white overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 capitalize">
            {selectedTab}
          </h2>
          <div className="text-sm text-gray-500">
            Welcome back, {user?.name || "Admin"}!
          </div>
        </div>

        {renderTabContent()}
      </div>
    </div>
  );
}
