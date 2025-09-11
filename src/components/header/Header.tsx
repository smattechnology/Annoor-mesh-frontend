"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";

interface NavItem {
  label: string;
  href?: string;
  dropdown?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "New Order",
    dropdown: [
      { label: "Order", href: "/order" },
      { label: "Note", href: "/note" },
    ],
  },
];

const Header = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const skipLayout =
    pathname.startsWith("/auth") || pathname.startsWith("/admin");

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  const toggleDropdown = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  if (skipLayout) return null;

  return (
    <header className="w-full bg-gray-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex flex-col justify-center items-start">
          <h1 className="text-xl sm:text-2xl font-bold">MessBazar</h1>
          <p>by An Noor Foods</p>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <div key={item.label} className="relative">
              {item.dropdown ? (
                <>
                  <button
                    onClick={() => toggleDropdown(item.label)}
                    className="flex items-center space-x-1 hover:underline"
                  >
                    <span>{item.label}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {activeDropdown === item.label && (
                    <div className="absolute left-0 mt-2 w-40 bg-gray-700 rounded-lg shadow-lg z-50">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.label}
                          href={subItem.href}
                          className="block px-4 py-2 hover:bg-gray-600"
                          onClick={() => setActiveDropdown(null)}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link href={item.href!} className="hover:underline">
                  {item.label}
                </Link>
              )}
            </div>
          ))}

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
          {navItems.map((item) => (
            <div key={item.label}>
              {item.dropdown ? (
                <>
                  <button
                    onClick={() => toggleDropdown(item.label)}
                    className="flex items-center justify-between w-full hover:underline"
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      className={`w-4 h-4 transform transition ${
                        activeDropdown === item.label ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {activeDropdown === item.label && (
                    <div className="mt-2 space-y-2 pl-4">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.label}
                          href={subItem.href}
                          className="block hover:underline"
                          onClick={() => {
                            setMenuOpen(false);
                            setActiveDropdown(null);
                          }}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href!}
                  className="block hover:underline"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}

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
