import NoteOrderView from "@/components/modal/NoteOrderView";
import { MessData, OrderData, UserData } from "@/types";
import api from "@/utils/api";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronUp,
  Package,
  Search,
} from "lucide-react";
import React, { useState, useEffect } from "react";

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

interface ApiResponse {
  orders: Order[];
  total: number;
  limit: number;
  skip: number;
}

const NoteOrder = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [ordersPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{
    field: string;
    direction: "asc" | "desc";
  }>({ field: "created_at", direction: "desc" });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [isOrderViewOpen, setIsOrderViewOpen] = useState(false);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        skip: ((currentPage - 1) * ordersPerPage).toString(),
        limit: ordersPerPage.toString(),
        sort_by: sortConfig.field,
        sort_order: sortConfig.direction,
        search: debouncedSearchTerm,
      });

      const req = await api.get(`/order/get/note/all?${params.toString()}`);

      if (req.status !== 200) {
        throw new Error(`HTTP error! status: ${req.data.detail}`);
      }

      const data: ApiResponse = req.data;

      setOrders(data.orders);
      setTotalOrders(data.total);
      setTotalPages(Math.ceil(data.total / ordersPerPage));
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, sortConfig, debouncedSearchTerm]);

  const requestSort = (field: string) => {
    setCurrentPage(1);
    setSortConfig((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortIcon = (field: string) => {
    if (sortConfig.field !== field) {
      return (
        <span className="opacity-0">
          <ChevronUp size={16} />
        </span>
      );
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp size={16} className="text-blue-500" />
    ) : (
      <ChevronDown size={16} className="text-blue-500" />
    );
  };

  const paginate = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;
    let startPage = Math.max(
      1,
      currentPage - Math.floor(maxVisibleButtons / 2)
    );
    const endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    buttons.push(
      <button
        key="first"
        onClick={() => paginate(1)}
        disabled={currentPage === 1}
        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronsLeft size={16} />
      </button>
    );

    buttons.push(
      <button
        key="prev"
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
        className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={16} />
      </button>
    );

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
            currentPage === i
              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
          }`}
        >
          {i}
        </button>
      );
    }

    buttons.push(
      <button
        key="next"
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight size={16} />
      </button>
    );

    buttons.push(
      <button
        key="last"
        onClick={() => paginate(totalPages)}
        disabled={currentPage === totalPages}
        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronsRight size={16} />
      </button>
    );

    return buttons;
  };
  const tableHeaders = [
    { field: "id", label: "Order ID", sortAble: false },
    { field: "customer_name", label: "Customer", sortAble: true },
    { field: "status", label: "Status", sortAble: true },
    { field: "total_amount", label: "Amount", sortAble: true },
    { field: "created_at", label: "Order Date", sortAble: true },
    { field: "actions", label: "Actions" },
  ];

  return (
    <div>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
        <h3 className="font-medium text-gray-700 text-lg">Order Management</h3>
        <div className="relative w-full md:w-auto">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search orders..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table Section */}
      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md">
          {error}
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {tableHeaders.map((header) => (
                    <th
                      key={header.field}
                      scope="col"
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        header.sortAble
                          ? "cursor-pointer hover:bg-gray-100"
                          : ""
                      }`}
                      onClick={() =>
                        header.sortAble && requestSort(header.field)
                      }
                    >
                      <div className="flex items-center gap-1 capitalize">
                        {header.label}
                        {header.sortAble && getSortIcon(header.field)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            <Package className="text-gray-500" size={20} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {order.mess.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {order.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {order.user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.status === "DELIVERED"
                              ? "bg-green-100 text-green-800"
                              : order.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {order.budget.toLocaleString("en-BD")}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsOrderViewOpen(true);
                          }}
                        >
                          View
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <p className="text-sm text-gray-700">
                Showing
                <span className="font-medium">
                  {(currentPage - 1) * ordersPerPage + 1}
                </span>
                to
                <span className="font-medium">
                  {Math.min(currentPage * ordersPerPage, totalOrders)}
                </span>
                of <span className="font-medium">{totalOrders}</span> results
              </p>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                {renderPaginationButtons()}
              </nav>
            </div>
          )}
        </div>
      )}
      <NoteOrderView
        order={selectedOrder}
        isOpen={isOrderViewOpen}
        onClose={() => setIsOrderViewOpen(false)}
      />
    </div>
  );
};

export default NoteOrder;
