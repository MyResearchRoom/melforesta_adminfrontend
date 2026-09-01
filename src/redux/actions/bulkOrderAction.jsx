import axios from "axios";
import {
  FETCH_BULKORDERS_FAILURE ,
  FETCH_BULKORDERS_SUCCESS
} from "../actionTypes";

const Base_Url = import.meta.env.VITE_BASE_URL;

export const fetchBulkOrders = (page = 1, limit = 10 ) => {
  return async (dispatch) => {
    try {
      const token=localStorage.getItem("token");
      const res = await axios.get(`${Base_Url}/api/bulkOrder/getBulkOrders`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        params: { page, limit},
      });

      dispatch({
        type: FETCH_BULKORDERS_SUCCESS,
        payload: {
          bulkOrders: Array.isArray(res.data.data) ? res.data.data : [],
          message: res.data.message || "Enquiries fetched successfully",
          totalPages: res.data.totalPages,
          totalRecords: res.data.totalRecords,
          currentPage: res.data.currentPage,
        },
      });
    } catch (err) {
      dispatch({
        type: FETCH_BULKORDERS_FAILURE,
        payload: err.response?.data?.message || err.message,
      });
    }
  };
};
