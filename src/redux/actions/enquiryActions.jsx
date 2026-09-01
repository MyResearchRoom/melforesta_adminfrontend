import axios from "axios";
import {
  FETCH_ENQUIRIES_SUCCESS ,
  FETCH_ENQUIRIES_FAILURE
} from "../actionTypes";

const Base_Url = import.meta.env.VITE_BASE_URL;

export const fetchEnquiries = (page = 1, limit = 10, searchTerm = "", ) => {
  return async (dispatch) => {
    try {
      const token=localStorage.getItem("token");
      const res = await axios.get(`${Base_Url}/api/enquiry/getEnquiries`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        params: { page, limit, search: searchTerm},
      });

      dispatch({
        type: FETCH_ENQUIRIES_SUCCESS,
        payload: {
          enquiry: Array.isArray(res.data.data) ? res.data.data : [],
          message: res.data.message || "Enquiries fetched successfully",
          totalPages: res.data.totalPages,
          totalRecords: res.data.totalRecords,
          currentPage: res.data.currentPage,
        },
      });
    } catch (err) {
      dispatch({
        type: FETCH_ENQUIRIES_FAILURE,
        payload: err.response?.data?.message || err.message,
      });
    }
  };
};
