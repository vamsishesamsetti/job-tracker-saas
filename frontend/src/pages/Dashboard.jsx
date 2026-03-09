import Navbar from "../components/Navbar";

function Dashboard() {
  return (
    <div>
      <Navbar />

      <div className="p-6">
        <h1 className="text-2xl font-bold">
          Dashboard
        </h1>

        <p className="mt-4">
          Welcome to your Job Tracker 🚀
        </p>
      </div>
    </div>
  );
}

export default Dashboard;