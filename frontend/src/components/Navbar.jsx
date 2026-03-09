import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="bg-gray-900 text-white p-4 flex justify-between">
      <h1 className="font-bold">Job Tracker</h1>

      <button
        onClick={handleLogout}
        className="bg-red-500 px-4 py-1 rounded"
      >
        Logout
      </button>
    </div>
  );
}

export default Navbar;