import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

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
    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.warn("Failed to parse stored user:", error);
        localStorage.removeItem("beautyApp_user");
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Login failed");
      }

      const data = await response.json();

      setUser(data.user);
      localStorage.setItem("beautyApp_user", JSON.stringify(data.user));
      localStorage.setItem("beautyApp_token", data.access_token);

      return data.user;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("beautyApp_user");
    localStorage.removeItem("beautyApp_token");
    localStorage.removeItem("beautyApp_cart");
  };

  const register = async (userData) => {
    const response = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Registration failed");
    }

    localStorage.setItem("beautyApp_user", JSON.stringify(data.user));
    localStorage.setItem("beautyApp_token", data.access_token);
    setUser(data.user);

    return data.user;
  };

  const value = {
    user,
    login,
    logout,
    register,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
