import { useState } from "react";
import axios from "axios";

export default function CreateContest() {
  const [title, setTitle] = useState("");
  const [entryFee, setEntryFee] = useState("");
  const [maxPlayers, setMaxPlayers] = useState("");
  const [matchTime, setMatchTime] = useState("");

  // ✅ Rewards State
  const [firstReward, setFirstReward] = useState("");
  const [secondReward, setSecondReward] = useState("");
  const [thirdReward, setThirdReward] = useState("");

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

      /* 
       * matchTime is now OPTIONAL. 
       * If not provided, contest is created as "Coming Soon".
       */

      const formData = new FormData();
      formData.append("title", title);
      formData.append("entryFee", entryFee);
      formData.append("maxPlayers", maxPlayers);
      if (matchTime) formData.append("matchTime", matchTime);

      // ✅ Append Rewards
      formData.append("firstReward", firstReward);
      formData.append("secondReward", secondReward);
      formData.append("thirdReward", thirdReward);

      // Capture rewards from DOM elements (quick fix since verify state management would take longer)
      // Ideally should bind to state, but inputs were added manually above. 
      // I will update the form above to bind to state properly in next step if this fails, 
      // but to be safe let's add state binding to the previous step.

      // WAIT, I should have added state variables first. 
      // I will fix this by creating state variables in a separate MultiReplace.
      // Retracting this thought, I must do it correctly.



      formData.append("image", imageFile);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL || "/api"}/admin/contest`,
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
      setFirstReward("");
      setSecondReward("");
      setThirdReward("");
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

        {/* REWARDS SECTION */}
        <div className="bg-gray-700/50 p-4 rounded border border-gray-600">
          <h3 className="font-bold text-lg mb-3 text-yellow-400">🏆 Rewards</h3>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm mb-1 text-gray-300">1st Prize</label>
              <input
                type="text"
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-yellow-400 outline-none"
                value={firstReward}
                onChange={(e) => setFirstReward(e.target.value)}
                placeholder="e.g. ₹500"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-300">2nd Prize</label>
              <input
                type="text"
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-gray-400 outline-none"
                value={secondReward}
                onChange={(e) => setSecondReward(e.target.value)}
                placeholder="e.g. ₹250"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-300">3rd Prize</label>
              <input
                type="text"
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-orange-400 outline-none"
                value={thirdReward}
                onChange={(e) => setThirdReward(e.target.value)}
                placeholder="e.g. ₹100"
              />
            </div>
          </div>
        </div>


        {/* MATCH START TIME */}
        <div>
          <label className="block mb-1 font-bold">
            Match Start Time
          </label>
          <div className="w-full p-2 rounded bg-gray-700 text-gray-400 italic border border-gray-600">
            Coming Soon
          </div>
          {/* 
          <input
            type="datetime-local"
            className="w-full p-2 rounded bg-gray-700"
            value={matchTime}
            onChange={(e) => setMatchTime(e.target.value)}
            name="matchTime"
          /> 
          */}
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
