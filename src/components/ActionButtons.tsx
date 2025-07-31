// components/ActionButtons.tsx

import React from "react";
import { Check, X, RotateCcw } from "lucide-react";

interface ActionButtonsProps {
  /** Handler for save action */
  onSave: () => void;
  /** Handler for clear action */
  onClear: () => void;
  /** Handler for cancel action */
  onCancel: () => void;
  /** Whether there are any selections made */
  hasSelections: boolean;
  /** Whether there are unsaved changes */
  hasChanges: boolean;
  /** Whether a save operation is in progress */
  isLoading?: boolean;
}

/**
 * ActionButtons Component
 *
 * Displays action buttons for saving, clearing, and canceling meal selections.
 * Handles button states based on selection status and loading state.
 *
 * Features:
 * - Conditional button enabling based on state
 * - Loading state indication
 * - Accessible button labels
 * - Consistent styling and hover effects
 *
 * @param props - Component props
 * @returns JSX element containing action buttons
 */
export const ActionButtons: React.FC<ActionButtonsProps> = React.memo(
  ({
    onSave,
    onClear,
    onCancel,
    hasSelections,
    hasChanges,
    isLoading = false,
  }) => {
    const buttonBaseClass = `
    flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]
  `.trim();

    return (
      <div className="flex flex-wrap gap-3 justify-center">
        {/* Save Button */}
        <button
          onClick={onSave}
          disabled={!hasSelections || isLoading}
          className={`
          ${buttonBaseClass}
          bg-green-600 text-white hover:bg-green-700 focus:ring-green-500
          disabled:bg-gray-400 disabled:hover:bg-gray-400
        `}
          aria-label="Save current meal selections"
        >
          <Check size={16} aria-hidden="true" />
          <span>{isLoading ? "Saving..." : "Save Selections"}</span>
        </button>

        {/* Clear Button */}
        <button
          onClick={onClear}
          disabled={!hasSelections || isLoading}
          className={`
          ${buttonBaseClass}
          bg-red-600 text-white hover:bg-red-700 focus:ring-red-500
          disabled:bg-gray-400 disabled:hover:bg-gray-400
        `}
          aria-label="Clear all selections"
        >
          <X size={16} aria-hidden="true" />
          <span>Clear All</span>
        </button>

        {/* Cancel Button */}
        <button
          onClick={onCancel}
          disabled={!hasChanges || isLoading}
          className={`
          ${buttonBaseClass}
          bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500
          disabled:bg-gray-400 disabled:hover:bg-gray-400
        `}
          aria-label="Cancel changes and restore previous state"
        >
          <RotateCcw size={16} aria-hidden="true" />
          <span>Cancel Changes</span>
        </button>
      </div>
    );
  }
);

ActionButtons.displayName = "ActionButtons";
