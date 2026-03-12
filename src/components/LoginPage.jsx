// src/components/LoginPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "./UserContext";
import { loginUser, registerUser, verifyEmail, sendOtp } from "../api/auth";
// import { useNavigate } from "react-router-dom";
// 🔥 Firebase Removed


export default function LoginPage({ onClose, mode: initialMode = "login" }) {
  const { login, logout, user } = useUser();
  // const navigate = useNavigate();

  const [mode, setMode] = useState(initialMode); // login | signup | forgot | profile | link_mobile
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  // COMMON STATES
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  // SIGNUP SPECIFIC
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);

  // LOGIN SPECIFIC
  const [identifier, setIdentifier] = useState(""); // Email or Mobile

  // LINK MOBILE SPECIFIC
  const [userIdToLink, setUserIdToLink] = useState(null);

  // FORGOT PASSWORD
  const [forgotEmail, setForgotEmail] = useState("");

  // 🔥 Firebase Confirmation Object
  const [confirmationResult, setConfirmationResult] = useState(null);

  useEffect(() => setMode(initialMode), [initialMode]);

  // TIMER LOGIC
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // 🔥 Firebase Logic Removed

  // ⚡ HANDLERS

  // 1. Send OTP (EMAIL)
  const handleSendOtp = async () => {
    if (!email) return alert("Please enter your email address");

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return alert("Please enter a valid email address");

    setOtpLoading(true);
    try {
      const res = await sendOtp({ email });
      alert(res.data.msg || "OTP Sent to your email");
      setOtpSent(true);
      setTimer(60);
    } catch (err) {
      console.error("Send OTP Error:", err);
      alert(err.response?.data?.msg || "Failed to send OTP. Check console.");
    } finally {
      setOtpLoading(false);
    }
  };

  // 2. Register
  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return alert("Passwords do not match!");
    if (!otp) return alert("Please enter OTP");

    setLoading(true);
    try {
      // Register on Backend with Email OTP
      const res = await registerUser({ username, email, password, otp });

      login({
        token: res.data.token,
        _id: res.data.userId,
        username: res.data.username,
        email: res.data.email,
      });
      onClose();
    } catch (err) {
      console.error("Signup Error:", err);
      alert(err.response?.data?.msg || err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // 3. Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Identifier = Mobile or Email
      const res = await loginUser({ identifier, password });

      login({
        token: res.data.token,
        _id: res.data.userId,
        username: res.data.username,
        email: res.data.email,
      });
      onClose();
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // 4. Verify Email (Optional Link)
  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    if (!otp) return alert("Please enter OTP");
    setLoading(true);

    try {
      // Backend Verification
      const res = await verifyEmail({ userId: userIdToLink, email, otp });

      login({
        token: res.data.token,
        _id: res.data.userId,
        username: res.data.username,
        email: email,
      });
      onClose();
    } catch (err) {
      alert(err.response?.data?.msg || err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // 5. Switch Mode
  const switchMode = (m) => {
    setMode(m);
    // Reset states
    setPassword("");
    setConfirmPassword("");
    setOtp("");
    setOtpSent(false);
    setTimer(0);
    setLoading(false);
  };

  // 6. Forgot Password
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || "/api"}/auth/forgot-password`, { email: forgotEmail });
      alert(res.data.msg || "Reset link sent!");
      setMode("login");
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
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
          <p className="font-semibold text-lg mt-1">Email: <span className="text-green-300">{user.email || "N/A"}</span></p>

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

  // ✨ UI COMPONENT
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-50">
      <div className="bg-[#1a4a56] p-8 md:p-12 rounded-3xl max-w-lg w-full relative shadow-2xl text-white border border-[#9ce2f9]/20 animate-slideUp">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-300 hover:text-white text-2xl">×</button>

        <h2 className="text-3xl font-bold mb-6 text-center">
          {mode === "login" && "Login"}
          {mode === "signup" && "Register"}
          {mode === "forgot" && "Reset Password"}
          {mode === "verify_email" && "Verify Email"}
        </h2>

        {/* Firebase Container Removed */}

        {/* LOGIN FORM */}
        {mode === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm text-gray-300 mb-1 block">Email or Username</label>
              <input
                placeholder="Enter Email or Username"
                className="input bg-gray-700 p-2 w-full rounded"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-1 block">Password</label>
              <input
                placeholder="Password"
                type="password"
                className="input bg-gray-700 p-2 w-full rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              className="bg-orange-500 w-full py-2 rounded-lg font-bold hover:bg-orange-600 transition-colors"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p
              onClick={() => { switchMode("forgot"); }}
              className="text-blue-400 cursor-pointer mt-2 text-sm text-center hover:underline"
            >
              Forgot Password?
            </p>

            <p className="text-center mt-4">
              Don't have an account? <button type="button" onClick={() => switchMode("signup")} className="font-bold text-yellow-300 hover:text-yellow-400">Sign Up</button>
            </p>


          </form>
        )}

        {/* SIGNUP FORM */}
        {mode === "signup" && (
          <form onSubmit={handleSignup} className="space-y-4">
            <input placeholder="Full Name (Username)" className="input bg-gray-700 p-2 w-full rounded" value={username} onChange={(e) => setUsername(e.target.value)} required />

            {/* Email & OTP Section */}
            <div className="flex gap-2">
              <input
                placeholder="Email Address"
                type="email"
                className="input bg-gray-700 p-2 w-full rounded flex-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={otpSent}
              />
              <button
                type="button"
                className={`px-3 py-2 rounded font-bold text-sm ${timer > 0 || otpSent || otpLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
                onClick={handleSendOtp}
                disabled={timer > 0 || otpSent || otpLoading}
              >
                {otpLoading ? "Sending..." : (timer > 0 ? `${timer}s` : (otpSent ? "Sent" : "Get OTP"))}
              </button>
            </div>

            {otpSent && (
              <input
                placeholder="Enter Email OTP"
                className="input bg-gray-700 p-2 w-full rounded border border-green-400"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            )}

            <input placeholder="Password" type="password" className="input bg-gray-700 p-2 w-full rounded" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <input placeholder="Confirm Password" type="password" className="input bg-gray-700 p-2 w-full rounded" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />

            <button disabled={loading} className="bg-orange-500 w-full py-2 rounded-lg font-bold">
              {loading ? "Creating Account..." : "Register"}
            </button>

            <p className="text-center mt-2">
              Already have an account? <button type="button" onClick={() => switchMode("login")} className="font-bold text-yellow-300">Login</button>
            </p>


          </form>
        )}

        {/* VERIFY EMAIL FORM (Optional) */}
        {mode === "verify_email" && (
          <form onSubmit={handleVerifyEmail} className="space-y-4">
            <div className="bg-yellow-600/20 p-3 rounded mb-2 text-sm border border-yellow-500/50">
              ⚠️ Security Update: Please verify your email to continue.
            </div>

            <div className="flex gap-2">
              <input
                placeholder="Email Address"
                type="email"
                className="input bg-gray-700 p-2 w-full rounded flex-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={otpSent}
              />
              <button
                type="button"
                className={`px-3 py-2 rounded font-bold text-sm ${timer > 0 || otpSent || otpLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
                onClick={handleSendOtp}
                disabled={timer > 0 || otpSent || otpLoading}
              >
                {otpLoading ? "Sending..." : (timer > 0 ? `${timer}s` : (otpSent ? "Sent" : "Get OTP"))}
              </button>
            </div>

            {otpSent && (
              <input
                placeholder="Enter Email OTP"
                className="input bg-gray-700 p-2 w-full rounded border border-green-400"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            )}

            <button disabled={loading} className="bg-orange-500 w-full py-2 rounded-lg font-bold">
              {loading ? "Verifying..." : "Verify & Login"}
            </button>
          </form>
        )}

        {/* FORGOT PASSWORD */}
        {mode === "forgot" && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <input placeholder="Enter Registered Email" className="input bg-gray-700 p-2 w-full rounded" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} required />
            <button disabled={loading} className="bg-orange-500 w-full py-2 rounded-lg font-bold">{loading ? "Sending..." : "Send Reset Link"}</button>
            <button type="button" className="mt-2 text-center w-full text-gray-300 hover:text-white" onClick={() => switchMode("login")}>Back to Login</button>
          </form>
        )}

      </div>
    </div>
  );
}
