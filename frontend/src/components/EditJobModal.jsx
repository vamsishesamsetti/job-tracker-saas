import { useState, useEffect, useRef } from "react";
import API from "../api/api";
import toast from "react-hot-toast";

function EditJobModal({ job, onClose, refresh }) {

  /* =========================
     STATES
  ========================= */

  const [companyName, setCompanyName] = useState(job.companyName);
  const [roleTitle, setRoleTitle] = useState(job.roleTitle);
  const [status, setStatus] = useState(job.status);
  const [priority, setPriority] = useState(job.priority);
  const [interviewDate, setInterviewDate] = useState(
    job.interviewDate ? job.interviewDate.slice(0, 16) : ""
  );
  const [notes, setNotes] = useState(job.notes || "");

  const [loading, setLoading] = useState(false);

  const modalRef = useRef();

  /* =========================
     ESC CLOSE
  ========================= */

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  /* =========================
     CLICK OUTSIDE CLOSE
  ========================= */

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!companyName.trim()) {
      return toast.error("Company is required");
    }

    if (!roleTitle.trim()) {
      return toast.error("Role is required");
    }

    try {
      setLoading(true);

      await API.patch(`/jobs/${job.id}`, {
        companyName,
        roleTitle,
        status,
        priority,
        interviewDate: interviewDate || null,
        notes: notes || "", // ✅ FIXED
      });

      toast.success("Job updated");

      refresh();
      onClose();

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     UI
  ========================= */

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">

      <div
        ref={modalRef}
        className="bg-white p-6 rounded-lg w-96 shadow-lg"
      >

        <h2 className="text-xl font-bold mb-4">
          Edit Job
        </h2>

        <form onSubmit={handleSubmit}>

          {/* COMPANY */}
          <input
            className="border w-full p-2 mb-3 rounded"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />

          {/* ROLE */}
          <input
            className="border w-full p-2 mb-3 rounded"
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

          {/* NOTES */}
          <textarea
            className="border w-full p-2 mb-3 rounded"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes"
          />

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white w-full p-2 rounded disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Job"}
          </button>

        </form>

        {/* CANCEL */}
        <button
          onClick={onClose}
          className="mt-4 w-full text-gray-500"
        >
          Cancel
        </button>

      </div>

    </div>
  );
}

export default EditJobModal;