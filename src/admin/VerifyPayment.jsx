import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function VerifyPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const token = localStorage.getItem("adminToken");

  const loadPayments = async () => {
    try {
      setLoading(true);
      if (!token) {
        toast.error("Admin auth required");
        return;
      }
      const res = await axios.get(`${import.meta.env.VITE_API_URL || "/api"}/payments/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayments(res.data);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      await axios.put(
        `${import.meta.env.VITE_API_URL || "/api"}/payments/update/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`Payment ${status}!`);
      loadPayments();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Error updating payment");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Verify Payments 💰</h1>

      {loading && (
        <p className="text-gray-400">Loading pending payments...</p>
      )}

      {!loading && payments.length === 0 && (
        <p className="text-gray-400">No pending payments</p>
      )}

      <div className="space-y-4">
        {payments.map((p) => (
          <div key={p._id} className="bg-gray-800 p-4 rounded-lg">
            <p>👤 <b>{p.userId?.username}</b></p>
            <p>🎯 Contest: {p.contestId?.title}</p>
            <p>💳 UTR: <b>{p.utr}</b></p>
            {p.screenshot && (
              <img
                src={p.screenshot}
                alt="Payment screenshot"
                className="mt-3 rounded max-h-64 object-contain border border-gray-700"
              />
            )}

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => updateStatus(p._id, "success")}
                disabled={updatingId === p._id}
                className="bg-green-500 hover:bg-green-600 p-2 rounded w-full disabled:opacity-60"
              >
                Approve
              </button>

              <button
                onClick={() => updateStatus(p._id, "rejected")}
                disabled={updatingId === p._id}
                className="bg-red-500 hover:bg-red-600 p-2 rounded w-full disabled:opacity-60"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
