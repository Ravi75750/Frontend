import React, { useState } from "react";
import { FaBars, FaTimes, FaUserCircle, FaUserShield } from "react-icons/fa"; // ⬅️ Optional: Import FaUserShield
import { useUser } from "./UserContext";
import ProfileModal from "./ProfileModal";
import { Link } from "react-router-dom";


export default function Header({ onLoginClick, onSignUpClick }) {
  const [open, setOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { user } = useUser(); // 🔥 GET USER DATA

  return (
    <>
      {/* ==================== HEADER ==================== */}
      <header className="bg-[#2b444a] text-white shadow-md">
        <div className="flex justify-between items-center px-5 py-2">

          {/* LOGO */}


          <Link to="/" className="flex items-center gap-2 cursor-pointer h-full">
            <img
              src="/Logos.gif"
              alt="Logo"
              className="h-20 w-auto object-contain -mt-2" // -mt-2 logo ko upar shift karega
            />
            <span className="text-4xl font-black italic tracking-tighter uppercase self-center 
                 text-[#9ce2f9] 
                
                 hover:text-[#f14e08] transition-all duration-300 cursor-pointer">
              FireContests
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/highlights"
              className="text-[#9ce2f9] hover:text-white font-medium text-lg transition"
            >
              View Highlights
            </Link>

            {/* IF NOT LOGGED IN → SHOW LOGIN/SIGNUP AND ADMIN LOGIN */}
            {!user && (
              <>
                {/* 🟢 NEW: ADMIN LOGIN BUTTON (Desktop) */}
                <Link
                  to="/admin" // Navigate to the Admin Login page
                  className="text-[#9ce2f9] hover:text-white font-medium text-lg transition flex items-center gap-1"
                >
                  <FaUserShield className="text-base" /> Admin
                </Link>
                <button
                  onClick={onLoginClick}
                  className="text-[#9ce2f9] hover:text-white font-medium text-lg transition"
                >
                  Login
                </button>
                <button
                  onClick={onSignUpClick}
                  className="text-[#9ce2f9] font-semibold px-5 py-2 rounded-lg text-lg hover:bg-[#1e3c40] transition"
                >
                  Sign Up
                </button>
              </>
            )}

            {/* IF LOGGED IN → SHOW PROFILE BUTTON */}
            {user && (
              <button
                onClick={() => setShowProfile(true)}
                className="bg-[#14455100] hover:bg-[#1c5d67] px-4 py-0 rounded-lg text-[#b7e0ee] font-semibold">
                <FaUserCircle className="inline mr-2 text-[40px] text-[#9ce2f9] mb-1" />
              </button>

            )}
          </nav>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2"
          >
            {open ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
          </button>
        </div>

        {/* MOBILE DROPDOWN */}
        {open && (
          <div className="md:hidden flex flex-col gap-3 px-5 pb-5 animate-slide-down">

            <Link
              to="/highlights"
              onClick={() => setOpen(false)}
              className="bg-[#3d5d62] text-[#9ce2f9] font-semibold py-2 rounded text-center hover:bg-[#4c6f75]"
            >
              View Highlights
            </Link>

            {!user && (
              <>
                {/* 🟢 NEW: ADMIN LOGIN BUTTON (Mobile) */}
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className="bg-red-700 text-white font-semibold py-2 rounded text-center hover:bg-red-800 flex items-center justify-center gap-2"
                >
                  <FaUserShield className="text-lg" /> Admin Login
                </Link>

                <button
                  onClick={() => { setOpen(false); onLoginClick(); }}
                  className="bg-[#3d5d62] text-[#9ce2f9] font-medium py-2 rounded hover:bg-[#4c6f75]"
                >
                  Login
                </button>

                <button
                  onClick={() => { setOpen(false); onSignUpClick(); }}
                  className="bg-[#3d5d62] text-[#9ce2f9] font-semibold py-2 rounded hover:bg-[#4c6f75]"
                >
                  Sign Up
                </button>
              </>
            )}

            {user && (
              <button
                onClick={() => { setOpen(false); setShowProfile(true); }}
                className="bg-[#3d5d62] text-[#9ce2f9] font-medium py-2 rounded hover:bg-[#1c5d67]"
              >
                Profile
              </button>
            )}
          </div>
        )}
      </header>

      {/* PROFILE MODAL */}
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </>
  );
}