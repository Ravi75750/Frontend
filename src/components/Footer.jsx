import React, { useState } from "react";
import { FaWhatsapp, FaFacebook, FaInstagram } from "react-icons/fa";

export default function Footer() {
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    const formData = new FormData(e.target);

    // ⭐ Your Web3Forms Access Key — paste your key here!
    formData.append("access_key", "bd33fbc2-4a07-459c-95bc-9aa339413d71");

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();

    if (result.success) {
      setStatus("Message sent successfully!");
      e.target.reset();
    } else {
      setStatus("Failed to send message.");
    }
  };

  return (
    <footer className="bg-[#143c46] text-gray-300 py-10 mt-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col gap-10">

        {/* 🔥 SOCIAL ICONS */}
        <div className="flex justify-center gap-6 text-3xl">
          <a
            href="https://wa.me/917575088632"
            target="_blank"
            className="hover:text-[#00ff00] transition-all"
          >
            <FaWhatsapp />
          </a>

          <a
            href="https://www.instagram.com/ravii_sahani_"
            target="_blank"
            className="hover:text-[#ff0040] transition-all"
          >
            <FaInstagram />
          </a>

          <a
            href="https://facebook.com/"
            target="_blank"
            className="bg-transparent hover:text-[#0000ff] hover:bg-white rounded-2xl transition-all"
          >
            <FaFacebook />
          </a>
        </div>

        {/* 📞 CONTACT NUMBER */}
        <div className="text-lg font-medium text-center">
          Contact: <span className="text-white">+91 7575088632</span>
        </div>

        {/* 📨 CONTACT FORM */}
        <div className="bg-[#0f2a30] p-6  rounded-xl max-w-xl mx-auto shadow-lg">
          <h2 className="text-2xl text-[#9ce2f9] font-bold text-center mb-4">Contact Us</h2>

          <form onSubmit={handleSubmit} className="space-y-4 ">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
              className="w-full p-2 rounded bg-[#143c46] border border-gray-600 text-white"
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              required
              className="w-full p-2 rounded bg-[#143c46] border border-gray-600 text-white"
            />
            <input
              type="number"
              name="ffid"
              placeholder="Free Fire ID"
              required
              className="w-full p-2 rounded bg-[#143c46] border border-gray-600 text-white"
            />

            <textarea
              name="message"
              placeholder="Your Message"
              required
              className="w-full p-2 h-28 rounded bg-[#143c46]  border border-gray-600 text-white"
            />

          <div className="max-w-full flex justify-center">
              <button
              type="submit"
              className="w-[200px]  bg-blue-600 py-2 rounded-lg text-white font-bold hover:bg-orange-600 transition"
            >
              Send Message
            </button>

          </div>
          </form>

          {status && (
            <p className="text-center text-green-400 mt-3 font-semibold">
              {status}
            </p>
          )}
        </div>

        {/* COPYRIGHT */}
        <p className="text-gray-400 text-sm text-center mt-6">
          Made with ❤️ by <span className="font-semibold">Ravi Sahani</span>.
        </p>
      </div>
    </footer>
  );
}
