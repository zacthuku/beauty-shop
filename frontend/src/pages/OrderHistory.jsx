import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, Package, Download, Eye, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "../context/AuthContext";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      const allOrders = JSON.parse(
        localStorage.getItem("beautyApp_orders") || "[]"
      );
      const userOrders = allOrders.filter((order) => order.userId === user.id);
      setOrders(
        userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );
    }
  }, [user]);

  const downloadInvoice = (order) => {
    const invoiceData = {
      orderId: order.id,
      date: new Date(order.createdAt).toLocaleDateString(),
      customer: `${order.shippingInfo.firstName} ${order.shippingInfo.lastName}`,
      email: order.shippingInfo.email,
      items: order.items,
      subtotal: order.subtotal,
      shipping: order.shipping,
      tax: order.tax,
      total: order.total,
    };

    const dataStr = JSON.stringify(invoiceData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice-${order.id}.json`;
    link.click();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (!user || orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-6">📦</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No orders yet
          </h2>
          <p className="text-gray-600 mb-8">
            You haven't placed any orders yet. Start shopping to see your order
            history here.
          </p>
          <Link to="/products">
            <Button size="lg" className="bg-rose-500 hover:bg-rose-600">
              <ShoppingBag className="h-5 w-5 mr-2" />
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order History
          </h1>
          <p className="text-gray-600">
            Track your orders and download invoices
          </p>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-sm border p-6"
            >
              {/* Order Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div className="flex items-center space-x-4 mb-4 md:mb-0">
                  <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                    <Package className="h-6 w-6 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order.id}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      <span>
                        {order.items.length} item
                        {order.items.length !== 1 ? "s" : ""}
                      </span>
                      <span className="font-medium text-gray-900">
                        kes {order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </Badge>

                  <div className="flex items-center space-x-2">
                    <Link to={`/order-confirmation/${order.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </Link>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadInvoice(order)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Invoice
                    </Button>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {order.items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity} • ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="flex items-center justify-center text-sm text-gray-500">
                      +{order.items.length - 3} more item
                      {order.items.length - 3 !== 1 ? "s" : ""}
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Info */}
              <div className="border-t pt-4 mt-4">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Shipping to:</span>{" "}
                  {order.shippingInfo.firstName} {order.shippingInfo.lastName},{" "}
                  {order.shippingInfo.city}, {order.shippingInfo.state}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Shopping */}
        <div className="text-center mt-12">
          <Link to="/products">
            <Button size="lg" className="bg-rose-500 hover:bg-rose-600">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
