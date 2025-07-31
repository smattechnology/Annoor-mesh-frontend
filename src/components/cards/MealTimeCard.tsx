import React from "react";

interface MealTimeCardProps {
  id: number;
  mealTime: "breakfast" | "lunch" | "dinner";
  checked: boolean;
  disabled: boolean;
  onChange: (
    id: number,
    mealTime: "breakfast" | "lunch" | "dinner",
    value: boolean
  ) => void;
}
// Constants
const MEAL_TIMES = {
  breakfast: "সকাল",
  lunch: "দুপুর",
  dinner: "রাত",
} as const;

const MealTimeCard: React.FC<MealTimeCardProps> = ({
  id,
  mealTime,
  checked,
  disabled,
  onChange,
}) => {
  return (
    <label className="inline-flex items-center gap-1">
      <input
        type="checkbox"
        disabled={disabled}
        checked={checked}
        onChange={(e) => onChange(id, mealTime, e.target.checked)}
        className="form-checkbox text-blue-600 border-gray-300 rounded"
      />
      {MEAL_TIMES[mealTime]}
    </label>
  );
};

export default MealTimeCard;
