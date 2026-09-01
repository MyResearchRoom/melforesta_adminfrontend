import axios from "axios";
import {
  FETCH_PINCODE_FAILURE,
  FETCH_PINCODE_SUCCESS,
} from "../actionTypes";

const Base_Url = import.meta.env.VITE_BASE_URL;

export const fetchPincodes = (page = 1, limit = 10, searchTerm = "") => {
  return async (dispatch) => {
    try {
      const token=localStorage.getItem("token");
      const res = await axios.get(`${Base_Url}/api/pincode/getPincodelist`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        params: { page, limit, search: searchTerm },
      });

      dispatch({
        type: FETCH_PINCODE_SUCCESS,
        payload: {
          pincodes: Array.isArray(res.data.data) ? res.data.data : [],
          message: res.data.message || "Pincodes fetched successfully",
          totalPages: res.data.totalPages,
          totalRecords: res.data.totalRecords,
          currentPage: res.data.currentPage,
        },
      });
    } catch (err) {
      dispatch({
        type: FETCH_PINCODE_FAILURE,
        payload: err.response?.data?.message || err.message,
      });
    }
  };
};
