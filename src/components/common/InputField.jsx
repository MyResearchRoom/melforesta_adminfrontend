import React, { useEffect, useState } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaUpload,
  FaRegFile,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { ImFilePdf } from "react-icons/im";

const placeholderMap = {
  email: "e.g., abc@gmail.com",
  mobileNumber: "e.g., 1234567890",
  address: "e.g., 123 Main Street",
  company: "e.g., Acme Corp",
  category: "New Category name",
  discountPercent: "e.g., 10%, 15%",
  screenSize: "e.g., 30 centimeter , 35.5 centimeter",
  cpuModel: "e.g., Celeron, Others",
  ramMemory: "e.g., 8GB, 12GB",
  operatingSystem: "e.g., Windows 10, Windows 11",
  specialFeature: "e.g., Anti Glare Coating, Micro-edge",
  graphicsCard: "e.g., Integrated, others",
  supplierName:"Enter supplier name",
  restockQuantity:"e.g., 10, 50, 120, etc",
  currentStockPricePerUnit:"Enter price of stock per unit",
};

export default function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  required = false,
  readOnly = false,
  disabled = false,
  options = [],
  isSelect = false,
  multiple = false,
  className = "",
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [filePreviews, setFilePreviews] = useState([]);

  useEffect(() => {
    if (Array.isArray(value) && value.length > 0) {
      const previews = value.map((file) => {
        if (file instanceof File) {
          return {
            type:
              file.type === "application/pdf"
                ? "pdf"
                : "other",
            url:
              file.type === "application/pdf"
                ? URL.createObjectURL(file)
                : null,
            name: file.name,
          };
        }

        const fileName =
          typeof file.name === "string"
            ? file.name
            : "";

        return {
          type: fileName
            .toLowerCase()
            .endsWith(".pdf")
            ? "pdf"
            : "other",
          url: file.url || null,
          name: fileName,
        };
      });

      setFilePreviews(previews);
    }
  }, [value]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    const hasImage = files.some((file) =>
      file.type.startsWith("image/")
    );

    if (hasImage) {
      toast.error("Image files are not allowed.");
      e.target.value = "";
      return;
    }

    const previews = files.map((file) => ({
      type:
        file.type === "application/pdf"
          ? "pdf"
          : "other",
      url: URL.createObjectURL(file),
      name: file.name,
    }));

    setFilePreviews((prev) => [
      ...prev,
      ...previews,
    ]);

    onChange({
      target: {
        name,
        type: "file",
        files,
      },
    });
  };

  const handleFileDelete = (index) => {
    setFilePreviews((prev) =>
      prev.filter((_, i) => i !== index)
    );

    if (Array.isArray(value)) {
      const newValue = value.filter(
        (_, i) => i !== index
      );

      onChange({
        target: {
          name,
          value: newValue,
        },
      });
    }
  };

  const handleCheckboxChange = (e) => {
    const {
      value: optionValue,
      checked,
    } = e.target;

    let newValues = Array.isArray(value)
      ? [...value]
      : [];

    if (checked) {
      newValues.push(optionValue);
    } else {
      newValues = newValues.filter(
        (v) => v !== optionValue
      );
    }

    onChange({
      target: {
        name,
        value: newValues,
      },
    });
  };

  const fieldStyle = `
  w-full
  border
  border-[#fde6a8]
  px-3
  py-2
  rounded-lg
  mt-1
  text-sm
  xl:text-base
  text-[#3E2C1C]
  bg-[#fcf7f2]
  focus:border-[#c69311]
  focus:outline-[#c69311]
  transition-all
  duration-200
  ${
    readOnly || disabled
      ? "cursor-not-allowed"
      : ""
  }
  ${className}
`;

  return (
    <div className="flex flex-col space-y-1 items-center px-3 xl:px-6">

      {label && (
        <label className="block font-medium text-sm xl:text-base text-left w-full text-[#3E2C1C]">
          {label}

          {required && (
            <span className="text-red-600 pl-1">
              *
            </span>
          )}
        </label>
      )}

      <div className="flex flex-col w-full">

        {/* Select */}
        {isSelect ? (
          multiple ? (
            <div className="flex flex-wrap gap-3 p-1">

              {options.map((opt) => (
                <label
                  key={opt}
                  className="
                    flex
                    items-center
                    gap-2
                    border
                    border-[#fde6a8]
                    bg-[#fcf7f2]
                    rounded-lg
                    px-3
                    py-2
                    text-sm
                  "
                >
                  <input
                    type="checkbox"
                    value={opt}
                    checked={
                      Array.isArray(value) &&
                      value.includes(opt)
                    }
                    onChange={handleCheckboxChange}
                    disabled={disabled}
                  />

                  {opt}
                </label>
              ))}

            </div>
          ) : (
            <select
              name={name}
              value={value}
              onChange={onChange}
              disabled={disabled}
              className={fieldStyle}
            >
              <option value="">
                Select {label}
              </option>

              {options.map((opt, index) => {
                const optionValue =
                  typeof opt === "object"
                    ? opt.value
                    : opt;

                const optionLabel =
                  typeof opt === "object"
                    ? opt.label
                    : opt;

                return (
                  <option
                    key={index}
                    value={optionValue}
                  >
                    {optionLabel}
                  </option>
                );
              })}
            </select>
          )
        ) : type === "file" ? (

          /* File Upload */
          <div className="space-y-2">

            <input
              id={`file-input-${name}`}
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={() =>
                document
                  .getElementById(
                    `file-input-${name}`
                  )
                  .click()
              }
              className="
                w-full
                flex
                items-center
                justify-center
                gap-2
                px-4
                py-2
                rounded-lg
                border
                border-[#fde6a8]
                bg-[#fcf7f2]
                hover:opacity-90
                transition-all
                duration-200
              "
            >
              <FaUpload />

              <span>
                Upload Document
              </span>
            </button>

            {filePreviews.length > 0 && (
              <ul className="mt-2 space-y-2 text-sm text-gray-700">

                {filePreviews.map((file, index) => (
                  <li
                    key={index}
                    className="
                      flex
                      items-center
                      justify-between
                      gap-3
                      border
                      border-[#fde6a8]
                      bg-[#fcf7f2]
                      rounded-lg
                      px-3
                      py-2
                    "
                  >
                    <div className="flex items-center gap-2">

                      {file.type === "pdf" ? (
                        <ImFilePdf className="text-red-600 text-lg" />
                      ) : (
                        <FaRegFile className="text-blue-600 text-lg" />
                      )}

                      <span className="break-all">
                        {file.name}
                      </span>

                    </div>

                    <div className="flex items-center gap-3">

                      {file.url && (
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 text-sm hover:underline"
                        >
                          View
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          handleFileDelete(index)
                        }
                        className="text-red-600 text-sm hover:underline"
                      >
                        Delete
                      </button>

                    </div>
                  </li>
                ))}

              </ul>
            )}

          </div>
        ) : (

          /* Input */
          <div className="relative">

            <input
              type={
                type === "password" &&
                showPassword
                  ? "text"
                  : type
              }
              name={name}
              value={value}
              onChange={onChange}
              readOnly={readOnly}
              disabled={disabled}
              placeholder={
                placeholderMap[name] ||
                `Enter ${name}`
              }
              className={fieldStyle}
            />

            {type === "password" && (
              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-[#c49110]
                "
              >
                {showPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>
            )}

          </div>
        )}

        {error && (
          <p className="text-red-500 text-xs mt-1">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}