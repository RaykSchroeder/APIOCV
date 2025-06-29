export default function Modal({ onClose, equipment }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded max-w-lg w-full shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold mb-3">Equipment Details</h3>
        <pre className="text-sm max-h-64 overflow-auto">{JSON.stringify(equipment, null, 2)}</pre>
        <button
          onClick={onClose}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Schließen
        </button>
      </div>
    </div>
  );
}
