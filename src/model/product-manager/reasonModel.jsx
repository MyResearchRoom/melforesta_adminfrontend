import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
export default function ReasonModal({ isOpen, onClose, onSubmit, type }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50  px-4  ">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 ">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
          {type === "accepted"
            ? "Enter reason for acceptance"
            : "Enter reason for rejection"}
        </h2>
        <div className="  ">
          <button onClick={onClose} className="text-2xl text-[#A63F40]">
            <FaTimes />
          </button>
        </div>
        </div>

        <textarea
          className="w-full border rounded-lg px-3 py-2 h-14 resize-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="Type your reason here..."
          id="decisionReasonInput"
        ></textarea>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              const reason = document.getElementById(
                "decisionReasonInput"
              ).value;
              if (!reason.trim()) {
                toast.error("Reason is required!");
                return;
              }
              onSubmit(reason);
            }}
            className={`px-4 py-1 rounded-lg text-white ${
              type === "accepted"
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
