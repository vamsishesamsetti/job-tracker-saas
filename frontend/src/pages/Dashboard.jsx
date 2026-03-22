import { useEffect, useState } from "react";
import API from "../api/api";

import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import JobTable from "../components/JobTable";
import AddJobModal from "../components/AddJobModal";
import EditJobModal from "../components/EditJobModal";
import StatusChart from "../components/StatusChart";
import toast from "react-hot-toast";

function Dashboard() {

  /* =========================
     STATES
  ========================= */

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  /* =========================
     FETCH DATA
  ========================= */

  const fetchData = async () => {
  try {
    const statsRes = await API.get("/dashboard");
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

  /* =========================
     EFFECTS
  ========================= */

  // fetch when filters OR page changes
  useEffect(() => {
    fetchData();
  }, [search, status, priority, page]);

  // reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, status, priority]);

  /* =========================
     DELETE JOB
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
     UPLOAD RESUME
  ========================= */

  const uploadResume = async (id, file) => {
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    await API.post(`/jobs/${id}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success("Resume uploaded");
    fetchData();

  } catch {
    toast.error("Upload failed");
  }
};

  /* =========================
     LOADING
  ========================= */

  if (!stats) {
    return <p className="p-6">Loading...</p>;
  }

  /* =========================
     UI
  ========================= */

  return (
    <Layout>

      <div className="p-6">

        {/* =========================
            STATS
        ========================= */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard title="Total Applications" value={stats.totalApplications} />
          <StatCard title="Interviews" value={stats.interviews} />
          <StatCard title="Offers" value={stats.offers} />
          <StatCard title="Rejections" value={stats.rejections} />
        </div>

        {/* =========================
            CHART
        ========================= */}
        <StatusChart data={stats.statusBreakdown} />

        {/* =========================
            FILTERS
        ========================= */}
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

        {/* =========================
            ADD JOB
        ========================= */}
        <div className="flex justify-end mt-6">
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Job
          </button>
        </div>

        {/* =========================
            JOB TABLE
        ========================= */}
        <JobTable
          jobs={jobs}
          onDelete={deleteJob}
          onEdit={(job) => setEditingJob(job)}
          onUpload={uploadResume}
        />

        {/* =========================
            PAGINATION
        ========================= */}
        <div className="flex justify-center items-center gap-4 mt-6">

          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="font-medium">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>

        </div>

        {/* =========================
            MODALS
        ========================= */}
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