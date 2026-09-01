import { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaTruck } from "react-icons/fa";
import { MdLocationCity } from "react-icons/md";
import { toast } from "react-toastify";
import axios from "axios";
import { savePincode } from "../../../../services/savePincodes";

const Base_Url = import.meta.env.VITE_BASE_URL;

export default function AddPincode({
  pincodeId = null,
  onSubmit,
  onClose,
}) {
  const isEditMode = !!pincodeId;

  const [formData, setFormData] = useState({
    pinCode: "",
    district: "",
    state: "",
    city: "",
    deliveryDays: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchPincodeDetailsById = async () => {
      if (!pincodeId) return;

      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${Base_Url}/api/pincode/getPincodeDetails/${pincodeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.success) {
          const pincode = res.data.data;

          setFormData({
            pinCode: pincode.pinCode || "",
            district: pincode.district || "",
            state: pincode.state || "",
            city: pincode.city || "",
            deliveryDays: pincode.deliveryDays || "",
          });
        }
      } catch (err) {
        toast.error(
          err.response?.data?.message ||
            "Failed to load pincode details"
        );
      }
    };

    fetchPincodeDetailsById();
  }, [pincodeId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.pinCode) {
      newErrors.pinCode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pinCode)) {
      newErrors.pinCode = "Pincode must be 6 digits";
    }

    if (!formData.state) {
      newErrors.state = "State is required";
    }

    if (!formData.district) {
      newErrors.district = "District is required";
    }

    if (!formData.city) {
      newErrors.city = "City is required";
    }

    if (!formData.deliveryDays) {
      newErrors.deliveryDays = "Delivery days required";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validate();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const data = {
      pinCode: formData.pinCode,
      district: formData.district,
      state: formData.state,
      city: formData.city,
      deliveryDays: formData.deliveryDays,
    };

    const token = localStorage.getItem("token");

    try {
      await savePincode({ pincodeId, data, token });

      // toast.success(
      //   isEditMode
      //     ? "Pincode updated successfully"
      //     : "Pincode added successfully one"
      // );

      if (onSubmit) onSubmit();
      if (onClose) onClose();
    } catch (err) {
      console.log(err);
      toast.error("Failed to save pincode");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">

      <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden">
        
        <div className="bg-custom-gradient1 px-6 py-5 text-white">
          <h2 className="text-xl md:text-2xl font-semibold">
            {isEditMode ? "Update Pincode" : "Add New Pincode"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-white text-xl hover:rotate-90 transition"
          >
            ✕
          </button>
        </div>


        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-3"
        >
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Pincode <span className="text-red-500">*</span>
            </label>

            <div className="flex items-center border rounded-xl px-3 focus-within:ring-2 focus-within:ring-primary">
              <FaMapMarkerAlt className="text-gray-400" />

              <input
                type="text"
                name="pinCode"
                placeholder="Enter pincode"
                value={formData.pinCode}
                onChange={handleChange}
                className="w-full p-3 outline-none rounded-xl"
              />
            </div>

            {errors.pinCode && (
              <p className="text-red-500 text-sm mt-1">
                {errors.pinCode}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                State <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="state"
                placeholder="Enter state"
                value={formData.state}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary"
              />

              {errors.state && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.state}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                City <span className="text-red-500">*</span>
              </label>

              <div className="flex items-center border rounded-xl px-3 focus-within:ring-2 focus-within:ring-primary">
                <MdLocationCity className="text-gray-400" />

                <input
                  type="text"
                  name="city"
                  placeholder="Enter city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full p-3 outline-none"
                />
              </div>

              {errors.city && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.city}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              District <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              name="district"
              placeholder="Enter district"
              value={formData.district}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary"
            />

            {errors.district && (
              <p className="text-red-500 text-sm mt-1">
                {errors.district}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Expected Delivery Days <span className="text-red-500">*</span>
            </label>

            <div className="flex items-center border rounded-xl px-3 focus-within:ring-2 focus-within:ring-primary">
              <FaTruck className="text-gray-400" />

              <input
                type="number"
                min={0}
                name="deliveryDays"
                placeholder="Enter expected delivery days"
                value={formData.deliveryDays}
                onChange={handleChange}
                className="w-full p-3 outline-none"
              />
            </div>

            {errors.deliveryDays && (
              <p className="text-red-500 text-sm mt-1">
                {errors.deliveryDays}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 border border-gray-300 py-3 rounded-xl hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-1/2 bg-custom-gradient1 text-white py-3 rounded-xl hover:bg-custom-gradient1-hover transition shadow-md"
            >
              {isEditMode ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}