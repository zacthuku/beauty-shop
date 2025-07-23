import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Navigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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

const API_BASE_URL = `${import.meta.env.VITE_SERVER_URL}/users`;

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const token = currentUser?.token;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newManagerEmail, setNewManagerEmail] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const statusColorMap = {
    true: "bg-red-100 text-red-800 border border-red-300",
    false: "bg-green-100 text-green-800 border border-green-300",
  };

  const roleColorMap = {
    admin: "bg-purple-100 text-purple-800 border border-purple-300",
    manager: "bg-blue-100 text-blue-800 border border-blue-300",
    user: "bg-gray-100 text-gray-800 border border-gray-300",
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}`, {
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

  // Block user
  const blockUser = async (id) => {
    setActionLoading(`block-${id}`);
    try {
      const res = await fetch(`${API_BASE_URL}/${id}/block`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ blocked: true }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("User blocked");
        setUsers((prev) =>
          prev.map((u) => (u._id === id ? { ...u, isBlocked: true } : u))
        );
      } else {
        toast.error(data.message || "Block failed");
      }
    } catch (error) {
      toast.error("Error blocking user");
    } finally {
      setActionLoading(null);
    }
  };

  const unblockUser = async (id) => {
    setActionLoading(`unblock-${id}`);
    try {
      const res = await fetch(`${API_BASE_URL}/${id}/block`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ blocked: false }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("User unblocked");
        setUsers((prev) =>
          prev.map((u) => (u._id === id ? { ...u, isBlocked: false } : u))
        );
      } else {
        toast.error(data.message || "Unblock failed");
      }
    } catch (error) {
      toast.error("Error unblocking user");
    } finally {
      setActionLoading(null);
    }
  };

  const createManager = async () => {
    if (!isValidEmail(newManagerEmail)) {
      toast.error("Enter a valid email address");
      return;
    }

    setCreating(true);
    try {
      const res = await fetch(`${API_BASE_URL}/register/order_manager`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: newManagerEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Manager created");
        setUsers((prev) => [
          ...prev,
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
      } else {
        toast.error(data.message || "Create failed");
      }
    } catch (error) {
      toast.error("Error creating manager");
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
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage system users and permissions</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <Input
          type="email"
          placeholder="Manager email"
          value={newManagerEmail}
          onChange={(e) => setNewManagerEmail(e.target.value)}
          className="max-w-md"
        />
        <Button
          onClick={createManager}
          disabled={creating || !isValidEmail(newManagerEmail)}
        >
          {creating ? "Creating..." : "Create Manager"}
        </Button>
      </div>

      <div className="rounded-md border max-w-7xl">
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
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <Badge className={roleColorMap[u.role] || roleColorMap.user}>
                    {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(u.createdAt)}</TableCell>
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
                      className="hover:bg-green-100 text-green-700 border-green-300"
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
                      className="bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-300 hover:text-amber-800"
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
