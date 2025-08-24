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

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    if (open) {
      setShouldRender(true);
      const timeoutId = setTimeout(() => setIsVisible(true), 10);
      document.addEventListener("keydown", handleEsc);

      // Apply scroll lock
      document.body.style.overflow = "hidden";

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener("keydown", handleEsc);
      };
    } else if (!open && shouldRender) {
      setIsVisible(false);
      const timeoutId = setTimeout(() => setShouldRender(false), 300);

      return () => clearTimeout(timeoutId);
    }
  }, [open, shouldRender, handleClose]);

  // Cleanup overflow when component unmounts OR when modal closes
  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
    xxl: "max-w-4xl",
    xxxl: "max-w-6xl",
    full: "max-w-7xl w-full mx-4",
  };

  if (!shouldRender) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300
          ${isVisible ? "opacity-100" : "opacity-0"}
        `}
        onClick={closeOnBackdrop ? handleClose : undefined}
        aria-hidden="true"
      />

      {/* Modal container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <div
          className={`
            relative w-full ${sizeClasses[size]}
            bg-white rounded-2xl shadow-2xl
            transform transition-all duration-300 ease-out
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
          }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "modal-title" : undefined}
        >
          {/* Header */}
          {header && (title || showCloseButton) && (
            <div className="flex items-center justify-between p-4 sm:p-6 pb-0">
              {title && (
                <h2
                  id="modal-title"
                  className="text-lg sm:text-xl font-semibold text-gray-900"
                >
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  onClick={handleClose}
                  className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
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

          {/* Scrollable Content */}
          <div
            className={`px-4 sm:px-6 ${
              title || showCloseButton ? "pt-4" : "pt-6"
            } pb-6 max-h-[80vh] overflow-y-auto`}
          >
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
