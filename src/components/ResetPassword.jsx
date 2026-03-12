import { useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");

  const submit = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL || "/api"}/auth/reset-password/${token}`,
        { password }
      );
      toast.success(res.data.msg);
    } catch {
      toast.error("Reset failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#02101a] text-white p-4">
      <div className="bg-[#1a4a56] p-8 md:p-12 rounded-3xl shadow-2xl w-full max-w-lg border border-[#9ce2f9]/20 animate-slideUp text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#9ce2f9]">Set New Password</h2>
        <p className="text-gray-300 mb-8 text-base">
          Please enter your new secure password below.
        </p>

        <div className="space-y-6">
          <input
            type="password"
            className="w-full p-4 rounded-2xl bg-[#0d2a33] border border-cyan-800 text-white focus:border-[#9ce2f9] focus:outline-none transition-all placeholder:text-gray-600"
            placeholder="New Secure Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={submit}
            className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold py-4 rounded-2xl transition-all transform active:scale-95 shadow-xl hover:shadow-green-500/20"
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}
