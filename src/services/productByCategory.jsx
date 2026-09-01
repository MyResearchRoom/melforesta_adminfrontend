import axios from "axios";

const Base_Url = import.meta.env.VITE_BASE_URL;

export const getProductsByCategory = async (categoryId) => {
  if (!categoryId) return [];

  try {
    const token = localStorage.getItem("token"); 
    const res = await axios.get(`${Base_Url}/api/product/getProductByCategory/${categoryId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.data.success) {
      return res.data.data || [];
    } else {
      console.error(res.data.message || "Failed to fetch products");
      return [];
    }
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Failed to fetch products");
    throw err; 
}

};

export const getVarientsByProduct = async (productId) => {
  if (!productId) return [];

  try {
    const token = localStorage.getItem("token"); 
    const res = await axios.get(`${Base_Url}/api/product/getVarientsByProductId/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.data.success) {
      return res.data.data || [];
    } else {
      console.error(res.data.message || "Failed to fetch product varients");
      return [];
    }
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Failed to fetch product varients");
    throw err; 
}

};