import React, { useEffect, useState } from "react";

interface Order {
  _id: string;
  customerId: any;
  from: { lat: number; lng: number; address?: string };
  to: { lat: number; lng: number; address?: string };
  bid: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const statusColors: Record<string, string> = {
  inprogress: "bg-blue-100 text-blue-700",
  pending: "bg-yellow-100 text-yellow-700",
  cancelled: "bg-red-100 text-red-700",
  completed: "bg-green-100 text-green-700",
};

const statusLabels: Record<string, string> = {
  inprogress: "In Progress",
  pending: "Pending",
  cancelled: "Cancelled",
  completed: "Completed",
};

const AllOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:3001/api/requests/");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Dashboard summary counts
  const total = orders.length;
  const pending = orders.filter((o) => o.status === "pending").length;
  const inprogress = orders.filter((o) => o.status === "inprogress").length;
  const completed = orders.filter((o) => o.status === "completed").length;
  const cancelled = orders.filter((o) => o.status === "cancelled").length;

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    const customerName =
      order.customerId && typeof order.customerId === "object"
        ? `${order.customerId.firstName ?? ""} ${
            order.customerId.lastName ?? ""
          }`.toLowerCase()
        : String(order.customerId).toLowerCase();
    const matchesSearch = customerName.includes(search.toLowerCase());
    const matchesStatus = statusFilter ? order.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto my-10 p-6 bg-white shadow-2xl rounded-2xl border border-blue-100">
      <h2 className="text-3xl font-bold text-blue-700 mb-2 text-center tracking-tight">
        Orders Dashboard
      </h2>
      <p className="text-center text-gray-500 mb-8">
        Overview of all customer orders and their statuses.
      </p>

      {/* Dashboard summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
        <div className="bg-blue-50 rounded-xl p-4 flex flex-col items-center shadow">
          <span className="text-2xl font-bold text-blue-700">{total}</span>
          <span className="text-xs text-blue-700 mt-1">Total Orders</span>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 flex flex-col items-center shadow">
          <span className="text-2xl font-bold text-yellow-700">{pending}</span>
          <span className="text-xs text-yellow-700 mt-1">Pending</span>
        </div>
        <div className="bg-blue-100 rounded-xl p-4 flex flex-col items-center shadow">
          <span className="text-2xl font-bold text-blue-700">{inprogress}</span>
          <span className="text-xs text-blue-700 mt-1">In Progress</span>
        </div>
        <div className="bg-green-50 rounded-xl p-4 flex flex-col items-center shadow">
          <span className="text-2xl font-bold text-green-700">{completed}</span>
          <span className="text-xs text-green-700 mt-1">Completed</span>
        </div>
        <div className="bg-red-50 rounded-xl p-4 flex flex-col items-center shadow">
          <span className="text-2xl font-bold text-red-700">{cancelled}</span>
          <span className="text-xs text-red-700 mt-1">Cancelled</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between items-center">
        <input
          type="text"
          placeholder="Search by customer name..."
          className="border border-blue-200 rounded-lg px-4 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border border-blue-200 rounded-lg px-4 py-2 w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-blue-200"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="inprogress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto rounded-xl border">
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <span className="text-blue-600 font-semibold text-lg">
              Loading...
            </span>
          </div>
        ) : !filteredOrders.length ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <span className="text-gray-500 text-lg">No orders found.</span>
          </div>
        ) : (
          <table className="min-w-full border rounded-xl overflow-hidden">
            <thead className="sticky top-0 bg-blue-50 z-10">
              <tr>
                <th className="py-2 px-4 border">Customer</th>
                <th className="py-2 px-4 border">From</th>
                <th className="py-2 px-4 border">To</th>
                <th className="py-2 px-4 border">Bid</th>
                <th className="py-2 px-4 border">Status</th>
                <th className="py-2 px-4 border">Created</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order._id}
                  className="text-center hover:bg-blue-50 transition"
                >
                  <td className="py-2 px-4 border font-medium">
                    {order.customerId && typeof order.customerId === "object"
                      ? `${order.customerId.firstName ?? ""} ${
                          order.customerId.lastName ?? ""
                        }`.trim() || "-"
                      : "-"}
                  </td>
                  <td className="py-2 px-4 border">
                    {order.from?.address
                      ? order.from.address
                      : order.from
                      ? `${order.from.lat}, ${order.from.lng}`
                      : "-"}
                  </td>
                  <td className="py-2 px-4 border">
                    {order.to?.address
                      ? order.to.address
                      : order.to
                      ? `${order.to.lat}, ${order.to.lng}`
                      : "-"}
                  </td>
                  <td className="py-2 px-4 border">Rs {order.bid}</td>
                  <td className="py-2 px-4 border">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        statusColors[order.status] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {statusLabels[order.status] || order.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 border">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AllOrders;
