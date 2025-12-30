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

  const intervalRef = useRef(null);
  const token = localStorage.getItem("adminToken");

  /* ================= FETCH DASHBOARD ================= */
  const fetchDashboard = async (silent = false) => {
    try {
      if (!silent) setLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL || "https://backend-d10xvopad-ravi-sahanis-projects.vercel.app/api"}/admin/dashboard-stats`,
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
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">
                              Total Collected
                            </span>
                            <span className="font-semibold text-emerald-400">
                              ₹ {c.totalCollected}
                            </span>
                          </div>

                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">
                              Paid Players
                            </span>
                            <span>{c.paidPlayers}</span>
                          </div>

                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">
                              Free Joins
                            </span>
                            <span>{c.freePlayers}</span>
                          </div>

                          <div>
                            <p className="text-slate-400 mb-2 text-sm">
                              Player Payments
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {c.playerPayments.map((p, i) => (
                                <div
                                  key={i}
                                  className="bg-slate-900 px-3 py-2 rounded flex justify-between text-xs"
                                >
                                  <span>{p.username}</span>
                                  <span
                                    className={
                                      p.amount === 0
                                        ? "text-slate-400"
                                        : "text-emerald-400"
                                    }
                                  >
                                    ₹ {p.amount}
                                  </span>
                                </div>
                              ))}
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
    </div>
  );
}
