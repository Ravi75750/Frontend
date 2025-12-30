import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return; // ⛔ prevent double submit

    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL || "https://backend-d10xvopad-ravi-sahanis-projects.vercel.app/api"}/admin/login`,
        {
          email: email.trim(),
          password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.data?.token) {
        setError(res.data?.msg || "Invalid credentials");
        return;
      }

      // ✅ Store admin token
      localStorage.setItem("adminToken", res.data.token);

      // ✅ Redirect (replace prevents back-navigation to login)
      navigate("/admin/dashboard", { replace: true });

    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-slate-900">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-xl w-[90%] max-w-sm shadow-lg"
      >
        <h2 className="text-2xl font-bold text-center mb-4 text-slate-700">
          Admin Login
        </h2>

        <input
          type="email"
          placeholder="Admin Email"
          required
          autoComplete="email"
          className="w-full border p-2 mb-3 rounded focus:ring-2 focus:ring-blue-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          required
          autoComplete="current-password"
          className="w-full border p-2 mb-3 rounded focus:ring-2 focus:ring-blue-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded font-semibold disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && (
          <p className="text-red-500 mt-3 text-center text-sm">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
