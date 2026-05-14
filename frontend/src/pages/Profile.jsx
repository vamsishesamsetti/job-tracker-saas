import { useEffect, useState } from "react";
import API from "../api/api";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={`fixed bottom-6 right-6 px-5 py-3 rounded-lg shadow-lg text-white text-sm font-medium z-50 transition-all ${
      toast.type === "error" ? "bg-red-500" : "bg-green-500"
    }`}>
      {toast.message}
    </div>
  );
}

function Avatar({ name }) {
  const initials = name
    ? name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";
  return (
    <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
      {initials}
    </div>
  );
}

export default function Profile() {
  const { user: ctxUser, updateUser } = useAuth();
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    API.get("/auth/me").then((res) => {
      setUser(res.data.data);
      setName(res.data.data.name);
    });
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const res = await API.patch("/auth/update-profile", { name });
      setUser({ ...user, name: res.data.data.name });
      updateUser({ name: res.data.data.name });
      showToast("Profile updated successfully");
    } catch (err) {
      showToast(err.response?.data?.message || "Update failed", "error");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showToast("New password must be at least 6 characters", "error");
      return;
    }
    setPasswordLoading(true);
    try {
      await API.patch("/auth/update-password", { currentPassword, newPassword });
      showToast("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      showToast(err.response?.data?.message || "Update failed", "error");
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="p-6 flex items-center justify-center min-h-64 text-gray-400">
          Loading…
        </div>
      </Layout>
    );
  }

  const memberSince = new Date(user.createdAt || Date.now()).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <Layout>
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile</h1>

        {/* Avatar card */}
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-5 mb-6">
          <Avatar name={user.name} />
          <div>
            <p className="text-xl font-semibold text-gray-800">{user.name}</p>
            <p className="text-gray-500 text-sm">{user.email}</p>
            <p className="text-gray-400 text-xs mt-1">Member since {memberSince}</p>
          </div>
          <div className="ml-auto">
            <span className="text-xs bg-blue-100 text-blue-700 font-medium px-3 py-1 rounded-full">
              {user.role}
            </span>
          </div>
        </div>

        {/* Update name */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h2>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 text-gray-400 cursor-not-allowed"
                value={user.email}
                disabled
              />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
            </div>
            <button
              type="submit" disabled={profileLoading || name === user.name}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {profileLoading ? "Saving…" : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Change password */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Change Password</h2>
          <p className="text-gray-400 text-sm mb-4">Use a strong password you don't use elsewhere</p>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPw ? "text" : "password"} required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm">
                  {showCurrentPw ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showNewPw ? "text" : "password"} required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Min. 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowNewPw(!showNewPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm">
                  {showNewPw ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <button
              type="submit" disabled={passwordLoading}
              className="bg-gray-800 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-900 disabled:opacity-50 transition-colors"
            >
              {passwordLoading ? "Updating…" : "Update Password"}
            </button>
          </form>
        </div>
      </div>

      <Toast toast={toast} />
    </Layout>
  );
}
