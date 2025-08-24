"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const Header = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const skipLayout =
    pathname.startsWith("/auth") || pathname.startsWith("/admin");

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  if (skipLayout) return null;

  return (
    <header className="w-full bg-gray-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3 lg:px-8">
        {/* Logo */}
        <h1 className="text-xl sm:text-2xl font-bold">Mess App</h1>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/about" className="hover:underline">
            About
          </Link>
          {user && user.role === "admin" && (
            <Link href="/admin" className="hover:underline">
              Admin Dashboard
            </Link>
          )}
          {user?.id && (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
            >
              Logout
            </button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-700"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-700 px-4 pb-4 space-y-4">
          <Link
            href="/"
            className="block hover:underline"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/about"
            className="block hover:underline"
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>
          {user?.id && (
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
