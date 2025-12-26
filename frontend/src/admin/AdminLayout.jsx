import { useState } from "react";
import {
  Link,
  useLocation,
  Navigate,
  Outlet,
  useNavigate,
} from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  LogOut,
  Shield,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

const AdminSidebar = ({ isCollapsed, onToggle }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  let navigation = [];

  if (user?.role === "admin") {
    navigation = [
      { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { name: "Products", href: "/admin/products", icon: Package },
      { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
      { name: "Users", href: "/admin/users", icon: Users },
      { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    ];
  } else if (user?.role === "manager") {
    navigation = [
      { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { name: "Products", href: "/admin/products", icon: Package },
      { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    ];
  }

  const isActive = (path) => location.pathname === path;

  return (
    <div
      className={`bg-background border-r border-border text-foreground h-screen flex flex-col transition-all duration-300 shadow-sm ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-rose-500" />
          {!isCollapsed && (
            <div>
              <h2 className="font-bold text-lg text-foreground">Admin Panel</h2>
              <p className="text-xs text-muted-foreground">
                {user?.username || user?.name}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <div className="space-y-1 px-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive(item.href)
                    ? "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className={`h-5 w-5 ${isCollapsed ? "" : "mr-3"}`} />
                {!isCollapsed && item.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button
          onClick={() => {
            logout();
            toast.success("Logged out");
            navigate("/");
          }}
          variant="ghost"
          className={`w-full text-muted-foreground hover:text-foreground hover:bg-muted ${
            isCollapsed ? "px-2" : "justify-start"
          }`}
        >
          <LogOut className={`h-5 w-5 ${isCollapsed ? "" : "mr-3"}`} />
          {!isCollapsed && "Logout"}
        </Button>
      </div>
    </div>
  );
};

const AdminLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-muted border-t-foreground rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying admin privileges...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== "admin" && user.role !== "manager") {
    toast.error("You do not have permission to access this page.");
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen bg-muted/20 dark:bg-background">
      <AdminSidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-background shadow-sm border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="text-sm text-muted-foreground">
              Logged in as: {user.username || user.name} ({user.role})
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6 bg-muted/20 dark:bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;