import api from "./api";


export const createOrder = async (orderData) => {
  const response = await api.post(
    "/orders/",
    orderData
  );

  return response.data;
};


export const getCustomerOrders = async (customerId) => {
  const response = await api.get(
    `/orders/customer/${customerId}`
  );

  return response.data;
};