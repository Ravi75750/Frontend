import React, { useEffect, useState } from "react";
import ContestCard from "./ContestCard";
import axios from "axios";

const ContestList = ({ user }) => {
  const [contests, setContests] = useState([]);

  const fetchContests = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || "/api"}/contests`);
      setContests(res.data);
    } catch (err) {
      console.error("Fetch contests failed:", err);
    }
  };

  useEffect(() => {
    fetchContests();
    const interval = setInterval(fetchContests, 10000); // auto refresh after admin reset
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-8">
      <h2 className="text-4xl text-center bg-[#143c46] py-3 font-bold text-[#c79661] mb-8">
        Available Contests
      </h2>

      {!contests.length ? (
        <p className="text-center text-gray-400">No contests available.</p>
      ) : (
        <div className="px-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {contests.map((contest) => (
            <ContestCard
              key={contest._id}
              contest={contest}
              user={user}
              onJoinedContest={fetchContests}
            />
          ))}
        </div>
      )}

      {/* WHATSAPP GROUP BANNER */}
      <div className="mx-8 mt-8 bg-green-600/20 border border-green-500 rounded p-4 text-center cursor-pointer hover:bg-green-600/30 transition shadow-[0_0_15px_rgba(22,163,74,0.3)]">
        <a href="https://chat.whatsapp.com/J0jElc84kuv1UfDZ8pwYM0" target="_blank" rel="noopener noreferrer" className="block w-full h-full">
          <h3 className="text-xl font-bold text-green-400 mb-1">📢 Join Our Official WhatsApp Group</h3>
          <p className="text-gray-300">Click here to get latest contest updates & room passwords instantly!</p>
        </a>
      </div>
    </section>
  );
};

export default ContestList;
