export default function Modal({ equipment, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded max-w-md w-full">
        <h3 className="text-lg font-bold mb-2">{equipment.name || 'Details'}</h3>
        <pre className="text-sm max-h-64 overflow-y-auto bg-gray-100 p-2 rounded">
          {JSON.stringify(equipment, null, 2)}
        </pre>
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Schließen
        </button>
      </div>
    </div>
  );
}
