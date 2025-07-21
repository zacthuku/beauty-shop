import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useOrders } from "../context/ordersContext";
import { useProducts } from "../context/ProductsContext";
import { useAuth } from "../context/AuthContext";

const AdminAnalytics = () => {
  const { orders, loading: ordersLoading } = useOrders();
  const { products, loading: productsLoading } = useProducts();
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("30d");
  const [analytics, setAnalytics] = useState({
    revenue: { current: 0, previous: 0, growth: 0 },
    orders: { current: 0, previous: 0, growth: 0 },
    customers: { current: 0, previous: 0, growth: 0 },
    products: { current: 0, previous: 0, growth: 0 },
    revenueChart: [],
    ordersChart: [],
    categoryBreakdown: [],
    topProducts: [],
  });

  useEffect(() => {
    if (!ordersLoading && !productsLoading && user) {
      calculateAnalytics();
    }
  }, [orders, products, ordersLoading, productsLoading, timeRange, user]);

  const calculateAnalytics = () => {
    const filteredOrders = filterOrdersByTimeRange(orders, timeRange);

    const totalRevenue = filteredOrders.reduce(
      (sum, order) => sum + (order.total_price || 0),
      0
    );
    const totalOrders = filteredOrders.length;
    const totalProducts = products.length;

    const previousRevenue = calculatePreviousPeriodRevenue(orders, timeRange);
    const revenueGrowth =
      ((totalRevenue - previousRevenue) / previousRevenue) * 100 || 0;

    const ordersByDate = filteredOrders.reduce((acc, order) => {
      const date = new Date(order.createdAt).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { date, revenue: 0, orders: 0 };
      }
      acc[date].revenue += order.total_price;
      acc[date].orders += 1;
      return acc;
    }, {});

    const revenueChart = Object.values(ordersByDate).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    const categoryBreakdown = products.reduce((acc, product) => {
      const category = product.category || "Uncategorized";
      if (!acc[category]) {
        acc[category] = { name: category, value: 0, sales: 0 };
      }

      acc[category].value += 1;
      return acc;
    }, {});

    const categoryData = Object.values(categoryBreakdown).map((cat) => ({
      ...cat,
      value: (cat.value / totalProducts) * 100,
    }));

    const topProducts = products.slice(0, 5).map((product) => ({
      name: product.name,
      sales: Math.floor(Math.random() * 100) + 50, // Replace with actual sales data
      revenue: product.price * (Math.floor(Math.random() * 100) + 50), // Replace with actual
    }));

    setAnalytics({
      revenue: {
        current: totalRevenue,
        previous: previousRevenue,
        growth: revenueGrowth,
      },
      orders: {
        current: totalOrders,
        previous: Math.floor(totalOrders * 0.8), // Replace with actual previous period data
        growth:
          ((totalOrders - Math.floor(totalOrders * 0.8)) /
            Math.floor(totalOrders * 0.8)) *
          100,
      },
      customers: {
        current: user?.customerCount || 0, // You'll need to fetch actual customer count
        previous: Math.floor((user?.customerCount || 0) * 0.85),
        growth: 15, // Replace with actual
      },
      products: {
        current: totalProducts,
        previous: totalProducts - 10, // Replace with actual
        growth: 10, // Replace with actual
      },
      revenueChart,
      ordersChart: revenueChart,
      categoryBreakdown: categoryData,
      topProducts,
    });
  };

  const filterOrdersByTimeRange = (orders, range) => {
    const now = new Date();
    let cutoffDate;

    switch (range) {
      case "7d":
        cutoffDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case "30d":
        cutoffDate = new Date(now.setDate(now.getDate() - 30));
        break;
      case "90d":
        cutoffDate = new Date(now.setDate(now.getDate() - 90));
        break;
      case "1y":
        cutoffDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        return orders;
    }

    return orders.filter((order) => new Date(order.createdAt) >= cutoffDate);
  };

  const calculatePreviousPeriodRevenue = (orders, range) => {
    const now = new Date();
    let startDate, endDate;

    switch (range) {
      case "7d":
        endDate = new Date(now.setDate(now.getDate() - 7));
        startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 7);
        break;
      case "30d":
        endDate = new Date(now.setDate(now.getDate() - 30));
        startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 30);
        break;
      case "90d":
        endDate = new Date(now.setDate(now.getDate() - 90));
        startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 90);
        break;
      case "1y":
        endDate = new Date(now.setFullYear(now.getFullYear() - 1));
        startDate = new Date(endDate);
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        return 0;
    }

    const previousOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= startDate && orderDate < endDate;
    });

    return previousOrders.reduce(
      (sum, order) => sum + (order.total_price || 0),
      0
    );
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const MetricCard = ({
    title,
    icon: Icon,
    current,
    previous,
    growth,
    format = "number",
  }) => {
    const isPositive = growth >= 0;
    const formattedCurrent =
      format === "currency" ? `Kes ${current.toFixed(2)}` : current;

    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold">{formattedCurrent}</p>
              <div className="flex items-center mt-2">
                {isPositive ? (
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                )}
                <span
                  className={`text-sm ${
                    isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {Math.abs(growth).toFixed(1)}%
                </span>
                <span className="text-sm text-gray-500 ml-1">
                  vs previous period
                </span>
              </div>
            </div>
            <div
              className={`p-3 rounded-full ${
                isPositive ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <Icon
                className={`h-6 w-6 ${
                  isPositive ? "text-green-600" : "text-red-600"
                }`}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (ordersLoading || productsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Track your business performance</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          icon={DollarSign}
          current={analytics.revenue.current}
          previous={analytics.revenue.previous}
          growth={analytics.revenue.growth}
          format="currency"
        />
        <MetricCard
          title="Total Orders"
          icon={ShoppingCart}
          current={analytics.orders.current}
          previous={analytics.orders.previous}
          growth={analytics.orders.growth}
        />
        <MetricCard
          title="Customers"
          icon={Users}
          current={analytics.customers.current}
          previous={analytics.customers.previous}
          growth={analytics.customers.growth}
        />
        <MetricCard
          title="Products"
          icon={Package}
          current={analytics.products.current}
          previous={analytics.products.previous}
          growth={analytics.products.growth}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>
              Daily revenue over the selected period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.revenueChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Orders Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Orders Trend</CardTitle>
            <CardDescription>
              Daily orders over the selected period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.ordersChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>
              Revenue distribution across product categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.categoryBreakdown.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best performing products by sales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topProducts.map((product, index) => (
                <div
                  key={product.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        {product.sales} sales
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      kes {product.revenue.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
