import React, { useEffect, useState } from "react";
import { getOrderById } from "../../../services/order";
import { useDispatch } from "react-redux";
import { setShowModal } from "../../../store/modalSlice";
import Loader from "../../../components/Loader";

function OrderDetailModal({ orderId }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await getOrderById(orderId);
        setOrder(res.data.data);
      } catch (err) {
        console.error("Failed to load order detail:", err);
      } finally {
        setLoading(false);
      }
    };
    if (orderId) fetchOrder();
  }, [orderId]);

  const close = () => dispatch(setShowModal({ showModal: false }));

  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-label={`Order details: ${orderId}`}
      >
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Order Details</h3>
              <p className="text-xs text-gray-400 font-mono mt-0.5">
                #{orderId.slice(-10).toUpperCase()}
              </p>
            </div>
            <button
              onClick={close}
              className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto flex-1 px-6 py-4">
            {loading ? (
              <Loader />
            ) : order ? (
              <>
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div
                      key={item._id || idx}
                      className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                    >
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {item.quantity} × ₹{item.price}
                        </p>
                      </div>
                      <span className="font-semibold text-gray-900 text-sm">
                        ₹{item.quantity * item.price}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-orange-500 text-lg">₹{order.totalAmount}</span>
                </div>

                <div className="mt-4 space-y-1.5 text-sm text-gray-600 bg-gray-50 rounded-xl p-4">
                  <p><span className="text-gray-400">Phone: </span>{order.phone}</p>
                  <p><span className="text-gray-400">Address: </span>{order.address}</p>
                  <p>
                    <span className="text-gray-400">Payment: </span>{order.paymentType}
                    {" — "}
                    <span className={order.paymentStatus ? "text-green-500 font-medium" : "text-red-400 font-medium"}>
                      {order.paymentStatus ? "Paid" : "Pending"}
                    </span>
                  </p>
                </div>
              </>
            ) : (
              <p className="text-center text-gray-400 py-8">Could not load order.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderDetailModal;
