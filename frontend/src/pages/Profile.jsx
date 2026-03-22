import { useEffect, useState } from "react";
import API from "../api/api";
import Layout from "../components/Layout";
import toast from "react-hot-toast";

function Profile() {

  /* =========================
     STATES
  ========================= */

  const [user, setUser] = useState(null);
  const [name, setName] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);

  /* =========================
     FETCH PROFILE
  ========================= */

  const fetchProfile = async () => {
    try {
      const res = await API.get("/auth/me");
      setUser(res.data.data);
      setName(res.data.data.name);
    } catch (err) {
      toast.error("Failed to load profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  /* =========================
     UPDATE NAME
  ========================= */

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      return toast.error("Name cannot be empty");
    }

    try {
      setLoading(true);

      await API.patch("/auth/update-profile", { name });

      toast.success("Profile updated");
      fetchProfile();

    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     UPDATE PASSWORD
  ========================= */

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword) {
      return toast.error("All fields are required");
    }

    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    try {
      setLoading(true);

      await API.patch("/auth/update-password", {
        currentPassword,
        newPassword,
      });

      toast.success("Password updated");

      setCurrentPassword("");
      setNewPassword("");

    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     LOADING
  ========================= */

  if (!user) {
    return <p className="p-6">Loading...</p>;
  }

  /* =========================
     UI
  ========================= */

  return (
    <Layout>

      <div className="p-6 max-w-md">

        <h1 className="text-2xl font-bold mb-6">
          Profile
        </h1>

        {/* =========================
            PROFILE FORM
        ========================= */}
        <form onSubmit={handleUpdate}>

          <label className="block mb-2 text-sm">
            Name
          </label>

          <input
            className="border w-full p-2 mb-4 rounded"
            value={name}
            onChange={(e)=>setName(e.target.value)}
          />

          <label className="block mb-2 text-sm">
            Email
          </label>

          <input
            className="border w-full p-2 mb-4 rounded bg-gray-100"
            value={user.email}
            disabled
          />

          <button
            disabled={loading}
            className="bg-blue-600 text-white w-full p-2 rounded disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>

        </form>

        {/* =========================
            PASSWORD SECTION
        ========================= */}

        <hr className="my-6" />

        <h2 className="text-xl font-semibold mb-4">
          Change Password
        </h2>

        <form onSubmit={handlePasswordUpdate}>

          <input
            type="password"
            placeholder="Current Password"
            className="border w-full p-2 mb-3 rounded"
            value={currentPassword}
            onChange={(e)=>setCurrentPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="New Password"
            className="border w-full p-2 mb-3 rounded"
            value={newPassword}
            onChange={(e)=>setNewPassword(e.target.value)}
          />

          <button
            disabled={loading}
            className="bg-red-600 text-white w-full p-2 rounded disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>

        </form>

      </div>

    </Layout>
  );
}

export default Profile;