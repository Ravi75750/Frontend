import React from "react";

export default function DeleteModal({ open, onClose, onConfirm }) {
  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
    >
      {/* Blur Background */}
      <div
        className="absolute inset-0 backdrop-blur-sm bg-black/40"
        onClick={onClose}
      />

      {/* Modal box */}
      <div
        className="
          relative bg-[#1e293b] text-white w-full max-w-md rounded-xl p-6
          shadow-xl border border-gray-700
          transition-all duration-300 transform
          animate-slideUp
        "
      >
        {/* Danger Icon */}
        <div className="flex justify-center mb-3">
          <div className="bg-red-500/20 text-red-400 p-3 rounded-full">
            ⚠️
          </div>
        </div>

        <h2 className="text-xl font-bold text-center">Delete Contest?</h2>

        <p className="text-gray-300 mt-2 text-center">
          Are you sure you want to delete this?  
          <br />This action cannot be undone.
        </p>

        <div className="flex gap-4 mt-6">
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-lg font-semibold"
          >
            Yes, Delete
          </button>

          <button
            onClick={onClose}
            className="flex-1 bg-blue-600 hover:bg-gray-700 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
