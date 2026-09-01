import React, { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";

export default function CustomFilter({
  options = [],
  value = "all",
  onChange,
  placeholder = "Select Option",
  allLabel = "All",
  className = "",
  disabled = false,

}) {
  const [openDropdown, setOpenDropdown] = useState(false);

  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpenDropdown(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // Selected Label
  const selectedOption = options.find(
    (item) => item.value === value
  );

  return (
    <div
      ref={dropdownRef}
      className={`relative w-full ${className}`}
    >
        <div className="">

        
      {/* Selected */}
      <div
        onClick={() =>{
           if (!disabled) {
            setOpenDropdown(!openDropdown);
          }}
        }
        className={`
          px-3
          py-2
          border
          border-primary
          rounded-md
          bg-white
          cursor-pointer
          flex
          justify-between
          items-center
          text-sm
          text-[#3E2C1C]
          ${disabled ? "cursor-not-allowed opacity-50 bg-gray-100" : "cursor-pointer"}
          `}
      >
        <span className="capitalize">
          {value === "all"
            ? allLabel
            : selectedOption?.label ||
              placeholder}
        </span>
        
          <FaChevronDown className="text-gray-500 text-sm"/>
        </div>

      </div>

      {/* Dropdown */}
      {openDropdown && !disabled && (
        <div
          className="
            absolute
            mt-1
            w-full
            bg-white
            border
            border-yellow-200
            rounded-lg
            shadow-lg
            z-50
            max-h-72
            overflow-y-auto
          "
        >
          {/* All Option */}
          <div
            onClick={() => {
              onChange("all");
              setOpenDropdown(false);
            }}
            className="
              px-4
              py-2
              hover:bg-yellow-200
              cursor-pointer
              font-medium
            "
          >
            {allLabel}
          </div>

          {/* Options */}
          {options.map((item) => (
            <div
              key={item.value}
              onClick={() => {
                onChange(item.value);
                setOpenDropdown(false);
              }}
              className="
                px-4
                py-2
                hover:bg-yellow-200
                cursor-pointer
                capitalize
              "
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}