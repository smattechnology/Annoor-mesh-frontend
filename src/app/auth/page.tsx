"use client";
import LoginSection from "@/components/section/auth/LoginSection";
import RegisterSection from "@/components/section/auth/RegisterSection";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
export default function AuthPage() {
  const [selection, setSelection] = useState<"login" | "register">("login");
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.push("/");
      }
    }
  }, [isLoading, user, router]);

  const renderSelection = () => {
    switch (selection) {
      case "login":
        return <LoginSection setSelect={setSelection} />;
      case "register":
        return <RegisterSection setSelect={setSelection} />;
      default:
        return <LoginSection setSelect={setSelection} />; // Fallback to login
    }
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-4">
      {/* <h1 className="text-green-600 font-extrabold text-5xl">An Noor Foods</h1> */}
      <Image
        src="/img/an-noor-foods.png"
        width={250}
        height={250}
        alt="An Noor Foods"
      />
      <div className="p-4 rounded-lg border border-gray-300 shadow-lg">
        {renderSelection()}
      </div>
    </div>
  );
}
