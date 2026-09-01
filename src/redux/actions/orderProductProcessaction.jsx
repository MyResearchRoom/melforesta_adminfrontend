import axios from "axios";
import {
  FETCH_PROCESSORDERS_SUCCESS,
  FETCH_PROCESSORDERS_FAILURE,
} from "../actionTypes";

const Base_Url = import.meta.env.VITE_BASE_URL;

export const fetchProcessedProducts = (page = 1, limit = 10, status="") => {
  return async (dispatch) => {
    try {
      const token=localStorage.getItem("token");
      const params = { page, limit };
      if (status && status !== "All") {
        params.status = status;
      }

      const res = await axios.get(`${Base_Url}/api/productOrder/getAllOrders`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        params,
      });

      dispatch({
        type: FETCH_PROCESSORDERS_SUCCESS,
        payload: {
          processedproducts: Array.isArray(res.data.data) ? res.data.data : [],
          message: res.data.message || "Product fetched successfully",
          totalPages: res.data.totalPages,
          totalRecords: res.data.totalRecords,
          currentPage: res.data.currentPage,
        },
      });
    } catch (err) {
      dispatch({
        type: FETCH_PROCESSORDERS_FAILURE,
        payload: err.response?.data?.message || err.message,
      });
    }
  };
};
