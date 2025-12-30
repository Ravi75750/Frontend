import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function RoomDetailsModal({ contest, onClose, onUpdated }) {
  const [roomId, setRoomId] = useState(contest.roomId || "");
  const [roomPass, setRoomPass] = useState(contest.roomPass || "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!roomId.trim() || !roomPass.trim()) {
      return toast.error("Room ID and Password are required");
    }

    const token = localStorage.getItem("adminToken");
    if (!token) {
      return toast.error("Admin authentication required");
    }

    try {
      setSaving(true);

      const res = await axios.put(
        `${import.meta.env.VITE_API_URL || "/api"}/admin/contest/${contest._id}/room`,
        {
          roomId: roomId.trim(),
          roomPass: roomPass.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(res.data.msg || "Room details updated");

      onUpdated?.(); // refresh contests list
      onClose?.();   // close modal
    } catch (err) {
      toast.error(err.response?.data?.msg || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg w-[400px] border border-gray-700 relative">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-xl text-gray-400 hover:text-white"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4 text-white text-center">
          Edit Room Details
        </h2>

        <div className="mb-3">
          <label className="block text-sm text-gray-300 mb-1">
            Room ID
          </label>
          <input
            placeholder="Enter Room ID"
            className="w-full p-2 bg-gray-700 rounded text-white outline-none focus:ring-2 focus:ring-yellow-500"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-1">
            Room Password
          </label>
          <input
            placeholder="Enter Room Password"
            className="w-full p-2 bg-gray-700 rounded text-white outline-none focus:ring-2 focus:ring-yellow-500"
            value={roomPass}
            onChange={(e) => setRoomPass(e.target.value)}
          />
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-60 py-2 rounded font-bold text-black"
        >
          {saving ? "Saving..." : "Save Room Details"}
        </button>

        {/* INFO */}
        <p className="text-xs text-gray-400 mt-3 text-center">
          Room details will be visible to joined players <br />
          <b>2 minutes before match start</b>
        </p>
      </div>
    </div>
  );
}
