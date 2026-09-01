import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import InputField from "../../../common/InputField";
import {PRODUCT_MANAGER,DELIVERY_ASSOCIATE} from "../../../../constants/role";
import { FaUpload } from "react-icons/fa6";
import { StaffData } from "../../../../data/staffdata";
import axios from "axios";
const Base_Url = import.meta.env.VITE_BASE_URL;
export default function AddStaff({ staffId = null, onSubmit }) {
  const isEditMode = !!staffId;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
    gender: "",
    phoneNo: "",
    role: "",
    profileImage:"",
  });

  useEffect(() => {
  const fetchStaffDetails = async () => {
    if (!staffId) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${Base_Url}/api/auth/getStaffDetails/${staffId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        const staff = res.data.data;

        setFormData({
          name: staff.name || "",
          email: staff.email || "",
          address: staff.address || "",
          password: "",
          confirmPassword: "",
          gender: staff.gender || "",
          phoneNo: staff.mobileNumber || "",
          role: staff.role || "",
          profileImage: staff.profile || "", 
          preview: null,
        });
      } else {
        toast.error(res.data.message || "Failed to fetch staff details");
      }
    } catch (err) {
      console.error("❌ Fetch staff error:", err);
      toast.error(err.response?.data?.message || "Failed to load staff details");
    }
  };

  fetchStaffDetails();
  }, [staffId]);

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
  const { name, type, files, value } = e.target;
  if (type === "file" && files.length > 0) {
   setFormData({ ...formData, [name]: files[0], preview: URL.createObjectURL(files[0]) });
  } else {
    setFormData({ ...formData, [name]: value });
  }
  };
  
  const validate = () => {
  const newErrors = {};
  const requiredFields = [
    "name",
    "email",
    "address",
    "gender",
    "phoneNo",
    "role",
  ];

  requiredFields.forEach((field) => {
    if (!formData[field]) newErrors[field] = "This field is required";
  });

  if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = "Invalid email format";
  }

  if (formData.phoneNo && !/^\d{10}$/.test(formData.phoneNo)) {
    newErrors.phoneNo = "Invalid mobile number";
  }

  if (!isEditMode) {
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    }

    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match";
      toast.error("Password and Confirm Password do not match");
    }
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

  try {
    if (isEditMode) {
      // edit API
      const staffData = new FormData();
      staffData.append("name", formData.name);
      staffData.append("email", formData.email);
      staffData.append("mobileNumber", formData.phoneNo);
      staffData.append("gender", formData.gender);
      staffData.append("address", formData.address);
      staffData.append("role", formData.role);

      if (formData.profileImage instanceof File) {
        staffData.append("profile", formData.profileImage);
      }

      const token = localStorage.getItem("token"); 
      const res = await axios.put(
        `${Base_Url}/api/auth/editStaff/${staffId}`,
        staffData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message || "Staff updated successfully!");
    } else {
      const staffData = new FormData();
      staffData.append("name", formData.name);
      staffData.append("email", formData.email);
      staffData.append("mobileNumber", formData.phoneNo);
      staffData.append("gender", formData.gender);
      staffData.append("address", formData.address);
      staffData.append("role", formData.role);
      staffData.append("password", formData.password);
      staffData.append("isBlock", "false");

      if (formData.profileImage instanceof File) {
        staffData.append("profile", formData.profileImage);
      }

      const token = localStorage.getItem("token");
      const res = await axios.post(`${Base_Url}/api/auth/register`, staffData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(res.data.message || "Staff Added successful!");
      console.log("✅ Add Response:", res.data);
    }

    if (onSubmit) {
      onSubmit();
    }
  } catch (err) {
    console.error("❌ API error:", err);
    toast.error(
        err.response?.data?.message ||
        (isEditMode ? "Staff update failed" : "Staff add failed")
    );
  }
 };

return (
<div className="flex flex-col px-4 pt-3 py-5 bg-white w-full">
<h2 className="text-xl xl:text-2xl font-bold mb-4 ">{isEditMode ? "Edit Staff" : "Add Staff"}</h2>
<form onSubmit={handleSubmit} className="space-y-6">
  <div className="flex flex-col justify-center items-center space-y-2">
  <p className="font-medium text-sm xl:text-base">Profile Picture</p>

  {formData.profileImage ? (
    <div className="relative group">
      <img
        src={formData.preview || formData.profileImage}
        alt="Profile Preview"
        className="w-28 h-28 object-cover rounded-full border"
      />
      
      <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white text-xs opacity-0 group-hover:opacity-100 rounded-full cursor-pointer">
        Change
        <input
          type="file"
          name="profileImage"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />
      </label>
    </div>
  ) : (
    <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-full p-6 cursor-pointer hover:border-gray-400 transition-all">
      <FaUpload/>
      <input
        type="file"
        name="profileImage"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </label>
  )}
  </div>

  <h3 className="text-base xl:text-lg font-semibold">Staff Information</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">

    <InputField
      label="Name"
      name="name"
      value={formData.name}
      onChange={handleChange}
      required
      error={errors.name}
    />

    <InputField
      label="Role"
      name="role"
      value={formData.role}
      onChange={handleChange}
      isSelect
      options={[PRODUCT_MANAGER,DELIVERY_ASSOCIATE]}
      required
      error={errors.role}
    />

    <InputField
      label="Email"
      name="email"
      value={formData.email}
      onChange={handleChange}
      required
      error={errors.email}
    />

    <InputField
      label="Mobile Number"
      name="phoneNo"
      value={formData.phoneNo}
      onChange={handleChange}
      required
      error={errors.phoneNo}
    />

    <InputField
      label="Address"
      name="address"
      value={formData.address}
      onChange={handleChange}
      required
      error={errors.address}
    />

    <InputField
      label="Gender"
      name="gender"
      value={formData.gender}
      onChange={handleChange}
      isSelect
      options={["male", "female", "other"]}
      required
      error={errors.gender}
    />

  </div>

  <h3 className="text-base xl:text-lg font-semibold">Set Password</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <InputField
      label="Password"
      name="password"
      type="password"
      required
      value={formData.password}
      onChange={handleChange}
      error={errors.password}
      disabled={isEditMode}
    />

    <InputField
      label="Confirm Password"
      name="confirmPassword"
      type="password"
      required
      value={formData.confirmPassword}
      onChange={handleChange}
      error={errors.confirmPassword}
      disabled={isEditMode}
    />
  </div>


  <div className="flex justify-end gap-3 text-xs xl:text-sm">
    <button
      type="button"
      onClick={() => window.location.reload()} 
      className="bg-gray-400 text-white px-4 py-2 rounded"
    >
      Cancel
    </button>

    <button
      type="submit"
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      {isEditMode ? "Update" : "Save"}
    </button>
  </div>
</form>

  
</div>
);
}
