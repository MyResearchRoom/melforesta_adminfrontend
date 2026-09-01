import axios from "axios";
import {
  FETCH_LOGGEDUSER_FAILURE,
  FETCH_LOGGEDUSER_SUCCESS,
} from "../actionTypes";

const Base_Url = import.meta.env.VITE_BASE_URL;

export const fetchLoggedUser = (token) => {
  return async (dispatch) => {
    try {;
      const res = await axios.get(`${Base_Url}/api/auth/getUser`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch({
        type: FETCH_LOGGEDUSER_SUCCESS,
        payload: {
          user: res.data.data || null,
          message: res.data.message || "User fetched successfully",
        },
      });
    } catch (err) {
      dispatch({
        type: FETCH_LOGGEDUSER_FAILURE,
        payload: err.response?.data?.message || err.message,
      });
    }
  };
};
