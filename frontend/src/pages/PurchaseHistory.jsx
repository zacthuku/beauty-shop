import { useEffect, useState } from "react";
import { api_url } from "../config.json"; 

function PurchaseHistory() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetch(`${api_url}/orders/history`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("beautyApp_token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch purchase history");
        return res.json();
      })
      .then((data) => {
        const cleaned = data.map((order) => ({
          ...order,
          items: Array.isArray(order.items) ? order.items : [],
        }));
        setOrders(cleaned);
        setFilteredOrders(cleaned);
      })
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    let filtered = orders;

    if (search.trim()) {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.items.some((item) =>
            item.product_name.toLowerCase().includes(term)
          ) ||
          (order.user && order.user.username.toLowerCase().includes(term))
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    if (startDate) {
      filtered = filtered.filter(
        (order) => new Date(order.created_at) >= new Date(startDate)
      );
    }

    if (endDate) {
      filtered = filtered.filter(
        (order) => new Date(order.created_at) <= new Date(endDate)
      );
    }

    setFilteredOrders(filtered);
  }, [search, statusFilter, startDate, endDate, orders]);

  const exportCSV = () => {
    if (!Array.isArray(filteredOrders) || filteredOrders.length === 0) {
      alert("No data to export.");
      return;
    }

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        ["Order ID", "Date", "Status", "User", "Products", "Invoice Amount"],
        ...filteredOrders.map((order) => [
          order.id,
          new Date(order.created_at).toLocaleString(),
          order.status,
          order.user?.username || "N/A",
          Array.isArray(order.items)
            ? order.items.map((item) => `${item.product_name} x${item.quantity}`).join("; ")
            : "No items",
          order.invoice?.total_amount ?? "N/A"
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "purchase_history.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Purchase History</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by product or user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Completed">Completed</option>
        </select>
        <button
          onClick={exportCSV}
          className="bg-green-600 text-white rounded px-4 py-2"
        >
          Export CSV
        </button>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-4 py-2 border rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="px-4 py-2 border rounded"
        />
      </div>

      {filteredOrders.length === 0 ? (
        <p>No matching purchase history found.</p>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="border rounded-xl p-4 shadow bg-white"
            >
              <div className="flex justify-between">
                <span className="font-semibold">Order #{order.id}</span>
                <span className="text-sm text-gray-600">
                  {new Date(order.created_at).toLocaleString()}
                </span>
              </div>
              <div className="text-sm mt-2">
                <p>
                  Status:{" "}
                  <span className="font-medium">{order.status}</span>
                </p>
                {order.user && (
                  <p>
                    User:{" "}
                    <span className="text-blue-600">
                      {order.user.username}
                    </span>
                  </p>
                )}
                <p>
                  Invoice Amount:{" "}
                  <span className="text-green-700 font-semibold">
                    {order.invoice?.total_amount != null
                      ? `KES ${order.invoice.total_amount.toFixed(2)}`
                      : "N/A"}
                  </span>
                </p>
              </div>
              {Array.isArray(order.items) && order.items.length > 0 && (
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
