import { useEffect, useState, useCallback } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl" | "full";
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  className?: string;
  header?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
  closeOnBackdrop = true,
  className = "",
  header = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Memoize the close handler to prevent unnecessary re-renders
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    if (open) {
      setShouldRender(true);
      // Use requestAnimationFrame for smoother animation timing
      const timeoutId = setTimeout(() => setIsVisible(true), 10);
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener("keydown", handleEsc);
      };
    } else if (!open && shouldRender) {
      setIsVisible(false);
      // Wait for exit animation to complete before unmounting
      const timeoutId = setTimeout(() => setShouldRender(false), 300);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener("keydown", handleEsc);
        document.body.style.overflow = "unset";
      };
    }

    // Cleanup function for when component unmounts
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [open, shouldRender, handleClose]);

  // Size variants
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
    xxl: "max-w-4xl",
    xxxl: "max-w-6xl",
    full: "max-w-7xl mx-4",
  };

  if (!shouldRender) return null;

  return (
    <>
      {/* Backdrop with blur effect */}
      <div
        className={`
          fixed inset-0 z-50 
          bg-black/60 backdrop-blur-sm
          transition-all duration-300 ease-out
          ${isVisible ? "opacity-100" : "opacity-0"}
        `}
        onClick={closeOnBackdrop ? handleClose : undefined}
        aria-hidden="true"
      />

      {/* Modal container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className={`
            relative w-full ${sizeClasses[size]}
            bg-white rounded-2xl shadow-2xl
            transform transition-all duration-300 ease-out pointer-events-auto
            ${
              isVisible
                ? "scale-100 opacity-100 translate-y-0"
                : "scale-95 opacity-0 translate-y-4"
            }
            border border-gray-200/50
            ${className}
          `}
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
            boxShadow:
              "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.8)",
          }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "modal-title" : undefined}
        >
          {/* Header */}
          {header && (title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 pb-0">
              {title && (
                <h2
                  id="modal-title"
                  className="text-xl font-semibold text-gray-900 tracking-tight"
                >
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  onClick={handleClose}
                  className={`
                    p-2 rounded-full transition-all duration-200
                    text-gray-400 hover:text-gray-600 hover:bg-gray-100
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    ${!title ? "absolute top-4 right-4 z-10" : ""}
                  `}
                  aria-label="Close modal"
                  type="button"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div
            className={`px-6 ${
              title || showCloseButton ? "pt-4" : "pt-6"
            } pb-6`}
          >
            {children}
          </div>

          {/* Subtle border accent */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)",
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              maskComposite: "xor",
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              padding: "1px",
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Modal;
