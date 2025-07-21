import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderHistory from "./pages/OrderHistory";
import Profile from "./pages/Profile";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Loader from "./components/Loader";
import AllUsers from "./pages/AllUsers";
import RegisterOrderManager from "./pages/RegisterOrderManager";
import PurchaseHistory from "./pages/PurchaseHistory";
import ManageInventory from "./pages/ManageInventory";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), 1200);
    const removeLoader = setTimeout(() => setLoading(false), 1500);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeLoader);
    };
  }, []);

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen bg-rose-50 transition-opacity duration-500 ${
          fadeOut ? "opacity-0" : "opacity-100"
        }`}
      >
        <Loader />
      </div>
    );
  }

  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-rose-50">
            <Header />
            <main className="min-h-screen">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:category" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/order-confirmation/:orderId"
                  element={<OrderConfirmation />}
                />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<Navigate to="/" />} />
                <Route path="/admin/users" element={<AllUsers />} />
                <Route path="/admin/register-order-manager" element={<RegisterOrderManager />} />
                <Route path="/purchase-history" element={<PurchaseHistory />} />
                <Route path="/manage-inventory" element={<ManageInventory />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
        <Toaster position="top-right" richColors />
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
