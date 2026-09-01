import React, { useState } from 'react';
import ViewProduct from './ViewProduct';
import AddProduct from './AddProduct';

export default function Section2() {
  const [activeTab, setActiveTab] = useState("view");
  const [editProductId, setEditProductId] = useState(null); 

  const handleEdit = (productId) => {
    setEditProductId(productId);   
    setActiveTab("add");          
  };

  const handleFormSubmit = () => {
    setEditProductId(null);       
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
              setEditProductId(null);
            }}
          >
            View
          </button>
          <button
            className={`px-4 py-1 rounded ${activeTab === "add" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => {
              setActiveTab("add");
              setEditProductId(null); 
            }}
          >
            Add
          </button>
        </div>
      </div>

      <div className="mt-4">
        {activeTab === "view" && (
          <ViewProduct onEdit={handleEdit} />
        )}
        {activeTab === "add" && (
          <AddProduct productId={editProductId} onSubmit={handleFormSubmit} />
        )}
      </div>
    </section>
  );
}
