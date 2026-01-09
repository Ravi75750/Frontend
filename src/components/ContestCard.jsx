import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import UTRModal from "./UTRModal";
import JoinContestModal from "./JoinContestModal";

export default function ContestCard({ contest, user, onJoinedContest }) {
  const [showForm, setShowForm] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false); // ✅ New state
  const [pending, setPending] = useState(false);
  const [verified, setVerified] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [joining, setJoining] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  const [playerCount, setPlayerCount] = useState(
    contest.participants?.length || 0
  );

  /* ================= USER ================= */
  const currentUser = useMemo(() => {
    if (user) return user;
    try {
      const stored =
        localStorage.getItem("user") || localStorage.getItem("userInfo");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }, [user]);

  const uid = currentUser?.userId || currentUser?._id;
  const contestId = contest._id;
  const entryFee = contest.entryFee ?? 0;
  const isFreeContest = entryFee === 0;

  // ✅ Find my participant info including Slot
  const myParticipantInfo = useMemo(() => {
    if (!contest.participants || !uid) return null;
    return contest.participants.find((p) => {
      const pId = p.userId?._id || p.userId || p; // Handle populated, object, or string ID (legacy)
      // Check if p is the new object structure { userId: ... }
      if (p.userId) {
        return String(p.userId?._id || p.userId) === String(uid);
      }
      // Fallback for types not matching unexpected structure (safety)
      return String(pId) === String(uid);
    });
  }, [contest.participants, uid]);


  /* ================= COUNTDOWN ================= */
  useEffect(() => {
    if (!contest.matchTime) return;

    const timer = setInterval(() => {
      const diff = new Date(contest.matchTime).getTime() - Date.now();
      setTimeLeft(diff > 0 ? diff : 0);
    }, 1000);

    return () => clearInterval(timer);
  }, [contest.matchTime]);

  /* ================= TIME FORMAT ================= */
  const formatTime = (ms) => {
    if (!ms || ms <= 0) return "00:00:00";

    const total = Math.floor(ms / 1000);
    const days = Math.floor(total / 86400);
    const hours = Math.floor((total % 86400) / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;

    const pad = (n) => String(n).padStart(2, "0");

    if (days > 0)
      return `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  /* ================= ROOM UNLOCK (2 MIN) ================= */
  const canShowRoomDetails =
    timeLeft !== null && timeLeft <= 2 * 60 * 1000;

  /* ================= JOIN + PAYMENT STATUS ================= */
  useEffect(() => {
    if (!uid) return;

    if (myParticipantInfo) {
      setIsJoined(true);
      return;
    }

    if (isFreeContest) return;

    const checkPayment = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL || "/api"}/payments/history/${uid}`
        );

        const payment = res.data.find(
          (p) => String(p.contestId) === String(contestId)
        );

        setPending(payment?.status === "pending");
        setVerified(payment?.status === "success");
      } catch { }
    };

    checkPayment();
    const interval = setInterval(checkPayment, 5000);
    return () => clearInterval(interval);
  }, [uid, contestId, myParticipantInfo, isFreeContest]);

  /* ================= JOIN LOGIC ================= */
  const handleJoinClick = () => {
    if (!uid) return toast.error("Login required");
    if (contest.status !== "UPCOMING")
      return toast.error("Contest already started");

    // For free contest OR verified paid contest, open the input modal
    // Note: For PAID contest, we technically pull data from Payment, 
    // BUT the user "Join Now" flow for free wants inputs.
    // If it's PAID and verified, we might skip inputs IF backend uses payment data.
    // However, backend logic:
    // IF Paid: pulls from Payment.
    // IF Free: pulls from Body.

    if (isFreeContest) {
      setShowJoinModal(true);
    } else {
      // Paid contest
      if (verified) {
        // It's paid and verified. The backend will pull details from Payment.
        // We can just call joinContestNow without extra data (or with empty/dummy).
        // BUT wait, does the Payment record HAVE InGameName/ID? Yes, UTRModal sends fullName/ffid.
        // What about UPI? Payment has UTR. Backend maps UTR to UPI.
        // So for PAID contest, we DO NOT need the modal.
        joinContestNow({});
      } else {
        // Not verified/not paid yet
        setShowForm(true); // Open UTR Modal
      }
    }
  };

  const joinContestNow = async (details = {}) => {
    if (joining) return;
    setJoining(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL || "/api"}/contests/${contestId}/join`,
        {
          userId: uid,
          ...details // Pass inGameName, inGameId, upiId if provided (Free contest)
        }
      );

      toast.success(res.data.msg || "Joined contest");
      setIsJoined(true);
      setPending(false);
      setVerified(false);
      setPlayerCount((p) => p + 1);
      setShowJoinModal(false);
      onJoinedContest?.();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Join failed");
    } finally {
      setJoining(false);
    }
  };

  const copyToClipboard = async (text, label) => {
    if (!text) return toast.error(`${label} not available`);
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied`);
    } catch {
      toast.error("Copy failed");
    }
  };

  const isLive =
    contest.matchTime &&
    new Date(contest.matchTime).getTime() <= Date.now() &&
    contest.status !== "COMPLETED";

  /* ================= UI ================= */
  return (
    <>
      <div className="bg-[#0d192b] border border-gray-700 rounded-xl p-4 relative">
        {isLive ? (
          <span className="absolute top-3 right-3 bg-red-600 text-white text-xs px-3 py-1 rounded animate-pulse">
            🔴 LIVE
          </span>
        ) : isJoined ? (
          <span className="absolute top-3 right-3 bg-green-600 text-white text-xs px-2 py-1 rounded">
            Joined
          </span>
        ) : null}

        <img
          src={contest.image}
          alt={contest.title}
          className="rounded-lg h-[200px] w-full object-cover"
        />

        <h2 className="text-white text-xl font-bold mt-4 text-center">
          {contest.title}
        </h2>

        <p className="text-gray-300 text-center">Entry Fee: ₹{entryFee}</p>
        <p className="text-gray-300 text-center mt-1">
          Players: <b>{playerCount}</b> / {contest.maxPlayers}
        </p>

        {timeLeft !== null && !isLive && (
          <p className="text-center mt-2 text-yellow-400 font-semibold">
            Starts in: {formatTime(timeLeft)}
          </p>
        )}

        {/* BUTTONS */}
        {isLive ? (
          <button
            disabled
            className="w-full mt-4 bg-red-700 text-white py-2 rounded"
          >
            LIVE MATCH
          </button>
        ) : isJoined ? (
          <button
            disabled
            className="w-full mt-4 bg-gray-600 text-gray-300 py-2 rounded"
          >
            Joined
          </button>
        ) : pending ? (
          <button disabled className="w-full mt-4 bg-orange-300 text-white py-2 rounded">
            Verification Pending
          </button>
        ) : verified && !isFreeContest ? (
          <button
            onClick={handleJoinClick} // Calls joinContestNow direct (Paid)
            disabled={joining}
            className="w-full mt-4 bg-blue-600 text-white py-2 rounded animate-pulse"
          >
            {joining ? "Joining..." : "Confirm & Join"}
          </button>
        ) : (
          <button
            onClick={handleJoinClick} // Opens Modal (Free) or UTR (Paid)
            className="w-full mt-4 bg-green-600 text-white py-2 rounded"
          >
            Join Now
          </button>
        )}

        {/* ROOM DETAILS */}
        {isJoined && !isLive && contest.status !== "COMPLETED" && (
          <button
            onClick={() => setShowRoomModal(true)}
            className="w-full mt-3 bg-[#4d80cb] text-black font-bold py-2 rounded"
          >
            View Room Details
          </button>
        )}
      </div>

      {/* ROOM MODAL */}
      {showRoomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-[#143c46] w-[90%] max-w-md rounded-lg p-5 text-[#9ce2f9] relative">
            <button
              onClick={() => setShowRoomModal(false)}
              className="absolute top-2 right-3 text-xl font-bold"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-3 text-center">
              Room Details
            </h2>

            {/* ✅ SHOW SLOT NUMBER */}
            <div className="bg-gray-800 p-3 rounded mb-3 text-center border border-yellow-500">
              <p className="text-gray-400 text-xs uppercase">Your Slot Number</p>
              <p className="text-3xl font-bold text-yellow-400">
                {myParticipantInfo?.slotIndex || "N/A"}
              </p>
            </div>


            {canShowRoomDetails ? (
              <div className="space-y-3">
                {["Room ID", "Password"].map((label, i) => {
                  const value = i === 0 ? contest.roomId : contest.roomPass;
                  return (
                    <div
                      key={label}
                      className="flex justify-between items-center bg-gray-100 p-2 rounded"
                    >
                      <div>
                        <p className="text-xs text-gray-500">{label}</p>
                        <p className="font-bold text-black">{value || "N/A"}</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(value, label)}
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        📋 Copy
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className=" text-center  rounded font-bold text-orange-500">
                Unlocks in {formatTime(Math.max(timeLeft - 2 * 60 * 1000, 0))}
              </p>
            )}
          </div>
        </div>
      )}

      {/* PAYMENT MODAL (Paid) */}
      {showForm && !isFreeContest && (
        <UTRModal
          contestId={contestId}
          user={currentUser}
          close={() => setShowForm(false)}
        />
      )}

      {/* JOIN DETAILS MODAL (Free) */}
      {showJoinModal && (
        <JoinContestModal
          contestId={contestId}
          user={currentUser}
          isJoining={joining}
          onClose={() => setShowJoinModal(false)}
          onJoinInfoSubmit={(details) => joinContestNow(details)}
        />
      )}
    </>
  );
}
