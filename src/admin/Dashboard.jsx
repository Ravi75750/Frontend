// src/admin/Dashboard.jsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Trophy,
  IndianRupee,
  Inbox,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const REFRESH_INTERVAL = 10000; // 10 seconds

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openContest, setOpenContest] = useState(null);
  const [error, setError] = useState(null);

  // ✅ New State for Modal
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [endingContestId, setEndingContestId] = useState(null);

  const intervalRef = useRef(null);
  const token = localStorage.getItem("adminToken");

  /* ================= FETCH DASHBOARD ================= */
  const fetchDashboard = async (silent = false) => {
    try {
      if (!silent) setLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL || "/api"}/admin/dashboard-stats`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setStats(res.data);
      setError(null);
    } catch (err) {
      console.error("Dashboard refresh failed:", err);
      setError("Failed to fetch dashboard data");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  /* ================= END CONTEST ================= */
  const handleEndContest = async (contestId) => {
    if (!confirm("Are you sure you want to END this contest? It will be marked as COMPLETED.")) return;

    setEndingContestId(contestId);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL || "/api"}/admin/contest/${contestId}/finish`,
        { winner: "TBD", killPoints: 0 }, // Default values, can be updated later if needed
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh
      fetchDashboard(true);
      setOpenContest(null);
      alert("Contest Ended Successfully");
    } catch (err) {
      alert("Failed to end contest");
    } finally {
      setEndingContestId(null);
    }
  };

  /* ================= AUTO REFRESH ================= */
  useEffect(() => {
    if (!token) return;

    fetchDashboard();

    const start = () => {
      if (intervalRef.current) return;
      intervalRef.current = setInterval(
        () => fetchDashboard(true),
        REFRESH_INTERVAL
      );
    };

    const stop = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    start();

    const onVisibility = () => {
      if (document.visibilityState === "hidden") stop();
      else {
        fetchDashboard(true);
        start();
      }
    };

    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [token]);

  if (loading && !stats) {
    return <p className="text-slate-400">Loading dashboard...</p>;
  }

  if (error) {
    return <p className="text-red-400">{error}</p>;
  }

  /* ================= STAT CARDS ================= */
  const cards = [
    {
      label: "Total Participants",
      value: stats.totalUsers,
      change: "Live count",
      positive: true,
      icon: Users,
    },
    {
      label: "Active Contests",
      value: stats.activeContests,
      change: "UPCOMING + LIVE",
      positive: true,
      icon: Trophy,
    },
    {
      label: "Total Revenue",
      value: `₹ ${stats.totalRevenue}`,
      change: "Successful payments",
      positive: true,
      icon: IndianRupee,
    },
    {
      label: "Pending Submissions",
      value: stats.pendingPayments,
      change: "Needs review",
      positive: false,
      icon: Inbox,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold flex items-center gap-2">
          Admin Dashboard
          <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
            Live
          </span>
        </h2>
        <p className="text-slate-400 mt-1">
          Auto-refreshing every 10 seconds
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={i}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4"
            >
              <div className="flex justify-between">
                <p className="text-xs uppercase text-slate-400">{s.label}</p>
                <Icon size={18} />
              </div>

              <div className="mt-3 flex items-end justify-between">
                <p className="text-2xl font-semibold">{s.value}</p>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${s.positive
                    ? "bg-emerald-500/15 text-emerald-300"
                    : "bg-rose-500/15 text-rose-300"
                    }`}
                >
                  {s.positive ? (
                    <ArrowUpRight size={14} />
                  ) : (
                    <ArrowDownRight size={14} />
                  )}
                  {s.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Contests */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl">
        <div className="px-5 py-4 border-b border-slate-800">
          <h3 className="text-lg font-semibold">Recent Contests</h3>
        </div>

        <table className="w-full text-sm">
          <thead className="text-slate-400">
            <tr>
              <th className="px-5 py-3 text-left">Contest</th>
              <th>Status</th>
              <th>Players</th>
              <th>Match Time</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {stats.recentContests.map((c) => {
              const isOpen = openContest === c._id;

              return (
                <React.Fragment key={c._id}>
                  {/* MAIN ROW */}
                  <tr
                    className="border-t border-slate-800 hover:bg-slate-800/40 cursor-pointer"
                    onClick={() =>
                      setOpenContest(isOpen ? null : c._id)
                    }
                  >
                    <td className="px-5 py-3 font-medium">{c.title}</td>
                    <td>{c.status}</td>
                    <td>{c.participants.length}</td>
                    <td>{new Date(c.matchTime).toLocaleString()}</td>
                    <td className="pr-5 text-right">
                      {isOpen ? <ChevronUp /> : <ChevronDown />}
                    </td>
                  </tr>

                  {/* DROPDOWN ROW */}
                  {isOpen && (
                    <tr className="bg-slate-800/60">
                      <td colSpan={5} className="px-6 py-4">
                        <div className="space-y-4">

                          {/* 🔴 END CONTEST BUTTON (If LIVE) */}
                          {c.status === "LIVE" && (
                            <div className="flex justify-end mb-4">
                              <button
                                onClick={(e) => { e.stopPropagation(); handleEndContest(c._id); }}
                                disabled={endingContestId === c._id}
                                className="bg-red-600 text-white px-4 py-2 rounded font-bold hover:bg-red-700 disabled:opacity-50"
                              >
                                {endingContestId === c._id ? "Ending..." : "⚠️ End Contest Now"}
                              </button>
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* LEFT COLUMN: Revenue Stats */}
                            <div className="space-y-3 bg-slate-900/50 p-4 rounded-lg">
                              <h4 className="text-emerald-400 font-bold mb-2">💰 Revenue Stats</h4>
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Total Collected</span>
                                <span className="font-semibold text-emerald-400">₹ {c.totalCollected}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Paid Players</span>
                                <span>{c.paidPlayers}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Free Joins</span>
                                <span>{c.freePlayers}</span>
                              </div>
                            </div>

                            {/* RIGHT COLUMN: Participant Details */}
                            <div className="space-y-3 bg-slate-900/50 p-4 rounded-lg">
                              <h4 className="text-blue-400 font-bold mb-2">👥 Participants</h4>
                              {c.participants && c.participants.length > 0 ? (
                                <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                  {c.participants.map((p, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-slate-800 p-2 rounded text-xs">
                                      <div>
                                        <span className="text-yellow-400 font-bold mr-2">#{p.slotIndex}</span>
                                        <span className="font-semibold">{p.userId?.username || "Unknown"}</span>
                                      </div>
                                      <button
                                        onClick={(e) => { e.stopPropagation(); setSelectedParticipant(p); }}
                                        className="text-[#9ce2f9] hover:underline"
                                      >
                                        View Details
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-slate-500 text-sm">No participants yet.</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ✅ PARTICIPANT DETAILS MODAL */}
      {selectedParticipant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setSelectedParticipant(null)}>
          <div className="bg-[#0f1f2e] border border-gray-600 w-full max-w-sm rounded-xl p-6 relative shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">
              Participant Details
            </h3>

            <div className="space-y-3">
              <div>
                <p className="text-gray-400 text-xs uppercase">Username</p>
                <p className="text-white font-semibold text-lg">{selectedParticipant.userId?.username || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase">In-Game Name</p>
                <p className="text-yellow-400 font-mono text-lg">{selectedParticipant.inGameName || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase">In-Game ID</p>
                <p className="text-blue-300 font-mono text-lg">{selectedParticipant.inGameId || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase">UPI ID</p>
                <p className="text-green-400 font-mono text-lg">{selectedParticipant.upiId || "N/A"}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedParticipant(null)}
              className="mt-6 w-full bg-red-600 hover:bg-red-700 py-2 rounded text-white font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
