// src/admin/AdminLayout.jsx
import React, { useEffect } from "react";
import VerifyPayments from "./VerifyPayment";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Trophy,
  CreditCard,
  LogOut,
  Video, // Changed from VideoIcon to Video to match usage below
} from "lucide-react";

import { useAdminSearch } from "./AdminSearchContext";

export default function AdminLayout() {
  const { setQuery } = useAdminSearch();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return;
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (!payload?.exp || payload.exp * 1000 < Date.now()) {
        localStorage.removeItem("adminToken");
        navigate("/admin", { replace: true });
      }
    } catch {
      // If token malformed, force logout to admin login
      localStorage.removeItem("adminToken");
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="h-16 flex items-center gap-2 px-6 border-b border-slate-800">
          <div className="h-9 w-9 rounded-lg  flex items-center justify-center">
            <img className="h-[38px] w-auto" src="/Logos.gif" alt="trophy" />
          </div>
          <div>
            <p className="font-bold text-lg leading-tight">Admin Dashboard</p>
            <p className="text-xs text-slate-400">FireContests Panel</p>
          </div>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 text-sm">
          <AdminNavItem to="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <AdminNavItem to="/admin/contests" icon={Trophy} label="Contests" />
          <AdminNavItem to="/admin/users" icon={Users} label="Users" />
          <AdminNavItem to="/admin/payments" icon={CreditCard} label="Payments" />
          <AdminNavItem to="/admin/add-highlight" icon={Video} label="Highlights Upload" />
          <AdminNavItem to="/admin/highlights" icon={Video} label="Manage Highlights" />
          <AdminNavItem to="/admin/announcements" icon={LayoutDashboard} label="Announcements" />

          <AdminNavItem to="/admin/verify-payments" icon={CreditCard} label="Verify Payments" />
          <AdminNavItem to="/admin/settings" icon={LayoutDashboard} label="System Settings" />


        </nav>

        <div className="border-t border-slate-800 px-4 py-4 flex items-center justify-between text-xs text-slate-400">
          <div>
            <p className="font-semibold text-slate-200">Admin</p>
            <p>Administrator</p>
          </div>
          <button
            className="inline-flex items-center gap-1 px-2 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-red-300 text-xs"
            onClick={() => {
              localStorage.removeItem("adminToken");
              window.location.href = "/admin";
            }}
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-950/80 backdrop-blur">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 text-xs border border-emerald-500/40">
              Online
            </span>
          </div>

          {/* 🔥 INPUT UPDATES SEARCH CONTEXT */}
          <input
            type="text"
            placeholder="Search Users, Contests, Payments..."
            onChange={(e) => setQuery(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
          />
        </header>

        <section className="flex-1 p-6 overflow-y-auto bg-slate-950">
          <Outlet />
        </section>
      </main>
    </div>
  );
}

function AdminNavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${isActive
          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
          : "text-slate-300 hover:bg-slate-800 hover:text-white"
        }`
      }
    >
      {(() => {
        const I = icon;
        return <I size={18} />;
      })()}
      <span>{label}</span>
    </NavLink>
  );
}
