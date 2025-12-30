import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const submit = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL || "/api"}/auth/forgot-password`,
        { email }
      );
      toast.success(res.data.msg);
    } catch {
      toast.error("Error sending link");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>

      <input
        className="w-full p-2 mb-3 border rounded"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={submit}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        Send Reset Link
      </button>
    </div>
  );
}
