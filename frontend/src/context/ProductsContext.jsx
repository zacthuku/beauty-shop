// src/contexts/ProductsContext.js
import { createContext, useContext, useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(
        `${API_BASE_URL}/products${query ? `?${query}` : ""}`
      );
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/products/categories`);
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await fetchProducts();
        await fetchCategories();
      } catch (error) {
        console.error("Failed to load products or categories", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getProductById = (id) => products.find((p) => p.id === Number(id));

  const searchProducts = (query, category = "all") => {
    return products.filter(
      (product) =>
        (category === "all" || product.category === category) &&
        (product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()))
    );
  };

  const filterProductsByPrice = (min, max) => {
    return products.filter((p) => p.price >= min && p.price <= max);
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        categories,
        loading,
        fetchProducts,
        fetchCategories,
        getProductById,
        searchProducts,
        filterProductsByPrice,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => useContext(ProductsContext);
