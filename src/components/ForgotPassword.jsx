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
    <div className="flex items-center justify-center min-h-screen bg-[#02101a] text-white p-4">
      <div className="bg-[#1a4a56] p-8 md:p-12 rounded-3xl shadow-2xl w-full max-w-lg border border-[#9ce2f9]/20 animate-slideUp">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-[#9ce2f9]">Reset Password</h2>
        <p className="text-gray-300 mb-8 text-center text-base">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <form onSubmit={submit} className="space-y-6">
          <div>
            <label className="block text-gray-400 mb-2 text-sm font-bold uppercase tracking-widest pl-1">Email Address</label>
            <input
              type="email"
              className="w-full p-4 rounded-2xl bg-[#0d2a33] border border-cyan-800 text-white focus:border-[#9ce2f9] focus:outline-none transition-all placeholder:text-gray-600"
              placeholder="e.g. user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-4 rounded-2xl transition-all transform active:scale-95 shadow-xl hover:shadow-orange-500/20"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/" className="text-[#9ce2f9] hover:text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2">
            <span>←</span> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
