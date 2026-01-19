import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function UTRModal({ contestId, close, user }) {
  const [name, setName] = useState("");
  // const [ffid, setFFID] = useState(""); // Removed
  const [utr, setUtr] = useState("");
  const [file, setFile] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState("/qrcode.png"); // Default fallback

  // Fetch dynamic QR code
  React.useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL || "/api"}/admin/system-settings`)
      .then(res => {
        if (res.data.paymentQrCode) setQrCodeUrl(res.data.paymentQrCode);
      })
      .catch(err => console.log("QR Fetch Error", err));
  }, []);

  const sendForm = async (e) => {
    e.preventDefault();

    // --- FIX START: robust user check ---
    let activeUser = user;

    // If the prop is missing, try to find the user in LocalStorage
    if (!activeUser) {
      try {
        const stored = localStorage.getItem("user") || localStorage.getItem("userInfo");
        if (stored) {
          activeUser = JSON.parse(stored);
        }
      } catch (err) {
        console.error("Storage parse error", err);
      }
    }

    const uid = activeUser?.userId || activeUser?._id;

    if (!uid) {
      toast.error("Login required - Please log in again.");
      return;
    }
    // --- FIX END ---

    if (!name || !utr || !file) {
      return toast.error("All fields including screenshot required!");
    }

    const formData = new FormData();
    formData.append("userId", uid);
    formData.append("contestId", contestId);
    formData.append("fullName", name);
    // formData.append("ffid", ffid);
    formData.append("utr", utr);
    if (file) formData.append("screenshot", file);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL || "/api"}/payments/submit`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Submitted! Wait for approval.");
      close();
    } catch (err) {
      console.log("Submit Error:", err);
      const msg = err.response?.data?.msg || "Failed to submit entry";
      toast.error(msg);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="bg-[#143c46] rounded-xl p-5 max-w-md w-full">
        <h5 className="text-white font-bold mb-4">Note: पहले QR कोड पर PAYMENT करने के बाद ही यूटीआर (UTR) नंबर मिलेगा</h5>
        <img src={qrCodeUrl} className="w-48 h-48 mx-auto my-4 object-contain bg-white rounded-lg p-2" alt="Payment QR" />

        <h3 className=" text-lg font-bold mb-4 text-orange-500">
          Scan the QR Code to Pay
        </h3>
        <h2 className="text-lg  font-bold mb-4 text-[#9ce2f9]">
          Submit Payment Details
        </h2>

        <form onSubmit={sendForm} className="space-y-3">
          <input className="input border bg-[#74959e] border-gray-300 p-2 rounded w-full text-black" placeholder="Full Name"
            value={name} onChange={(e) => setName(e.target.value)} />

          <input className="input border bg-[#74959e] border-gray-300 p-2 rounded w-full text-white" placeholder="UTR / Transaction ID"
            value={utr} onChange={(e) => setUtr(e.target.value)} />

          <input type="file" accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="p-2 border bg-[#74959e] border-gray-300 rounded w-full text-white" />

          <div className="max-w-full flex justify-center">
            <button type="submit"
              className="w-auto bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg font-bold">
              Submit Entry
            </button>
          </div>
        </form>

        <button
          onClick={close}
          className="mt-4 w-auto  text-red-300 p-2 rounded-lg font-bold  hover:text-red-700">
          Cancel
        </button>
      </div>
    </div>
  );
}
