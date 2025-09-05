export default function ConfirmModal({ isOpen, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Semi-transparent black backdrop */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Modal content */}
      <div className="relative bg-white rounded-lg p-6 w-96 shadow-lg z-10">
        <p className="text-gray-800 mb-4">{message}</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
