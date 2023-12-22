import React, { useEffect, useState } from "react";
import { getAllOrdersOfUser } from "../../../services/order";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCart } from "../../../services/cart";
import { addItemToCart } from "../../../store/cartSlice";

function Orders() {
  const [orders, setOrders] = useState([]);
  const jwtToken = useSelector((state) => state.auth.jwtToken);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllOrdersOfUser(jwtToken);
        console.log(res.data.data);
        setOrders(res.data.data);
        const cart = await getCart(jwtToken);
        dispatch(
          addItemToCart({
            itemCount: cart.data.data.items.length,
            items: cart.data.data.items,
          })
        );
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const link = {
    color: "#fe5f1e",
  };

  return (
    <section className="orders light-section">
      <div className="container mx-auto pt-12">
        <h1 className="font-bold text-lg mb-4">All orders</h1>
        <table className="w-full table-auto bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Orders</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Address</th>
              <th className="px-4 py-2 text-left">Time</th>
            </tr>
          </thead>
          <tbody>
            {orders.length ? (
              orders.map((order) => (
                <tr key={order._id}>
                  <td className="border px-4 py-2">
                    <Link style={link} to={`/customer/orders/${order._id}`}>
                      {order._id}
                    </Link>
                  </td>
                  <td className="border px-4 py-2">{order.phone}</td>
                  <td className="border px-4 py-2">{order.address}</td>
                  <td className="border px-4 py-2">
                    {new Intl.DateTimeFormat("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    }).format(new Date(order.createdAt))}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-4">
                  <span>No orders found!</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default Orders;
