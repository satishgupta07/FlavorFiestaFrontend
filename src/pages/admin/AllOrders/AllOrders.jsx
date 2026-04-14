import React, { useEffect, useState } from "react";
import { getAllOrders } from "../../../services/order";
import OrderStatus from "./OrderStatus";
import OrderDetailModal from "./OrderDetailModal";
import { useDispatch, useSelector } from "react-redux";
import { setShowModal } from "../../../store/modalSlice";
import Loader from "../../../components/Loader";

const STATUS_STYLES = {
  order_placed: "bg-blue-50 text-blue-600",
  confirmed:    "bg-yellow-50 text-yellow-600",
  prepared:     "bg-purple-50 text-purple-600",
  delivered:    "bg-green-50 text-green-600",
  completed:    "bg-gray-100 text-gray-500",
};

function formatDate(iso) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso));
}

function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const showModal = useSelector((state) => state.modal.showModal);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getAllOrders();
        setOrders(res.data.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const openDetail = (id) => {
    setSelectedOrderId(id);
    dispatch(setShowModal({ showModal: true }));
  };

  if (loading) return <Loader />;

  return (
    <>
      <section className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-extrabold text-gray-900">All Orders</h1>
            <span className="text-sm text-gray-500">{orders.length} total</span>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-16 text-center">
              <p className="text-gray-400">No orders have been placed yet.</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {["Order ID", "Customer", "Address", "Status", "Placed At", "Payment"].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50 transition">
                        {/* Order ID */}
                        <td className="px-5 py-4">
                          <button
                            onClick={() => openDetail(order._id)}
                            className="font-mono text-xs text-orange-500 hover:text-orange-600 hover:underline"
                            title={order._id}
                          >
                            #{order._id.slice(-8).toUpperCase()}
                          </button>
                        </td>

                        {/* Customer ID (truncated) */}
                        <td className="px-5 py-4 text-gray-500 font-mono text-xs" title={order.customerId}>
                          {String(order.customerId).slice(-8)}
                        </td>

                        {/* Address */}
                        <td className="px-5 py-4 text-gray-600 max-w-xs truncate">{order.address}</td>

                        {/* Status select */}
                        <td className="px-5 py-4">
                          <div className="w-36">
                            <OrderStatus order={order} />
                          </div>
                        </td>

                        {/* Placed at */}
                        <td className="px-5 py-4 text-gray-400 text-xs whitespace-nowrap">
                          {formatDate(order.createdAt)}
                        </td>

                        {/* Payment status */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              order.paymentStatus
                                ? "bg-green-50 text-green-600"
                                : "bg-red-50 text-red-500"
                            }`}
                          >
                            {order.paymentStatus ? "Paid" : "Unpaid"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>

      {showModal && selectedOrderId && (
        <OrderDetailModal orderId={selectedOrderId} />
      )}
    </>
  );
}

export default AllOrders;
