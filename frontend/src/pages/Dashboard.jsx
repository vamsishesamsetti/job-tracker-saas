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

  const [sortBy, setSortBy] = useState("createdAt"); // ✅ NEW
  const [order, setOrder] = useState("desc");        // ✅ NEW

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
        params: {
          search,
          status,
          priority,
          page,
          limit: 5,
          sortBy,   // ✅ NEW
          order,    // ✅ NEW
        },
      });

      setJobs(jobsRes.data.data.jobs);
      setTotalPages(jobsRes.data.data.pagination.totalPages);

    } catch (err) {
      console.error(err);
    }
  };

  /* =========================
     DEBOUNCE
  ========================= */

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(delay);
  }, [search, status, priority, page, sortBy, order]);

  useEffect(() => {
    setPage(1);
  }, [search, status, priority, sortBy, order]);

  /* =========================
     LOADING (SKELETON)
  ========================= */

  if (!stats) {
    return (
      <Layout>
        <div className="p-6 animate-pulse">

          <div className="grid grid-cols-4 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>

          <div className="mt-6 h-40 bg-gray-200 rounded"></div>
          <div className="mt-6 h-60 bg-gray-200 rounded"></div>

        </div>
      </Layout>
    );
  }

  /* =========================
     UI
  ========================= */

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
        <div className="flex gap-4 mt-6 flex-wrap items-center">

  {/* SEARCH */}
  <input
    className="border p-2 rounded w-64"
    placeholder="Search jobs"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  {/* STATUS */}
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

  {/* PRIORITY */}
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

  {/* SORT */}
  <select
    className="border p-2 rounded"
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
  >
    <option value="createdAt">Date</option>
    <option value="companyName">Company</option>
    <option value="status">Status</option>
  </select>

  <select
    className="border p-2 rounded"
    value={order}
    onChange={(e) => setOrder(e.target.value)}
  >
    <option value="desc">Desc</option>
    <option value="asc">Asc</option>
  </select>

  {/* ✅ CLEAR BUTTON */}
  <button
    onClick={() => {
      setSearch("");
      setStatus("");
      setPriority("");
      setSortBy("createdAt");
      setOrder("desc");
      setPage(1);
    }}
    className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
  >
    Clear
  </button>

</div>

        {/* VIEW SWITCH */}
        <div className="flex justify-between mt-6">

          <div className="flex gap-2">
            <button
              onClick={() => setView("table")}
              className={`px-4 py-2 rounded ${
                view === "table" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              Table
            </button>

            <button
              onClick={() => setView("kanban")}
              className={`px-4 py-2 rounded ${
                view === "kanban" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              Kanban
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
              className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span>Page {page} of {totalPages}</span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
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