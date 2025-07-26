"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";

interface MealTimes {
  morning: boolean;
  day: boolean;
  night: boolean;
}

export default function Home() {
  const [morningMealTimes, setMorningMealTimes] = useState<boolean>(false);
  const [dayMealTimes, setDayMealTimes] = useState<boolean>(false);
  const [nightMealTimes, setNightMealTimes] = useState<boolean>(false);
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.push("/");
      } else {
        router.push("/auth");
      }
    }
  }, [isLoading, user, router]);

  const handleFixMealMenu = () => {
    if (!morningMealTimes && !dayMealTimes && !nightMealTimes) {
      alert("Please select at least one meal time.");
      return;
    }
    // Using URLSearchParams to pass data via query parameters
    const params = new URLSearchParams();
    params.set("morning", String(morningMealTimes));
    params.set("day", String(dayMealTimes));
    params.set("night", String(nightMealTimes));

    router.push(`/fix-meal?${params.toString()}`);
  };

  const handleCreateMealPlan = () => {
    if (!morningMealTimes && !dayMealTimes && !nightMealTimes) {
      alert("Please select at least one meal time.");
      return;
    }
    // Using URLSearchParams to pass data via query parameters
    const params = new URLSearchParams();
    params.set("morning", String(morningMealTimes));
    params.set("day", String(dayMealTimes));
    params.set("night", String(nightMealTimes));

    router.push(`/create-plan?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loader className="animate-spin text-blue-500" size={24} />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="p-4 mt-4 flex flex-col justify-center items-center gap-4 shadow-md rounded-lg">
        <div className="">
          <h2 className="w-full text-md font-bold">Select Meal Times</h2>
          <p className="text-sm text-gray-500">
            Please select the meal times you prefer:
          </p>
        </div>

        <div className="flex justify-center items-center gap-4">
          <label className="flex items-center gap-2 select-none">
            <input
              type="checkbox"
              name="mealTimes"
              value="morning"
              checked={morningMealTimes}
              onChange={(e) => {
                setMorningMealTimes(e.target.checked);
              }}
            />
            Morning
          </label>

          <label className="flex items-center gap-2 select-none">
            <input
              type="checkbox"
              name="mealTimes"
              value="day"
              checked={dayMealTimes}
              onChange={(e) => {
                setDayMealTimes(e.target.checked);
              }}
            />
            Day
          </label>

          <label className="flex items-center gap-2 select-none">
            <input
              type="checkbox"
              name="mealTimes"
              value="night"
              checked={nightMealTimes}
              onChange={(e) => {
                setNightMealTimes(e.target.checked);
              }}
            />
            Night
          </label>
        </div>
        <div className="w-full flex justify-center items-center gap-4">
          <button
            onClick={handleFixMealMenu}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Fix Meal Menu
          </button>
          <button
            onClick={handleCreateMealPlan}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Create Meal Plan
          </button>
        </div>
      </div>
    </div>
  );
}
