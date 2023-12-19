import React, { useEffect, useState } from "react";
import "./OrderDetail.css";
import { useParams } from "react-router-dom";
import { getOrderById } from "../../../services/order";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import { notify } from "../../../services/toast";

const socket = io(import.meta.env.VITE_SOCKET_URI);

function OrderDetail() {
  const { orderId } = useParams();
  const [order, setOrder] = useState();
  const [statuses, setStatuses] = useState([]);
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

    // Listen for order status changes from the server
    socket.on("changeStatus", (updatedOrder) => {
      notify("Order status updated");
      // Update the order state when a changeStatus event is received
      setOrder(updatedOrder.data.data);
    });

    // Clean up the event listener when the component unmounts
    return () => {
      socket.off("changeStatus");
    };
  }, [orderId, jwtToken]);

  useEffect(() => {
    if (order) {
      const statusRefs = Array.from({ length: 5 }, () => React.createRef());
      setStatuses(statusRefs);
    }
  }, [order]);

  useEffect(() => {
    if (order && statuses.length > 0) {
      statuses.forEach((status, index) => {
        status.current.classList.remove("step-completed");
        status.current.classList.remove("current");
      });

      let stepCompleted = true;

      statuses.forEach((status, index) => {
        let dataProp = status.current.dataset.status;

        if (stepCompleted) {
          status.current.classList.add("step-completed");
        }

        if (dataProp === order.status) {
          stepCompleted = false;
          if (index < statuses.length - 1) {
            statuses[index + 1].current.classList.add("current");
          }
        }
      });
    }
  }, [order, statuses]);

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
                  ref={statuses[0]}
                  className="status_line text-sm md:text-xl pb-16"
                  data-status="order_placed"
                >
                  <span>Order Placed</span>
                </li>
                <li
                  ref={statuses[1]}
                  className="status_line text-sm md:text-xl pb-16"
                  data-status="confirmed"
                >
                  <span>Order confirmation</span>
                </li>
                <li
                  ref={statuses[2]}
                  className="status_line text-sm md:text-xl pb-16"
                  data-status="prepared"
                >
                  <span>Preparation</span>
                </li>
                <li
                  ref={statuses[3]}
                  className="status_line text-sm md:text-xl pb-16"
                  data-status="delivered"
                >
                  <span>Out for delivery </span>
                </li>
                <li
                  ref={statuses[4]}
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
