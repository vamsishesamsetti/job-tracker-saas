import { useState } from "react";
import API from "../api/api";
import toast from "react-hot-toast";

function AddJobModal({ onClose, refresh }) {

  /* =========================
     STATES
  ========================= */

  const [companyName, setCompanyName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [status, setStatus] = useState("APPLIED");
  const [priority, setPriority] = useState("MEDIUM");
  const [interviewDate, setInterviewDate] = useState("");
  const [notes, setNotes] = useState(""); // ✅ NEW

  const [loading, setLoading] = useState(false);

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validation
    if (!companyName.trim() || !roleTitle.trim()) {
      return toast.error("Company and Role are required");
    }

    try {
      setLoading(true);

      await API.post("/jobs", {
        companyName,
        roleTitle,
        status,
        priority,
        interviewDate: interviewDate || null,
        notes: notes || null, // ✅ NEW
      });

      toast.success("Job created");

      refresh();
      onClose();

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     UI
  ========================= */

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">

        <h2 className="text-xl font-bold mb-4">
          Add Job
        </h2>

        <form onSubmit={handleSubmit}>

          {/* COMPANY */}
          <input
            className="border w-full p-2 mb-3 rounded"
            placeholder="Company"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />

          {/* ROLE */}
          <input
            className="border w-full p-2 mb-3 rounded"
            placeholder="Role"
            value={roleTitle}
            onChange={(e) => setRoleTitle(e.target.value)}
          />

          {/* INTERVIEW DATE */}
          <input
            type="datetime-local"
            className="border w-full p-2 mb-3 rounded"
            value={interviewDate}
            onChange={(e) => setInterviewDate(e.target.value)}
          />

          {/* STATUS */}
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

          {/* PRIORITY */}
          <select
            className="border w-full p-2 mb-3 rounded"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>

          {/* ✅ NOTES FIELD */}
          <textarea
            placeholder="Notes (optional)"
            className="border w-full p-2 mb-3 rounded"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          {/* SUBMIT */}
          <button
            disabled={loading}
            className="bg-blue-600 text-white w-full p-2 rounded disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Job"}
          </button>

        </form>

        {/* CANCEL */}
        <button
          onClick={onClose}
          className="mt-4 text-gray-500 w-full"
        >
          Cancel
        </button>

      </div>

    </div>
  );
}

export default AddJobModal;