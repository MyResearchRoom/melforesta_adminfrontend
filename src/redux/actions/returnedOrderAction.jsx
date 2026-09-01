import axios from "axios";
import {
  FETCH_REURNEDORDERS_SUCCESS,
  FETCH_REURNEDORDERS_FAILURE,
} from "../actionTypes";
const Base_Url = import.meta.env.VITE_BASE_URL;

export const fetchReturnOrderProducts = (page = 1, limit = 10,returnStatus="") => {
  return async (dispatch) => {
    try {
      const token=localStorage.getItem("token");
      
      const res = await axios.get(`${Base_Url}/api/returnProductOrder/getAllReturnedProducts`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        params: { page, limit, returnStatus},
      });

      dispatch({
        type: FETCH_REURNEDORDERS_SUCCESS,
        payload: {
          returnedproduct: res.data.data,
          message: res.data.message || "Return Product fetched successfully",
          totalPages: res.data.totalPages,
          totalRecords: res.data.totalRecords,
          currentPage: res.data.currentPage,
        },
      });
    } catch (err) {
      dispatch({
        type: FETCH_REURNEDORDERS_FAILURE,
        payload: err.response?.data?.message || err.message,
      });
    }
  };
};
