import React from "react";
import toast from "react-hot-toast";
import API from "../api/api";

const columns = ["APPLIED", "INTERVIEW", "OFFER", "REJECTED"];

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
        <div key={col} className="bg-gray-100 p-4 rounded">

          <h2 className="font-bold mb-3 text-center">
            {col}
          </h2>

          {jobs
            .filter((job) => job.status === col)
            .map((job) => (
              <div
                key={job.id}
                className="bg-white p-3 mb-3 rounded shadow"
              >
                <h3 className="font-semibold">
                  {job.companyName}
                </h3>

                <p className="text-sm text-gray-500">
                  {job.roleTitle}
                </p>

                {/* Move Buttons */}
                <div className="flex flex-wrap gap-2 mt-2">

                  {columns.map((status) => (
                    status !== job.status && (
                      <button
                        key={status}
                        onClick={() => updateStatus(job.id, status)}
                        className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        {status}
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