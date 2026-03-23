import { useEffect, useState } from "react";
import API from "../api/api";

import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import JobTable from "../components/JobTable";
import AddJobModal from "../components/AddJobModal";
import EditJobModal from "../components/EditJobModal";
import StatusChart from "../components/StatusChart";
import KanbanBoard from "../components/KanbanBoard";
import toast from "react-hot-toast";

function Dashboard() {

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  const [view, setView] = useState("table");

  /* =========================
     FETCH DATA
  ========================= */

  const fetchData = async () => {
    try {
      const statsRes = await API.get("/dashboard/summary");
      setStats(statsRes.data.data);

      const jobsRes = await API.get("/jobs", {
        params: { search, status, priority, page, limit: 5 },
      });

      setJobs(jobsRes.data.data.jobs);
      setTotalPages(jobsRes.data.data.pagination.totalPages);

    } catch {
      toast.error("Failed to load data");
    }
  };

  useEffect(() => {
  const delay = setTimeout(() => {
    fetchData();
  }, 500); // 500ms delay

  return () => clearTimeout(delay);
}, [search, status, priority, page]);

  useEffect(() => {
    setPage(1);
  }, [search, status, priority]);

  /* =========================
     DELETE
  ========================= */

  const deleteJob = async (id) => {
    if (!window.confirm("Delete this job?")) return;

    try {
      await API.delete(`/jobs/${id}`);
      toast.success("Job deleted");
      fetchData();
    } catch {
      toast.error("Delete failed");
    }
  };

  /* =========================
     LOADING
  ========================= */

  if (!stats) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <Layout>

      <div className="p-6">

        {/* STATS */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard title="Total Applications" value={stats.totalApplications} />
          <StatCard title="Interviews" value={stats.interviews} />
          <StatCard title="Offers" value={stats.offers} />
          <StatCard title="Rejections" value={stats.rejections} />
        </div>

        {/* CHART */}
        <StatusChart data={stats.statusBreakdown} />

        {/* FILTERS */}
        <div className="flex gap-4 mt-6">

          <input
            className="border p-2 rounded w-64"
            placeholder="Search jobs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border p-2 rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="APPLIED">Applied</option>
            <option value="INTERVIEW">Interview</option>
            <option value="OFFER">Offer</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <select
            className="border p-2 rounded"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="">All Priority</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>

        </div>

        {/* VIEW SWITCH + ADD */}
        <div className="flex justify-between mt-6">

          <div className="flex gap-2">

            <button
              onClick={() => setView("table")}
              className={`px-4 py-2 rounded ${
                view === "table" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              Table View
            </button>

            <button
              onClick={() => setView("kanban")}
              className={`px-4 py-2 rounded ${
                view === "kanban" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              Kanban View
            </button>

          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Job
          </button>

        </div>

        {/* MAIN VIEW */}
        {view === "table" ? (
          <JobTable
            jobs={jobs}
            onDelete={deleteJob}
            onEdit={(job) => setEditingJob(job)}
            refresh={fetchData}  
          />
        ) : (
          <KanbanBoard jobs={jobs} refresh={fetchData} />
        )}

        {/* PAGINATION */}
        {view === "table" && (
          <div className="flex justify-center mt-6 gap-4">

            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Prev
            </button>

            <span>Page {page} of {totalPages}</span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Next
            </button>

          </div>
        )}

        {/* MODALS */}
        {showModal && (
          <AddJobModal
            onClose={() => setShowModal(false)}
            refresh={fetchData}
          />
        )}

        {editingJob && (
          <EditJobModal
            job={editingJob}
            onClose={() => setEditingJob(null)}
            refresh={fetchData}
          />
        )}

      </div>

    </Layout>
  );
}

export default Dashboard;