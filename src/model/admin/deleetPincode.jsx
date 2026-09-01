import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { fetchPincodes } from "../../redux/actions/pincodeActions";
import axios from "axios";
const Base_Url = import.meta.env.VITE_BASE_URL;
const DeletePincodeModel = ({
  pincodeId,
  isOpen,
  onClose,
}) => {

  if (!isOpen || !pincodeId) return null;

  const [loading, setLoading] = useState(false);
  const dispatch=useDispatch();

  const handleDelete = async() => {
    if (!pincodeId) return;
    // toast.success("call")
      
          try {
            setLoading(true);
      
            const token = localStorage.getItem("token");

            const res = await axios.delete(
              `${Base_Url}/api/pincode/delete-pincode/${pincodeId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            // console.log("res",res);
            
           if (res.data.success) {
              toast.success(res.data.message ||"Pincode deleted successfully..");
              onClose();
              
              dispatch(   
                fetchPincodes()
              );
            } else {
              toast.error("Failed to delete pincode");
            }
          } catch (error) {
             toast.error(error || "Something went wrong");
          } finally {
            setLoading(false);
          }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Confirm Deletion
        </h3>
        <p className="text-sm text-gray-500">
          Are you sure you want to delete this pincode? This action cannot be undone.
        </p>

        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-100 text-gray-700 rounded-md"
          >
            <p className="text-black border border-gray-200 px-4 py-2 rounded-md">Cancel</p>
          </button>

          <button
            onClick={handleDelete}
            className="bg-red-600 px-4 py-2 rounded-md  text-white"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePincodeModel;