import React, { useEffect, useState } from "react";
import { MdOutlineFileDownload } from "react-icons/md";
import axios from "axios";
const Base_Url = import.meta.env.VITE_BASE_URL;

export default function DocumentViewModal({ id, onClose }) {
  const [stockDocuemnt,setStockDocument]=useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStockDocumentById = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token"); 
        const res = await axios.get(`${Base_Url}/api/stock/getStockDocuments/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setStockDocument(res.data.data);
        } else {
          setError(res.data.message || "Failed to fetch stock document");
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message||"Something went wrong while fetching stock document");
      } finally {
        setLoading(false);
      }
    };

    fetchStockDocumentById();
  }, [id]);

  if (!id) return null;

  return (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center ">
    <div className="bg-white rounded-lg p-6 w-96 shadow-lg mx-2">
      <h2 className="text-lg font-bold mb-4">Document List</h2>

      {loading ? (
        <p className="text-center mt-10">Loading Stock Document...</p>
      ) : error ? (
        <p className="text-orange-500 text-center mt-10">{error}</p>
      ) : stockDocuemnt.length === 0 ? (
        <p className="text-red-500 text-center mt-10">Stock document not found</p>
      ) : (
        <table className="w-full">
          <thead className="border">
            <tr className="bg-gray-200">
              <th className="border px-3 py-2 text-left">Sr No</th>
              <th className="border px-3 py-2 text-left">Name</th>
              <th className="border px-3 py-2 text-center">Download</th>
            </tr>
          </thead>
          <tbody>
            {stockDocuemnt.map((doc, index) => (
              <tr key={index} className="hover:bg-gray-100 border">
                <td className=" px-3 py-2">{index + 1}</td>
                <td className=" px-3 py-2">{doc.documentName}</td>
                <td className="py-3 text-center flex justify-center">
                  <a
                    href={doc.document}
                    download={doc.documentName}
                    className="text-blue-600 underline text-xl "
                  >
                    <MdOutlineFileDownload />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

}
