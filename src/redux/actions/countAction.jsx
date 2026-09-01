import axios from "axios";
import { FETCH_COUNTS_SUCCESS, FETCH_COUNTS_FAILURE } from "../actionTypes";

const Base_Url = import.meta.env.VITE_BASE_URL;

export const fetchCounts = () => {
  return async (dispatch) => {
    try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${Base_Url}/api/count/getCounts`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    dispatch({
      type: FETCH_COUNTS_SUCCESS,
      payload: res.data.data,
    });
    } catch (err) {
    dispatch({
      type: FETCH_COUNTS_FAILURE,
      payload: err.response?.data?.message || err.message,
    });
  }
  };
};
