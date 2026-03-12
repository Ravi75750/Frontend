import React from 'react';
import NoticeBoard from './NoticeBoard';
import { FaUserPlus, FaSearch, FaTrophy, FaExclamationTriangle } from 'react-icons/fa';

const HowItWorks = () => {
  return (
    <section className="py-16 bg-[#143c46] text-center border-t border-[#1a4a56]">
      <div className="max-w-[1600px] mx-auto px-4 md:px-10">
        {/* --- NOTICE BOARD --- */}
        <div className="max-w-4xl mx-auto mb-10">
          <NoticeBoard />
        </div>

        {/* --- Updated Caution Section --- */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="bg-[#012129] border border-red-500 text-red-100 p-8 rounded-2xl text-left shadow-2xl animate-glow-border">
            <div className="flex items-center justify-center gap-4 mb-6 border-b border-red-500/50 pb-4">
              <FaExclamationTriangle className="text-yellow-400 text-3xl" />
              <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-widest">Caution / चेतावनी</h2>
            </div>

            <ul className="space-y-6 text-base md:text-lg">
              <li className="flex flex-col">
                <span className="font-bold text-red-400 text-lg">1. Strictly No Invites / आमंत्रण पूरी तरह से वर्जित है</span>
                <span className="text-gray-300">* If you invite other players, you will be disqualified and will not get a refund.</span>
                <span className="text-white italic mt-2">* यदि आप अन्य खिलाड़ियों को आमंत्रित करते हैं, तो आपको अयोग्य घोषित कर दिया जाएगा और कोई रिफंड नहीं मिलेगा।</span>
              </li>

              <li className="flex flex-col">
                <span className="font-bold text-red-400 text-lg">2. Slot Discipline / स्लॉट अनुशासन</span>
                <span className="text-gray-300">* Please join the allotted slot only. If you join another slot, you will be kicked out.</span>
                <span className="text-white italic mt-2">* कृपया केवल आवंटित स्लॉट में ही शामिल हों। यदि आप किसी और स्लॉट में शामिल होते हैं, तो आपको बाहर कर दिया जाएगा।</span>
              </li>

              <li className="flex flex-col">
                <span className="font-bold text-red-400 text-lg">3. No Refund / कोई रिफंड नहीं</span>
                <span className="text-white">* If you violate any of the above rules, you will not receive a refund.</span>
                <span className="text-white italic mt-2">* यदि आप उपरोक्त में से किसी भी नियम का उल्लंघन करते हैं, तो आपको रिफंड नहीं मिलेगा।</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="py-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#9ce2f9] mb-12 uppercase tracking-tighter italic">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="flex flex-col items-center group">
              <div className="bg-[#1a4a56] w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-[#27687a] border-2 border-[#9ce2f9]/30 shadow-xl">
                <FaUserPlus className="text-[#9ce2f9] text-4xl" />
              </div>
              <h3 className="text-2xl font-bold text-[#9ce2f9] mb-3">Create Account</h3>
              <p className="text-gray-400 max-w-xs text-lg">
                Sign up for free and set up your gamer profile with email verification.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center group">
              <div className="bg-[#1a4a56] w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-[#27687a] border-2 border-[#9ce2f9]/30 shadow-xl">
                <FaSearch className="text-[#9ce2f9] text-4xl" />
              </div>
              <h3 className="text-2xl font-bold text-[#9ce2f9] mb-3">Browse Contest</h3>
              <p className="text-gray-400 max-w-xs text-lg">
                Browse upcoming contests and find one that fits your playstyle.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center group">
              <div className="bg-[#1a4a56] w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-[#27687a] border-2 border-[#9ce2f9]/30 shadow-xl">
                <FaTrophy className="text-[#9ce2f9] text-4xl" />
              </div>
              <h3 className="text-2xl font-bold text-[#9ce2f9] mb-3">Compete & Win</h3>
              <p className="text-gray-400 max-w-xs text-lg">
                Join the battle, showcase your skills, and win exciting prizes!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
