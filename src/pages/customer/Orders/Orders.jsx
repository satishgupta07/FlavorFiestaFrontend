import { useEffect, useState } from "react";
import { getAllOrdersOfUser } from "../../../services/order";
import { Link } from "react-router-dom";
import Loader from "../../../components/Loader";
import Pagination from "../../../components/Pagination/Pagination";
import { formatDate } from "../../../utils/formatDate";
import { STATUS_LABELS, STATUS_STYLES } from "../../../constants/orderStatus";

const PAGE_SIZE = 10;

function Orders() {
  const [orders, setOrders]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [page, setPage]           = useState(1);
  const [pagination, setPagination] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const params = { page, limit: PAGE_SIZE };
        if (statusFilter) params.status = statusFilter;
        const res = await getAllOrdersOfUser(params);
        setOrders(res.data.data.orders);
        setPagination(res.data.data.pagination);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [page, statusFilter]);

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1); // reset to first page on filter change
  };

  return (
    <section className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h1 className="text-2xl font-extrabold text-gray-900">My Orders</h1>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={handleStatusChange}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="">All statuses</option>
            {Object.entries(STATUS_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <Loader />
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-4">
              {statusFilter ? "No orders match this filter." : "You haven't placed any orders yet."}
            </p>
            {!statusFilter && (
              <Link
                to="/"
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full transition"
              >
                Start ordering
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Order ID", "Phone", "Address", "Status", "Placed at"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-4">
                      <Link
                        to={`/customer/orders/${order._id}`}
                        className="font-mono text-xs text-orange-500 hover:text-orange-600 hover:underline"
                        title={order._id}
                      >
                        #{order._id.slice(-8).toUpperCase()}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-gray-600 hidden sm:table-cell">{order.phone}</td>
                    <td className="px-5 py-4 text-gray-600 hidden md:table-cell max-w-xs truncate">{order.address}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[order.status] || "bg-gray-100 text-gray-500"}`}>
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-xs hidden lg:table-cell whitespace-nowrap">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {pagination && (
              <Pagination page={pagination.page} pages={pagination.pages} onPage={setPage} />
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default Orders;
