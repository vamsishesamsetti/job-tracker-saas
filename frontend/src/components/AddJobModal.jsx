import { useState } from "react";
import API from "../api/api";

const INITIAL = {
  companyName: "",
  roleTitle: "",
  status: "APPLIED",
  priority: "MEDIUM",
  applicationDate: new Date().toISOString().slice(0, 10),
  interviewDate: "",
  salaryMin: "",
  salaryMax: "",
  notes: "",
};

function AddJobModal({ onClose, refresh }) {
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await API.post("/jobs", {
        companyName: form.companyName,
        roleTitle: form.roleTitle,
        status: form.status,
        priority: form.priority,
        applicationDate: form.applicationDate || undefined,
        interviewDate: form.interviewDate || undefined,
        salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
        notes: form.notes || undefined,
      });
      refresh();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Add Job Application</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded">{error}</p>}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
              <input required className="border w-full p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Google" value={form.companyName} onChange={set("companyName")} />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
              <input required className="border w-full p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Software Engineer" value={form.roleTitle} onChange={set("roleTitle")} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select className="border w-full p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.status} onChange={set("status")}>
                <option value="APPLIED">Applied</option>
                <option value="INTERVIEW">Interview</option>
                <option value="OFFER">Offer</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select className="border w-full p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.priority} onChange={set("priority")}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Application Date</label>
              <input type="date" className="border w-full p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.applicationDate} onChange={set("applicationDate")} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interview Date</label>
              <input type="datetime-local" className="border w-full p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.interviewDate} onChange={set("interviewDate")} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Salary ($)</label>
              <input type="number" min="0" className="border w-full p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 80000" value={form.salaryMin} onChange={set("salaryMin")} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Salary ($)</label>
              <input type="number" min="0" className="border w-full p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 120000" value={form.salaryMax} onChange={set("salaryMax")} />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea rows={3} className="border w-full p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Any notes about this application..." value={form.notes} onChange={set("notes")} />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60">
              {loading ? "Saving..." : "Add Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddJobModal;
