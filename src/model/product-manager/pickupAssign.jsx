import axios from "axios";
import { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { toast } from "react-toastify";

const Base_Url = import.meta.env.VITE_BASE_URL;

export default function AssignPickupModal({ isOpen, onClose, returnId }) {
  const [pickupPerson, setPickupPerson] = useState([]);
  const [selectedPickupId, setSelectedPickupId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const fetchPickupPersonDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${Base_Url}/api/auth/getPickupPersons`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setPickupPerson(res.data.data);
        } else {
          toast.error(res.data.message || "Failed to fetch pickup persons");
        }
      } catch (err) {
        console.error("❌ Fetch pickup person error:", err);
        toast.error(
          err.response?.data?.message || "Failed to load list of pickup persons"
        );
      }
    };

    fetchPickupPersonDetails();
  }, []);

  if (!isOpen) return null;

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!selectedPickupId || !date || !time) {
      toast.error("Please fill all fields");
      return;
    }
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        toast.error("Pickup date cannot be in the past");
        return;
    }

    try {
        const token = localStorage.getItem("token");
        const res = await axios.put(`${Base_Url}/api/returnProductOrder/assignPickupForReturn/${returnId}`,
        {pickupPersonId:selectedPickupId, pickupDate:date, pickUpTime:time},
        {
          headers: { Authorization: `Bearer ${token}` },
        });

        toast.success(res.data.message || "Pickup Schedule scuccessfully...");
        setSelectedPickupId("");
        setDate("");
        setTime("");
        
    } catch (err) 
    {
        console.error("❌ pickup assign error:", err);
        toast.error(
          err.response?.data?.message || "Failed to assign pickup"
        );
    }
     onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
        >
          <IoCloseOutline size={28} />
        </button>

        <h2 className="text-lg font-semibold mb-4 text-center">Assign Pickup</h2>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Pickup Person</label>
            <select
              value={selectedPickupId}
              onChange={(e) => setSelectedPickupId(e.target.value)}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A63F40]"
            >
              <option value="">Select pickup person</option>
              {pickupPerson.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A63F40]"
              value={date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Time</label>
            <select
              type="text"
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A63F40]"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            >
              <option value="">Select Slot</option>
              <option value="10:30 AM - 12:30 PM">10:30 AM - 12:30 PM</option>
              <option value="01:00 PM - 03:00 PM">01:00 PM - 03:00 PM</option>
              <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
              <option value="07:00 PM - 09:00 PM">07:00 PM - 09:00 PM</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-[#A63F40] text-white py-2 px-4 rounded-lg hover:bg-[#7c2b2c] transition font-medium"
          >
            Assign
          </button>
        </form>
      </div>
    </div>
  );
}
