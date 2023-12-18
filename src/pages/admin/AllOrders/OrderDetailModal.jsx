import React, { useEffect, useState } from "react";
import { getOrderById } from "../../../services/order";
import { useDispatch, useSelector } from "react-redux";
import { setShowModal } from "../../../store/modalSlice";

function OrderDetailModal({ orderId }) {
  const [order, setOrder] = useState();
  const dispatch = useDispatch();
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

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-2/5 my-6 mx-auto">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between items-center p-2 border-b border-solid border-blueGray-200 rounded-t">
              <h3 className="text-xl font-semibold">
                Order Details : {orderId}
              </h3>
              <button
                className="p-1 ml-auto text-3xl"
                onClick={() => dispatch(setShowModal({ showModal: false }))}
              >
                <span className="h-6 w-6 text-2xl">×</span>
              </button>
            </div>
            {/*body*/}
            <div className="relative p-6 flex-auto">
              {order ? (
                <>
                  {Object.values(order.items).map((item) => (
                    <div
                      key={item._id}
                      className="flex flex-row m-4 justify-between"
                    >
                      <h1>{item.name}</h1>
                      <span>{item.size}</span>
                      <span>
                        {item.quantity}*{item.price}
                      </span>
                      <span>₹{item.quantity * item.price}</span>
                    </div>
                  ))}
                  <div className="flex flex-row mt-8 justify-end">
                    <span className="font-bold text-lg">
                      Total Amount : {`₹${order.totalAmount}`}
                    </span>
                  </div>
                </>
              ) : (
                <h2>Loading...</h2>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}

export default OrderDetailModal;
