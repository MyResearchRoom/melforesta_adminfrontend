import axios from "axios";
import { toast } from "react-toastify";
import { fetchProducts } from "../redux/actions/prodcutAction";
import { useDispatch } from "react-redux";

const Base_Url = import.meta.env.VITE_BASE_URL;

export const saveProduct = async ({ productId = null, data, token }) => {
  const isEditMode = !!productId;

  try {
    let res;
    if (isEditMode) {
        //update API
         res = await axios.put(`${Base_Url}/api/product/editProduct/${productId}`,data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
        );
    } else {
        //add API
        res = await axios.post(`${Base_Url}/api/product/createProduct`, data, 
        {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
        });
    }
    toast.success(res.data.message || (isEditMode ? "Category updated!" : "Category added!"));
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Failed to save product");
    throw err; 
  }
};
