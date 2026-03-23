function ResumePreviewModal({ url, onClose }) {

  const viewerUrl = `https://docs.google.com/gview?url=${url}&embedded=true`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">

      <div className="bg-white w-4/5 h-4/5 rounded shadow-lg p-4">

        <div className="flex justify-between mb-2">
          <h2 className="font-bold">Resume Preview</h2>

          <button
            onClick={onClose}
            className="text-red-500"
          >
            Close
          </button>
        </div>

        <iframe
          src={viewerUrl}
          title="Resume"
          className="w-full h-full border"
        />

      </div>

    </div>
  );
}

export default ResumePreviewModal;