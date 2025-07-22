import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Smartphone, Lock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [mpesaPromptSent, setMpesaPromptSent] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    address: "",
    county: "",
    city: "",
    country: "Kenya",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    if (cartItems.length === 0) {
      navigate("/cart");
    }
  }, [user, navigate, cartItems]);

  const [mpesaInfo, setMpesaInfo] = useState({
    phoneNumber: "",
  });

  const subtotal = getCartTotal();
  const shipping = subtotal >= 1500 ? 0 : 150;
  const total = subtotal + shipping;

  const handleShippingChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleMpesaChange = (e) => {
    let value = e.target.value;

    if (e.target.name === "phoneNumber") {
      // Only allow digits
      value = value.replace(/\D/g, "");

      // Limit to 10 digits for 07xxxxxxxx format
      if (value.length > 10) return;
    }

    setMpesaInfo({
      ...mpesaInfo,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mpesaInfo.phoneNumber.match(/^07\d{8}$/)) {
      toast.error("Invalid phone number", {
        description: "Please enter a valid phone number in format 07XXXXXXXX",
      });
      return;
    }

    setIsProcessing(true);
    setMpesaPromptSent(true);

    try {
      const toastId = toast.loading("Processing M-Pesa payment...", {
        description: "Please check your phone and enter your M-Pesa PIN.",
      });

      await new Promise((resolve) => setTimeout(resolve, 3000));

      const mockTransactionId = `MPX${Date.now()}${Math.floor(
        Math.random() * 1000
      )}`;

      const res = await fetch("http://localhost:5000/orders/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          shipping_info: shippingInfo,
          payment_method: "mpesa",
          transaction_id: mockTransactionId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Order failed");
      }

      const order = await res.json();
      const orderId = order.order?.id || order.id;

      if (!orderId) {
        throw new Error("Order ID not received from server");
      }

      clearCart();

      toast.dismiss(toastId);
      toast.success("Payment successful!", {
        description:
          "Your order has been placed successfully. You will receive an SMS confirmation.",
      });

      navigate(`/order-confirmation/${orderId}`);
    } catch (error) {
      toast.error("Payment failed", {
        description:
          error.message || "There was an error processing your payment.",
      });
      setMpesaPromptSent(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const counties = [
    "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo Marakwet", "Embu", "Garissa",
    "Homa Bay", "Isiolo", "Kajiado", "Kakamega", "Kericho", "Kiambu", "Kilifi",
    "Kirinyaga", "Kisii", "Kisumu", "Kitui", "Kwale", "Laikipia", "Lamu",
    "Machakos", "Makueni", "Mandera", "Marsabit", "Meru", "Migori", "Mombasa",
    "Murang'a", "Nairobi", "Nakuru", "Nandi", "Narok", "Nyamira", "Nyandarua",
    "Nyeri", "Samburu", "Siaya", "Taita Taveta", "Tana River", "Tharaka Nithi",
    "Trans Nzoia", "Turkana", "Uasin Gishu", "Vihiga", "Wajir", "West Pokot",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Shipping Info */}
            <div className="space-y-8">
              {/* Shipping Info */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-green-600" />
                  Shipping Information
                </h2>

                {/* Form fields */}
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    name="firstName"
                    required
                    value={shippingInfo.firstName}
                    onChange={handleShippingChange}
                    placeholder="First Name"
                  />
                  <Input
                    name="lastName"
                    required
                    value={shippingInfo.lastName}
                    onChange={handleShippingChange}
                    placeholder="Last Name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Input
                    name="email"
                    type="email"
                    required
                    value={shippingInfo.email}
                    onChange={handleShippingChange}
                    placeholder="Email"
                  />
                  <Input
                    name="phone"
                    required
                    value={shippingInfo.phone}
                    onChange={handleShippingChange}
                    placeholder="+2547..."
                  />
                </div>

                <Input
                  name="address"
                  required
                  value={shippingInfo.address}
                  onChange={handleShippingChange}
                  placeholder="Address"
                  className="mt-4"
                />

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <Select
                      value={shippingInfo.county}
                      onValueChange={(value) =>
                        setShippingInfo({ ...shippingInfo, county: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select County" />
                      </SelectTrigger>
                      <SelectContent>
                        {counties.map((county) => (
                          <SelectItem key={county} value={county}>
                            {county}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Input
                      name="city"
                      required
                      value={shippingInfo.city}
                      onChange={handleShippingChange}
                      placeholder="Town"
                    />
                  </div>
                </div>
              </div>

              {/* M-Pesa Payment Info */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <Smartphone className="h-5 w-5 mr-2 text-green-600" />
                  M-Pesa Payment
                </h2>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    M-Pesa Phone Number
                  </label>
                  <Input
                    name="phoneNumber"
                    required
                    value={mpesaInfo.phoneNumber}
                    onChange={handleMpesaChange}
                    placeholder="07XXXXXXXX"
                    className="text-lg"
                  />
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                      M
                    </div>
                    <span className="font-semibold text-green-800">M-PESA</span>
                  </div>
                  <p className="text-sm text-green-700">
                    • Enter your Safaricom number (07XXXXXXXX format)
                  </p>
                  <p className="text-sm text-green-700">
                    • You'll receive an STK push prompt on your phone
                  </p>
                  <p className="text-sm text-green-700">
                    • Enter your M-Pesa PIN to complete payment
                  </p>
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center">
                  <Lock className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm text-gray-600">
                    Your payment is secured by Safaricom M-Pesa
                  </span>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-lg p-6 shadow-sm sticky top-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
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
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        Ksh {item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      Ksh {subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? "FREE" : `Ksh ${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-3">
                    <span>Total</span>
                    <span>Ksh {total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full mt-6 bg-rose-500 hover:bg-green-600 text-white py-4 text-lg cursor-pointer"
                >
                  {isProcessing
                    ? mpesaPromptSent
                      ? "Processing..."
                      : "Successfull."
                    : `Pay with M-Pesa - Ksh ${total.toFixed(2)}`}
                </Button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By placing your order, you agree to our Terms of Service
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const InputField = ({ label, name, value, onChange, type = "text", placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <Input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required
      placeholder={placeholder}
    />
  </div>
);

const OrderSummary = ({ cartItems, subtotal, shipping, total, isProcessing }) => (
  <div className="bg-white rounded-lg p-6 shadow-sm sticky top-4">
    <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

    <div className="space-y-4 mb-6">
      {cartItems.map((item) => (
        <div key={item.id} className="flex items-center space-x-3">
          <img
            src={item.image}
            alt={item.name}
            className="w-12 h-12 object-cover rounded-lg"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
          </div>
          <span className="text-sm font-medium text-gray-900">
            Kes {item.price * item.quantity}
          </span>
        </div>
      ))}
    </div>

    <div className="space-y-3 border-t pt-4">
      <SummaryLine label="Subtotal" value={`Kes ${subtotal.toFixed(2)}`} />
      <SummaryLine label="Shipping" value={shipping === 0 ? "FREE" : `Kes ${shipping.toFixed(2)}`} />
      <div className="flex justify-between text-lg font-bold border-t pt-3">
        <span>Total</span>
        <span>Kes {total.toFixed(2)}</span>
      </div>
    </div>

    <Button
      type="submit"
      disabled={isProcessing}
      className="w-full mt-6 bg-rose-500 hover:bg-rose-600 text-white py-4 text-lg"
    >
      {isProcessing ? "Processing..." : `Place Order - Ksh ${total.toFixed(2)}`}
    </Button>

    <p className="text-xs text-gray-500 text-center mt-4">
      By placing your order, you agree to our Terms of Service
    </p>
  </div>
);

const SummaryLine = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="text-gray-600">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default Checkout;
