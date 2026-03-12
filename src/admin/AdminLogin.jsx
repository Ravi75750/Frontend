import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: Login, 2: OTP
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL || "/api"}/admin/login`,
        { email: email.trim(), password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (!res.data?.token) {
        setError("Login failed: No token received");
        return;
      }

      // ✅ Store admin token
      localStorage.setItem("adminToken", res.data.token);

      // ✅ Redirect
      navigate("/admin/dashboard", { replace: true });

    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-slate-900 leading-normal tracking-normal text-white">
      <div className="bg-slate-800 p-8 rounded-2xl w-[90%] max-w-md shadow-2xl border border-slate-700">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
          Admin Portal
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-slate-400 text-sm mb-1 ml-1" htmlFor="admin-email">Email Address</label>
            <input
              id="admin-email"
              type="email"
              placeholder="admin@example.com"
              required
              className="w-full bg-slate-700 border border-slate-600 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-slate-400 text-sm mb-1 ml-1" htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              placeholder="••••••••"
              required
              className="w-full bg-slate-700 border border-slate-600 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white p-3 rounded-lg font-bold shadow-lg transform active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200 text-center text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

