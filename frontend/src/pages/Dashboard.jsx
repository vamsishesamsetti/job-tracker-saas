import { useEffect, useState } from "react";
import API from "../api/api";

import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import JobTable from "../components/JobTable";
import AddJobModal from "../components/AddJobModal";
import EditJobModal from "../components/EditJobModal";
import StatusChart from "../components/StatusChart";

function Dashboard() {

  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  // ✅ FETCH DATA
  const fetchData = async () => {
    try {
      const statsRes = await API.get("/dashboard");
      setStats(statsRes.data.data);

      const jobsRes = await API.get("/jobs", {
        params: { search, status, priority },
      });

      setJobs(jobsRes.data.data.jobs);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, status, priority]);

  // ✅ DELETE JOB
  const deleteJob = async (id) => {
    if (!window.confirm("Delete this job?")) return;

    try {
      await API.delete(`/jobs/${id}`);
      fetchData();
    } catch {
      alert("Delete failed");
    }
  };

  // ✅ UPLOAD RESUME (IMPORTANT FIX)
  const uploadResume = async (id, file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await API.post(`/jobs/${id}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      fetchData();
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  if (!stats) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <Layout>

      <div className="p-6">

        {/* Cards */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard title="Total Applications" value={stats.totalApplications} />
          <StatCard title="Interviews" value={stats.interviews} />
          <StatCard title="Offers" value={stats.offers} />
          <StatCard title="Rejections" value={stats.rejections} />
        </div>

        {/* Chart */}
        <StatusChart data={stats.statusBreakdown} />

        {/* Filters */}
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

        {/* Add Job */}
        <div className="flex justify-end mt-6">
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Job
          </button>
        </div>

        {/* Job Table */}
        <JobTable
          jobs={jobs}
          onDelete={deleteJob}
          onEdit={(job) => setEditingJob(job)}
          onUpload={uploadResume}  
        />

        {/* Modals */}
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