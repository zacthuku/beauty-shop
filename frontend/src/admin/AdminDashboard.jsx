import { useState, useEffect } from "react";

// Icon components
const Package = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
    />
  </svg>
);

const ShoppingCart = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6m-8 0V9a2 2 0 012-2h4a2 2 0 012 2v4.01"
    />
  </svg>
);

const Users = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-.5a4 4 0 110-5.292M21 21v-1a4 4 0 00-3-3.87"
    />
  </svg>
);

const TrendingUp = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
    />
  </svg>
);

const Eye = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const DollarSign = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
    />
  </svg>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    topProducts: [],
    recentOrders: [],
  });

  // Sample products data for demonstration
  const products = [
    {
      id: 1,
      name: "Hydrating Face Serum",
      price: 29.99,
      image:
        "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200&h=200&fit=crop",
    },
    {
      id: 2,
      name: "Vitamin C Brightening Cream",
      price: 34.99,
      image:
        "https://images.unsplash.com/photo-1556228578-dd29e4b19216?w=200&h=200&fit=crop",
    },
    {
      id: 3,
      name: "Gentle Exfoliating Scrub",
      price: 24.99,
      image:
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop",
    },
    {
      id: 4,
      name: "Anti-Aging Night Cream",
      price: 45.99,
      image:
        "https://images.unsplash.com/photo-1556228720-da4ac52ba3cd?w=200&h=200&fit=crop",
    },
    {
      id: 5,
      name: "Refreshing Toner",
      price: 19.99,
      image:
        "https://images.unsplash.com/photo-1556228641-27ade4ef7e6c?w=200&h=200&fit=crop",
    },
  ];

  useEffect(() => {
    // Simulate loading dashboard data
    const loadDashboardData = () => {
      // Simulate orders and users data
      const orders = [
        {
          id: "ORD-001",
          customerName: "Sarah Johnson",
          total: 89.97,
          items: [{ name: "Face Serum" }, { name: "Night Cream" }],
          createdAt: Date.now() - 86400000,
        },
        {
          id: "ORD-002",
          customerName: "Mike Chen",
          total: 54.98,
          items: [{ name: "Vitamin C Cream" }],
          createdAt: Date.now() - 172800000,
        },
        {
          id: "ORD-003",
          customerName: "Emma Davis",
          total: 24.99,
          items: [{ name: "Exfoliating Scrub" }],
          createdAt: Date.now() - 259200000,
        },
      ];
      const users = Array(127)
        .fill({})
        .map((_, i) => ({ id: i + 1 }));

      // Calculate total revenue
      const totalRevenue = orders.reduce(
        (sum, order) => sum + (order.total || 0),
        0
      );

      // Get top products with simulated data
      const topProducts = products.slice(0, 5).map((product) => ({
        ...product,
        sales: Math.floor(Math.random() * 100) + 10,
        views: Math.floor(Math.random() * 500) + 50,
      }));

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalUsers: users.length,
        totalRevenue,
        topProducts,
        recentOrders: orders.slice(-5).reverse(),
      });
    };

    loadDashboardData();
  }, []);

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      description: "Active products in catalog",
      color: "text-blue-600",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      description: "Orders received",
      color: "text-green-600",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      description: "Registered customers",
      color: "text-purple-600",
    },
    {
      title: "Revenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      description: "Total revenue generated",
      color: "text-emerald-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with products page styling */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Welcome to your admin control panel</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-sm border"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-700">
                    {stat.title}
                  </h3>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <p className="text-xs text-gray-600">{stat.description}</p>
              </div>
            );
          })}
        </div>

        {/* Top Products & Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Products */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-5 w-5 text-gray-900" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Top Products
                </h2>
              </div>
              <p className="text-sm text-gray-600">
                Best performing products by sales
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {stats.topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-600">
                        <span className="flex items-center">
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          {product.sales} sales
                        </span>
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {product.views} views
                        </span>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      ${product.price}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex items-center space-x-2 mb-2">
                <ShoppingCart className="h-5 w-5 text-gray-900" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Orders
                </h2>
              </div>
              <p className="text-sm text-gray-600">Latest customer orders</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {stats.recentOrders.length > 0 ? (
                  stats.recentOrders.map((order, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Order #{order.id || `ORD-${index + 1}`}
                        </p>
                        <p className="text-xs text-gray-600">
                          {order.customerName || "Customer"} •{" "}
                          {new Date(
                            order.createdAt || Date.now()
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          ${(order.total || 0).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-600">
                          {order.items?.length || 1} items
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-600 text-center py-4">
                    No orders yet
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
