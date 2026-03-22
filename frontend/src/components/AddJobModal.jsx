import { useState } from "react";
import API from "../api/api";

function AddJobModal({ onClose, refresh }) {

  const [companyName, setCompanyName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [status, setStatus] = useState("APPLIED");
  const [priority, setPriority] = useState("MEDIUM");
  const [interviewDate, setInterviewDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/jobs", {
        companyName,
        roleTitle,
        status,
        priority,
        interviewDate: interviewDate || null,
      });

      refresh();
      onClose();

    } catch (err) {
      alert(err.response?.data?.message || "Failed to create job");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">

        <h2 className="text-xl font-bold mb-4">Add Job</h2>

        <form onSubmit={handleSubmit}>

          <input
            className="border w-full p-2 mb-3 rounded"
            placeholder="Company"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />

          <input
            className="border w-full p-2 mb-3 rounded"
            placeholder="Role"
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

          <button className="bg-blue-600 text-white w-full p-2 rounded">
            Create Job
          </button>

        </form>

        <button onClick={onClose} className="mt-4 text-gray-500 w-full">
          Cancel
        </button>

      </div>

    </div>
  );
}

export default AddJobModal;