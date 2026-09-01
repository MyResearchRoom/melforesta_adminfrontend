import { useEffect, useState } from "react";
import { FaFileUpload } from "react-icons/fa";
import { toast } from "react-toastify";
import { saveCategory } from "../../../../services/saveCategory";
import axios from "axios";
const Base_Url = import.meta.env.VITE_BASE_URL;
export default function AddCategory({ categoryId = null, onSubmit ,onClose}) {
  const isEditMode = !!categoryId;
  const [formData, setFormData] = useState({
    name: "",
    icon: null,
    preview: null,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
  const fetchCategoryDetails = async () => {
    if (!categoryId) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${Base_Url}/api/category/getCategoryDetails/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        const category = res.data.data;

        setFormData({
          name: category.name || "",
        });
      } else {
        toast.error(res.data.message || "Failed to fetch category details");
      }
    } catch (err) {
      console.error("❌ Fetch Category error:", err);
      toast.error(err.response?.data?.message || "Failed to load category details");
    }
  };

  fetchCategoryDetails();
  }, [categoryId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleIconUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    setFormData({ ...formData, icon: file, preview: URL.createObjectURL(file) });
  }
 };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Category name is required";
    return newErrors;
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

     const data = {
      name: formData.name,
      isBlock: false,
    };
    const token = localStorage.getItem("token");

    try {
      await saveCategory({ categoryId, data, token });
      if (onSubmit) onSubmit();
      if (onClose) onClose();
    } catch (err) {
      console.error("Save category failed:", err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white w-[90%] max-w-md rounded-lg shadow-lg p-6 relative">
        
        
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 text-xl hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold text-center mb-6">
          {isEditMode ? "Edit Category" : "Add new category"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
        
          <div>
            <input
              type="text"
              name="name"
              placeholder="New category Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2
               focus:ring-[#A63F40]"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

         
         {/* <div className="flex flex-col items-center justify-center  cursor-pointer relative group">
          <label className=" border border-gray-300 p-4 w-full rounded-lg flex flex-col items-center justify-center cursor-pointer relative">
          {formData.preview ||formData.icon ? (
          <>
            <img
              src={formData.preview||formData.icon}
              alt="Category Icon"
              className="w-full h-36 object-cover rounded hover:scale-105"
            />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded transition">
                <span className="text-white text-xs font-medium">Change</span>
              </div>
          </>
          ) : (
          <>
            <FaFileUpload className="text-gray-500 text-2xl mb-2" />
            <p className="text-gray-500 text-sm">Upload image for category</p>
          </>
           )}

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleIconUpload}
          />
          </label>
          {errors.icon && (
            <p className="text-red-500 text-sm mt-1">{errors.icon}</p>
          )}
        </div> */}

          
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-primary text-white w-full py-2 rounded-md hover:bg-custom-gradient1-hover transition"
            >
              {isEditMode ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
