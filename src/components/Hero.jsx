import { ArrowBigDown } from 'lucide-react';
import React from 'react';
// No import needed for images in the 'public' folder

const Hero = () => {
  return (
    <section
      className="h-[650px] py-6 my-0 bg-cover bg-center flex flex-col justify-center items-center text-center "
      style={{
        // Corrected line:
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6)), url('/bgcover.jpg')`,
      }}
    >
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-black italic tracking-tighter uppercase self-center drop-shadow-[0_2px_15px_rgba(156,226,249,0.5)] text-[#9ce2f9] transition-all duration-300 hover:text-[#ffcc00] hover:drop-shadow-[0_0_20px_rgba(255,69,0,0.8)] leading-tight px-4">
        Ultimate Free Fire Battle!
      </h1>

      <div className="text-lg sm:text-xl md:text-2xl xl:text-3xl text-[#f88d28] italic tracking-tighter self-center uppercase mt-6 mb-10 max-w-4xl px-4">
        Compete in daily contests and win exciting prizes.
        <p className="mt-4 text-sm md:text-base text-center opacity-80">Scroll down to see all contests</p>
        <ArrowBigDown className="animate-bounce font-extrabold mx-auto mt-4 text-[#ff8400] w-8 h-8 md:w-10 md:h-10" />
      </div>

      {/* <button className="bg-[#f55f0f] hover:bg-brand-orange-hover text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors">
        View Contests <a href="http://Contest"></a>
      </button> */}
    </section>
  );
};

export default Hero;
