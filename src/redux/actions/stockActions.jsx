import axios from "axios";
import {
  FETCH_STOCK_SUCCESS,
  FETCH_STOCK_FAILURE
} from "../actionTypes";

const Base_Url = import.meta.env.VITE_BASE_URL;

export const fetchStock = (page = 1, limit = 10, searchTerm = "",status) => {
  return async (dispatch) => {
    try {
      const token=localStorage.getItem("token");
      const res = await axios.get(`${Base_Url}/api/stock/getStockList`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        params: { page, limit, search: searchTerm ,status},
      });
      dispatch({
        type: FETCH_STOCK_SUCCESS,
        payload: {
          stock: Array.isArray(res.data.data) ? res.data.data : [],
          message: res.data.message || "Stock fetched successfully",
          totalPages: res.data.totalPages,
          totalRecords: res.data.totalRecords,
          currentPage: res.data.currentPage,
        },
      });
    } catch (err) {
      dispatch({
        type: FETCH_STOCK_FAILURE,
        payload: err.response?.data?.message || err.message,
      });
    }
  };
};
