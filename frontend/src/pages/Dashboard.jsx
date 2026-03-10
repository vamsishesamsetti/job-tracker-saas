import { useEffect, useState } from "react";
import API from "../api/api";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";

function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/dashboard");

        setStats(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
  }, []);

  if (!stats) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div>
      <Navbar />

      <div className="p-6 grid grid-cols-4 gap-4">
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
    </div>
  );
}

export default Dashboard;