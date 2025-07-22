import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { CheckCircle, Truck, CreditCard, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, loading: authLoading } = useAuth();
  const token = user?.token;
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId || !token) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `http://127.0.0.1:5000/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Order not found");
          } else if (response.status === 403) {
            throw new Error("You are not authorized to view this order");
          } else {
            throw new Error("Failed to fetch order details");
          }
        }

        const orderData = await response.json();
        setOrder(orderData);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user && token) {
      fetchOrder();
    }
  }, [orderId, token, user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{error}</h2>
          <div className="space-x-4">
            <Link to="/orders">
              <Button variant="outline">View Order History</Button>
            </Link>
            <Link to="/products">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Order not found
          </h2>
          <Link to="/orders">
            <Button>View Order History</Button>
          </Link>
        </div>
      </div>
    );
  }

  const deliveryAddress = order.shippingInfo;

  const getOrderStatusSteps = () => {
    const steps = [
      {
        key: "pending",
        label: "Order Confirmed",
        icon: CheckCircle,
        color: "green",
      },
      { key: "processing", label: "Processing", icon: Truck, color: "blue" },
      { key: "shipped", label: "Shipped", icon: Truck, color: "blue" },
      {
        key: "delivered",
        label: "Delivered",
        icon: CheckCircle,
        color: "green",
      },
    ];

    const currentIndex = steps.findIndex(
      (step) => step.key === order.status.toLowerCase()
    );

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Thank you for your purchase. Your order has been received and is
            being processed.
          </p>
          <p className="text-sm text-gray-500">
            Order #{order.id} • Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Order Items
              </h2>
              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 pb-4 border-b last:border-b-0"
                  >
                    <img
                      src={item.image || "/placeholder-image.jpg"}
                      alt={item.name || "Product"}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = "/placeholder-image.jpg";
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {item.name || "Product"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <span className="font-medium text-gray-900">
                      Ksh {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                )) || <p className="text-gray-500">No items found</p>}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Shipping Destination
              </h2>
              <div className="text-gray-600 space-y-2">
                {deliveryAddress ? (
                  <>
                    <p className="font-medium text-gray-900">
                      {`${deliveryAddress.firstName || ""} ${
                        deliveryAddress.lastName || ""
                      }`.trim() || "Customer"}
                    </p>

                    {deliveryAddress.county && (
                      <p>{deliveryAddress.county} County</p>
                    )}

                    {deliveryAddress.city && <p>{deliveryAddress.city} Town</p>}

                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {deliveryAddress.email}
                    </p>
                  </>
                ) : (
                  <p>Delivery address not available</p>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Payment Information
              </h2>
              <div className="flex items-center space-x-3">
                <CreditCard className="h-6 w-6 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Paid with M-Pesa</p>
                  <p className="text-sm text-gray-500">
                    Payment completed successfully
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    Ksh {parseFloat(order.subtotal || order.total).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">
                    {order.shipping > 0
                      ? `Ksh ${order.shipping.toFixed(2)}`
                      : "FREE"}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-3">
                  <span>Total</span>
                  <span>Ksh {parseFloat(order.total).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Order Status */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Order Status
              </h2>
              <div className="space-y-4">
                {getOrderStatusSteps().map((step, index) => {
                  const IconComponent = step.icon;
                  return (
                    <div key={step.key} className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step.completed
                            ? step.color === "green"
                              ? "bg-green-100"
                              : "bg-blue-100"
                            : "bg-gray-100"
                        }`}
                      >
                        <IconComponent
                          className={`h-5 w-5 ${
                            step.completed
                              ? step.color === "green"
                                ? "text-green-600"
                                : "text-blue-600"
                              : "text-gray-400"
                          }`}
                        />
                      </div>
                      <div>
                        <p
                          className={`font-medium ${
                            step.completed ? "text-gray-900" : "text-gray-500"
                          }`}
                        >
                          {step.label}
                        </p>
                        <p className="text-sm text-gray-500">
                          {step.key === "pending" &&
                            step.completed &&
                            "Your order has been received"}
                          {step.key === "processing" &&
                            step.completed &&
                            "We're preparing your order"}
                          {step.key === "shipped" &&
                            step.completed &&
                            "Your order is on its way"}
                          {step.key === "delivered" &&
                            step.completed &&
                            "Order delivered successfully"}
                          {!step.completed &&
                            step.key === "delivered" &&
                            "1-3 business days"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link to="/orders" className="block">
                <Button variant="outline" className="w-full">
                  View Order History
                </Button>
              </Link>

              <Link to="/products" className="block">
                <Button className="w-full bg-rose-500 hover:bg-rose-600">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
