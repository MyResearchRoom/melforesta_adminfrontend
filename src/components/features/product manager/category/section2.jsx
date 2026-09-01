import React, { useState } from 'react';
import AddCategory from './AddCategory';
import CategoryList from './categorylist';

export default function Section2() {
  const [activeTab, setActiveTab] = useState("view");
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  const handleEdit = (categoryId) => {
    setEditingCategoryId(categoryId);
    setActiveTab("add");
  };

  const handleFormSubmit = () => {
    setEditingCategoryId(null);
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
              setEditingCategoryId(null);
            }}
          >
            View
          </button>
          <button
            className={`px-4 py-1 rounded ${activeTab === "add" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => {
              setActiveTab("add");
              setEditingCategoryId(null);
            }}
          >
            Add
          </button>
        </div>
      </div>

      <div className="mt-4">
        {activeTab === "view" && (
          <CategoryList onEdit={handleEdit} />
        )}
        {activeTab === "add" && (
          <AddCategory 
            categoryId={editingCategoryId} 
            onSubmit={handleFormSubmit} 
            onClose={() => setActiveTab("view")}  
          />
        )}
      </div>
    </section>
  );
}
