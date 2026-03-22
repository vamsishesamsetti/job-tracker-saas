import { useState } from "react";
import API from "../api/api";
import toast from "react-hot-toast";

function EditJobModal({ job, onClose, refresh }) {

  const [companyName, setCompanyName] = useState(job.companyName);
  const [roleTitle, setRoleTitle] = useState(job.roleTitle);
  const [status, setStatus] = useState(job.status);
  const [priority, setPriority] = useState(job.priority);

  const [interviewDate, setInterviewDate] = useState(
    job.interviewDate
      ? new Date(job.interviewDate).toISOString().slice(0, 16)
      : ""
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
  await API.patch(`/jobs/${job.id}`, {
    companyName,
    roleTitle,
    status,
    priority,
    interviewDate: interviewDate || null,
  });

  toast.success("Job updated");
  refresh();
  onClose();

} catch (err) {
  toast.error(err.response?.data?.message || "Update failed");
}
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">

        <h2 className="text-xl font-bold mb-4">Edit Job</h2>

        <form onSubmit={handleSubmit}>

          <input
            className="border w-full p-2 mb-3 rounded"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />

          <input
            className="border w-full p-2 mb-3 rounded"
            value={roleTitle}
            onChange={(e) => setRoleTitle(e.target.value)}
          />

          {/* ✅ Interview Date */}
          <input
            type="datetime-local"
            className="border w-full p-2 mb-3 rounded"
            value={interviewDate}
            onChange={(e) => setInterviewDate(e.target.value)}
          />

          <select
            className="border w-full p-2 mb-3 rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="APPLIED">Applied</option>
            <option value="INTERVIEW">Interview</option>
            <option value="OFFER">Offer</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <select
            className="border w-full p-2 mb-3 rounded"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>

          <button className="bg-green-600 text-white w-full p-2 rounded">
            Update Job
          </button>

        </form>

        <button onClick={onClose} className="mt-4 text-gray-500 w-full">
          Cancel
        </button>

      </div>

    </div>
  );
}

export default EditJobModal;