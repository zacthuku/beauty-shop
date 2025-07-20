import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../context/AuthContext";

const AdminSidebar = ({ isCollapsed }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div
      className={`bg-gradient-to-b from-rose-900 to-pink-900 text-white h-screen flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-pink-800">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-rose-200" />
          {!isCollapsed && (
            <div>
              <h2 className="font-bold text-lg">Admin Panel</h2>
              <p className="text-xs text-rose-200/80">
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
                  location.pathname === item.href
                    ? "bg-rose-700/50 text-white"
                    : "text-rose-100 hover:bg-pink-800/50 hover:text-white"
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
      <div className="p-4 border-t border-pink-800">
        <Button
          onClick={() => {
            logout();
            navigate("/");
          }}
          variant="ghost"
          className={`w-full text-rose-100 hover:text-white hover:bg-pink-800/50 ${
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

export default AdminSidebar;
