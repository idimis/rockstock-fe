"use client";

import { useEffect, useState } from "react";
import Header from "@/components/common/Header";
import Navbar from "@/components/common/Navbar";
import UserSidebarPanel from "@/components/common/UserSidebar";
import Footer from "@/components/common/Footer";
import { getAccessToken } from "@/lib/utils/auth";
import { useRouter } from "next/navigation";
import { Order, OrderFilterProps, OrderItem } from "@/types/order";
import { Warehouse } from "@/types/warehouse";
import { decodeToken } from "@/lib/utils/decodeToken";
import { fetchOrders, fetchOrderItems, updateOrderStatus } from "@/services/orderService";
import OrderDetailPopup from "@/components/orders/OrderDetailPopup";
import OrderCard from "@/components/orders/OrderCard";
import { fetchWarehouses } from "@/services/warehouseService";
import OrderFilter from "@/components/orders/OrderFilter";

const OrdersPage = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoadingOrderItems, setIsLoadingOrderItems] = useState(false);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);

  // Filters, Pagination & Sorting
  const [filters, setFilters] = useState<OrderFilterProps["filters"]>({ 
    status: null, 
    startDate: null, 
    endDate: null, 
    warehouseId: null,
    sortBy: "createdAt",
    sortOrder: "desc"
  });
  const [page, setPage] = useState(1);
  const [size] = useState(10); // Default page size
  const [totalPages, setTotalPages] = useState(1);

  // Authorization
  useEffect(() => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      router.replace("/login");
      return;
    }
    
    const decoded = decodeToken(accessToken);
    if (!decoded || decoded.roles === "Customer") {
      router.replace(decoded ? "/unauthorized" : "/login");
    }
  }, [router]);

  // Fetch Orders
  useEffect(() => {
    fetchOrders(filters.status, page, size, `${filters.sortBy},${filters.sortOrder}`, filters.startDate, filters.endDate, filters.warehouseId)
      .then(({ orders, totalPages }) => {
        setOrders(orders);
        setTotalPages(totalPages);
      })
      .catch(() => console.error("Failed to fetch orders"));
  }, [filters, page, size]);
  
  useEffect(() => {
    fetchWarehouses()
      .then(({ warehouses }) => setWarehouses(warehouses))
      .catch(() => console.error("Failed to fetch warehouses"));
  }, []);

  const handleOpenOrderDetail = async (order: Order) => {
    setSelectedOrder(order);
    setIsLoadingOrderItems(true);
    try {
      const items = await fetchOrderItems(order.orderId);
      setOrderItems(items);
    } catch {
      console.error("Failed to fetch order items");
    } finally {
      setIsLoadingOrderItems(false);
    }
    setShowPopup(true);
  };

  const handleCloseOrderDetail = () => {
    setOrderItems([]);
    setSelectedOrder(null);
    setShowPopup(false);
  }

  const handleUploadPaymentProof = (order: Order) => {
    setSelectedOrder(order);
    router.push(`/payments/manual/${order.orderId}`);
  }

  const handleCompleteOrder = async (order: Order) => {
    try {
      await updateOrderStatus({}, order.orderId, "COMPLETE");
      console.log("Order completed successfully");
    } catch {
      console.error("Failed to complete the order");
    }
  }

  const handleCancelOrder = async (order: Order) => {
    try {
      await updateOrderStatus({}, order.orderId, "CANCELED");
      console.log("Order canceled successfully");
    } catch {
      console.error("Failed to cancel the order");
    }
  }

  return (
    <div>
      <Header />
      <Navbar />
      <div className="flex text-black">
        <UserSidebarPanel />
        <main className="p-2 md:p-6 flex-1">
          <div className="mb-4">
            <h1 className="text-2xl font-semibold">My Orders</h1>
            <p>View and manage your past orders here.</p>
          </div>

          <OrderFilter filters={filters} setFilters={setFilters} setPage={setPage} warehouses={warehouses} />

          {/* Order List */}
          <div>
            {orders.length > 0 ? (
              orders.map((order) => (
                <OrderCard key={order.orderId} 
                  order={order} 
                  onOpenDetail={handleOpenOrderDetail} 
                  onUploadPaymentProof={handleUploadPaymentProof}
                  onComplete={handleCompleteOrder}
                  onCancel={handleCancelOrder} 
                />
              ))
            ) : (
              <p>There are no orders in this status!</p>
            )}
          </div>
          
          {/* Pagination */}
          <div className="flex justify-center mt-4">
            <button 
              disabled={page === 1} 
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className={`px-4 py-2 mx-2 ${page === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"}`}
            >
              Previous
            </button>

            <span className="text-lg font-semibold px-4">{page} / {totalPages}</span>

            <button 
              disabled={page === totalPages} 
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              className={`px-4 py-2 mx-2 ${page === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"}`}
            >
              Next
            </button>
          </div>
        </main>
      </div>
      <Footer />

      {showPopup && selectedOrder && (
        <OrderDetailPopup
          order={selectedOrder}
          orderItems={orderItems}
          isLoading={isLoadingOrderItems}
          onClose={handleCloseOrderDetail}
        />
      )}
    </div>
  );
};

export default OrdersPage;
