import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Lock, MapPin } from "lucide-react";

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

  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    town: "",
    country: "Kenya",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
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

  const handlePaymentChange = (e) => {
    let value = e.target.value;

    if (e.target.name === "cardNumber") {
      value = value
        .replace(/\s/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim();
      if (value.length > 19) return;
    }

    if (e.target.name === "expiryDate") {
      value = value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2");
      if (value.length > 5) return;
    }

    if (e.target.name === "cvv") {
      value = value.replace(/\D/g, "");
      if (value.length > 4) return;
    }

    setPaymentInfo({
      ...paymentInfo,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const order = {
        id: Date.now(),
        userId: user?.id || null,
        items: cartItems,
        subtotal,
        shipping,
        total,
        shippingInfo,
        paymentInfo: {
          ...paymentInfo,
          cardNumber: "**** **** **** " + paymentInfo.cardNumber.slice(-4),
        },
        status: "confirmed",
        createdAt: new Date().toISOString(),
      };

      const existingOrders = JSON.parse(
        localStorage.getItem("beautyApp_orders") || "[]"
      );
      existingOrders.push(order);
      localStorage.setItem("beautyApp_orders", JSON.stringify(existingOrders));

      clearCart();

      toast({
        title: "Order placed successfully!",
        description:
          "Thank you for your purchase. You will receive an email confirmation shortly.",
      });

      navigate(`/order-confirmation/${order.id}`);
    } catch (error) {
      toast({
        title: "Payment failed",
        description:
          "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
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
            {/* Shipping & Payment Info */}
            <div className="space-y-8">
              {/* Shipping Info */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-rose-500" />
                  Shipping Information
                </h2>

                {/* Form fields */}
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="First Name"
                    name="firstName"
                    value={shippingInfo.firstName}
                    onChange={handleShippingChange}
                  />
                  <InputField
                    label="Last Name"
                    name="lastName"
                    value={shippingInfo.lastName}
                    onChange={handleShippingChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <InputField
                    label="Email"
                    name="email"
                    type="email"
                    value={shippingInfo.email}
                    onChange={handleShippingChange}
                  />
                  <InputField
                    label="Phone"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleShippingChange}
                    placeholder="+2547..."
                  />
                </div>

                <div className="mt-4">
                  <InputField
                    label="Address"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleShippingChange}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      County
                    </label>
                    <Select
                      value={shippingInfo.city}
                      onValueChange={(value) =>
                        setShippingInfo({ ...shippingInfo, city: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select county" />
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
                    <InputField
                      label="Town"
                      name="town"
                      value={shippingInfo.town}
                      onChange={handleShippingChange}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-rose-500" />
                  Payment Information
                </h2>

                <div className="space-y-4">
                  <InputField
                    label="Card Number"
                    name="cardNumber"
                    value={paymentInfo.cardNumber}
                    onChange={handlePaymentChange}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField
                      label="Expiry Date"
                      name="expiryDate"
                      value={paymentInfo.expiryDate}
                      onChange={handlePaymentChange}
                    />
                    <InputField
                      label="CVV"
                      name="cvv"
                      value={paymentInfo.cvv}
                      onChange={handlePaymentChange}
                    />
                  </div>
                  <InputField
                    label="Name on Card"
                    name="nameOnCard"
                    value={paymentInfo.nameOnCard}
                    onChange={handlePaymentChange}
                  />
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center">
                  <Lock className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm text-gray-600">
                    Your payment information is secure and encrypted
                  </span>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <OrderSummary
              cartItems={cartItems}
              subtotal={subtotal}
              shipping={shipping}
              total={total}
              isProcessing={isProcessing}
            />
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
