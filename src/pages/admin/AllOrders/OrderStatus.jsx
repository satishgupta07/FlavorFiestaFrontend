import React, { useState } from "react";
import { updateStatus } from "../../../services/order";
import socket from "../../../services/socket";

const ORDER_STATUSES = [
  { value: "order_placed", label: "Placed" },
  { value: "confirmed",    label: "Confirmed" },
  { value: "prepared",     label: "Prepared" },
  { value: "delivered",    label: "Delivered" },
  { value: "completed",    label: "Completed" },
];

function OrderStatus({ order, onStatusChange }) {
  const [status, setStatus] = useState(order.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const changeStatus = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setIsUpdating(true);
    try {
      const res = await updateStatus({ orderId: order._id, newStatus });
      // Broadcast the update to all clients (including customer order-tracking page)
      socket.emit("changeStatus", res);
      onStatusChange?.(order._id, newStatus);
    } catch (err) {
      console.error("Failed to update order status:", err);
      setStatus(order.status); // Roll back on error
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <select
      value={status}
      onChange={changeStatus}
      disabled={isUpdating}
      className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-50 cursor-pointer"
    >
      {ORDER_STATUSES.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
  );
}

export default OrderStatus;
