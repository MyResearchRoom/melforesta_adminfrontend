import React, { useState } from 'react';
import AddPincode from './AddPincode';
import PincodeList from './PincodeList';

export default function Section2() {
  const [activeTab, setActiveTab] = useState("view");
  const [editingPincodeId, setEditingPincodeId] = useState(null);

  const handleEdit = (pincodeId) => {
    setEditingPincodeId(pincodeId);
    setActiveTab("add");
  };

  const handleFormSubmit = () => {
    setEditingPincodeId(null);
    setActiveTab("view");
  };

  return (
    <section>
      <div className="border-y border-gray-500 py-2">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-1 rounded ${activeTab === "view" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => {
              setActiveTab("view");
              setEditingPincodeId(null);
            }}
          >
            View
          </button>
          <button
            className={`px-4 py-1 rounded ${activeTab === "add" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => {
              setActiveTab("add");
              setEditingPincodeId(null);
            }}
          >
            Add
          </button>
        </div>
      </div>

      <div className="mt-4">
        {activeTab === "view" && (
          <PincodeList onEdit={handleEdit} />
        )}
        {activeTab === "add" && (
          <AddPincode 
            pincodeId={editingPincodeId} 
            onSubmit={handleFormSubmit} 
            onClose={() => setActiveTab("view")}  
          />
        )}
      </div>
    </section>
  );
}
