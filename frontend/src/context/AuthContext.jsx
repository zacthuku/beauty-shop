import { createContext, useContext, useState, useEffect } from "react";
const AuthContext = createContext();

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("beautyApp_user");
    const storedToken = localStorage.getItem("beautyApp_token");

    if (storedUser && storedUser !== "undefined" && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);

        setUser({
          ...parsedUser,
          token: storedToken,
        });
      } catch (error) {
        console.warn("Failed to parse stored user:", error);
        clearStorage();
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const clearStorage = () => {
    localStorage.removeItem("beautyApp_user");
    localStorage.removeItem("beautyApp_token");
    localStorage.removeItem("beautyApp_cart");
  };

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Login failed");
      }

      const data = await response.json();

      if (data.user?.blocked) {
        throw new Error("Account suspended");
      }

      const userWithToken = {
        ...data.user,
        token: data.access_token,
      };

      setUser(userWithToken);
      localStorage.setItem("beautyApp_user", JSON.stringify(data.user));
      localStorage.setItem("beautyApp_token", data.access_token);

      return userWithToken;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    clearStorage();
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      const userWithToken = {
        ...data.user,
        token: data.access_token,
      };

      setUser(userWithToken);
      localStorage.setItem("beautyApp_user", JSON.stringify(data.user));
      localStorage.setItem("beautyApp_token", data.access_token);

      return userWithToken;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    login,
    logout,
    register,
    loading,
    isAuthenticated: !!user?.token,
    clearStorage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
