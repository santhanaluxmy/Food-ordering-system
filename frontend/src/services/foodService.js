import api from "./api";

// Get foods with search, category, sorting and pagination
export const getFoods = async ({
  search = "",
  categoryId = "",
  sort = "",
  page = 1,
  limit = 10,
} = {}) => {
  const params = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
  }

  if (categoryId) {
    params.category_id = categoryId;
  }

  if (sort) {
    params.sort = sort;
  }

  const response = await api.get("/foods/", {
    params,
  });

  return response.data;
};


// Get one food
export const getFood = async (id) => {
  const response = await api.get(
    `/foods/${id}`
  );

  return response.data;
};


// Create food
export const createFood = async (foodData) => {
  const response = await api.post(
    "/foods/",
    foodData
  );

  return response.data;
};


// Update food
export const updateFood = async (
  id,
  foodData
) => {
  const response = await api.put(
    `/foods/${id}`,
    foodData
  );

  return response.data;
};


// Delete food
export const deleteFood = async (id) => {
  const response = await api.delete(
    `/foods/${id}`
  );

  return response.data;
};


// Get popular foods
export const getPopularFoods = async () => {
  const response = await api.get(
    "/foods/popular"
  );

  return response.data;
};