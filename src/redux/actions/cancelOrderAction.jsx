import axios from "axios";
import {
  FETCH_CANCLEORDERS_SUCCESS,
  FETCH_CANCLEORDERS_FAILURE,
} from "../actionTypes";

const Base_Url = import.meta.env.VITE_BASE_URL;

export const fetchCancelOrderProducts = (page = 1, limit = 10,status="") => {
  return async (dispatch) => {
    try {
      const token=localStorage.getItem("token");
      const res = await axios.get(`${Base_Url}/api/cancelProductOrder/getAllCancelledProductOrders`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        params: { page, limit,status},
      });
      // console.log("cancle prodiuct res",res);

      dispatch({
        type: FETCH_CANCLEORDERS_SUCCESS,
        payload: {
          canceledproduct: res.data.data,
          message: res.data.message || "Cancel Product fetched successfully",
          totalPages: res.data.totalPages,
          totalRecords: res.data.totalRecords,
          currentPage: res.data.currentPage,
        },
      });
    } catch (err) {
      // console.log("cancle prodiuct err",err);
      
      dispatch({
        type: FETCH_CANCLEORDERS_FAILURE,
        payload: err.response?.data?.message || err.message,
      });
    }
  };
};
