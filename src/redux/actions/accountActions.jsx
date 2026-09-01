import axios from "axios";
import {
  FETCH_ACCOUNT_SUCCESS,
  FETCH_ACCOUNT_FAILURE,
} from "../actionTypes";

const Base_Url = import.meta.env.VITE_BASE_URL;

export const fetchAccounts = (page = 1, limit = 10, searchTerm = "",paymentStatus="",startDate="",endDate="") => {
  return async (dispatch) => {
    try {
      const token=localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("adminuser"));
      const res = await axios.get(`${Base_Url}/api/productOrder/payment-history`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        params: { page, limit, search: searchTerm, paymentStatus,startDate,endDate},
      });

      dispatch({
        type: FETCH_ACCOUNT_SUCCESS,
        payload: {
          account: Array.isArray(res.data.data) ? res.data.data : [],
          message: res.data.message || "Account fetched successfully",
          totalPages: res.data.totalPages,
          totalRecords: res.data.totalRecords,
          currentPage: res.data.currentPage,
        },
      });
    } catch (err) {
      dispatch({
        type: FETCH_ACCOUNT_FAILURE,
        payload: err.response?.data?.message || err.message,
      });
    }
  };
};
