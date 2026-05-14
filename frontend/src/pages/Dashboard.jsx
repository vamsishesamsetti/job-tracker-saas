import { useState, useEffect, useCallback } from "react";
import API from "../api/api";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import StatCard from "../components/StatCard";
import StatusChart from "../components/StatusChart";
import JobTable from "../components/JobTable";
import AddJobModal from "../components/AddJobModal";
import EditJobModal from "../components/EditJobModal";

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [toast, setToast] = useState(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 400);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (debouncedSearch) params.search = debouncedSearch;
      if (status) params.status = status;
      if (priority) params.priority = priority;

      const { data } = await API.get("/jobs", { params });
      setJobs(data.data.jobs);
      setMeta(data.data.meta);
    } catch {
      showToast("Failed to fetch jobs", "error");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, status, priority, page]);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await API.get("/dashboard");
      setStats(data.data);
    } catch {
      // silently fail — stats are non-critical
    }
  }, []);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);
  useEffect(() => { fetchStats(); }, [fetchStats]);

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [debouncedSearch, status, priority]);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/jobs/${id}`);
      showToast("Job deleted");
      fetchJobs();
      fetchStats();
    } catch (err) {
      showToast(err.response?.data?.message || "Delete failed", "error");
    }
  };

  const handleUpload = async (jobId, file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      await API.post(`/jobs/${jobId}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showToast("Resume uploaded");
      fetchJobs();
    } catch (err) {
      showToast(err.response?.data?.message || "Upload failed", "error");
    }
  };

  const refresh = () => { fetchJobs(); fetchStats(); };

  const { user } = useAuth();

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500 text-sm">Welcome back, {user.name || "User"}</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 font-medium shadow-sm"
          >
            + Add Job
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard title="Total Applied"  value={stats.totalApplications} icon="📨" color="blue"   />
            <StatCard title="Interviews"     value={stats.interviews}        icon="🗣️" color="yellow" />
            <StatCard title="Offers"         value={stats.offers}            icon="🎉" color="green"  />
            <StatCard title="Rejected"       value={stats.rejections}        icon="❌" color="red"    />
          </div>
        )}

        {/* Chart */}
        {stats?.statusBreakdown?.length > 0 && (
          <StatusChart data={stats.statusBreakdown} />
        )}

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-4 mt-6 flex flex-wrap gap-3 items-center">
          <input
            className="border rounded-lg p-2 flex-1 min-w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search company or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="APPLIED">Applied</option>
            <option value="INTERVIEW">Interview</option>
            <option value="OFFER">Offer</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <select className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
          {(search || status || priority) && (
            <button onClick={() => { setSearch(""); setStatus(""); setPriority(""); }}
              className="text-sm text-gray-500 hover:text-gray-800 underline">
              Clear
            </button>
          )}
        </div>

        {/* Table */}
        {loading ? (
          <div className="bg-white shadow rounded-lg mt-6 p-12 text-center text-gray-400">
            Loading...
          </div>
        ) : (
          <JobTable
            jobs={jobs}
            onDelete={handleDelete}
            onEdit={(job) => setEditJob(job)}
            onUpload={handleUpload}
          />
        )}

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex justify-center gap-3 mt-6 items-center">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)}
              className="px-4 py-2 border rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50">
              ← Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {meta.page} of {meta.totalPages}
            </span>
            <button disabled={page >= meta.totalPages} onClick={() => setPage(page + 1)}
              className="px-4 py-2 border rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50">
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-5 py-3 rounded-lg shadow-lg text-white text-sm font-medium z-50 transition-all ${
          toast.type === "error" ? "bg-red-500" : "bg-green-500"
        }`}>
          {toast.message}
        </div>
      )}

      {showAddModal && (
        <AddJobModal onClose={() => setShowAddModal(false)} refresh={refresh} />
      )}
      {editJob && (
        <EditJobModal job={editJob} onClose={() => setEditJob(null)} refresh={refresh} />
      )}
    </Layout>
  );
}
