// CartContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.token) {
      fetchCartFromServer();
    } else {
      setCartItems([]);
      setError(null);
    }
  }, [user]);

  const fetchCartFromServer = async () => {
    if (!user?.token) {
      console.error("No user token available");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/cart", {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP ${res.status}: ${res.statusText}`
        );
      }

      const data = await res.json();

      // Ensure data is an array
      if (!Array.isArray(data)) {
        console.error("Expected array but got:", typeof data, data);
        throw new Error("Invalid response format from server");
      }

      // Transform server data to frontend format
      const items = data.map((item) => ({
        id: item.product?.id || item.product_id,
        name: item.product?.name || "Unknown Product",
        price: item.product?.price || 0,
        image: item.product?.image_url || "",
        category: item.product?.category_name || "Unknown",
        quantity: item.quantity || 1,
        cart_item_id: item.id,
      }));

      setCartItems(items);
    } catch (err) {
      console.error("Failed to load cart:", err.message);
      setError(err.message);
      setCartItems([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    if (!user?.token) {
      setError("Please login to add items to cart");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ product_id: product.id, quantity }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to add to cart`);
      }

      // Refresh cart after successful addition
      await fetchCartFromServer();
    } catch (err) {
      console.error("Add to cart failed:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    const item = cartItems.find((i) => i.id === productId);
    if (!item) return;

    if (!user?.token) {
      setError("Please login to update cart");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `http://localhost:5000/cart/${item.cart_item_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to update quantity`);
      }

      // Refresh cart after successful update
      await fetchCartFromServer();
    } catch (err) {
      console.error("Update quantity failed:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    const item = cartItems.find((i) => i.id === productId);
    if (!item) return;

    if (!user?.token) {
      setError("Please login to remove items from cart");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `http://localhost:5000/cart/${item.cart_item_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to remove item`);
      }

      // Refresh cart after successful removal
      await fetchCartFromServer();
    } catch (err) {
      console.error("Remove failed:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user?.token) {
      setError("Please login to clear cart");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/cart/clear", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to clear cart`);
      }

      setCartItems([]);
    } catch (err) {
      console.error("Clear cart failed:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + (item.price || 0) * (item.quantity || 0),
      0
    );
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    cartItems,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    clearError,
    refreshCart: fetchCartFromServer,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
