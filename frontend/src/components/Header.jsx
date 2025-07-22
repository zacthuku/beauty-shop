import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag, User, Menu, X, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductsContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const { categories } = useProducts();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActivePage = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-rose-100 text-rose-800 text-center py-2 text-sm">
        Free shipping on orders over kes 1500 | 30-day returns
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/beauty.svg"
              alt="The Beauty Logo"
              className="w-12 h-12 rounded-full object-cover"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              The Beauty
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/products"
              className={`font-medium transition-colors ${
                isActivePage("/products")
                  ? "text-rose-600"
                  : "text-gray-700 hover:text-rose-600"
              }`}
            >
              All Products
            </Link>
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/products/${category.name}`}
                className={`font-medium transition-colors ${
                  isActivePage(`/products/${category.name}`)
                    ? "text-rose-600"
                    : "text-gray-700 hover:text-rose-600"
                }`}
              >
                {category.label}
              </Link>
            ))}
            {/*admin menu */}
            {user && user.role === "admin" && (
              <>
              <Link
                to="/admin/users"
                className={`font-medium transition-colors ${
                  isActivePage("/admin/users")
                    ? "text-rose-600"
                    : "text-gray-700 hover:text-rose-600"
                }`}
              >
                Users
              </Link>
              <Link
                to="/admin/register-order-manager"
                className={`font-medium transition-colors ${
                  isActivePage("/admin/register-order-manager")
                    ? "text-rose-600"
                    : "text-gray-700 hover:text-rose-600"
                }`}
              >
                Add Manager
              </Link>
              <Link
                to="/purchase-history"
                className={`font-medium transition-colors ${
                  isActivePage("/purchase-history")
                    ? "text-rose-600"
                    : "text-gray-700 hover:text-rose-600"
                }`}
              >
                Purchase History
              </Link>
              <Link
                to="/manage-inventory"
                className={`font-medium transition-colors ${
                  isActivePage("/manage-inventory")
                    ? "text-rose-600"
                    : "text-gray-700 hover:text-rose-600"
                }`}
              >
                Manage Inventory
              </Link>
              </>
            )}
            {/*order manager menu */}
            {user && user.role === "order_manager" && (
              <>
              <Link
                to="manage-inventory"
                className={`font-medium transition-colors ${
                  isActivePage("/manage-inventory")
                    ? "text-rose-600"
                    : "text-gray-700 hover:text-rose-600"
                }`}
              >
                Manage Inventory
              </Link>
              </>)}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-rose-600 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {getCartItemsCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartItemsCount()}
                </span>
              )}
            </Link>
            

            {/* User Menu */}
            {user ? (
              <div className="relative group">
                <Button variant="ghost" className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span className="hidden md:inline">{user.username}</span>
                </Button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Order History
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2 ">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="cursor-pointer">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    size="sm"
                    className="bg-red-500 hover:bg-pink-600 cursor-pointer"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className="font-medium text-gray-700 hover:text-rose-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="font-medium text-gray-700 hover:text-rose-600"
                onClick={() => setIsMenuOpen(false)}
              >
                All Products
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.name}
                  to={`/products/${category.name}`}
                  className="font-medium text-gray-700 hover:text-rose-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
