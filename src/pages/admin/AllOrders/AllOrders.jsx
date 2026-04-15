import { useEffect, useState, useCallback } from "react";
import { getAllOrders } from "../../../services/order";
import OrderStatus from "./OrderStatus";
import OrderDetailModal from "./OrderDetailModal";
import { useDispatch, useSelector } from "react-redux";
import { setShowModal } from "../../../store/modalSlice";
import Loader from "../../../components/Loader";
import Pagination from "../../../components/Pagination/Pagination";
import { formatDate } from "../../../utils/formatDate";

const STATUS_OPTIONS = [
  { value: "",             label: "All statuses" },
  { value: "order_placed", label: "Order Placed" },
  { value: "confirmed",    label: "Confirmed" },
  { value: "prepared",     label: "Prepared" },
  { value: "delivered",    label: "Delivered" },
  { value: "completed",    label: "Completed" },
  { value: "cancelled",    label: "Cancelled" },
];

const PAGE_SIZE = 10;

function AllOrders() {
  const [orders, setOrders]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [page, setPage]                 = useState(1);
  const [pagination, setPagination]     = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch]             = useState("");
  const [searchInput, setSearchInput]   = useState("");

  const showModal = useSelector((state) => state.modal.showModal);
  const dispatch  = useDispatch();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: PAGE_SIZE };
      if (statusFilter) params.status = statusFilter;
      if (search)       params.search = search;

      const res = await getAllOrders(params);
      setOrders(res.data.data.orders);
      setPagination(res.data.data.pagination);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const openDetail = (id) => {
    setSelectedOrderId(id);
    dispatch(setShowModal({ showModal: true }));
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  };

  const handleSearchClear = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  return (
    <>
      <section className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header + filters */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
            <div className="flex-1">
              <h1 className="text-2xl font-extrabold text-gray-900">All Orders</h1>
              {pagination && (
                <p className="text-sm text-gray-500 mt-0.5">{pagination.total} total orders</p>
              )}
            </div>

            {/* Search by address */}
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search by address…"
                  className="pl-9 pr-8 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 w-52"
                />
                <svg className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {search && (
                  <button type="button" onClick={handleSearchClear} className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <button type="submit" className="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition">
                Go
              </button>
            </form>

            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              {STATUS_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <Loader />
          ) : orders.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-16 text-center">
              <p className="text-gray-400">No orders match your filters.</p>
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
                        <td className="px-5 py-4">
                          <button
                            onClick={() => openDetail(order._id)}
                            className="font-mono text-xs text-orange-500 hover:text-orange-600 hover:underline"
                            title={order._id}
                          >
                            #{order._id.slice(-8).toUpperCase()}
                          </button>
                        </td>

                        <td className="px-5 py-4 text-gray-500 font-mono text-xs" title={order.customerId}>
                          {String(order.customerId).slice(-8)}
                        </td>

                        <td className="px-5 py-4 text-gray-600 max-w-xs truncate">{order.address}</td>

                        <td className="px-5 py-4">
                          {order.status === "cancelled" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-400">
                              Cancelled
                            </span>
                          ) : (
                            <div className="w-36">
                              <OrderStatus order={order} />
                            </div>
                          )}
                        </td>

                        <td className="px-5 py-4 text-gray-400 text-xs whitespace-nowrap">
                          {formatDate(order.createdAt)}
                        </td>

                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.paymentStatus ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
                          }`}>
                            {order.paymentStatus ? "Paid" : "Unpaid"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {pagination && (
                <Pagination page={pagination.page} pages={pagination.pages} onPage={setPage} />
              )}
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
