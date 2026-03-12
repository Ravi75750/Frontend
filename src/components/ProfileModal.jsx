import React, { useEffect, useState } from "react"; // ⬅️ Import useEffect and useState
import { useUser } from "./UserContext";

// Simple Loading Spinner Component (Tailwind CSS based)
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center h-64 p-8 bg-[#143c46] text-[#d18925]">
    {/* Tailwind CSS Spinner */}
    <div className="animate-bounce rounded-full h-16 w-16 border-t-8 border-b-8 border-[#93faff] text-center"></div>
    <p className="mt-4 text-lg font-semibold">Loading Profile...</p>
  </div>
);

export default function ProfileModal({ onClose }) {
  const { user, logout } = useUser();
  // 1. State to track the loading status
  const [isLoading, setIsLoading] = useState(true);

  // 2. useEffect to handle the 2-second delay
  useEffect(() => {
    // Set a timeout for 2000 milliseconds (2 seconds)
    const timer = setTimeout(() => {
      setIsLoading(false); // Stop loading after 2 seconds
    }, 1500);

    // Cleanup function: Clear the timeout if the component unmounts early
    return () => clearTimeout(timer);
  }, []); // Empty dependency array means this runs only once on mount

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-50">
      <div className="bg-[#1a4a56] text-white rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden border border-[#9ce2f9]/20 animate-slideUp">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-2xl text-gray-400 hover:text-red-500 z-10 transition-colors"
        >
          ✕
        </button>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* Header */}
            <div className="bg-[#1f5a68] text-[#9ce2f9] text-center pb-10 pt-12 border-b border-[#9ce2f9]/30">
              <div className="relative inline-block">
                <img
                  src="/profile.png"
                  alt="User"
                  className="w-28 h-28 mx-auto rounded-full border-4 border-[#9ce2f9] object-cover shadow-lg"
                />
                <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-[#1f5a68]"></div>
              </div>
              <h2 className="text-2xl font-bold mt-4 tracking-tight">{user?.username}</h2>
              <p className="text-[#9ce2f9]/70 text-sm uppercase tracking-widest mt-1">Player Profile</p>
            </div>

            {/* Options Section */}
            <div className="px-8 py-8 space-y-4">
              <div className="flex items-center gap-4 bg-[#27687a]/40 p-4 rounded-2xl border border-[#9ce2f9]/10">
                <span className="text-2xl">👤</span>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 uppercase font-bold">Username</span>
                  <p className="text-lg font-semibold text-[#9ce2f9]">{user?.username}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-[#27687a]/40 p-4 rounded-2xl border border-[#9ce2f9]/10">
                <span className="text-2xl">📧</span>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 uppercase font-bold">Email Address</span>
                  <p className="text-lg font-semibold text-white truncate max-w-[200px]">{user?.email}</p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="w-full mt-6 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold py-4 rounded-2xl hover:from-red-700 hover:to-red-600 transition-all shadow-lg hover:shadow-red-500/30 active:scale-95"
              >
                Log Out
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
