import axios from "axios";
import {
  FETCH_CATEGORIES_SUCCESS,
  FETCH_CATEGORIES_FAILURE,
} from "../actionTypes";

const Base_Url = import.meta.env.VITE_BASE_URL;

export const fetchCategories = (page = 1, limit = 10, searchTerm = "") => {
  return async (dispatch) => {
    try {
      const token=localStorage.getItem("token");
      const res = await axios.get(`${Base_Url}/api/category/getCategoryList`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        params: { page, limit, search: searchTerm },
      });

      dispatch({
        type: FETCH_CATEGORIES_SUCCESS,
        payload: {
          categories: Array.isArray(res.data.data) ? res.data.data : [],
          message: res.data.message || "Categories fetched successfully",
          totalPages: res.data.totalPages,
          totalRecords: res.data.totalRecords,
          currentPage: res.data.currentPage,
        },
      });
    } catch (err) {
      dispatch({
        type: FETCH_CATEGORIES_FAILURE,
        payload: err.response?.data?.message || err.message,
      });
    }
  };
};
