export default function Modal({ onClose, equipment }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded max-w-lg w-full">
        <h2 className="text-lg font-bold mb-2">Equipment Details</h2>
        <pre className="text-sm overflow-auto max-h-64">{JSON.stringify(equipment, null, 2)}</pre>
        <button onClick={onClose} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
          Close
        </button>
      </div>
    </div>
  );
}
