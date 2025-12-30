// src/components/LoginPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "./UserContext";
import { loginUser, registerUser } from "../api/auth";
import { useNavigate } from "react-router-dom"; // Hook for navigation

export default function LoginPage({ onClose, mode: initialMode = "login" }) {
  const { login, logout, user } = useUser();
  const navigate = useNavigate(); // Initialize navigation

  const [mode, setMode] = useState(initialMode); // login signup forgot profile

  // FORM STATES
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => setMode(initialMode), [initialMode]);

  // ⚡ LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginUser({ email, password });
      login({
        token: res.data.token,
        _id: res.data.userId,
        username: res.data.username,
        email: email,
      });

      onClose();
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // 🆕 SIGNUP
  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return alert("Passwords do not match!");
    setLoading(true);

    try {
      const res = await registerUser({ username, email, password });
      login({
        token: res.data.token,
        _id: res.data.userId,
        username: res.data.username,
        email: email,
      });

      onClose();
    } catch (err) {
      alert(err.response?.data?.msg || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔐 FORGOT PASSWORD (INTERNAL MODAL FLOW)
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || "https://backend-d10xvopad-ravi-sahanis-projects.vercel.app/api"}/auth/forgot-password`, { email: forgotEmail });
      alert(res.data.msg || "Reset link sent!");
      setMode("login");
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  // ✨ SWITCH UI MODE WITH CLEAR
  const switchMode = (m) => {
    setMode(m);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setUsername("");
    setForgotEmail("");
  };

  // 🚹 USER PROFILE MODE
  if (mode === "profile" && user) {
    return (
      <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4 z-50">
        <div className="bg-[#27687a] p-8 rounded-lg max-w-sm w-full text-white shadow-lg relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-200">
            ✖
          </button>
          <h2 className="text-3xl font-bold mb-5 text-center">👤 Profile</h2>

          <p className="font-semibold text-lg">Username: <span className="text-yellow-300">{user.username}</span></p>
          <p className="font-semibold text-lg mt-1">Email: <span className="text-green-300">{user.email}</span></p>

          <button
            onClick={() => { logout(); onClose(); }}
            className="mt-6 bg-red-500 w-full py-2 rounded-lg font-bold hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  /* 🌟 FORMS BELOW ★ 3 MODES */
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4 z-50">
      <div className="bg-[#27687a] p-8 rounded-lg max-w-md w-full relative shadow-lg text-white">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-300 hover:text-white text-2xl">×</button>

        <h2 className="text-3xl font-bold mb-6 text-center">
          {mode === "login" && "Login"}
          {mode === "signup" && "Sign Up"}
          {mode === "forgot" && "Forgot Password"}
        </h2>

        {/* LOGIN */}
        {mode === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              placeholder="Email"
              className="input bg-gray-700 p-2 w-full rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              placeholder="Password"
              type="password"
              className="input bg-gray-700 p-2 w-full rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              className="bg-orange-500 w-full py-2 rounded-lg font-bold hover:bg-orange-600 transition-colors"
              disabled={loading}
            >
              {loading ? "Logging..." : "Login"}
            </button>

            {/* NEW REDIRECT LINK */}
            <p
              onClick={() => {
                navigate("/forgot-password");
                onClose();
              }}
              className="text-blue-400 cursor-pointer mt-2 text-sm text-center hover:underline"
            >
              Forgot Password?
            </p>

            <p className="text-center mt-4">
              Don't have an account? <button type="button" onClick={() => switchMode("signup")} className="font-bold text-yellow-300 hover:text-yellow-400">Sign Up</button>
            </p>
          </form>
        )}

        {/* SIGNUP */}
        {mode === "signup" && (
          <form onSubmit={handleSignup} className="space-y-4">
            <input placeholder="Username" className="input bg-gray-700 p-2 w-full rounded" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <input placeholder="Email" className="input bg-gray-700 p-2 w-full rounded" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input placeholder="Password" type="password" className="input bg-gray-700 p-2 w-full rounded" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <input placeholder="Confirm Password" type="password" className="input bg-gray-700 p-2 w-full rounded" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />

            <button disabled={loading} className="bg-orange-500 w-full py-2 rounded-lg font-bold">{loading ? "Creating..." : "Sign Up"}</button>

            <p className="text-center mt-2">
              Already have an account? <button type="button" onClick={() => switchMode("login")} className="font-bold text-yellow-300">Login</button>
            </p>
          </form>
        )}

        {/* FORGOT PASSWORD (MODAL VERSION) */}
        {mode === "forgot" && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <input placeholder="Enter Email" className="input bg-gray-700 p-2 w-full rounded" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} required />
            <button disabled={loading} className="bg-orange-500 w-full py-2 rounded-lg font-bold">{loading ? "Sending..." : "Send Reset Link"}</button>
            <button type="button" className="mt-2 text-center w-full text-gray-300 hover:text-white" onClick={() => switchMode("login")}>Back to Login</button>
          </form>
        )}
      </div>
    </div>
  );
}