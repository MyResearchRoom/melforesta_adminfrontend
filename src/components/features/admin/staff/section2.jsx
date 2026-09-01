import React, { useState } from 'react';
import AddStaff from './AddStaff';
import StaffList from './stafflist';

export default function Section2() {
  const [activeTab, setActiveTab] = useState("view");
  const [editingStaffId, setEditingStaffId] = useState(null); 

  const handleEdit = (staffId) => {
    setEditingStaffId(staffId);   
    setActiveTab("add");          
  };

  const handleFormSubmit = () => {
    setEditingStaffId(null);       
    setActiveTab("view");           
  };

  return (
    <section className=''>
      <div className="border-y border-gray-500 py-2">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-1 rounded ${activeTab === "view" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => {
              setActiveTab("view");
              setEditingStaffId(null);
            }}
          >
            View
          </button>
          <button
            className={`px-4 py-1 rounded ${activeTab === "add" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => {
              setActiveTab("add");
              setEditingStaffId(null); 
            }}
          >
            Add
          </button>
        </div>
      </div>

      <div className="mt-4">
        {activeTab === "view" && (
          <StaffList onEdit={handleEdit} />
        )}
        {activeTab === "add" && (
          <AddStaff staffId={editingStaffId} onSubmit={handleFormSubmit} />
        )}
      </div>
    </section>
  );
}
