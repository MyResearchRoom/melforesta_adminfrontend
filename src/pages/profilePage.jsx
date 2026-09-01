import React, { useContext, useEffect, useMemo, useState } from "react";
import useHeader from "../hooks/useHeader";
import HeaderContext from "../context/headercontext";
import { IoArrowBack } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchLoggedUser } from "../redux/actions/loggedUserActions";
const Base_Url = import.meta.env.VITE_BASE_URL;
export default function ProfilePage() {
  const storedUser = JSON.parse(localStorage.getItem("adminuser"));
  const { header } = useContext(HeaderContext);
  useHeader("Profile");
  const navigate = useNavigate();

  const isSuperAdmin = storedUser?.role === "ADMIN";

  const dispatch=useDispatch();
  const { user, error } = useSelector(
    (state) => state.loggedUserState
  );

  useEffect(() => {
    const fetchData = async () => {
        if(!user){
           dispatch(fetchLoggedUser()); 
        }      
    };
    fetchData();
  }, [dispatch,user]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    gender:"",
    phone_number: "",
    address: "",
    profile: "",
    preview:"",

  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
  if (user) {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "",
      gender: user.gender || "",
      phone_number: user.mobileNumber || "",
      address: user.address || "",
      profile: user.profile || "",
      preview: null,
    });
  }
}, [user]);

  const profileUrl = useMemo(() => {
  if (formData.preview) return formData.preview; 

  if (!formData?.profile) return null;

  if (typeof formData.profile === "string" && formData.profile.startsWith("data:")) {
    return formData.profile;
  }

  if (typeof formData.profile === "string" && formData.profile.startsWith("http")) {
    return formData.profile;
  }

  return null;
  }, [formData]);


  const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

 const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const previewUrl = URL.createObjectURL(file);

  setFormData((prev) => ({
    ...prev,
    profile: file,      
    preview: previewUrl, 
  }));
};

  const handleSave = async () => {
  try {
    const token = localStorage.getItem("token");

    const data = new FormData();
    if (isSuperAdmin) {
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("role", formData.role);
      data.append("gender", formData.gender);
      data.append("mobileNumber", formData.phone_number);
      data.append("address", formData.address);
    }

    if (formData.profile instanceof File) {
      data.append("profile", formData.profile);
    }


    const res = await axios.put(`${Base_Url}/api/auth/updateUser`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.data.success) {
      toast.success(res.data.message || "Profile updated successfully ✅");
      setIsEditing(false);
      // Update localStorage user if needed
      localStorage.setItem("user", JSON.stringify(res.data.data));
      setFormData((prev) => ({ ...prev, ...res.data.data }));
    } else {
      toast.error(res.data.message || "Failed to update profile");
    }
  } catch (err) {
    console.error("Profile update failed:", err);
    toast.error(err.response?.data?.message || "Failed to update profile");
  }
  };

  const handleCancel = () => {
  if (user) {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "",
      gender: user.gender || "",
      phone_number: user.mobileNumber || "",
      address: user.address || "",
      profile: user.profile || "",
      preview: null, 
    });
  }
  setIsEditing(false); 
};


  {error && (
  <p className="text-red-600">
    {typeof error === "string" ? error : error.message || "Something went wrong"}
  </p>
)}

  return (
    <section className="pr-5 py-4">

      <div
        className="pb-2 flex flex-row space-x-2 items-center text-sm md:text-base xl:text-lg font-medium cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <IoArrowBack />
        <p className="font-semibold">{header}</p>
      </div>

      <div className="grid grid-cols-2 gap-x-6 xl:gap-x-10 gap-y-4 px-5 xl:px-7">
        <div className="col-span-2 flex flex-col items-center justify-center pb-4 space-y-2">
          {profileUrl ? (
            <img
              src={profileUrl}
              alt="Profile Picture"
              className="w-28 h-28 xl:w-32 xl:h-32 rounded-full object-cover"
            />
          ) : (
            <CgProfile className="text-gray-500 w-28 h-28 xl:w-32 xl:h-32" />
          )}

          <label 
            className={`text-xs xl:text-sm ${
              isEditing ? "text-blue-600 font-medium cursor-pointer hover:underline" : "text-gray-400 cursor-not-allowed"
            }`}>
            Change Profile Picture
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={!isEditing} 
            />
          </label>
        </div>

        <div className="flex flex-col space-y-1 items-start">
          <p className="font-medium text-sm xl:text-base">Name :</p>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={!isEditing || !isSuperAdmin}
            className={`w-full border border-zinc-400 px-3 py-2 rounded mt-1 text-sm xl:text-base focus:outline-none ${
              (!isEditing || !isSuperAdmin) && "bg-gray-200 cursor-not-allowed"
            }`}
          />
        </div>

        <div className="flex flex-col space-y-1 items-start">
          <p className="font-medium text-sm xl:text-base">Email :</p>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!isEditing || !isSuperAdmin}
            className={`w-full border border-zinc-400 px-3 py-2 rounded mt-1 text-sm xl:text-base focus:outline-none ${
              (!isEditing || !isSuperAdmin) && "bg-gray-200 cursor-not-allowed"
            }`}
          />
        </div>

        <div className="flex flex-col space-y-1 items-start">
          <p className="font-medium text-sm xl:text-base">Role :</p>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            disabled={!isEditing || !isSuperAdmin}
            className={`w-full border border-zinc-400 px-3 py-2 rounded mt-1 text-sm xl:text-base focus:outline-none ${
              (!isEditing || !isSuperAdmin) && "bg-gray-200 cursor-not-allowed"
            }`}
          />
        </div>

        <div className="flex flex-col space-y-1 items-start">
          <p className="font-medium text-sm xl:text-base">Mobile number :</p>
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            disabled={!isEditing || !isSuperAdmin}
            className={`w-full border border-zinc-400 px-3 py-2 rounded mt-1 text-sm xl:text-base focus:outline-none ${
              (!isEditing || !isSuperAdmin) && "bg-gray-200 cursor-not-allowed"
            }`}
          />
        </div>
        <div className="flex flex-col space-y-1 items-start">
          <p className="font-medium text-sm xl:text-base">Gender :</p>
          <input
            type="text"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            disabled={!isEditing || !isSuperAdmin}
            className={`w-full border border-zinc-400 px-3 py-2 rounded mt-1 text-sm xl:text-base focus:outline-none ${
              (!isEditing || !isSuperAdmin) && "bg-gray-200 cursor-not-allowed"
            }`}
          />
        </div>

        <div className="flex flex-col space-y-1 items-start">
          <p className="font-medium text-sm xl:text-base">Address :</p>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            disabled={!isEditing || !isSuperAdmin}
            className={`w-full border border-zinc-400 px-3 py-2 rounded mt-1 text-sm xl:text-base focus:outline-none ${
              (!isEditing || !isSuperAdmin) && "bg-gray-200 cursor-not-allowed"
            }`}
          />
        </div>
      </div>

      <div className="col-span-2 flex justify-end mt-6 px-5">
        {isEditing ? (
          <div className="flex flex-row space-x-3 items-center">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
            >
              Save 
            </button>

            <button
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-400 text-white text-sm rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>

        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Edit
          </button>
        )}
      </div>
    </section>
  );
}
