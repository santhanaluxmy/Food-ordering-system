import api from "./api";


export const createCustomer = async (customerData) => {
  const response = await api.post(
    "/customers/",
    customerData
  );

  return response.data;
};