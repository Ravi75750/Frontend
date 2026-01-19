import React, { useEffect, useState } from "react";
import { getPaymentHistory } from "../api/payments";

import axios from "axios";
import toast from "react-hot-toast";

export default function PaymentHistory({ userId }) {
  const [history, setHistory] = useState([]);

  const loadHistory = async () => {
    const res = await getPaymentHistory(userId);
    setHistory(res.data);
  };

  useEffect(() => {
    loadHistory();
  }, [userId]);

  const handleDelete = async (paymentId) => {
    if (!window.confirm("Are you sure you want to delete this payment record?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || "/api"}/payments/${paymentId}`, {
        data: { userId } // Pass userId for ownership check
      });
      toast.success("Payment deleted");
      setHistory(history.filter(p => p._id !== paymentId));
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to delete");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>My Payments</h2>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#eee" }}>
            <th style={th}>UTR</th>
            <th style={th}>Free Fire ID</th>
            <th style={th}>Status</th>
            <th style={th}>Date</th>
            <th style={th}>Action</th>
          </tr>
        </thead>

        <tbody>
          {history.map((p) => (
            <tr key={p._id} style={tr}>
              <td style={td}>{p.utr}</td>
              <td style={td}>{p.ffid || "-"}</td>
              <td style={td}>
                <span style={{
                  color: p.status === 'success' ? 'green' : p.status === 'rejected' ? 'red' : 'orange',
                  fontWeight: 'bold'
                }}>
                  {p.status}
                </span>
              </td>
              <td style={td}>{new Date(p.createdAt).toLocaleString()}</td>
              <td style={td}>
                <button
                  onClick={() => handleDelete(p._id)}
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th = { padding: "10px", border: "1px solid #ddd" };
const td = { padding: "10px", borderBottom: "1px solid #ddd" };
const tr = { textAlign: "center" };
