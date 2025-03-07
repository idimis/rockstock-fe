import React from "react";
import { formatStatus } from "@/lib/utils/format";
import { statusColors } from "@/constants/statusColors";
import { OrderFilterProps } from "@/types/order";

const OrderFilter: React.FC<OrderFilterProps> = ({ filters, setFilters, setPage, warehouses }) => {
  const handleFilterChange = (key: keyof typeof filters, value: string | null) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1); // Reset pagination when filters change
  };

  const resetFilters = () => {
    setFilters({
      status: null,
      warehouseId: null,
      startDate: null,
      endDate: null,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    setPage(1);
  };

  return (
    <div className="flex flex-col p-2 border border-gray-300 rounded-lg bg-gray-100 shadow">
      {/* Status Filter */}
      <select
        onChange={(e) => handleFilterChange("status", e.target.value === "ALL_STATUS" ? null : e.target.value)}
        value={filters.status || "ALL_STATUS"}
        className="my-2 p-2 bg-white border rounded-md shadow"
      >
        <option value="ALL_STATUS">All Status</option>
        {Object.keys(statusColors).map((status) => (
          <option key={status} value={status}>
            {formatStatus(status)}
          </option>
        ))}
      </select>

      {/* Warehouse Filter */}
      <select
        onChange={(e) => handleFilterChange("warehouseId", e.target.value === "ALL_WAREHOUSES" ? null : e.target.value)}
        value={filters.warehouseId || "ALL_WAREHOUSES"}
        className="my-2 p-2 bg-white border rounded-md shadow"
      >
        <option value="ALL_WAREHOUSES">All Warehouses</option>
        {warehouses.map((warehouse) => (
          <option key={warehouse.id} value={warehouse.id}>
            {warehouse.name}
          </option>
        ))}
      </select>

      {/* Date Filters */}
      <input
        type="date"
        value={filters.startDate || ""}
        onChange={(e) => handleFilterChange("startDate", e.target.value || null)}
        className="my-2 p-2 bg-white border rounded-md shadow"
      />
      <input
        type="date"
        value={filters.endDate || ""}
        onChange={(e) => handleFilterChange("endDate", e.target.value || null)}
        className="my-2 p-2 bg-white border rounded-md shadow"
      />

      {/* Sorting Filter */}
      <div className="flex flex-col my-2">
        <label className="text-sm font-semibold">Sort By</label>
        <select
          onChange={(e) => handleFilterChange("sortBy", e.target.value || null)}
          value={filters.sortBy || ""}
          className="p-2 bg-white border rounded-md shadow"
        >
          <option value="">Default</option>
          <option value="createdAt">Date</option>
          <option value="totalPayment">Total Payment</option>
        </select>

        {/* Sort Order */}
        {filters.sortBy && (
          <select
            onChange={(e) => handleFilterChange("sortOrder", e.target.value as "asc" | "desc")}
            value={filters.sortOrder || "asc"}
            className="p-2 mt-2 bg-white border rounded-md shadow"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        )}
      </div>

      {/* Reset Filter Button */}
      <button
        onClick={resetFilters}
        className="mt-4 p-2 bg-red-500 text-white rounded-md shadow hover:bg-red-600"
      >
        Reset Filter
      </button>
    </div>
  );
};

export default OrderFilter;
