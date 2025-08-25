// components/OrderView.tsx
import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { OrderData, OrderItem } from "@/types";

interface OrderViewProps {
  order: OrderData | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderView: React.FC<OrderViewProps> = ({ order, isOpen, onClose }) => {
  const [editableOrder, setEditableOrder] = useState<OrderData | null>(order);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setEditableOrder(order);
    setIsEditing(false);
  }, [order]);

  if (!editableOrder) return null;

  const handleItemQuantityChange = (itemId: string, quantity: number) => {
    if (!editableOrder || !isEditing) return;
    setEditableOrder({
      ...editableOrder,
      items: editableOrder.items.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      ),
    });
  };

  const handleStatusChange = (status: string) => {
    if (!editableOrder || !isEditing) return;
    setEditableOrder({ ...editableOrder, status } as OrderData);
  };

  const handleBudgetChange = (budget: number) => {
    if (!editableOrder || !isEditing) return;
    setEditableOrder({ ...editableOrder, meal_budget: budget });
  };

  const handleSave = () => {
    if (editableOrder) {
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditableOrder(order);
    setIsEditing(false);
    onClose();
  };

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case "PENDING":
        return { dot: "bg-gray-400", text: "text-gray-700", bg: "bg-gray-50" };
      case "APPROVED":
        return { dot: "bg-gray-800", text: "text-gray-900", bg: "bg-gray-100" };
      case "REJECTED":
        return { dot: "bg-gray-600", text: "text-gray-800", bg: "bg-gray-50" };
      case "COMPLETED":
        return { dot: "bg-black", text: "text-black", bg: "bg-gray-200" };
      default:
        return { dot: "bg-gray-300", text: "text-gray-500", bg: "bg-gray-50" };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusIndicator = getStatusIndicator(editableOrder.status);

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title=""
      size="xxl"
      showCloseButton={false}
    >
      <div className="min-h-[80vh] bg-white">
        {/* Header */}
        <div className="border-b border-gray-200 pb-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-light text-black">
                Order #{editableOrder.id.slice(-8).toUpperCase()}
              </h1>
              <p className="text-sm text-gray-500">
                {formatDate(editableOrder.created_at)}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusIndicator.bg}`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${statusIndicator.dot}`}
                />
                <span className={`text-sm font-medium ${statusIndicator.text}`}>
                  {editableOrder.status}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-12">
          {/* Customer & Mess Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Customer */}
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-black border-b border-gray-200 pb-2">
                Customer Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </label>
                  <p className="text-gray-900 font-medium mt-1">
                    {editableOrder.user.name}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </label>
                  <p className="text-gray-900 font-medium mt-1">
                    {editableOrder.user.email}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </label>
                  <p className="text-gray-900 font-medium mt-1 capitalize">
                    {editableOrder.user.role}
                  </p>
                </div>
              </div>
            </div>

            {/* Mess */}
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-black border-b border-gray-200 pb-2">
                Mess Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mess Name
                  </label>
                  <p className="text-gray-900 font-medium mt-1">
                    {editableOrder.mess.name}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </label>
                  <p className="text-gray-900 font-medium mt-1">
                    {editableOrder.mess.phone}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </label>
                  <p className="text-gray-900 font-medium mt-1 capitalize">
                    {editableOrder.mess.type}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-medium text-black mb-6">
              Order Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Items
                </label>
                <p className="text-2xl font-light text-black mt-1">
                  {editableOrder.items.length}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Meals
                </label>
                <p className="text-2xl font-light text-black mt-1">
                  {editableOrder.total_meal}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Budget
                </label>
                <p className="text-2xl font-light text-black mt-1">
                  ${editableOrder.meal_budget.toFixed(2)}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Value
                </label>
                <p className="text-2xl font-light text-black mt-1">
                  ${editableOrder.meal_budget * editableOrder.total_meal}
                </p>
              </div>
            </div>
            {isEditing && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">
                  Order Status
                </label>
                <select
                  value={editableOrder.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            )}
          </div>

          {/* Items */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-black">Order Items</h2>
              <span className="text-sm text-gray-500">
                {editableOrder.items.length} item
                {editableOrder.items.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Breakfast
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lunch
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dinner
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {editableOrder.items.map((item: OrderItem) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.product.name}
                            </div>
                            <div className="text-xs text-gray-500 capitalize">
                              {item.product.category.label}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-sm text-gray-900">
                            {item.auto ? (
                              "Auto"
                            ) : (
                              <span className="mr-2">
                                {item.quantity} / {item.unit.icon}{" "}
                                {item.unit.label}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {item.auto ? (
                            "Auto"
                          ) : (
                            <span className="text-sm font-medium text-gray-900">
                              ${item.unit.price * item.quantity}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                          {item.for_breakfast ? "Yes" : "No"}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                          {item.for_lunch ? "Yes" : "No"}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                          {item.for_dinner ? "Yes" : "No"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-8 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Last updated: {formatDate(editableOrder.updated_at)}
            </div>
            <div className="flex items-center gap-3">
              {!isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 text-sm font-medium text-white bg-black border border-black rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                  >
                    Edit Order
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 text-sm font-medium text-white bg-black border border-black rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                  >
                    Save Changes
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default OrderView;
