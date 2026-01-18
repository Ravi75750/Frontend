import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function AddHighlight() {
  const [title, setTitle] = useState("");
  const [videoURL, setVideoURL] = useState("");
  const [date, setDate] = useState("");

  const token = localStorage.getItem("adminToken");

  const saveHighlight = async (e) => {
    e.preventDefault();

    if (!title || !videoURL) {
      toast.error("Title & Video URL required");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL || "/api"}/highlights`,
        { title, videoURL, date },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Highlight uploaded!");
      setTitle("");
      setVideoURL("");
      setDate("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload highlight");
    }
  };


  return (
    <div className="p-10 text-white max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Upload Tournament Highlight
      </h1>

      <form onSubmit={saveHighlight} className="space-y-5">
        <input
          className="w-full p-3 rounded bg-gray-700 outline-none"
          placeholder="Highlight Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="w-full p-3 rounded bg-gray-700 outline-none"
          placeholder="Paste YouTube Video Link"
          value={videoURL}
          onChange={(e) => setVideoURL(e.target.value)}
        />

        <input
          type="date"
          className="w-full p-3 rounded bg-gray-700 outline-none text-white appearance-none"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded font-bold"
        >
          Upload Now ⏫
        </button>
      </form>
    </div>
  );
}
