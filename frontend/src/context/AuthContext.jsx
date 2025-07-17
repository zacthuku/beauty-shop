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
    // Check if user is logged in on app start
    const storedUser = localStorage.getItem("beautyApp_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("beautyApp_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("beautyApp_user");
    localStorage.removeItem("beautyApp_cart");
  };

  const register = (userData) => {
    // In a real app, this would be an API call
    const newUser = {
      id: Date.now(),
      username: userData.username,
      email: userData.email,
      createdAt: new Date().toISOString(),
    };

    // Store user in localStorage (simulating backend storage)
    const existingUsers = JSON.parse(
      localStorage.getItem("beautyApp_users") || "[]"
    );
    existingUsers.push({ ...newUser, password: userData.password });
    localStorage.setItem("beautyApp_users", JSON.stringify(existingUsers));

    login(newUser);
    return newUser;
  };

  const authenticateUser = (username, password) => {
    const existingUsers = JSON.parse(
      localStorage.getItem("beautyApp_users") || "[]"
    );
    const user = existingUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      login(userWithoutPassword);
      return userWithoutPassword;
    }
    return null;
  };

  const value = {
    user,
    login,
    logout,
    register,
    authenticateUser,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
