import axios from "axios";
import { toast } from "react-toastify";
import { fetchCoupons } from "../redux/actions/couponsActions";

const Base_Url = import.meta.env.VITE_BASE_URL;

export const saveCoupon = async ({ couponId = null, data }) => {
  const isEditMode = !!couponId;
  

  const token = localStorage.getItem("token");

  try {
    let res;
    if (isEditMode) {
        //update API
         res = await axios.patch(`${Base_Url}/api/coupon/edit-coupon/${couponId}`,data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        );
    } else {
        //add API
        res = await axios.post(`${Base_Url}/api/coupon/add-coupon`, data, 
        {
            headers: {
                Authorization: `Bearer ${token}`,
              },
        });
    }
    toast.success(res.data.message || (isEditMode ? "Coupon updated!" : "Coupon added!"));
    // dispatch(fetchCoupons()); 

  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Failed to save Coupon");
    throw err; 
  }
};
