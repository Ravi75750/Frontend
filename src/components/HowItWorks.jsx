import React from 'react';
import { FaUserPlus, FaSearch, FaTrophy, FaExclamationTriangle } from 'react-icons/fa';

const HowItWorks = () => {
  return (
    <section className="py-16 bg-[#143c46] text-center">
      {/* --- Updated Caution Section --- */}
      <div className="max-w-4xl mx-auto mb-12 px-4">
        <div className="bg-[#012129] border border-red-500 text-red-100 p-6 rounded-lg text-left shadow-lg">
          <div className="flex items-center justify-center gap-3 mb-4 border-b border-red-500/50 pb-2">
            <FaExclamationTriangle className="text-yellow-400 text-2xl" />
            <h2 className="text-2xl font-bold uppercase tracking-wide">Caution / चेतावनी</h2>
          </div>

          <ul className="space-y-4 text-sm md:text-base">
            <li className="flex  flex-col">
              <span className="font-bold text-red-400">1. Strictly No Invites / आमंत्रण पूरी तरह से वर्जित है</span>
              <span className="text-gray-300">* If you invite other players, you will be disqualified and will not get a refund.</span>
              <span className="text-white italic  mt-1">* यदि आप अन्य खिलाड़ियों को आमंत्रित करते हैं, तो आपको अयोग्य घोषित कर दिया जाएगा और कोई रिफंड नहीं मिलेगा।</span>
            </li>

            <li className="flex flex-col">
              <span className="font-bold text-red-400">2. Slot Discipline / स्लॉट अनुशासन</span>
              <span className="text-gray-300">* Please join the allotted slot only. If you join another slot, you will be kicked out.</span>
              <span className="text-white italic  mt-1">* कृपया केवल आवंटित स्लॉट में ही शामिल हों। यदि आप किसी और स्लॉट में शामिल होते हैं, तो आपको बाहर कर दिया जाएगा।</span>
            </li>

            <li className="flex flex-col">
              <span className="font-bold text-red-400">3. No Refund / कोई रिफंड नहीं</span>
              <span className="text-white">* If you violate any of the above rules, you will not receive a refund.</span>
              <span className="text-white italic  mt-1">* यदि आप उपरोक्त में से किसी भी नियम का उल्लंघन करते हैं, तो आपको रिफंड नहीं मिलेगा।</span>
            </li>
          </ul>
        </div>
      </div>
      {/* ------------------------------- */}

      <div className="grid py-6 grid-cols-1 bg-[#143c46] md:grid-cols-3 gap-10">
        <div className="md:col-span-3 mb-10">
          <h2 className="text-4xl font-bold text-[#9ce2f9] mb-4">How It Works</h2>
        </div>
        {/* Step 1 */}
        <div className="flex flex-col items-center">
          <div className="bg-brand-dark-secondary w-20 h-20 rounded-full flex items-center justify-center mb-5 transition-transform hover:scale-110 border border-[#9ce2f9]/20">
            <FaUserPlus className="text-white text-4xl" />
          </div>
          <h3 className="text-2xl font-semibold text-[#9ce2f9] mb-2">Create Account</h3>
          <p className="text-[#909698] max-w-xs">
            Sign up for free and set up your gamer profile.
          </p>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col items-center">
          <div className="bg-brand-dark-secondary w-20 h-20 rounded-full flex items-center justify-center mb-5 transition-transform hover:scale-110 border border-[#9ce2f9]/20">
            <FaSearch className="text-white text-4xl" />
          </div>
          <h3 className="text-2xl font-semibold text-[#9ce2f9] mb-2">Browse Contest</h3>
          <p className="text-[#909698] max-w-xs">
            Browse upcoming contests and find one that fits you.
          </p>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col items-center">
          <div className="bg-brand-dark-secondary w-20 h-20 rounded-full flex items-center justify-center mb-5 transition-transform hover:scale-110 border border-[#9ce2f9]/20">
            <FaTrophy className="text-white text-4xl" />
          </div>
          <h3 className="text-2xl font-semibold text-[#9ce2f9]">Compete & Win</h3>
          <p className="text-[#909698] max-w-xs">
            Join the battle, showcase your skills, and win big!
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
