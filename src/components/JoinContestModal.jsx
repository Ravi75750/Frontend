import { useState } from "react";
import toast from "react-hot-toast";

export default function JoinContestModal({
    contestId,
    user,
    onJoinInfoSubmit, // Function to call with { inGameName, inGameId, upiId }
    onClose,
    isJoining
}) {
    const [inGameName, setInGameName] = useState(user?.inGameName || "");
    const [inGameId, setInGameId] = useState(user?.inGameId || "");
    const [upiId, setUpiId] = useState("");

    const handleSubmit = () => {
        if (!inGameName || !inGameId || !upiId) {
            return toast.error("All fields (Game Name, Game ID, UPI) are required");
        }

        onJoinInfoSubmit({ inGameName, inGameId, upiId });
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-[#143c46] border border-gray-600 rounded-lg p-6 w-[90%] max-w-sm relative text-white">
                <button
                    onClick={onClose}
                    disabled={isJoining}
                    className="absolute top-2 right-3 text-2xl font-bold text-gray-400 hover:text-white"
                >
                    ✕
                </button>

                <h2 className="text-xl font-bold mb-5 text-center text-[#9ce2f9]">
                    Enter Details to Join
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-300 mb-1">Game Name</label>
                        <input
                            value={inGameName}
                            onChange={(e) => setInGameName(e.target.value)}
                            placeholder="Enter your Game Name"
                            className="w-full p-2 bg-[#0d192b] border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-300 mb-1">Game ID</label>
                        <input
                            value={inGameId}
                            onChange={(e) => setInGameId(e.target.value)}
                            placeholder="Enter your Game ID"
                            className="w-full p-2 bg-[#0d192b] border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-300 mb-1">UPI Number / ID</label>
                        <input
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="Enter UPI Number"
                            className="w-full p-2 bg-[#0d192b] border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isJoining}
                        className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded transition mt-2 disabled:bg-gray-600"
                    >
                        {isJoining ? "Joining..." : "Join Contest"}
                    </button>
                </div>
            </div>
        </div>
    );
}
