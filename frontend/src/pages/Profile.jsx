import { useEffect, useState } from "react";
import API from "../api/api";
import Layout from "../components/Layout";

function Profile() {

  const [user, setUser] = useState(null);
  const [name, setName] = useState("");

  // ✅ Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // =========================
  // FETCH PROFILE
  // =========================
  const fetchProfile = async () => {
    try {
      const res = await API.get("/auth/me");
      setUser(res.data.data);
      setName(res.data.data.name);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // =========================
  // UPDATE NAME
  // =========================
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await API.patch("/auth/update-profile", { name });
      alert("Profile updated");
      fetchProfile();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  // =========================
  // UPDATE PASSWORD
  // =========================
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    try {
      await API.patch("/auth/update-password", {
        currentPassword,
        newPassword,
      });

      alert("Password updated successfully");

      // clear inputs
      setCurrentPassword("");
      setNewPassword("");

    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  // =========================
  // LOADING STATE
  // =========================
  if (!user) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <Layout>

      <div className="p-6 max-w-md">

        <h1 className="text-2xl font-bold mb-6">
          Profile
        </h1>

        {/* =========================
            UPDATE NAME
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

          <button className="bg-blue-600 text-white w-full p-2 rounded">
            Update Profile
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

          <button className="bg-red-600 text-white w-full p-2 rounded">
            Update Password
          </button>

        </form>

      </div>

    </Layout>
  );
}

export default Profile;