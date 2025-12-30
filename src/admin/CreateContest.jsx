import { useState } from "react";
import axios from "axios";

export default function CreateContest() {
  const [title, setTitle] = useState("");
  const [entryFee, setEntryFee] = useState("");
  const [maxPlayers, setMaxPlayers] = useState("");
  const [matchTime, setMatchTime] = useState(""); // ✅ NEW
  const [imageFile, setImageFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setMsg("Admin auth required");
        setLoading(false);
        return;
      }

      if (!imageFile) {
        setMsg("Contest image required");
        setLoading(false);
        return;
      }

      if (!matchTime) {
        setMsg("Match start time is required");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("entryFee", entryFee);
      formData.append("maxPlayers", maxPlayers);
      formData.append("matchTime", matchTime); // ✅ NEW
      formData.append("image", imageFile);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL || "https://backend-1sqampll9-ravi-sahanis-projects.vercel.app/api"}/admin/contest`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMsg(res.data?.msg || "🎉 Contest Created Successfully!");

      // reset form
      setTitle("");
      setEntryFee("");
      setMaxPlayers("");
      setMatchTime("");
      setImageFile(null);
    } catch (err) {
      setMsg(err.response?.data?.msg || "Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Create New Contest</h1>

      {msg && (
        <p className="mb-4 p-3 bg-gray-700 rounded text-center font-medium">
          {msg}
        </p>
      )}

      <form
        onSubmit={handleCreate}
        className="bg-gray-800 p-6 rounded-lg max-w-xl space-y-4"
      >
        {/* CONTEST TITLE */}
        <div>
          <label className="block mb-1 font-bold">Contest Title</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-700"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* ENTRY FEE */}
        <div>
          <label className="block mb-1 font-bold">Entry Fee (₹)</label>
          <input
            type="number"
            className="w-full p-2 rounded bg-gray-700"
            value={entryFee}
            onChange={(e) => setEntryFee(e.target.value)}
            required
          />
        </div>

        {/* MAX PLAYERS */}
        <div>
          <label className="block mb-1 font-bold">Max Players</label>
          <input
            type="number"
            className="w-full p-2 rounded bg-gray-700"
            value={maxPlayers}
            onChange={(e) => setMaxPlayers(e.target.value)}
            required
          />
        </div>

        {/* MATCH START TIME */}
        <div>
          <label className="block mb-1 font-bold">
            Match Start Time
          </label>
          <input
            type="datetime-local"
            className="w-full p-2 rounded bg-gray-700"
            value={matchTime}
            onChange={(e) => setMatchTime(e.target.value)}
            required
          />
        </div>

        {/* CONTEST IMAGE */}
        <div>
          <label className="block mb-1 font-bold">Contest Image</label>
          <input
            type="file"
            accept="image/*"
            className="w-full p-2 rounded bg-gray-700"
            onChange={(e) => setImageFile(e.target.files[0])}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 py-2 rounded font-bold hover:bg-blue-500 disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Contest"}
        </button>
      </form>
    </div>
  );
}
