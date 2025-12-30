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
    }, 2000);

    // Cleanup function: Clear the timeout if the component unmounts early
    return () => clearTimeout(timer);
  }, []); // Empty dependency array means this runs only once on mount

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-50">
      <div className="bg-[#143c46] text-gray-800 rounded-2xl shadow-xl w-full max-w-sm relative overflow-hidden">
        
        {/* Close Button is always visible */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-xl text-gray-400 hover:text-red-500 z-10"
        >
          ✕
        </button>

        {/* 3. Conditional Rendering: Show Loader or Content */}
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* Header */}
            <div className="bg-[#143c46] text-[#9ce2f9] text-center pb-8 pt-8 border-b border-[#9ce2f9]">
              <img
                src="/profile.png"
                alt="User"
                className="w-24 h-24 mx-auto rounded-full border-4 border-[#9ce2f9] object-cover"
              />
              <h2 className="text-xl font-bold mt-3">{user?.username}</h2>
            </div>

            {/* Options Section */}
            <div className="px-6 py-4">
              <div className="flex items-center gap-3 bg-[#8ea29d] text-gray-900 hover:bg-gray-200 p-3 rounded-lg cursor-default">
                <span className="text-blue-600 text-2xl">🙍‍♂️</span>
                <p className="text-[18px] px-2 font-medium">{user?.username}</p>
              </div>

              <div className="flex items-center gap-3 bg-[#8ea29d] text-gray-900 hover:bg-gray-200 p-3 rounded-lg cursor-default mt-3">
                <span className=" text-red-500 text-2xl">📧</span>
                <p className="text-[18px] px-2 font-medium">{user?.email}</p>
              </div>

              {/* Logout Button */}
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="w-full mt-6 bg-red-500 text-white font-semibold py-2 rounded-lg hover:bg-red-600 transition"
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
