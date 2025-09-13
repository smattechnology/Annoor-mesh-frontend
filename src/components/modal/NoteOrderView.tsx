import React from "react";
import Modal from "./Modal";
import { MessData, UserData } from "@/types";

type OrderItem = {
  id: string;
  meal_time: "BREAKFAST" | "LUNCH" | "DINNER";
  total_meal: number;
  menu: string;
};

type Order = {
  id: string;
  status: string;
  items: OrderItem[];
  mess: MessData;
  user: UserData;
  budget: number;
  created_at: string;
};

interface NoteOrderProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const NoteOrderView: React.FC<NoteOrderProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!order) return null;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      size="xxl"
      title="Order Details"
      header
    >
      <div className="w-full p-6">
        {/* Header */}
        <div className="border-b border-gray-300 pb-6 mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {order.mess.name}
            </h2>
            <p className="text-gray-500 text-sm">Order by: {order.user.name}</p>
            <p className="text-gray-400 text-xs">
              {new Date(order.created_at).toLocaleString()}
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <span
              className={`px-4 py-2 text-sm font-semibold rounded-full ${
                order.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-700"
                  : order.status === "APPROVED"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {order.status}
            </span>
          </div>
        </div>

        {/* Order Items */}
        <div className="space-y-4">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >
              {/* Left: Note & Meal Type */}
              <div className="flex flex-col">
                <span
                  className={`text-xs font-bold mb-2 px-3 py-1 rounded-full ${
                    item.meal_time === "BREAKFAST"
                      ? "bg-blue-100 text-blue-700"
                      : item.meal_time === "LUNCH"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-pink-100 text-pink-700"
                  }`}
                >
                  {item.meal_time}
                </span>
                <p className="text-gray-700 text-sm">
                  {item.menu || "No special note"}
                </p>
              </div>

              {/* Right: Pricing Info */}
              <div className="flex flex-col text-right mt-3 sm:mt-0">
                <span className="text-gray-600 text-sm">
                  Meals:{" "}
                  <span className="font-semibold">{item.total_meal}</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-6 flex justify-end border-t pt-4">
          <h3 className="text-xl font-bold text-gray-800">
            Total: {order.budget.toLocaleString("en-BD")}
          </h3>
        </div>
      </div>
    </Modal>
  );
};

export default NoteOrderView;
