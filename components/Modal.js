import React from "react";

export default function Modal({ equipment, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded p-4 max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-2">{equipment.name}</h3>
        <pre className="text-sm bg-gray-100 p-2 rounded overflow-x-auto">
          {JSON.stringify(equipment, null, 2)}
        </pre>
        <button
          onClick={onClose}
          className="mt-2 bg-red-500 text-white p-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}
