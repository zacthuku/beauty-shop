import { useState, useEffect, useContext } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductCard from "../components/ProductCard";
import { useProducts } from "../context/ProductsContext";
import Loader from "../components/Loader";

const Products = () => {
  const [loading, setLoading] = useState(true);
  const { products, categories, fetchProducts } = useProducts();
  const { category } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(category || "all");

  const [filteredProducts, setFilteredProducts] = useState(products);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [showFilters, setShowFilters] = useState(false);
  const [gridSize, setGridSize] = useState(4);

  const currentCategory = categories.find((cat) => cat.name === category);
  const pageTitle = currentCategory ? currentCategory.label : "All Products";

  useEffect(() => {
    setLoading(true);
    fetchProducts({
      search: searchQuery,
      category: selectedCategory,
      sort: sortBy,
    }).then(() => setLoading(false));
  }, [searchQuery, selectedCategory, sortBy]);

  useEffect(() => {
    setSelectedCategory(category || "all");
  }, [category]);

  useEffect(() => {
    const sortFn = {
      "price-low": (a, b) => a.price - b.price,
      "price-high": (a, b) => b.price - a.price,
      rating: (a, b) => b.rating - a.rating,
      newest: (a, b) => b.id - a.id,
      name: (a, b) => a.name.localeCompare(b.name),
    };

    const sorted = [...products].sort(sortFn[sortBy]);
    setFilteredProducts(sorted);
  }, [products, sortBy]);

  const resetFilters = () => {
    setSearchQuery("");
    setSortBy("name");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {pageTitle}
            </h1>
            <p className="text-gray-600">
              {filteredProducts.length} product
              {filteredProducts.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>
      </div>

      {/* Main Section */}
      <div className="container mx-auto px-4 py-8 flex gap-8">
        {/* Sidebar Filters */}
        <aside
          className={`w-80 space-y-6 ${
            showFilters ? "block" : "hidden"
          } lg:block`}
        >
          <div className="bg-white rounded-lg p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                Reset
              </Button>
            </div>

            {/* Sort Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sorting" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price-low">Price Low to High</SelectItem>
                  <SelectItem value="price-high">Price High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Radio Buttons */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === "all"}
                    onChange={() => {
                      setSelectedCategory("all");
                      navigate("/products");
                    }}
                  />
                  All Products
                </label>
                {categories.map((cat) => (
                  <label key={cat.name} className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === cat.name}
                      onChange={() => {
                        setSelectedCategory(cat.name);
                        navigate(`/products/${cat.name}`);
                      }}
                      className="mr-2"
                    />
                    {cat.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="flex-1">
          {loading ? (
            <div
              className={`grid gap-6 ${
                gridSize === 3
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              }`}
            >
              {Array(8)
                .fill(0)
                .map((_, i) => (
                  <Loader key={i} />
                ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your filters or search terms
              </p>
              <Button onClick={resetFilters}>Reset Filters</Button>
            </div>
          ) : (
            <div
              className={`grid gap-6 ${
                gridSize === 3
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              }`}
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;
