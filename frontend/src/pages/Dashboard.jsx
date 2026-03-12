import { useEffect, useState } from "react";
import API from "../api/api";

import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import JobTable from "../components/JobTable";
import AddJobModal from "../components/AddJobModal";

function Dashboard() {

  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    try {

      const statsRes = await API.get("/dashboard");
      setStats(statsRes.data.data);

      const jobsRes = await API.get("/jobs");
      setJobs(jobsRes.data.data.jobs);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!stats) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div>

      <Navbar />

      <div className="p-6">

        {/* Dashboard Cards */}

        <div className="grid grid-cols-4 gap-4">

          <StatCard
            title="Total Applications"
            value={stats.totalApplications}
          />

          <StatCard
            title="Interviews"
            value={stats.interviews}
          />

          <StatCard
            title="Offers"
            value={stats.offers}
          />

          <StatCard
            title="Rejections"
            value={stats.rejections}
          />

        </div>


        {/* Add Job Button */}

        <div className="flex justify-end mt-6">

          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Job
          </button>

        </div>


        {/* Jobs Table */}

        <JobTable jobs={jobs} />


        {/* Modal */}

        {showModal && (
          <AddJobModal
            onClose={() => setShowModal(false)}
            refresh={fetchData}
          />
        )}

      </div>

    </div>
  );
}

export default Dashboard;