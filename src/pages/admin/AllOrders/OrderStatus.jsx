import React, { useState } from "react";
import { updateStatus } from "../../../services/order";

function OrderStatus({ order }) {
  const [status, setStatus] = useState(order.status);
  async function changeStatus(e) {
    setStatus(e.target.value);
    try {
      const updatedOrder = await updateStatus({
        orderId: order._id,
        newStatus: e.target.value,
      });

      console.log(updatedOrder);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <form>
      <input type="hidden" name="orderId" value={order._id} />
      <select
        name="status"
        onChange={(e) => changeStatus(e)}
        className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
        value={status}
      >
        <option value="order_placed">Placed</option>
        <option value="confirmed">Confirmed</option>
        <option value="prepared">Prepared</option>
        <option value="delivered">Delivered</option>
        <option value="completed">Completed</option>
      </select>
    </form>
  );
}

export default OrderStatus;
