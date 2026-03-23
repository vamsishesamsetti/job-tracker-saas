function ConfirmModal({ message, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

      <div className="bg-white p-6 rounded-lg w-80 shadow-lg">

        <h2 className="text-lg font-semibold mb-4">
          {message}
        </h2>

        <div className="flex justify-end gap-3">

          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default ConfirmModal;