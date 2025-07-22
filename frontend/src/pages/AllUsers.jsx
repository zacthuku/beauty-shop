import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const AllUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("beautyApp_token");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/users/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data.users || data); // Fallback support
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
    } else {
      setError("No access token. Please log in.");
    }
  }, []);

  const handleBlockToggle = async (userId, shouldBlock) => {
    const confirmToggle = window.confirm(
      shouldBlock ? "Block this user?" : "Unblock this user?"
    );
    if (!confirmToggle) return;

    try {
      const res = await fetch(`http://localhost:5000/users/${userId}/block`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ blocked: shouldBlock }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update block status");
      }

      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === userId ? { ...u, blocked: shouldBlock } : u
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete user "${userName}"? This cannot be undone.`
    );
    if (!confirmed) return;

    try {
      const response = await fetch(`http://localhost:5000/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to delete user");
      }

      await fetchUsers(); // refresh user list
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">All Users</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul className="grid gap-4">
          {users.map((u) => (
            <li
              key={u.id}
              className="border p-4 rounded-lg shadow flex flex-col md:flex-row md:justify-between md:items-center"
            >
              <div>
                <p>
                  <strong>Name:</strong> {u.username}
                </p>
                <p>
                  <strong>Email:</strong> {u.email}
                </p>
                <p>
                  <strong>Role:</strong> {u.role}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {u.blocked ? (
                    <span className="text-red-600 font-semibold">Blocked</span>
                  ) : (
                    <span className="text-green-600 font-semibold">Active</span>
                  )}
                </p>
              </div>
              <div className="flex gap-2 mt-4 md:mt-0">
                <button
                  onClick={() => handleBlockToggle(u.id, !u.blocked)}
                  className={`px-4 py-2 rounded ${
                    u.blocked
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-yellow-500 hover:bg-yellow-600"
                  } text-white`}
                >
                  {u.blocked ? "Unblock" : "Block"}
                </button>
                <button
                  onClick={() => handleDeleteUser(u.id, u.username)}
                  className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AllUsers;
