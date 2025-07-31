"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

import { FloatingWhatsApp } from "react-floating-whatsapp";

const Header = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const skipLayout =
    pathname.startsWith("/auth") || pathname.startsWith("/admin");

  if (skipLayout) {
    return null; // Skip rendering the header if on auth pages
  }
  const handleLogout = () => {
    logout();
  };

  return (
    <div className="w-full p-4 bg-gray-800 text-white flex justify-between items-center">
      <div className="w-full lg:max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mess App</h1>
        <div className="flex items-center space-x-4">
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline">
                  About
                </Link>
              </li>
              {user && user.role === "admin" && (
                <li>
                  <Link href="/admin" className="hover:underline">
                    Admin Dashboard
                  </Link>
                </li>
              )}
            </ul>
          </nav>
          {user?.id && (
            <button className="" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
