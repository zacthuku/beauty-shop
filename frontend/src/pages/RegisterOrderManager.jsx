import { useState } from "react";
import { useAuth } from "@/context/AuthContext"; // adjust the path if different
import { Button } from "@/components/ui/button";

const RegisterOrderManager = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("beautyApp_token");

      const response = await fetch("http://localhost:5000/users/register/order_manager", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to register order manager");
      }

      setMessage(data.message);
      setEmail(""); // Clear input
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-4 max-w-md">
      <h2 className="text-xl font-bold">Register Order Manager</h2>
      <input
        type="email"
        className="border p-2 w-full"
        placeholder="Enter order manager email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button onClick={handleRegister} disabled={loading || !email}>
        {loading ? "Registering..." : "Register & Send Email"}
      </Button>
      {message && <p className="text-sm text-green-600">{message}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default RegisterOrderManager;
