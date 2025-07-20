
import { useEffect, useState } from "react";

function PurchaseHistory() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/orders/history", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("beautyApp_token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch purchase history");
        return res.json();
      })
      .then((data) => setOrders(data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Purchase History</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {orders.length === 0 ? (
        <p>No purchase history found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-xl p-4 shadow bg-white">
              <div className="flex justify-between">
                <span className="font-semibold">Order #{order.id}</span>
                <span className="text-sm text-gray-600">{new Date(order.created_at).toLocaleString()}</span>
              </div>
              <div className="text-sm mt-2">
                <p>Status: <span className="font-medium">{order.status}</span></p>
                {order.user && (
                  <p>User: <span className="text-blue-600">{order.user.username}</span></p>
                )}
              </div>
              {order.items && (
                <ul className="mt-3 text-sm list-disc list-inside">
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.product_name} × {item.quantity}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PurchaseHistory;
