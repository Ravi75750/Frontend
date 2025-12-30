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
        `${import.meta.env.VITE_API_URL || "https://backend-1sqampll9-ravi-sahanis-projects.vercel.app/api"}/auth/reset-password/${token}`,
        { password }
      );
      toast.success(res.data.msg);
    } catch {
      toast.error("Reset failed");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>

      <input
        type="password"
        className="w-full p-2 mb-3 border rounded"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={submit}
        className="w-full bg-green-600 text-white py-2 rounded"
      >
        Reset Password
      </button>
    </div>
  );
}
