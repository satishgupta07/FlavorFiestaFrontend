/**
 * OrderDetail.jsx — Order detail and real-time status tracker.
 *
 * Bug fixes applied:
 *  1. Missing `return` on the else branch — component now always renders.
 *  2. Socket created via shared singleton (socket.js) instead of a new
 *     connection per component instance.
 *  3. DOM manipulation via imperative refs replaced with declarative state.
 *  4. useEffect cleanup correctly removes only this component's listener.
 */
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderById, cancelOrder } from "../../../services/order";
import { addToCart } from "../../../services/cart";
import { useSelector, useDispatch } from "react-redux";
import { addItemToCart } from "../../../store/cartSlice";
import socket from "../../../services/socket";
import { notify } from "../../../services/toast";
import Loader from "../../../components/Loader";

const STEPS = [
  { key: "order_placed", label: "Order Placed",    icon: "🛒" },
  { key: "confirmed",    label: "Confirmed",        icon: "✅" },
  { key: "prepared",     label: "Being Prepared",   icon: "👨‍🍳" },
  { key: "delivered",    label: "Out for Delivery", icon: "🛵" },
  { key: "completed",    label: "Delivered",        icon: "🎉" },
];

function getStepIndex(status) {
  return STEPS.findIndex((s) => s.key === status);
}

function formatDate(iso) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso));
}

function OrderDetail() {
  const { orderId } = useParams();
  const [order, setOrder]         = useState(null);
  const [loading, setLoading]     = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [reordering, setReordering] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrderById(orderId);
        setOrder(res.data.data);
      } catch (err) {
        console.error("Failed to fetch order:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();

    // Listen for real-time status updates from the server
    const handleStatusChange = (payload) => {
      // Only update if this event is for the order currently being viewed
      if (payload?.data?.data?._id === orderId || payload?.data?.data?.orderId === orderId) {
        notify("Order status updated!");
        setOrder(payload.data.data);
      }
    };

    socket.on("changeStatus", handleStatusChange);
    return () => socket.off("changeStatus", handleStatusChange);
  }, [orderId]);

  const handleCancel = async () => {
    if (!window.confirm("Cancel this order?")) return;
    setCancelling(true);
    try {
      const res = await cancelOrder(orderId);
      setOrder(res.data.data);
      notify("Order cancelled successfully");
    } catch (err) {
      notify(err?.response?.data?.message || "Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  // Re-adds every item from this order into the cart, then syncs Redux state
  const handleReorder = async () => {
    setReordering(true);
    try {
      let lastCart;
      for (const item of order.items) {
        const res = await addToCart(item.productId, { quantity: item.quantity });
        lastCart = res.data.data;
      }
      if (lastCart) {
        dispatch(addItemToCart({ itemCount: lastCart.items.length, items: lastCart.items }));
      }
      notify("Items added to cart!");
    } catch (err) {
      notify(err?.response?.data?.message || "Failed to reorder");
    } finally {
      setReordering(false);
    }
  };

  if (loading) return <Loader />;

  // Bug fix: was missing `return` here — component now correctly returns null
  if (!order) {
    return (
      <section className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-20 px-4">
        <p className="text-gray-500 mb-4">Order not found.</p>
        <Link to="/customer/orders" className="text-orange-500 hover:underline text-sm font-medium">
          ← Back to orders
        </Link>
      </section>
    );
  }

  const currentStepIdx = getStepIndex(order.status);

  return (
    <section className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div>
            <Link to="/customer/orders" className="text-sm text-orange-500 hover:underline font-medium mb-1 inline-block">
              ← My Orders
            </Link>
            <h1 className="text-2xl font-extrabold text-gray-900">Track Your Order</h1>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Reorder — always available */}
            <button
              onClick={handleReorder}
              disabled={reordering}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-orange-500 bg-orange-50 hover:bg-orange-100 px-4 py-2 rounded-lg transition disabled:opacity-60"
            >
              {reordering ? <Loader inline /> : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
              {reordering ? "Adding…" : "Reorder"}
            </button>

            {/* Cancel — only when still in order_placed */}
            {order.status === "order_placed" && (
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-red-500 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition disabled:opacity-60"
              >
                {cancelling ? <Loader inline /> : null}
                {cancelling ? "Cancelling…" : "Cancel Order"}
              </button>
            )}

            <span className="font-mono text-xs bg-white border border-gray-200 text-gray-500 px-3 py-2 rounded-lg">
              #{order._id.slice(-10).toUpperCase()}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Status timeline */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wider mb-6">
              Delivery Status
            </h2>
            <ol className="relative">
              {STEPS.map((step, idx) => {
                const isCompleted = idx <= currentStepIdx;
                const isCurrent   = idx === currentStepIdx + 1;
                return (
                  <li key={step.key} className="flex gap-4 pb-6 last:pb-0 relative">
                    {/* Vertical line */}
                    {idx < STEPS.length - 1 && (
                      <div
                        className={`absolute left-4 top-8 w-0.5 h-full -translate-x-1/2 ${
                          idx < currentStepIdx ? "bg-orange-400" : "bg-gray-200"
                        }`}
                      />
                    )}

                    {/* Dot */}
                    <div
                      className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full text-base shrink-0 ${
                        isCompleted
                          ? "bg-orange-500 text-white shadow-md"
                          : isCurrent
                          ? "bg-orange-100 text-orange-500 border-2 border-orange-400"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {step.icon}
                    </div>

                    {/* Label */}
                    <div className="pt-1">
                      <p
                        className={`text-sm font-semibold ${
                          isCompleted ? "text-gray-900" : isCurrent ? "text-orange-500" : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </p>
                      {isCompleted && idx === currentStepIdx && (
                        <p className="text-xs text-orange-400 mt-0.5">Current status</p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Order items + details */}
          <div className="space-y-4">
            {/* Items */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wider mb-4">
                Items
              </h2>
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={item._id || idx} className="flex justify-between items-start text-sm">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-semibold text-gray-900">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 mt-4 pt-3 flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span>₹{order.totalAmount}</span>
              </div>
            </div>

            {/* Delivery info */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 text-sm">
              <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wider mb-3">
                Delivery Info
              </h2>
              <div className="space-y-1.5 text-gray-600">
                <p><span className="text-gray-400">Phone: </span>{order.phone}</p>
                <p><span className="text-gray-400">Address: </span>{order.address}</p>
                <p><span className="text-gray-400">Placed: </span>{formatDate(order.createdAt)}</p>
                <p>
                  <span className="text-gray-400">Payment: </span>
                  {order.paymentType}
                  {" — "}
                  <span className={order.paymentStatus ? "text-green-500" : "text-red-400"}>
                    {order.paymentStatus ? "Paid" : "Pending"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OrderDetail;
