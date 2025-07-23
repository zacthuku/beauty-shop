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
import { ProductsProvider } from "./context/ProductsContext";
import { OrdersProvider } from "./context/ordersContext";
import Loader from "./components/Loader";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import BlockedUserPage from "./context/BlockedUserPage";

import AdminProducts from "./admin/AdminProducts";
import AdminOrders from "./admin/AdminOrders";
import AdminUsers from "./admin/AdminUsers";
import AdminAnalytics from "./admin/AdminAnalytics";

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
        <ProductsProvider>
          <OrdersProvider>
            <BrowserRouter>
              <div className="min-h-screen bg-rose-50">
                <Routes>
                  <Route path="/admin/*" element={null} />
                  <Route path="*" element={<Header />} />
                </Routes>

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
                    <Route path="/blocked" element={<BlockedUserPage />} />
                    <Route
                      path="/order-confirmation/:orderId"
                      element={<OrderConfirmation />}
                    />
                    <Route path="/orders" element={<OrderHistory />} />
                    <Route path="/profile" element={<Profile />} />

                    {/* Admin routes */}
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route
                        index
                        element={<Navigate to="/admin/dashboard" replace />}
                      />
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="products" element={<AdminProducts />} />
                      <Route path="orders" element={<AdminOrders />} />
                      <Route path="users" element={<AdminUsers />} />
                      <Route path="analytics" element={<AdminAnalytics />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </main>

                <Routes>
                  <Route path="/admin/*" element={null} />
                  <Route path="*" element={<Footer />} />
                </Routes>
              </div>
              <Toaster position="bottom-right" richColors />
            </BrowserRouter>
          </OrdersProvider>
        </ProductsProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
