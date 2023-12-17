import React, { useEffect, useState } from "react";
import { getAllOrders } from "../../../services/order";
import OrderStatus from "./OrderStatus";
import OrderDetailModal from "./OrderDetailModal";
import { useDispatch, useSelector } from "react-redux";
import { setShowModal } from "../../../store/modalSlice";

function AllOrders() {
  const [orders, setOrders] = useState();
  const showModal = useSelector((state) => state.modal.showModal);
  const dispatch = useDispatch();
  const [orderId, setOrderId] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ords = await getAllOrders();
        console.log(ords);
        setOrders(ords.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  function getOrderDetail(orderId) {
    setOrderId(orderId);
    dispatch(setShowModal({ showModal: true }));
  }

  return (
    <>
      <section className="orders light-section">
        <div className="container mx-auto pt-12 py-6 px-10">
          <h1 className="font-bold text-lg mb-4">All orders</h1>
          <table className="w-full table-auto bg-white">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">OrderId</th>
                <th className="px-4 py-2 text-left">Customer</th>
                <th className="px-4 py-2 text-left">Address</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Placed at</th>
                <th className="px-4 py-2 text-left">Payment Status</th>
              </tr>
            </thead>
            <tbody id="orderTableBody">
              {orders &&
                orders.map((order) => (
                    <tr key={order._id}>
                      <td className="border px-4 py-2 text-green-900">
                        <button onClick={() => getOrderDetail(order._id)}>
                          {order._id}
                        </button>
                      </td>
                      <td className="border px-4 py-2">{order.customerId}</td>
                      <td className="border px-4 py-2">{order.address}</td>
                      <td className="border px-4 py-2">
                        <div className="inline-block relative w-64">
                          <OrderStatus order={order} />
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg
                              className="fill-current h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                          </div>
                        </div>
                      </td>
                      <td className="border px-4 py-2">{order.createdAt}</td>
                      <td className="border px-4 py-2">
                        {order.paymentStatus ? "paid" : "Not paid"}
                      </td>
                    </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
      {showModal ? <OrderDetailModal orderId={orderId} /> : null}
    </>
  );
}

export default AllOrders;
