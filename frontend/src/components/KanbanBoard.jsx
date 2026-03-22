import React from "react";
import toast from "react-hot-toast";
import API from "../api/api";

const columns = ["APPLIED", "INTERVIEW", "OFFER", "REJECTED"];

/* =========================
   STATUS COLORS
========================= */
const statusColors = {
  APPLIED: "bg-blue-100 text-blue-700",
  INTERVIEW: "bg-yellow-100 text-yellow-700",
  OFFER: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

/* =========================
   PRIORITY COLORS
========================= */
const priorityColors = {
  LOW: "bg-gray-200 text-gray-700",
  MEDIUM: "bg-purple-100 text-purple-700",
  HIGH: "bg-red-200 text-red-800",
};

function KanbanBoard({ jobs, refresh }) {

  const updateStatus = async (jobId, newStatus) => {
    try {
      await API.patch(`/jobs/${jobId}`, { status: newStatus });
      toast.success("Status updated");
      refresh();
    } catch {
      toast.error("Failed to update");
    }
  };

  return (
    <div className="grid grid-cols-4 gap-4 mt-6">

      {columns.map((col) => (
        <div key={col} className="bg-gray-50 p-4 rounded-xl shadow-sm">

          {/* Column Header */}
          <h2 className="font-bold mb-4 text-center text-gray-700">
            {col}
          </h2>

          {/* Cards */}
          {jobs
            .filter((job) => job.status === col)
            .map((job) => (
              <div
                key={job.id}
                className="bg-white p-4 mb-4 rounded-xl shadow hover:shadow-md transition"
              >
                {/* Company */}
                <h3 className="font-semibold text-lg">
                  {job.companyName}
                </h3>

                {/* Role */}
                <p className="text-sm text-gray-500">
                  {job.roleTitle}
                </p>

                {/* Badges */}
                <div className="flex justify-between mt-3">

                  {/* Status */}
                  <span
                    className={`text-xs px-2 py-1 rounded ${statusColors[job.status]}`}
                  >
                    {job.status}
                  </span>

                  {/* Priority */}
                  <span
                    className={`text-xs px-2 py-1 rounded ${priorityColors[job.priority]}`}
                  >
                    {job.priority}
                  </span>

                </div>

                {/* Move Buttons */}
                <div className="flex flex-wrap gap-2 mt-3">

                  {columns.map((status) => (
                    status !== job.status && (
                      <button
                        key={status}
                        onClick={() => updateStatus(job.id, status)}
                        className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                      >
                        Move → {status}
                      </button>
                    )
                  ))}

                </div>

              </div>
            ))}

        </div>
      ))}

    </div>
  );
}

export default KanbanBoard;