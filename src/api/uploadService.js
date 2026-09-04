import axios from "./axiosInstance";

const getStoreFiles = async (storeId) => {
  const res = await axios.get(`/upload/files/${storeId}`);
  return res.data;
};

const uploadFile = async (storeId, formData) => {
  const res = await axios.post(`/upload/${storeId}`, formData);
  return res.data;
};

const viewFile = async (fileId) => {
  const res = await axios.get(`/upload/files/view/${fileId}`, {
    responseType: "blob",
  });

  return res.data;
};

const deleteFile = async (fileId) => {
  const res = await axios.delete(`/upload/files/${fileId}`);
  return res.data;
};

export default {
  getStoreFiles,
  uploadFile,
  viewFile,
  deleteFile,
};