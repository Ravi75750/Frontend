import React, { useEffect, useState } from "react";
import { getPaymentHistory } from "../api/payments";

export default function PaymentHistory({ userId }) {
  const [history, setHistory] = useState([]);

  const loadHistory = async () => {
    const res = await getPaymentHistory(userId);
    setHistory(res.data);
  };

  useEffect(() => {
    loadHistory();
  }, []);

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
          </tr>
        </thead>

        <tbody>
          {history.map((p) => (
            <tr key={p._id} style={tr}>
              <td style={td}>{p.utr}</td>
              <td style={td}>{p.ffid}</td>
              <td style={td}>{p.status}</td>
              <td style={td}>{new Date(p.createdAt).toLocaleString()}</td>
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
