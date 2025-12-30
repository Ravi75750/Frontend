// src/admin/PaymentsPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAdminSearch } from "./AdminSearchContext";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const { query } = useAdminSearch();
  const token = localStorage.getItem("adminToken");

  // ==========================
  // LOAD PAYMENTS
  // ==========================
  const loadPayments = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL || "https://backend-d10xvopad-ravi-sahanis-projects.vercel.app/api"}/payments/all`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPayments(res.data);
    } catch (err) {
      toast.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  // ==========================
  // SEARCH FILTER
  // ==========================
  const filtered = useMemo(() => {
    if (!query.trim()) return payments;

    const q = query.toLowerCase();
    return payments.filter((p) =>
      `${p.userId?.username} ${p.utr} ${p.status}`
        .toLowerCase()
        .includes(q)
    );
  }, [query, payments]);

  if (loading) {
    return <p className="text-gray-400">Loading payments...</p>;
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Payments History</h1>

      {filtered.length === 0 ? (
        <p className="text-gray-400">No payments found.</p>
      ) : (
        <table className="w-full bg-gray-900 rounded-lg overflow-hidden">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Contest</th>
              <th className="p-3 text-left">UTR</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((p) => (
              <tr key={p._id} className="border-b border-gray-800">
                <td className="p-3">{p.userId?.username}</td>
                <td className="p-3">{p.contestId?.title}</td>
                <td className="p-3">{p.utr}</td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-sm font-bold
                      ${p.status === "success"
                        ? "bg-green-600"
                        : p.status === "rejected"
                          ? "bg-red-600"
                          : "bg-yellow-500 text-black"
                      }`}
                  >
                    {p.status.toUpperCase()}
                  </span>
                </td>

                <td className="p-3">
                  {new Date(p.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
