import React, { useState } from 'react';
import AddStock from './AddStock';
import StockList from './stockList';

export default function Section2() {
  const [activeTab, setActiveTab] = useState("view");

  const handleFormSubmit = () => {   
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
            }}
          >
            View
          </button>
          <button
            className={`px-4 py-1 rounded ${activeTab === "add" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => {
              setActiveTab("add");
            }}
          >
            Add
          </button>
        </div>
      </div>

      <div className="mt-4">
        {activeTab === "view" && (
          <StockList />
        )}
        {activeTab === "add" && (
          <AddStock onSubmit={handleFormSubmit} />
        )}
      </div>
    </section>
  );
}
