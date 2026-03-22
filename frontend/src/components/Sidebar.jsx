import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {

  const { logout } = useAuth();

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-6">

      <h1 className="text-xl font-bold mb-8">
        Job Tracker
      </h1>

      <nav className="flex flex-col gap-4">

        <Link
          to="/"
          className="hover:text-gray-300"
        >
          Dashboard
        </Link>

        <Link to="/profile" className="hover:text-gray-300">
  Profile
</Link>

        <button
          onClick={logout}
          className="text-left hover:text-gray-300"
        >
          Logout
        </button>

      </nav>

    </div>
  );
}

export default Sidebar;
