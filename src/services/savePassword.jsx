import axios from "axios";
import { toast } from "react-toastify";

const Base_Url = import.meta.env.VITE_BASE_URL;

export const savePassword = async ({id,password,confirmPassword,token}) => {
    try
    {
      const data = { newPassword: password, confirmPassword };

      const res = await axios.put(`${Base_Url}/api/auth/changePassword/${id}`,data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      );
      toast.success(res.data.message || "Password change success..");

    }catch(err)
    {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to change password");
    }
}