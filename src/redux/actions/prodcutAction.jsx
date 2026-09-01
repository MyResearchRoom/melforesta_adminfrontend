import axios from "axios";
import {
   FETCH_PRODUCT_SUCCESS,
   FETCH_PRODUCT_FAILURE
} from "../actionTypes";

const Base_Url = import.meta.env.VITE_BASE_URL;

export const fetchProducts = (page = 1, limit = 10, searchTerm = "",isBlock="") => {
  return async (dispatch) => {
    try {
      const token=localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("adminuser"));
      const res = await axios.get(`${Base_Url}/api/product/getProductList`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        params: { page, limit, search: searchTerm, role:user?.role, isBlock:isBlock},
      });

      dispatch({
        type: FETCH_PRODUCT_SUCCESS,
        payload: {
          product: Array.isArray(res.data.data) ? res.data.data : [],
          message: res.data.message || "Product fetched successfully",
          totalPages: res.data.totalPages,
          totalRecords: res.data.totalRecords,
          currentPage: res.data.currentPage,
        },
      });
    } catch (err) {
      dispatch({
        type: FETCH_PRODUCT_FAILURE,
        payload: err.response?.data?.message || err.message,
      });
    }
  };
};
