import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

const CartContext = createContext();

// *************guest cart*******************

const getGuestCart = () => {
  const cart = localStorage.getItem("guest_cart");
  return cart ? JSON.parse(cart) : [];
};

const saveGuestCart = (cart) => {
  localStorage.setItem("guest_cart", JSON.stringify(cart));
};

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeCart = async () => {
      if (user?.token) {
        await fetchCartFromServer();
      } else {
        setCartItems(getGuestCart());
      }
    };
    initializeCart();
  }, [user]);

  const makeRequest = async (url, method = "GET", body = null) => {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(user?.token && { Authorization: `Bearer ${user.token}` }),
      },
      ...(body && { body: JSON.stringify(body) }),
    };

    const response = await fetch(`${API_BASE_URL}/cart${url}`, options);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Request failed with status ${response.status}`
      );
    }
    return await response.json();
  };

  //***************Fetch server cart*****************

  const fetchCartFromServer = async () => {
    if (!user?.token) return;

    setLoading(true);
    try {
      const data = await makeRequest("");
      setCartItems(
        data.map((item) => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.image,
          category: item.product.category,
          quantity: item.quantity,
          cart_item_id: item.id,
          inStock: item.product.inStock,
          rating: item.product.rating,
          reviews: item.product.reviews,
        }))
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  //***********Clear cart*************************

  const clearCart = async () => {
    setLoading(true);
    setError(null);

    try {
      if (user?.token) {
        await makeRequest("/clear", "DELETE");
        await fetchCartFromServer();
      } else {
        saveGuestCart([]);
        setCartItems([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  //************Add to cart*************************

  const addToCart = async (product, quantity = 1) => {
    setLoading(true);
    setError(null);

    try {
      if (user?.token) {
        await makeRequest("", "POST", {
          product_id: product.id,
          quantity,
        });
        await fetchCartFromServer();
      } else {
        const guestCart = getGuestCart();
        const existingItem = guestCart.find((item) => item.id === product.id);

        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          guestCart.push({
            ...product,
            quantity,
            cart_item_id: Date.now(),
          });
        }

        setCartItems([...guestCart]);
        saveGuestCart(guestCart);
      }
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  //***********Remove item from cart***************

  const removeFromCart = async (productId) => {
    setLoading(true);
    setError(null);

    try {
      if (user?.token) {
        const item = cartItems.find((i) => i.id === productId);
        if (item) {
          await makeRequest(`/${item.cart_item_id}`, "DELETE");
          await fetchCartFromServer();
        }
      } else {
        const guestCart = getGuestCart().filter(
          (item) => item.id !== productId
        );
        setCartItems(guestCart);
        saveGuestCart(guestCart);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  //************Update item quantity*************

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    setLoading(true);
    setError(null);

    try {
      if (user?.token) {
        const item = cartItems.find((i) => i.id === productId);
        if (item) {
          await makeRequest(`/${item.cart_item_id}`, "PUT", {
            quantity: newQuantity,
          });
          await fetchCartFromServer();
        }
      } else {
        const guestCart = getGuestCart();
        const item = guestCart.find((i) => i.id === productId);
        if (item) {
          item.quantity = newQuantity;
          setCartItems([...guestCart]);
          saveGuestCart(guestCart);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    cartItems,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal: () =>
      cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    getCartItemsCount: () =>
      cartItems.reduce((count, item) => count + item.quantity, 0),
    clearError: () => setError(null),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
