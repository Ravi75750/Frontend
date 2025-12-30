import { ArrowBigDown } from 'lucide-react';
import React from 'react';
// No import needed for images in the 'public' folder

const Hero = () => {
  return (
    <section
      className="h-[650px] py-6 my-0 bg-cover bg-center flex flex-col justify-center items-center text-center "
      style={{
        // Corrected line:
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url('/bgcover.jpg')`,
      }}
    >
      <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase self-center drop-shadow-[0_2px_15px_rgba-[#9ce2f9]] text-[#9ce2f9] hover:text-[#1bd0dd] leading-tight">
  Ultimate Free Fire Battle!
</h1>

      <p className="text-lg text-[#909698] italic tracking-tighter self-center uppercase mt-4 mb-8 max-w-2xl">
        Compete in daily contests and win exciting prizes.
        <p>Scroll down to see all contests</p>
        <ArrowBigDown className="animate-bounce font-extrabold mx-auto mt-2 text-[#ff8400]" />
      </p>
      {/* <button className="bg-[#f55f0f] hover:bg-brand-orange-hover text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors">
        View Contests <a href="http://Contest"></a>
      </button> */}
    </section>
  );
};

export default Hero;