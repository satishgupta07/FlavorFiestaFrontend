import React, { useEffect, useState } from "react";
import "./OrderDetail.css";
import { useParams } from "react-router-dom";
import { getOrderById } from "../../../services/order";
import { useSelector } from "react-redux";

function OrderDetail() {
  const { orderId } = useParams();
  const [order, setOrder] = useState();
  const jwtToken = useSelector((state) => state.auth.jwtToken);

  useEffect(() => {
    async function getOrder(id) {
      try {
        const order = await getOrderById(id, jwtToken);
        setOrder(order.data.data);
      } catch (err) {
        console.log(err);
      }
    }

    getOrder(orderId);
  }, [orderId]);

  {
    if (order) {
      return (
        <section className="status">
          <div className="container mx-auto">
            <div className="status-box w-full lg:w-2/3 mx-auto">
              <div className="flex items-center justify-between mb-12">
                <h1 className="text-xl font-bold">Track delivery status</h1>

                <h6 className="bg-white py-1 rounded-full px-4 text-green-600 text-xs">
                  {order._id}
                </h6>
                <input
                  id="hiddenInput"
                  type="hidden"
                  value={JSON.stringify(order)}
                />
              </div>
              <ul>
                <li
                  className={`status_line text-sm md:text-xl pb-16 step-completed ${
                    order.status === "order_placed" ? "current" : ""
                  }`}
                  data-status="order_placed"
                >
                  <span>Order Placed</span>
                </li>
                <li
                  className={`status_line text-sm md:text-xl pb-16 ${
                    order.status === "confirmed" ? "current" : ""
                  }`}
                  data-status="confirmed"
                >
                  <span>Order confirmation</span>
                </li>
                <li
                  className={`status_line text-sm md:text-xl pb-16 ${
                    order.status === "prepared" ? "current" : ""
                  }`}
                  data-status="prepared"
                >
                  <span>Preparation</span>
                </li>
                <li
                  className={`status_line text-sm md:text-xl pb-16 ${
                    order.status === "delivered" ? "current" : ""
                  }`}
                  data-status="delivered"
                >
                  <span>Out for delivery </span>
                </li>
                <li
                  className="status_line text-sm md:text-xl"
                  data-status="completed"
                >
                  <span>Complete</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      );
    } else {
      <>
        <h3>Loading...</h3>
      </>;
    }
  }
}

export default OrderDetail;
