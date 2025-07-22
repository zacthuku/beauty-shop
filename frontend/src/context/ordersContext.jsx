import { createContext, useContext, useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const ORDER_STATUSES = {
    pending: "Pending",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
  };

  const normalizeOrderData = (order) => {
    return {
      ...order,
      status: order.status?.toLowerCase() || "pending",
      createdAt:
        order.createdAt || order.created_at || new Date().toISOString(),
      total_price: order.total_price || order.total || 0,
      shippingInfo: order.shippingInfo || order.shipping_info || {},
      userId: order.userId || order.user_id,
    };
  };

  const fetchOrders = async (status = "all") => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("beautyApp_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `${API_BASE_URL}/orders/all?status=${status}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const normalizedOrders = data.orders.map(normalizeOrderData);
      setOrders(normalizedOrders);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderById = async (orderId) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const normalizedOrder = normalizeOrderData(data);
      setOrderDetails(normalizedOrder);
      return normalizedOrder;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus.charAt(0).toUpperCase() + newStatus.slice(1),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedOrderData = await response.json();
      const updatedOrder = normalizeOrderData(
        updatedOrderData.order || updatedOrderData
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === parseInt(orderId)
            ? { ...order, status: newStatus.toLowerCase(), ...updatedOrder }
            : order
        )
      );

      if (orderDetails && orderDetails.id === parseInt(orderId)) {
        setOrderDetails({
          ...orderDetails,
          status: newStatus.toLowerCase(),
          ...updatedOrder,
        });
      }

      return updatedOrder;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getOrderCounts = () => {
    return {
      all: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      processing: orders.filter((o) => o.status === "processing").length,
      shipped: orders.filter((o) => o.status === "shipped").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
    };
  };

  const getInvoiceForOrder = async (orderId) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/orders/${orderId}/invoice`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const invoice = await response.json();
      return invoice;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (checkoutData) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/orders/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(checkoutData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const newOrder = normalizeOrderData(data.order || data);

      setOrders((prevOrders) => [newOrder, ...prevOrders]);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const filterOrdersByStatus = (status) => {
    if (status === "all") {
      return orders;
    }
    return orders.filter((order) => order.status === status.toLowerCase());
  };

  useEffect(() => {
    fetchOrders().catch((err) => {
      console.error("Auto-fetch failed:", err);
    });
  }, []);

  return (
    <OrdersContext.Provider
      value={{
        orders,
        orderDetails,
        loading,
        error,
        ORDER_STATUSES,
        fetchOrders,
        fetchOrderById,
        updateOrderStatus,
        getOrderCounts,
        getInvoiceForOrder,
        createOrder,
        filterOrdersByStatus,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrdersProvider");
  }
  return context;
};
