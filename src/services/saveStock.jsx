import axios from "axios";
import { toast } from "react-toastify";

const Base_Url = import.meta.env.VITE_BASE_URL;

export const saveStock = async ({data, token }) => {

  try {
    let res;
    res = await axios.post(`${Base_Url}/api/stock/addStock`, data, 
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    toast.success(res.data.message ||"stock added!");
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Failed to save stock");
    throw err; 
  }
};
