import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import api from "@/utils/api";

interface ProductDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: Product;
}

const ProductDeleteModal: React.FC<ProductDeleteModalProps> = ({
  open,
  onClose,
  product,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setError(null);
      setLoading(false);
    }
  }, [open]);

  const handleDelete = async () => {
    if (!product) return;

    setLoading(true);
    setError(null);

    try {
      await api.delete(`/del/product/${product.id}`);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          "Failed to delete the product. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError(null);
      onClose();
    }
  };

  return (
    <Modal
      open={open && !!product}
      onClose={handleClose}
      size="md"
      title="Delete Product"
      header
    >
      <div className="p-4 flex flex-col gap-4">
        <div className="text-center">
          <Trash2 className="mx-auto mb-3 text-red-500 w-10 h-10" />
          <h2 className="text-lg font-semibold">
            Are you sure you want to delete{" "}
            <span className="font-bold text-red-600">
              {product?.name ?? "this product"}
            </span>
            ?
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            This action cannot be undone. The product will be permanently
            removed from your inventory.
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-600 text-center font-medium">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            aria-label="Cancel deletion"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
            aria-label="Confirm deletion"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ProductDeleteModal;
