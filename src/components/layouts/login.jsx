import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Hive, LoginImage, Logo } from "../../assets/common";
import { ADMIN, PRODUCT_MANAGER } from "../../constants/role";
import axios from "axios";
const Base_Url = import.meta.env.VITE_BASE_URL;
export default function LoginPage({ setUser }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role:"",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({});
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    if (!formData.role.trim()) newErrors.role = "Role is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length == 0)
    {
      try {
        setIsLoading(true);
        const res = await axios.post(`${Base_Url}/api/auth/login`, formData);
        const {message} = res.data
        if (message) {
          toast.success(
            message || "Please verify the OTP sent on your registered email address to login."
          );
          navigate("/verify-otp", {
            state: {
              role: formData.role,
              email: formData.email,
            },
          });
        } else{
          toast.error("Faild to login");
        }
      } 
      catch (err) 
      {
        if (err.response && err.response.data && err.response.data.message) {
          toast.error(err.response.data.message);
        } else {
          toast.error("Login failed. Try again!");
        }
        console.error("Login error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    else
    {
      return;
    }
  };


  return (
    <div className="min-h-screen flex justify-center items-center px-4 sm:px-6 md:px-12 py-6 bg-gradient-to-br from-[#fff8e8] via-[#fffdf8] to-[#f7efe2]">

      <div className="w-full my-5 max-w-5xl bg-white/90 backdrop-blur-sm rounded-[28px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col md:flex-row border border-[#f3e2b5]">

        <div className="order-2 md:order-1 md:w-1/2  bg-gradient-to-br from-[#f0a429] via-[#d98a11] to-[#a85b00] p-8 md:p-10 flex flex-col justify-between relative">

          <div className="absolute top-[-50px] right-[-50px] w-52 h-52 bg-white/10 rounded-full blur-3xl"></div>

          <div className="absolute bottom-[-70px] left-[-40px] w-56 h-56 bg-white/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">

            <div className="flex items-start justify-between gap-5">
              <div>

                <div
                  className="
                    inline-flex
                    items-center
                    px-4
                    py-1.5
                    rounded-full
                    bg-white/15
                    border
                    border-white/20
                    backdrop-blur-md
                    shadow-md
                    mb-5
                  "
                >
                  <p className="text-xs md:text-sm text-white tracking-wide font-semibold">
                    Welcome to MELFORESTA
                  </p>
                </div>

                <h2
                  className="
                    text-3xl
                    md:text-4xl
                    xl:text-5xl
                    font-extrabold
                    text-white
                    leading-tight
                  "
                >
                  Login
                </h2>

              </div>

              <div
                className="
                  w-24
                  h-24
                  md:w-28
                  md:h-28
                  rounded-full
                  bg-white/15
                  border
                  border-white/20
                  backdrop-blur-md
                  flex
                  items-center
                  justify-center
                  shadow-2xl
                  p-3
                  shrink-0
                "
              >

                <div
                  className="
                    w-full
                    h-full
                    rounded-full
                    bg-white
                    flex
                    items-center
                    justify-center
                    shadow-lg
                  "
                >
                  <img
                    src={Logo}
                    alt="login"
                    className="
                      w-14
                      md:w-16
                      object-contain
                    "
                  />
                </div>

              </div>

            </div>

            <p
              className="
                text-sm
                md:text-base
                lg:text-lg
                mt-6
                text-[#fff5e6]
                leading-7
                max-w-sm
              "
            >
              Login to access your account, orders and personalized experience.
            </p>

          </div>

          <div className="relative z-10 mt-12">

            {/* Highlight Tagline */}
            <div
              className="
                inline-flex
                items-center
                px-5
                py-2
                rounded-full
                bg-white/15
                border
                border-white/20
                backdrop-blur-md
                shadow-lg
                mb-5
              "
            >
              <i
                className="
                  text-base
                  md:text-lg
                  font-medium
                  tracking-wide
                  text-[#fff4d8]
                "
              >
                ✨ From Hives to Home
              </i>
            </div>

            {/* Main Text */}
            <h1
              className="
                text-xl
                md:text-2xl
                xl:text-3xl
                font-bold
                font-serif
                text-white
                leading-snug
                max-w-md
              "
            >
              Natural Honey,
              <br />
              Straight from Nature
            </h1>

          </div>
        </div>

        <div className="order-1 md:order-2 md:w-1/2 p-8 md:p-10 lg:p-12
          bg-white">
          <div className="mb-8">

            <h3
              className="
                text-2xl
                md:text-3xl
                font-bold
                text-gray-800
              "
            >
              Login to your Account
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Please enter your credentials to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Role
                </label>
            
                <select
                    value={formData.role}
                    name="role"
                    onChange={handleChange}
                    className={`w-full text-sm xl:text-base px-2 md:px-4 py-2  rounded-md outline-none focus:ring-2 ${
                        errors.role
                        ? "border-2 border-red-500 focus:ring-red-400"
                        : "border border-[#ead7b0] focus:ring-[#e0a52d]"
                    } text-gray-600`}
                >
                    <option value="">Select Role</option>
                    <option value={ADMIN}>Admin</option>
                    <option value={PRODUCT_MANAGER}>Product Manager</option>
                </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email id
              </label>
              <input
                type="text"
                name="email"
                placeholder="Enter your Email / Phone number"
                value={formData.email}
                onChange={handleChange}
                className={`w-full text-sm xl:text-base px-2 md:px-4 py-2  rounded-md outline-none focus:ring-2 ${
                    errors.email
                    ? "border-2 border-red-500 focus:ring-red-400"
                    : "border border-[#ead7b0] focus:ring-[#e0a52d]"
                    } text-gray-600`}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full text-sm xl:text-base px-2 md:px-4 py-2  rounded-md outline-none focus:ring-2 ${
                    errors.password
                    ? "border-2 border-red-500 focus:ring-red-400"
                    : "border border-[#ead7b0] focus:ring-[#e0a52d]"
                    } text-gray-600`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`relative overflow-hidden w-full py-2 rounded-xl font-semibold text-white 
                hover:shadow-xl hover:scale-[1.01] bg-gradient-to-r
                from-[#cf7b00]
                to-[#7f4200] hover:bg-custom-gradient1-dark transition-all duration-300 shadow-lg 
                ${isLoading ? "cursor-not-allowed" : "" }`}
              >
                <div
                  className="
                    absolute
                    inset-0
                    opacity-[0.50]
                    bg-center
                    bg-cover
                    mix-blend-screen
                  "
                  style={{
                    backgroundImage: `url(${Hive})`,
                    backgroundSize: "220px",
                  }}
                />

                <div
                  className="
                    absolute
                    inset-0
                    bg-white/5
                  "
                />

                <span className="relative z-10 tracking-wide">
                  {isLoading ? "Sending OTP..." : "LOG IN"}
                </span>
              </button>
            </div>

          </form>

          <div className=" text-sm mt-8 font-medium text-gray-600 text-right">

            <p>
              Designed and Developed By{" "}

              <a
                href="https://www.wesolutize.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Neowesolutize Technology
              </a>

            </p>

          </div>
        </div>

      </div>
    </div>
  );
}
