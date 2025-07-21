import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Download,
  Truck,
  Calendar,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem("beautyApp_orders") || "[]");
    const foundOrder = orders.find((o) => o.id === parseInt(orderId));
    setOrder(foundOrder);
  }, [orderId]);

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

  const downloadInvoice = () => {
    const invoiceData = {
      orderId: order.id,
      date: new Date(order.createdAt).toLocaleDateString(),
      customer: `${order.shippingInfo?.firstName ?? ""} ${order.shippingInfo?.lastName ?? ""}`,
      email: order.shippingInfo?.email ?? "N/A",
      items: order.items ?? [],
      subtotal: order.subtotal ?? 0,
      shipping: order.shipping ?? 0,
      tax: order.tax ?? 0,
      total: order.total ?? 0,
    };

    const dataStr = JSON.stringify(invoiceData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice-${order.id}.json`;
    link.click();
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
                {(order.items ?? []).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 pb-4 border-b last:border-b-0"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500 capitalize">
                        {item.category}
                      </p>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <span className="font-medium text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Shipping Address
              </h2>
              <div className="text-gray-600">
                <p>
                  {order.shippingInfo?.firstName} {order.shippingInfo?.lastName}
                </p>
                <p>{order.shippingInfo?.address}</p>
                <p>
                  {order.shippingInfo?.city}, {order.shippingInfo?.state}{" "}
                  {order.shippingInfo?.zipCode}
                </p>
                <p className="mt-2">Email: {order.shippingInfo?.email}</p>
                <p>Phone: {order.shippingInfo?.phone}</p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Payment Method
              </h2>
              <div className="flex items-center space-x-3">
                <CreditCard className="h-6 w-6 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">
                    {order.paymentInfo?.cardNumber ?? "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {order.paymentInfo?.nameOnCard ?? "N/A"}
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
                    ${order.subtotal?.toFixed(2) ?? "0.00"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {order.shipping === 0
                      ? "FREE"
                      : `$${order.shipping?.toFixed(2) ?? "0.00"}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">
                    ${order.tax?.toFixed(2) ?? "0.00"}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-3">
                  <span>Total</span>
                  <span>${order.total?.toFixed(2) ?? "0.00"}</span>
                </div>
              </div>
            </div>

            {/* Order Status */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Order Status
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Order Confirmed</p>
                    <p className="text-sm text-gray-500">
                      Your order has been received
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Truck className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Processing</p>
                    <p className="text-sm text-gray-500">
                      We're preparing your order
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">
                      Estimated Delivery
                    </p>
                    <p className="text-sm text-gray-500">3-5 business days</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={downloadInvoice}
                variant="outline"
                className="w-full flex items-center justify-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Download Invoice</span>
              </Button>

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
