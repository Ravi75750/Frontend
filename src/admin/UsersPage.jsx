// src/admin/UsersPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import DeleteModal from "../components/DeleteModal.jsx";
import { useAdminSearch } from "./AdminSearchContext.jsx";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [selected, setSelected] = useState(null); // DELETE USER
  const [showCreate, setShowCreate] = useState(false); // ADD USER MODAL

  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  const { query } = useAdminSearch();
  const token = localStorage.getItem("adminToken");

  // ==========================
  // LOAD USERS
  // ==========================
  const loadUsers = async () => {
    try {
      setErrorMsg("");
      if (!token) {
        setErrorMsg("Admin auth required");
        return;
      }
      const res = await axios.get(`${import.meta.env.VITE_API_URL || "https://backend-1sqampll9-ravi-sahanis-projects.vercel.app/api"}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      setErrorMsg(err.response?.data?.msg || "Failed to load users");
      toast.error(err.response?.data?.msg || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // ==========================
  // DELETE USER
  // ==========================
  const askDelete = (u) => setSelected(u);

  const deleteUser = async () => {
    try {
      if (!token) {
        return toast.error("Admin auth required");
      }
      await axios.delete(
        `${import.meta.env.VITE_API_URL || "https://backend-1sqampll9-ravi-sahanis-projects.vercel.app/api"}/admin/user/${selected._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers((prev) => prev.filter((u) => u._id !== selected._id));

      toast.success("User deleted");
      setSelected(null);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to delete user");
    }
  };

  // ==========================
  // ADD NEW USER
  // ==========================
  const createUser = async (e) => {
    e.preventDefault();

    if (!newUser.email || !newUser.username || !newUser.password) {
      return toast.error("All fields required");
    }

    try {
      if (!token) {
        return toast.error("Admin auth required");
      }
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL || "https://backend-1sqampll9-ravi-sahanis-projects.vercel.app/api"}/admin/user`,
        newUser,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data?.msg || "User created!");

      setNewUser({
        username: "",
        email: "",
        password: "",
      });
      setShowCreate(false);
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to create user");
    }
  };

  // ==========================
  // SEARCH FILTER
  // ==========================
  const filtered = users.filter((u) =>
    `${u.username} ${u.email}`.toLowerCase().includes(query.toLowerCase())
  );

  if (loading)
    return <p className="text-gray-400 text-lg">Loading users...</p>;

  return (
    <div className="p-6 text-white">

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">All Users</h1>

        <button
          className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
          onClick={() => setShowCreate(true)}
        >
          ➕ Add User
        </button>
      </div>

      {errorMsg && (
        <p className="mb-4 p-3 bg-red-900/40 border border-red-700 rounded">{errorMsg}</p>
      )}

      {/* TABLE */}
      <table className="w-full bg-gray-900 rounded-lg overflow-hidden">
        <thead className="bg-gray-800">
          <tr>
            <th className="p-3 text-left">Username</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Joined Contests</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((u) => (
            <tr key={u._id} className="border-b border-gray-800">
              <td className="p-3">{u.username}</td>
              <td className="p-3">{u.email}</td>
              <td className="p-3">{u.joinedContests?.length || 0}</td>

              <td className="p-3 text-right space-x-2">
                <button
                  onClick={() => askDelete(u)}
                  className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
                <button className="bg-yellow-500 px-3 py-1 rounded text-black hover:bg-yellow-600">
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* DELETE USER MODAL */}
      <DeleteModal
        open={!!selected}
        onClose={() => setSelected(null)}
        onConfirm={deleteUser}
        title="Delete this user?"
        message={`User: ${selected?.username}`}
      />

      {/* ADD USER MODAL */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center backdrop-blur-sm">
          <form
            onSubmit={createUser}
            className="bg-gray-900 p-6 rounded-lg w-[380px] space-y-3"
          >
            <h2 className="text-xl font-bold">Create New User</h2>

            <input
              className="bg-gray-800 p-2 w-full rounded"
              placeholder="Username"
              value={newUser.username}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
            />

            <input
              className="bg-gray-800 p-2 w-full rounded"
              placeholder="Email"
              type="email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />

            <input
              className="bg-gray-800 p-2 w-full rounded"
              placeholder="Password"
              type="password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
            />

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-blue-600 py-2 rounded hover:bg-blue-700"
              >
                Create
              </button>

              <button
                className="flex-1 bg-gray-700 py-2 rounded"
                onClick={() => setShowCreate(false)}
                type="button"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
