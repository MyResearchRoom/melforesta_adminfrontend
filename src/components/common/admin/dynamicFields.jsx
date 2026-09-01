import React, { useState, useEffect, useRef } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export default function DynamicFields({ type, value = [], onChange }) {
  const isObjectMode = !Array.isArray(value);

  const [items, setItems] = useState(
    Array.isArray(value)
      ? value
      : Object.entries(value).map(([k, v]) => ({ key: k, value: v }))
  );

  const prevValueRef = useRef(null);

  useEffect(() => {
    if (JSON.stringify(prevValueRef.current) === JSON.stringify(value)) return;

    prevValueRef.current = value;

    if (Array.isArray(value)) {
      setItems(value);
    } else if (value) {
      setItems(
        Object.entries(value).map(([k, v]) => ({ key: k, value: v }))
      );
    }
  }, [value]);

  useEffect(() => {
    if (!onChange) return;

    const output = isObjectMode
      ? items.reduce((acc, item) => {
          acc[item.key] = item.value;
          return acc;
        }, {})
      : items;

    onChange(output);
  }, [items]);

  const [isAdding, setIsAdding] = useState(false);
  const [current, setCurrent] = useState({ key: "", value: "" });
  const [editIndex, setEditIndex] = useState(null);

  const detectType = (val) => {
    if (val === "true") return true;
    if (val === "false") return false;

    try {
      const parsed = JSON.parse(val);
      return parsed;
    } catch {}

    if (val.includes(",")) {
      return val.split(",").map((i) => i.trim());
    }

    if (!isNaN(val) && val.trim() !== "") return Number(val);

    return val; 
  };

  const handleSave = () => {
    if (!current.key) return;

    let val = current.value;
    val = detectType(val); 

    if (editIndex !== null) {
      const updated = [...items];
      updated[editIndex] = { key: current.key, value: val };
      setItems(updated);
      setEditIndex(null);
    } else {
      setItems([...items, { key: current.key, value: val }]);
    }

    setCurrent({ key: "", value: "" });
    setIsAdding(false);
  };

  const handleCancel = () => {
    setCurrent({ key: "", value: "" });
    setIsAdding(false);
    setEditIndex(null);
  };

  const handleEdit = (index) => {
    const item = items[index];
    let val = item.value;

    if (Array.isArray(val)) val = val.join(", ");
    else if (typeof val === "object") val = JSON.stringify(val);
    else val = String(val);

    setCurrent({ key: item.key, value: val });
    setIsAdding(true);
    setEditIndex(index);
  };

  const handleRemove = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  return (
    <div className="my-4">
      <div className="flex flex-row justify-between items-start">
        <h3 className="text-base xl:text-lg font-semibold mb-2">{type}</h3>

        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="px-4 py-1 lg:py-1.5 bg-custom-gradient2 text-white rounded mb-2 text-[13px] lg:text-[15px]"
        >
          + Add {type}
        </button>
      </div>

      {isAdding && (
        <div className="flex flex-col gap-5 my-4 p-5 py-8 border border-gray-200 shadow-md rounded-xl">
          <div className="flex flex-row space-x-6">
            <input
              type="text"
              placeholder="Title"
              value={current.key}
              onChange={(e) =>
                setCurrent((prev) => ({ ...prev, key: e.target.value }))
              }
              className="flex-1 border border-gray-400 px-2 py-1 lg:py-1.5 shadow-lg rounded-md focus:ring-1 focus:ring-blue-400 focus:outline-none focus:border-none"
            />

            <input
              type="text"
              placeholder="Value (Seperated by commas)"
              value={current.value}
              onChange={(e) =>
                setCurrent((prev) => ({ ...prev, value: e.target.value }))
              }
              className="flex-1 border border-gray-400 px-2 py-1 lg:py-1.5 shadow-lg rounded-md focus:ring-1 focus:ring-blue-400 focus:outline-none focus:border-none"
            />
          </div>

          <div className="flex flex-row space-x-6 justify-end">
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1 lg:py-1.5 bg-primary text-white rounded"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-3 py-1 lg:py-1.5 bg-gray-400 text-white rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {items.length > 0 && (
        <div className="border border-gray-400 rounded-lg mt-8 md:mx-2">
          <table className="w-full text-sm xl:text-base">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 py-2 text-left rounded-tl-lg">Key</th>
                <th className="px-2 py-2 text-center">Value</th>
                <th className="px-2 py-2 text-center rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 border-t border-t-gray-400"
                >
                  <td className="px-2 py-1">{item.key}</td>
                  <td className="px-2 py-1 text-center">
                    {typeof item.value === "boolean"
                      ? item.value
                        ? "True"
                        : "False"
                      : Array.isArray(item.value)
                      ? item.value.join(", ")
                      : typeof item.value === "object"
                      ? JSON.stringify(item.value)
                      : item.value}
                  </td>
                  <td className="px-2 py-1 flex gap-2 justify-center items-center">
                    <button
                      type="button"
                      onClick={() => handleEdit(index)}
                      className="px-2 py-1"
                    >
                      <FaEdit className="text-blue-500 text-lg lg:text-xl" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(index)}
                      className="px-2 py-1"
                    >
                      <MdDelete className="text-red-500 text-lg lg:text-xl" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {items.length === 0 && (
        <p className="text-sx lg:text-sm text-gray-900">
          No {type} data added yet.
        </p>
      )}
    </div>
  );
}
