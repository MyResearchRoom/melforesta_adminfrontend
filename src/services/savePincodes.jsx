import axios from "axios";
import { toast } from "react-toastify";

const Base_Url = import.meta.env.VITE_BASE_URL;

export const savePincode = async ({ pincodeId = null, data, token }) => {
  const isEditMode = !!pincodeId;

  try {
    let res;

    if (isEditMode) {
      res = await axios.patch(
        `${Base_Url}/api/pincode/editPincode/${pincodeId}`,
        data, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } else {
      res = await axios.post(
        `${Base_Url}/api/pincode/createPincode`,
        data, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }

    toast.success(
      res.data.message || (isEditMode ? "Pincode updated!" : "Pincode added!")
    );
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Failed to save Pincode");
    throw err;
  }
};
