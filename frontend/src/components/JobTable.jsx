import { useState } from "react";
import ResumeUpload from "./ResumeUpload";
import ResumePreviewModal from "./ResumePreviewModal";
import ConfirmModal from "./ConfirmModal";
import API from "../api/api";

const priorityColors = {
  LOW: "bg-gray-200 text-gray-700",
  MEDIUM: "bg-purple-100 text-purple-700",
  HIGH: "bg-red-200 text-red-800",
};

function JobTable({ jobs, onEdit, refresh }) {

  const [previewUrl, setPreviewUrl] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ NEW STATE
  const [updatingId, setUpdatingId] = useState(null);

  /* =========================
     DELETE
  ========================= */

  const handleDelete = async () => {
    try {
      setLoading(true);
      await API.delete(`/jobs/${deleteId}`);
      setDeleteId(null);
      refresh();
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     STATUS UPDATE (IMPROVED)
  ========================= */

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);

      await API.patch(`/jobs/${id}`, { status });

      refresh();

    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <>
      <table className="w-full mt-6 border rounded-xl overflow-hidden">

        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Company</th>
            <th className="p-3">Role</th>
            <th className="p-3">Status</th>
            <th className="p-3">Priority</th>
            <th className="p-3">Notes</th>
            <th className="p-3">Created</th>
            <th className="p-3">Resume</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {jobs.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center p-6 text-gray-500">
                🚀 No jobs yet. Start applying!
              </td>
            </tr>
          ) : (
            jobs.map((job) => (
              <tr
                key={job.id}
                className={`border-b hover:bg-gray-50 ${
                  job.priority === "HIGH" ? "bg-red-50" : ""
                }`}
              >
                <td className="p-3 font-medium">{job.companyName}</td>

                <td className="p-3 text-gray-600">{job.roleTitle}</td>

                {/* ✅ STATUS WITH LOADING */}
                <td className="p-3">
                  <select
                    value={job.status}
                    onChange={(e) => updateStatus(job.id, e.target.value)}
                    disabled={updatingId === job.id}
                    className="text-xs p-1 rounded border"
                  >
                    <option value="APPLIED">Applied</option>
                    <option value="INTERVIEW">Interview</option>
                    <option value="OFFER">Offer</option>
                    <option value="REJECTED">Rejected</option>
                  </select>

                  {/* LOADING TEXT */}
                  {updatingId === job.id && (
                    <div className="text-[10px] text-gray-400 mt-1">
                      Updating...
                    </div>
                  )}
                </td>

                <td className="p-3">
                  <span className={`text-xs px-2 py-1 rounded ${priorityColors[job.priority]}`}>
                    {job.priority}
                  </span>
                </td>

                <td className="p-3 text-sm text-gray-500 truncate max-w-[120px]">
                  {job.notes || "—"}
                </td>

                <td className="p-3 text-xs text-gray-400">
                  {new Date(job.createdAt).toLocaleDateString()}
                </td>

                <td className="p-3">
                  {job.resumeUrl ? (
                    <button
                      onClick={() => setPreviewUrl(job.resumeUrl)}
                      className="text-blue-600 underline text-sm"
                    >
                      Preview
                    </button>
                  ) : (
                    "No Resume"
                  )}
                </td>

                <td className="p-3 flex gap-2">

                  <button
                    onClick={() => onEdit(job)}
                    className="bg-yellow-400 px-2 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => setDeleteId(job.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>

                  <ResumeUpload jobId={job.id} refresh={refresh} />

                </td>

              </tr>
            ))
          )}
        </tbody>

      </table>

      {/* PREVIEW */}
      {previewUrl && (
        <ResumePreviewModal
          url={previewUrl}
          onClose={() => setPreviewUrl(null)}
        />
      )}

      {/* DELETE MODAL */}
      {deleteId && (
        <ConfirmModal
          message="Are you sure you want to delete this job?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          loading={loading}
        />
      )}
    </>
  );
}

export default JobTable;