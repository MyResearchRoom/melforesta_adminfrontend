import axios from "axios";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { fetchEnquiries } from "../../redux/actions/enquiryActions";

const Base_Url = import.meta.env.VITE_BASE_URL;

export default function DeleteEnquiry({ isOpen, onClose, id, currentPage, itemsPerPage,searchTerm }) {
  const dispatch = useDispatch();

  if (!isOpen) return null;

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`${Base_Url}/api/enquiry/deleteEnquiry/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
      toast.success(res.data.message || "Enquiry deleted successfully!");
      onClose(); 
      dispatch(fetchEnquiries(currentPage, itemsPerPage,searchTerm)); 
      } else 
      {
        toast.error(res.data.message || "Failed to fetch product details");
      }
    } catch (error) {
      toast.error(error.response?.data?.message ||"Failed to delete enquiry. Please try again.");
      console.error("Delete Error:", error);
    }
    //  toast.success("Enquiry deleted successfully!",id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-6 w-80">
        <h2 className="text-lg font-semibold text-gray-800">Confirm Delete</h2>
        <p className="text-sm text-gray-600 mt-2">
          Do you really want to delete this enquiry?
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            No
          </button>
          <button
            onClick={handleConfirmDelete}
            className="px-4 py-2 rounded-lg bg-custom-gradient1 text-white hover:bg-custom-gradient1-hover"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
