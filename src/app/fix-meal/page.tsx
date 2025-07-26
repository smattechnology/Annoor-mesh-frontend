"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function PlannerPage() {
  const searchParams = useSearchParams();

  const morning = searchParams.get("morning") === "true";
  const day = searchParams.get("day") === "true";
  const night = searchParams.get("night") === "true";

  return (
    <div>
      <h1>Meal Planner</h1>
      <div>
        <h2>Selected Meal Times</h2>
        <ul>
          {morning && <li>Morning</li>}
          {day && <li>Day</li>}
          {night && <li>Night</li>}
        </ul>
      </div>
    </div>
  );
}
