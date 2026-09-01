import React, { useState, useRef, useEffect } from "react";
import { Logo } from "../../assets/common";
import { BsArrowRight } from "react-icons/bs";
import { toast } from "react-toastify";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { ADMIN, PRODUCT_MANAGER } from "../../constants/role";
const Base_Url = import.meta.env.VITE_BASE_URL;

export default function VerifyOtpPage({ setUser }) {
  const location = useLocation();
  const role = location?.state?.role;
  const email = location?.state?.email;
  const navigate=useNavigate();

  const [otp, setOtp] = useState(["", "", "", "","",""]);
  const [timer, setTimer] = useState(180);

  const inputRefs = useRef([]);

  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleChange = (value, index) => {

    if (!/^\d*$/.test(value)) return;

    const updatedOtp = [...otp];

    updatedOtp[index] = value.slice(-1);

    setOtp(updatedOtp);

    // AUTO FOCUS NEXT INPUT
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {

    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const joinedOtp = otp.join("");

    if (otp.includes("") || joinedOtp.length < 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    try {
        const response = await axios.post(`${Base_Url}/api/auth/verifyLoginOtp`, 
            {
            email, 
            otp: joinedOtp 
            });
        // console.log("otp response",response);
        const {message,data} = response.data
        const user = {
          id:data.id,
          role: data.role,
          name: data.name,     
        };
        localStorage.setItem("token", data.token);
        localStorage.setItem("adminuser", JSON.stringify(user));
        setUser(user);
        toast.success(message||"Login successful!!!!!");
        if (data.role === ADMIN) {     
          navigate("/admin/dashboard");
        } else if (data.role === PRODUCT_MANAGER) {
          navigate("/product-manager/dashboard");
        } else {
          navigate("/unauthorized");
        }
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Verification failed. Try again!");
        }
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    try {
        const response = await axios.post(`${Base_Url}/api/auth/resendOtp`, 
        {
            email, 
        });
        const {message,data} = response.data
      toast.success(message || "OTP resent successfully!");
      setTimer(60);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div
      className="
        min-h-screen
        bg-[#fffdf8]
        flex
        items-center
        justify-center
        px-4
        relative
        overflow-hidden
      "
    >

      {/* BACKGROUND GLOW */}

      <div
        className="
          absolute
          top-[-120px]
          right-[-120px]
          w-[300px]
          h-[300px]
          bg-[#f6d38d]
          rounded-full
          blur-3xl
          opacity-30
        "
      />

      <div
        className="
          absolute
          bottom-[-100px]
          left-[-100px]
          w-[250px]
          h-[250px]
          bg-[#f0b44c]
          rounded-full
          blur-3xl
          opacity-20
        "
      />

      {/* OTP CARD */}

      <div
        className="
          relative
          z-10
          w-full
          max-w-xl
          bg-white
          rounded-[32px]
          shadow-xl
          border
          border-[#f4e2bc]
          p-8
          md:p-10
        "
      >

        {/* LOGO */}

        <div className="flex justify-center">

          <div
            className="
              w-24
              h-24
              rounded-full
              bg-[#fff7e8]
              flex
              items-center
              justify-center
              shadow-md
            "
          >

            <img
              src={Logo}
              alt="Melforesta"
              className="w-20 h-20 object-contain"
            />

          </div>

        </div>

        {/* HEADING */}

        <div className="text-center mt-6">

          <p
            className="
              uppercase
              tracking-[4px]
              text-xs
              text-[#b7791f]
              font-semibold
            "
          >
            Melforesta Security
          </p>

          <h1
            className="
              text-3xl
              font-bold
              text-[#7d4400]
              mt-3
            "
          >
            Verify OTP
          </h1>

          <p
            className="
              text-sm
              text-gray-500
              mt-3
              leading-6
            "
          >
            Enter the 6-digit OTP sent to your
            registered email.
          </p>

        </div>

        {/* OTP INPUTS */}

        <div className="flex justify-center gap-2 md:gap-4 mt-10">

          {otp.map((digit, index) => (

            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) =>
                handleChange(e.target.value, index)
              }
              onKeyDown={(e) =>
                handleKeyDown(e, index)
              }
              className="
                w-10 h-10
                md:w-14
                md:h-14
                rounded-lg
                md:rounded-2xl
                border-2
                border-[#f1d9a7]
                text-center
                text-2xl
                font-bold
                text-[#7d4400]
                outline-none
                focus:border-[#d98a11]
                focus:ring-4
                focus:ring-[#f5d7a0]
                transition
              "
            />

          ))}

        </div>

        {/* VERIFY BUTTON */}

        <button
          className="
            mt-10
            w-full
            h-14
            rounded-2xl
            bg-[#d98a11]
            hover:bg-[#b96f00]
            text-white
            font-semibold
            text-base
            transition
            flex
            items-center
            justify-center
            gap-2
            shadow-lg
          "
          onClick={handleSubmit}
        >

          Verify OTP

          <BsArrowRight size={18} />

        </button>

        {/* RESEND */}

        {/* <div className="text-center mt-6">

          <p className="text-sm text-gray-500">

            Didn’t receive the OTP?

            <button
              className="
                ml-2
                text-[#c97a00]
                font-semibold
                hover:underline
              "
            >
              Resend
            </button>

          </p>

        </div> */}

        <div className="mt-2 text-center text-sm md:text-base text-gray-600 mb-6">
              {timer > 0 ? (
                <p>
                  Resend OTP in{" "}
                  <span className="font-semibold text-purple-600">
                    {formatTime(timer)}
                  </span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isResending}
                  className={` font-medium ${isResending ? "cursor-not-allowed text-primary" : "text-blue-600 hover:underline"}`}
                >
                  {isResending ? "Resending..." : "Resend OTP"}
                </button>
              )}
            </div>

      </div>

    </div>
  );
}