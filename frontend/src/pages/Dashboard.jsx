import { useEffect, useState } from "react";
import API from "../api/api";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import JobTable from "../components/JobTable";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
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

    fetchData();
  }, []);

  if (!stats) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div>
      <Navbar />

      <div className="p-6">

        {/* Stats */}
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

        {/* Jobs Table */}
        <JobTable jobs={jobs} />

      </div>
    </div>
  );
}

export default Dashboard;