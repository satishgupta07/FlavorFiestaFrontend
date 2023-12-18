import axios from "axios";
const URL = "http://localhost:8000/api/v1";

export const createOrder = async (data, jwtToken) => {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwtToken}`,
  };
  try {
    return await axios.post(`${URL}/orders/place-order`, data, { headers });
  } catch (error) {
    console.log("Error while placing the order !!", error);
  }
};

export const getAllOrdersOfUser = async (jwtToken) => {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwtToken}`,
  };
  try {
    return await axios.get(`${URL}/orders`, { headers });
  } catch (error) {
    console.log("Error while placing the order !!", error);
  }
};

export const getOrderById = async (orderId, jwtToken) => {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwtToken}`,
  };
  try {
    return await axios.get(`${URL}/orders/${orderId}`, { headers });
  } catch (error) {
    console.log("Error while fetching the order !!", error);
  }
};

export const getAllOrders = async (jwtToken) => {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwtToken}`,
  };
  try {
    return await axios.get(`${URL}/orders/all-orders`, { headers });
  } catch (error) {
    console.log("Error while placing the order !!", error);
  }
};

export const updateStatus = async (data, jwtToken) => {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwtToken}`,
  };
  try {
    return await axios.post(`${URL}/orders/order/status`, data, { headers });
  } catch (error) {
    console.log("Error while updatind the order status !!", error);
  }
};
