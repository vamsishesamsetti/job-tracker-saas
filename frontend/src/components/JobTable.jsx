import { useRef, useState } from "react";

const STATUS_STYLES = {
  APPLIED:   "bg-blue-100 text-blue-700",
  INTERVIEW: "bg-yellow-100 text-yellow-700",
  OFFER:     "bg-green-100 text-green-700",
  REJECTED:  "bg-red-100 text-red-700",
};

const PRIORITY_STYLES = {
  LOW:    "bg-gray-100 text-gray-600",
  MEDIUM: "bg-orange-100 text-orange-700",
  HIGH:   "bg-red-100 text-red-700",
};

function UploadCell({ job, onUpload }) {
  const ref = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    await onUpload(job.id, file);
    setUploading(false);
    e.target.value = "";
  };

  return (
    <div className="flex items-center gap-2">
      {job.resumeUrl ? (
        <a href={job.resumeUrl} target="_blank" rel="noreferrer"
          className="text-blue-600 underline text-sm">View</a>
      ) : (
        <span className="text-gray-400 text-sm">None</span>
      )}
      <button
        onClick={() => ref.current?.click()}
        disabled={uploading}
        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded border disabled:opacity-50"
      >
        {uploading ? "..." : job.resumeUrl ? "Replace" : "Upload"}
      </button>
      <input ref={ref} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleChange} />
    </div>
  );
}

function JobTable({ jobs, onDelete, onEdit, onUpload }) {
  const [confirmId, setConfirmId] = useState(null);

  if (!jobs || jobs.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg mt-6 p-12 text-center text-gray-400">
        <p className="text-4xl mb-3">📋</p>
        <p className="font-medium">No jobs found</p>
        <p className="text-sm mt-1">Add your first job application above</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg mt-6 overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
          <tr>
            <th className="p-4">Company / Role</th>
            <th className="p-4">Status</th>
            <th className="p-4">Priority</th>
            <th className="p-4">Salary</th>
            <th className="p-4">Interview</th>
            <th className="p-4">Resume</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {jobs.map((job) => (
            <tr key={job.id} className="hover:bg-gray-50 transition-colors">
              <td className="p-4">
                <p className="font-semibold text-gray-800">{job.companyName}</p>
                <p className="text-gray-500">{job.roleTitle}</p>
                {job.notes && (
                  <p className="text-gray-400 text-xs mt-1 truncate max-w-48" title={job.notes}>
                    {job.notes}
                  </p>
                )}
              </td>

              <td className="p-4">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[job.status] || ""}`}>
                  {job.status}
                </span>
              </td>

              <td className="p-4">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${PRIORITY_STYLES[job.priority] || ""}`}>
                  {job.priority}
                </span>
              </td>

              <td className="p-4 text-gray-600">
                {job.salaryMin || job.salaryMax
                  ? `$${(job.salaryMin || 0).toLocaleString()} – $${(job.salaryMax || 0).toLocaleString()}`
                  : <span className="text-gray-300">—</span>}
              </td>

              <td className="p-4 text-gray-600">
                {job.interviewDate
                  ? new Date(job.interviewDate).toLocaleDateString()
                  : <span className="text-gray-300">—</span>}
              </td>

              <td className="p-4">
                <UploadCell job={job} onUpload={onUpload} />
              </td>

              <td className="p-4">
                {confirmId === job.id ? (
                  <div className="flex gap-1 items-center">
                    <span className="text-xs text-gray-500">Sure?</span>
                    <button onClick={() => { onDelete(job.id); setConfirmId(null); }}
                      className="text-xs bg-red-500 text-white px-2 py-1 rounded">Yes</button>
                    <button onClick={() => setConfirmId(null)}
                      className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">No</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => onEdit(job)}
                      className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1 rounded border border-blue-200">
                      Edit
                    </button>
                    <button onClick={() => setConfirmId(job.id)}
                      className="text-xs bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1 rounded border border-red-200">
                      Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default JobTable;
