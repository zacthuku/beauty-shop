import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Navigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const token = currentUser?.token;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newManagerEmail, setNewManagerEmail] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const statusColorMap = {
    true: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800",
    false: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-300 dark:border-green-800",
  };

  const roleColorMap = {
    admin: "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-800",
    manager: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800",
    user: "bg-gray-100 dark:bg-zinc-800/50 text-gray-800 dark:text-zinc-400 border border-gray-300 dark:border-zinc-700",
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setUsers(
            data.users
              .filter((user) => user.role !== "admin")
              .map((user) => ({
                _id: user.id,
                name: user.username,
                email: user.email,
                role: user.role,
                isBlocked: user.blocked,
                createdAt: user.created_at,
              }))
          );
        } else {
          toast.error(data.message || "Failed to load users");
        }
      } catch (error) {
        toast.error("Error fetching users");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchUsers();
  }, [token]);

  const blockUser = async (id) => {
    setActionLoading(`block-${id}`);
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}/block`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ blocked: true }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to block user");
        return;
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, isBlocked: true } : user
        )
      );

      toast.success("User blocked successfully");
    } catch (error) {
      console.error("Error blocking user:", error);
      toast.error("Network error while blocking user");
    } finally {
      setActionLoading(null);
    }
  };

  const unblockUser = async (id) => {
    setActionLoading(`unblock-${id}`);
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}/block`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ blocked: false }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to unblock user");
        return;
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, isBlocked: false } : user
        )
      );

      toast.success("User unblocked successfully");
    } catch (error) {
      console.error("Error unblocking user:", error);
      toast.error("Network error while unblocking user");
    } finally {
      setActionLoading(null);
    }
  };

  const createManager = async () => {
    if (!isValidEmail(newManagerEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setCreating(true);

    try {
      const response = await fetch(`${API_BASE_URL}/users/create-manager`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: newManagerEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          toast.error("Only admins can create managers");
        } else if (response.status === 400) {
          toast.error(data.error || "Email is required");
        } else {
          toast.error(data.error || "Failed to create manager");
        }
        return;
      }

      toast.success(data.message || "Manager created successfully");

      setUsers((prevUsers) => [
        ...prevUsers,
        {
          _id: data.user.id,
          name: data.user.username,
          email: data.user.email,
          role: data.user.role,
          isBlocked: data.user.blocked,
          createdAt: data.user.created_at,
        },
      ]);

      setNewManagerEmail("");
    } catch (error) {
      console.error("Error creating manager:", error);
      toast.error("Network error while creating manager");
    } finally {
      setCreating(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return "Unknown";
    }
  };

  if (!currentUser || currentUser.role !== "admin") {
    return <Navigate to="/" />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">Manage system users and permissions</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <Input
          type="email"
          placeholder="Manager email"
          value={newManagerEmail}
          onChange={(e) => setNewManagerEmail(e.target.value)}
          className="max-w-md bg-background"
        />
        <Button
          onClick={createManager}
          disabled={creating || !isValidEmail(newManagerEmail)}
        >
          {creating ? "Creating..." : "Create Manager"}
        </Button>
      </div>

      <div className="rounded-md border border-border max-w-7xl bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u._id}>
                <TableCell className="font-medium text-foreground">{u.name}</TableCell>
                <TableCell className="text-muted-foreground">{u.email}</TableCell>
                <TableCell>
                  <Badge className={roleColorMap[u.role] || roleColorMap.user}>
                    {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{formatDate(u.createdAt)}</TableCell>
                <TableCell>
                  <Badge className={statusColorMap[u.isBlocked]}>
                    {u.isBlocked ? "Blocked" : "Active"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  {u.isBlocked ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => unblockUser(u._id)}
                      disabled={actionLoading === `unblock-${u._id}`}
                      className="hover:bg-green-100 dark:hover:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-800"
                    >
                      {actionLoading === `unblock-${u._id}`
                        ? "Processing..."
                        : "Unblock"}
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => blockUser(u._id)}
                      disabled={actionLoading === `block-${u._id}`}
                      className="bg-amber-50 dark:bg-amber-900/10 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800"
                    >
                      {actionLoading === `block-${u._id}`
                        ? "Processing..."
                        : "Block"}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminUsers;