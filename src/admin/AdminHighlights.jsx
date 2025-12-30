import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AddHighlight from "./AddHighlight.jsx"; // your upload UI

export default function AdminHighlights() {
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const token = localStorage.getItem("adminToken");

  // Load highlights
  const loadHighlights = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || "https://backend-1sqampll9-ravi-sahanis-projects.vercel.app/api"}/highlights`);
      setHighlights(res.data);
    } catch {
      toast.error("Failed to load highlights");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHighlights();
  }, []);

  // Delete highlight
  const deleteHighlight = async (id) => {
    if (!window.confirm("Delete this highlight?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || "https://backend-1sqampll9-ravi-sahanis-projects.vercel.app/api"}/highlights/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setHighlights((prev) => prev.filter((h) => h._id !== id));
      toast.success("Highlight Deleted!");
    } catch {
      toast.error("Failed to delete");
    }
  };

  if (loading)
    return <p className="text-gray-300 text-lg p-6">Loading highlights...</p>;

  return (
    <div className="p-6 text-white">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🎥 Manage Highlights</h1>

        <button
          onClick={() => setShowUpload(!showUpload)}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          {showUpload ? "Close" : "➕ Add Highlight"}
        </button>
      </div>

      {/* UPLOAD PANEL */}
      {showUpload && (
        <div className="border border-gray-700 rounded-lg mb-6 p-4 bg-gray-900">
          <AddHighlight onUpload={loadHighlights} />
        </div>
      )}

      {/* LIST */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {highlights.map((h) => (
          <div
            key={h._id}
            className="bg-[#1f2937] rounded-lg overflow-hidden border border-gray-700"
          >
            <img
              src={h.thumbnail || "/default-thumb.jpg"}
              alt={h.title}
              className="h-44 w-full object-cover"
            />

            <div className="p-3">
              <h2 className="font-bold text-lg">{h.title}</h2>

              <a
                href={h.videoURL}
                target="_blank"
                className="text-blue-400 hover:underline text-sm"
              >
                ▶ Watch Video
              </a>

              <button
                className="w-full mt-3 bg-red-600 py-2 rounded hover:bg-red-700 font-semibold"
                onClick={() => deleteHighlight(h._id)}
              >
                🗑 Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
