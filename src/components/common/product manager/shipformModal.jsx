import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import capitalizeFirstLetter from "../capitalizeFirstLetter";

export default function ShipmentFormModal({ isOpen, onClose, onSubmit,order }) {
  const [formData, setFormData] = useState({
    deliveryType: "manual",
    courierCompanyName: "",
    trackingId: "",
    deliveryPersonName:"",
    deliveryPersonContact:"",
    pickupDate: "",
    estimatedDeliveryDate: "",
    paymentMode: "",
    boxWeight: "",
    pickupLocation: "D-18, Emirate Hills, Near Bade Hospital, Old Mumbai - Pune Highway Somatne Phata, Pune – 410506. ",
    deliveryAddress: "",
  });

    useEffect(() => {
    if (order) {
      setFormData((prev) => ({
        ...prev,
        paymentMode: order?.paymentMethod || "",
        deliveryAddress: `${capitalizeFirstLetter(order.address.buildingBlock) || ""} ${order.address.flatNo || ""} ${order.address.buildingName || ""} ${order.address.streetName || ""} ${order.address.landmark || "" } ${order.address.city || ""}  ${order.address.pincode || ""}`,
      }));
    }
  }, [order]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.deliveryType === "courier") {
      if (!formData.courierCompanyName.trim()) {
        return toast.error("Courier company is required.");
      }

      if (!formData.trackingId.trim()) {
        return toast.error("Tracking ID is required.");
      }
    }

    if (formData.deliveryType === "manual") {
      if (!formData.deliveryPersonName.trim()) {
        return toast.error("Delivery person name is required.");
      }

      if (!formData.deliveryPersonContact.trim()) {
        return toast.error("Delivery person contact is required.");
      }

      if (!/^[6-9]\d{9}$/.test(formData.deliveryPersonContact)) {
        return toast.error("Enter a valid 10-digit mobile number.");
      }
    }

    const today = new Date();
    const pickup = new Date(formData.pickupDate);
    const estimate = new Date(formData.estimateDate);

    if (pickup < today.setHours(0, 0, 0, 0)) {
      toast.error("Pickup date cannot be in the past.");
      return;
    }

    if (estimate <= pickup) {
      toast.error("Estimate delivery date must be after pickup date.");
      return;
    }

    onSubmit(formData);
  };

  if (!isOpen) return null;

  const Label = ({ children }) => (
    <label>
      {children} <span className="text-red-500">*</span>
    </label>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-2 ">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-4 md:p-6 relative my-4 mx-5 overflow-y-auto h-[92vh]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>
        <h2 className="text-lg font-bold mb-4">Shipping Details</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="">
            <Label>Delivery Type</Label>
            <select
              name="deliveryType"
              value={formData.deliveryType}
              onChange={handleChange}
              className="w-full border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 px-2 py-1 rounded"
            >
              <option value="courier">Courier</option>
              <option value="manual">Manual</option>
            </select>
          </div>

          <div className="hidden md:block"></div>

          {formData.deliveryType === "courier" && (
            <>
              <div>
                <Label>Courier Company</Label>
                <input
                  name="courierCompanyName"
                  value={formData.courierCompanyName}
                  onChange={handleChange}
                  required={formData.deliveryType === "courier"}
                  className="w-full border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 px-2 py-1 rounded"
                />
              </div>

              <div>
                <Label>Tracking ID</Label>
                <input
                  name="trackingId"
                  value={formData.trackingId}
                  onChange={handleChange}
                  required={formData.deliveryType === "courier"}
                  className="w-full border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 px-2 py-1 rounded"
                />
              </div>
            </>
          )}

          {formData.deliveryType === "manual" && (
            <>
              <div>
                <Label>Delivery Person Name</Label>
                <input
                  type="text"
                  name="deliveryPersonName"
                  value={formData.deliveryPersonName}
                  onChange={handleChange}
                  required={formData.deliveryType === "manual"}
                  className="w-full border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 px-2 py-1 rounded"
                />
              </div>

              <div>
                <Label>Delivery Person Contact</Label>
                <input
                  type="tel"
                  name="deliveryPersonContact"
                  value={formData.deliveryPersonContact}
                  onChange={handleChange}
                  maxLength={10}
                  pattern="[6-9]{1}[0-9]{9}"
                  required={formData.deliveryType === "manual"}
                  className="w-full border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 px-2 py-1 rounded"
                  placeholder="Enter 10-digit mobile number"
                />
              </div>
            </>
          )}

          <div>
            <Label>Pickup Date</Label>
            <input
              type="date"
              name="pickupDate"
              className="w-full border border-gray-400 focus:outline-none focus:border-none focus:ring-2 focus:ring-blue-400 px-2 py-1 rounded"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label>Estimate Delivery Date</Label>
            <input
              type="date"
              name="estimatedDeliveryDate"
              className="w-full border border-gray-400 focus:outline-none focus:border-none focus:ring-2 focus:ring-blue-400 px-2 py-1 rounded"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label>Payment Mode</Label>
            <input
              name="paymentMode"
              value={formData.paymentMode}
              className="w-full border border-gray-400 focus:outline-none focus:border-none focus:ring-2 focus:ring-blue-400 px-2 py-1 rounded cursor-not-allowed bg-gray-200"
              onChange={handleChange}
              readOnly
              required
            />
          </div>

          <div>
            <Label>Box / Package Weight</Label>
            <input
              name="boxWeight"
              type="number"
              step="0.01"
              placeholder="Enter weight in kg"
              className="w-full border border-gray-400 focus:outline-none focus:border-none focus:ring-2 focus:ring-blue-400 px-2 py-1 rounded"
              onChange={handleChange}
              value={formData.boxWeight}
              required
            />
          </div>

          <div>
            <Label>Pickup Location</Label>
            <textarea
              name="pickupLocation"
              value={formData.pickupLocation}
              className="w-full border border-gray-500 px-2 py-1 rounded cursor-not-allowed bg-gray-200"
              required
              readOnly 

            />
          </div>

          <div className="md:col-span-2">
            <Label>Delivery Address</Label>
            <textarea
              name="deliveryAddress"
              value={formData.deliveryAddress} 
              className="w-full border border-gray-400 focus:outline-none focus:border-none focus:ring-2 focus:ring-blue-400 px-2 py-1 rounded cursor-not-allowed bg-gray-200"
              onChange={handleChange}
              readOnly
              required
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="border px-4 py-1 rounded bg-gray-200 hover:bg-gray-500 text-black"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
