import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import DeleteModal from "../components/DeleteModal.jsx";
import RoomDetailsModal from "../components/RoomDetailsModal.jsx";
import { useAdminSearch } from "./AdminSearchContext.jsx";

export default function ContestsPage() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Room details modal
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [selectedContest, setSelectedContest] = useState(null);

  const token = localStorage.getItem("adminToken");
  const { query } = useAdminSearch();

  /* ================= LOAD CONTESTS ================= */
  const loadContests = async () => {
    if (!token) {
      setErrorMsg("Admin authentication required");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL || "/api"}/admin/contests`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setContests(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      const msg = err.response?.data?.msg || "Failed to load contests";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContests();
  }, []);

  /* ================= SEARCH FILTER ================= */
  const filteredContests = useMemo(() => {
    if (!query?.trim()) return contests;

    const q = query.toLowerCase();

    return contests.filter(
      (c) =>
        c.title?.toLowerCase().includes(q) ||
        String(c.entryFee).includes(q) ||
        String(c.maxPlayers).includes(q)
    );
  }, [query, contests]);

  /* ================= DELETE ================= */
  const deleteContest = async () => {
    if (!deleteTarget || !token) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL || "/api"}/admin/contest/${deleteTarget._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Contest deleted");
      setContests((prev) =>
        prev.filter((c) => c._id !== deleteTarget._id)
      );
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete contest");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Contests</h1>

        <a
          href="/admin/create-contest"
          className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          ➕ Create Contest
        </a>
      </div>

      {loading && <p className="text-gray-300">Loading contests...</p>}
      {errorMsg && !loading && (
        <p className="text-red-400">{errorMsg}</p>
      )}

      {!loading && filteredContests.length === 0 ? (
        <p className="text-gray-300">No contests found.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-5">
          {filteredContests.map((contest) => (
            <div
              key={contest._id}
              className="bg-[#1f2937] p-5 rounded-xl border border-gray-700"
            >
              <img
                src={contest.image}
                alt={contest.title}
                className="h-40 w-full object-cover rounded-md"
              />

              <h2 className="mt-3 font-semibold text-lg">
                {contest.title}
              </h2>

              <p>Entry: ₹{contest.entryFee}</p>
              <p>Max Players: {contest.maxPlayers}</p>
              <p>
                Players Joined: {contest.participants?.length || 0}
              </p>

              <p className="mt-1 text-sm">
                Status:{" "}
                <span
                  className={
                    contest.status === "LIVE"
                      ? "text-red-400 font-bold"
                      : contest.status === "COMPLETED"
                        ? "text-green-400 font-bold"
                        : "text-yellow-400 font-bold"
                  }
                >
                  {contest.status}
                </span>
              </p>

              <div className="mt-4 flex gap-3">
                {/* DELETE */}
                <button
                  onClick={() => setDeleteTarget(contest)}
                  className="bg-red-600 flex-1 rounded py-2 hover:bg-red-700"
                >
                  Delete
                </button>

                {/* EDIT ROOM DETAILS */}
                <button
                  onClick={() => {
                    setSelectedContest(contest);
                    setShowRoomForm(true);
                  }}
                  className="bg-yellow-600 hover:bg-yellow-500 text-black px-4 py-2 rounded"
                >
                  Edit Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DELETE MODAL */}
      <DeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={deleteContest}
      />

      {/* ROOM DETAILS MODAL */}
      {showRoomForm && selectedContest && (
        <RoomDetailsModal
          contest={selectedContest}
          onClose={() => {
            setShowRoomForm(false);
            setSelectedContest(null);
          }}
          onUpdated={loadContests}
        />
      )}
    </div>
  );
}
