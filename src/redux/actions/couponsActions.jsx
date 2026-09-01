import axios from "axios";
import {
  FETCH_COUPONS_SUCCESS,
  FETCH_COUPONS_FAILURE,
} from "../actionTypes";

const Base_Url = import.meta.env.VITE_BASE_URL;


export const fetchCoupons = (page = 1, limit = 10, search = "",isActive="",applicableType="",visibility="") => {
  return async (dispatch) => {
    try {
      const token=localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("adminuser"));
      const res = await axios.get(`${Base_Url}/api/coupon/getCoupanlist`, {
        // headers: {
        //   Authorization: `Bearer ${token}`, 
        // },
        params: { page, limit, search, isActive, applicableType, visibility,role:user?.role},
      });

      dispatch({
        type: FETCH_COUPONS_SUCCESS,
        payload: {
          coupons: Array.isArray(res.data.data) ? res.data.data : [],
          message: res.data.message || "Coupans fetched successfully",
          totalPages: res.data.totalPages,
          totalRecords: res.data.totalRecords,
          currentPage: res.data.currentPage,
        },
      });
    } catch (err) {
      dispatch({
        type: FETCH_COUPONS_FAILURE,
        payload: err.response?.data?.message || err.message,
      });
    }
  };
};
