// components/LoadingSpinner.tsx

import React from "react";
import { Loader } from "lucide-react";

interface LoadingSpinnerProps {
  /** Custom message to display below the spinner */
  message?: string;
  /** Size of the spinner icon */
  size?: number;
  /** Whether to show as full screen overlay */
  fullScreen?: boolean;
}

/**
 * LoadingSpinner Component
 *
 * A reusable loading spinner component with customizable message and size.
 * Can be displayed as a full-screen overlay or inline within other components.
 *
 * Features:
 * - Animated spinning icon
 * - Customizable message and size
 * - Full-screen and inline modes
 * - Accessible with proper ARIA labels
 *
 * @param props - Component props
 * @returns JSX element representing a loading spinner
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Loading...",
  size = 32,
  fullScreen = true,
}) => {
  const containerClass = fullScreen
    ? "fixed inset-0 bg-gray-50 bg-opacity-75 flex justify-center items-center z-50"
    : "flex justify-center items-center p-8";

  return (
    <div
      className={containerClass}
      role="status"
      aria-label={message}
      aria-live="polite"
    >
      <div className="text-center">
        <Loader
          className="animate-spin text-blue-600 mx-auto mb-4"
          size={size}
          aria-hidden="true"
        />
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
};

LoadingSpinner.displayName = "LoadingSpinner";
