import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import API_URL from "../api/config";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter email");

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      // The backend returns success even if user not found (security)
      toast.success(res.data.msg);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Error sending link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#02101a] text-white">
      <div className="bg-[#143c46] p-8 rounded-lg shadow-lg w-full max-w-md border border-cyan-900">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#9ce2f9]">Reset Password</h2>
        <p className="text-gray-300 mb-6 text-center text-sm">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-2 text-sm">Email Address</label>
            <input
              type="email"
              className="w-full p-3 rounded bg-[#0d2a33] border border-cyan-800 text-white focus:border-[#9ce2f9] focus:outline-none"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 rounded transition-all transform active:scale-95 shadow-lg"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/" className="text-gray-400 hover:text-white text-sm">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
