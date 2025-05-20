import React, { useEffect, useState } from "react";
import { useProfile } from "../context/ProfileContext";

const API_BASE = process.env.REACT_APP_SOCKET_URL || "http://localhost:3001";

const Order = () => {
  const { currentUser } = useProfile();
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);

  const fetchOrder = async () => {
    if (!currentUser?.userId) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE}/api/requests/running/${currentUser.profileId}`
      );
      if (response.ok) {
        const data = await response.json();
        setOrderData(data);
      } else {
        setOrderData(null);
      }
    } catch (error) {
      console.error("Failed to fetch order:", error);
      setOrderData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line
  }, [currentUser]);

  const handleCancelOrder = async () => {
    if (!orderData._id) return;
    setCancelling(true);
    try {
      const response = await fetch(
        `${API_BASE}/api/requests/cancel/${
          orderData._id
        }?customerId=${
          orderData.customerId && typeof orderData.customerId === "object"
            ? orderData.customerId._id
            : orderData.customerId
        }`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (response.ok) {
        await fetchOrder();
      } else {
        console.log("Failed to cancel order.", response.status);
      }
    } catch (error) {
      console.log("Failed to cancel order.", error);
    } finally {
      setCancelling(false);
    }
  };

  const handleCompleteOrder = async () => {
    if (!orderData._id) return;
    setCompleting(true);
    try {
      const response = await fetch(
        `${API_BASE}/api/requests/complete/${
          orderData._id
        }?customerId=${
          orderData.customerId && typeof orderData.customerId === "object"
            ? orderData.customerId._id
            : orderData.customerId
        }`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (response.ok) {
        await fetchOrder(); // Refresh the order data
      } else {
        console.log("Failed to complete order.", response.status);
      }
    } catch (error) {
      console.log("Failed to complete order.", error);
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <span className="text-blue-600 font-semibold text-lg">Loading...</span>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <span className="text-gray-500 text-lg">No running order found.</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto my-10 p-8 bg-white shadow-2xl rounded-2xl border border-blue-100">
      <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center tracking-tight">
        Order Details
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div>
          <div className="text-gray-800 font-semibold text-lg">
            {orderData.customerId && typeof orderData.customerId === "object"
              ? `${orderData.customerId.firstName} ${orderData.customerId.lastName}`
              : "Unk n"}
          </div>
        </div>
        <div>
          <div className="text-gray-800 font-semibold text-lg">
            {orderData.to?.address ||
              (orderData.to
                ? `${orderData.to.lat}, ${orderData.to.lng}`
                : "Unknown")}
          </div>
        </div>
        <div>
          <div className="text-gray-500 text-xs uppercase mb-1">Bid Amount</div>
          <div className="text-green-600 font-bold text-lg">
            Rs {orderData.bid}
          </div>
        </div>
        <div>
          <div className="text-gray-500 text-xs uppercase mb-1">Status</div>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              orderData.status === "inprogress"
                ? "bg-blue-100 text-blue-700"
                : orderData.status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : orderData.status === "cancelled"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {orderData.status.charAt(0).toUpperCase() +
              orderData.status.slice(1)}
          </span>
        </div>
        <div>
          <div className="text-gray-500 text-xs uppercase mb-1">
            Customer ID
          </div>
          <div className="text-gray-700 text-sm">
            {orderData.customerId && typeof orderData.customerId === "object"
              ? orderData.customerId._id // or orderData.customerId.profileId if that's your field
              : orderData.customerId}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-end">
        <button
          type="button"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
          onClick={() => setShowCompleteConfirm(true)}
          disabled={
            completing ||
            orderData.status === "completed" ||
            orderData.status === "cancelled"
          }
        >
          {completing ? "Completing..." : "Complete Order"}
        </button>
        <button
          type="button"
          className="px-6 py-2 bg-red-500 text-white rounded-lg font-semibold shadow hover:bg-red-600 transition"
          onClick={() => setShowConfirm(true)}
          disabled={cancelling || orderData.status === "cancelled"}
        >
          {cancelling ? "Cancelling..." : "Cancel Order"}
        </button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold mb-2">Cancel Order</h3>
            <p className="mb-6 text-gray-700">
              Are you sure you want to cancel this order?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => setShowConfirm(false)}
              >
                No
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={async () => {
                  setShowConfirm(false);
                  await handleCancelOrder();
                }}
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showCompleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold mb-2">Complete Order</h3>
            <p className="mb-6 text-gray-700">
              Are you sure you want to mark this order as completed?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => setShowCompleteConfirm(false)}
              >
                No
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                onClick={async () => {
                  setShowCompleteConfirm(false);
                  await handleCompleteOrder();
                }}
              >
                Yes, Complete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
