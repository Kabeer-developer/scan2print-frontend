import axios from "./axiosInstance";

const getAllStores = async (search = "") => {
  const res = await axios.get(
    `/store${search ? `?search=${search}` : ""}`
  );
  return res.data;
};

const getStoreById = async (id) => {
  const res = await axios.get(`/store/${id}`);
  return res.data;
};

const registerStore = async (formData) => {
  const res = await axios.post("/store/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

const loginStore = async (credentials) => {
  const res = await axios.post("/store/login", credentials);
  return res.data;
};

export default {
  getAllStores,
  getStoreById,
  registerStore,
  loginStore,
};
