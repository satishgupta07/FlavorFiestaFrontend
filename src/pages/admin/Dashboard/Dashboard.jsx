import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminStats } from "../../../services/user";
import { formatDate } from "../../../utils/formatDate";
import { STATUS_LABELS, STATUS_COLORS } from "../../../constants/orderStatus";
import Loader from "../../../components/Loader";

function StatCard({ label, value, sub, color }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{label}</p>
      <p className={`text-3xl font-extrabold ${color || "text-gray-900"}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

function Dashboard() {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getAdminStats();
        setStats(res.data.data);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader />;

  if (!stats) {
    return (
      <section className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">Could not load dashboard stats.</p>
      </section>
    );
  }

  const totalStatusCount = Object.values(stats.statusBreakdown).reduce((a, b) => a + b, 0) || 1;

  return (
    <section className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-8">Dashboard</h1>

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Orders"
            value={stats.totalOrders.toLocaleString()}
            color="text-gray-900"
          />
          <StatCard
            label="Total Revenue"
            value={`₹${stats.totalRevenue.toLocaleString()}`}
            sub="Paid orders only"
            color="text-orange-500"
          />
          <StatCard
            label="Products"
            value={stats.totalProducts.toLocaleString()}
            color="text-gray-900"
          />
          <StatCard
            label="Customers"
            value={stats.totalCustomers.toLocaleString()}
            color="text-gray-900"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Order status breakdown */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wider mb-5">
              Orders by Status
            </h2>
            <div className="space-y-3">
              {Object.entries(STATUS_LABELS).map(([key, label]) => {
                const count = stats.statusBreakdown[key] || 0;
                const pct   = Math.round((count / totalStatusCount) * 100);
                return (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{label}</span>
                      <span className="font-semibold text-gray-900">{count}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${STATUS_COLORS[key] || "bg-gray-400"} transition-all`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent orders */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wider">
                Recent Orders
              </h2>
              <Link
                to="/admin/orders"
                className="text-xs text-orange-500 hover:text-orange-600 font-medium"
              >
                View all →
              </Link>
            </div>
            {stats.recentOrders.length === 0 ? (
              <p className="text-gray-400 text-sm">No orders yet.</p>
            ) : (
              <div className="space-y-3">
                {stats.recentOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-mono text-xs text-orange-500 font-medium">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">
                        {order.address || "—"}
                      </p>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <p className="font-semibold text-gray-900">₹{order.totalAmount}</p>
                      <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick links */}
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <Link
            to="/admin/products"
            className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl shadow-sm p-5 hover:border-orange-200 hover:shadow-md transition group"
          >
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center group-hover:bg-orange-100 transition">
              <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Manage Products</p>
              <p className="text-xs text-gray-400">{stats.totalProducts} items in catalogue</p>
            </div>
          </Link>
          <Link
            to="/admin/orders"
            className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl shadow-sm p-5 hover:border-orange-200 hover:shadow-md transition group"
          >
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center group-hover:bg-orange-100 transition">
              <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Manage Orders</p>
              <p className="text-xs text-gray-400">{stats.totalOrders} orders total</p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
