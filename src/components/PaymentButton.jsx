import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function PaymentButton({ userId, contestId }) {
  const [showForm, setShowForm] = useState(false);
  const [utr, setUtr] = useState("");

  const submitUTR = async () => {
    if (!utr) return toast.error("Please enter UTR / Transaction ID");

    try {
      await axios.post(`${import.meta.env.VITE_API_URL || "https://backend-1sqampll9-ravi-sahanis-projects.vercel.app/api"}/payments/create-order`, {
        userId,
        contestId,
        utr,
      });

      toast.success("UTR Submitted! Waiting for approval.");
      setShowForm(false);
      setUtr("");
    } catch {
      toast.error("Failed to submit UTR");
    }
  };

  return (
    <div className="w-full">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-500 hover:bg-green-600 w-full text-black font-bold p-3 rounded-lg"
        >
          Scan & Pay → Submit UTR
        </button>
      ) : (
        <div className="bg-gray-800 p-4 rounded-lg space-y-3">
          <p className="text-gray-300 text-sm font-medium">
            ✨ After payment, enter the UTR/Transaction ID below:
          </p>

          <input
            className="w-full p-2 bg-gray-700 rounded outline-none"
            placeholder="Enter 12-digit UTR"
            value={utr}
            onChange={(e) => setUtr(e.target.value)}
          />

          <div className="flex gap-2">
            <button
              onClick={submitUTR}
              className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded"
            >
              Submit UTR
            </button>

            <button
              onClick={() => setShowForm(false)}
              className="w-full bg-red-500 hover:bg-red-600 p-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
