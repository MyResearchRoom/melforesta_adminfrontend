import axios from "axios";
import { toast } from "react-toastify";

const Base_Url = import.meta.env.VITE_BASE_URL;

export const saveCategory = async ({ categoryId = null, data, token }) => {
  const isEditMode = !!categoryId;

  try {
    let res;

    if (isEditMode) {
      res = await axios.put(
        `${Base_Url}/api/category/editCategory/${categoryId}`,
        data, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } else {
      res = await axios.post(
        `${Base_Url}/api/category/createCategory`,
        data, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }

    toast.success(
      res.data.message || (isEditMode ? "Category updated!" : "Category added!")
    );
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Failed to save category");
    throw err;
  }
};
