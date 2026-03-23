import { useState } from "react";
import API from "../api/api";
import toast from "react-hot-toast";

function ResumeUpload({ jobId, refresh }) {

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      setProgress(0);

      await API.post(`/jobs/${jobId}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },

        onUploadProgress: (event) => {
          const percent = Math.round(
            (event.loaded * 100) / event.total
          );
          setProgress(percent);
        },
      });

      toast.success("Resume uploaded");
      refresh();

    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  /* =========================
     DRAG & DROP
  ========================= */

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleUpload(file);
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="border-dashed border-2 p-2 rounded text-center cursor-pointer text-xs"
    >

      {uploading ? (
        <div>
          <p>Uploading... {progress}%</p>
          <div className="w-full bg-gray-200 h-2 rounded mt-1">
            <div
              className="bg-blue-600 h-2 rounded"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        <>
          <label className="cursor-pointer text-blue-600 underline">
            Upload / Drop
            <input
              type="file"
              hidden
              onChange={(e) =>
                handleUpload(e.target.files[0])
              }
            />
          </label>
        </>
      )}

    </div>
  );
}

export default ResumeUpload;