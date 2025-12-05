// components/HeroSection.jsx
import React from "react";

const HeroSection = () => {
  return (
    <section className="px-0 lg:px-10 mt-0">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        {/* LEFT SIDE */}
        <div className="lg:w-1/2 ml-5 lg:ml-10">
          <h1 className="text-[26px] leading-[36px] md:text-[48px] md:leading-[60px] font-[500] text-gray-700">
            We help patients <br /> live a healthy, <br /> longer life.
          </h1>

          <p className="text-[16px] leading-[28px] text-gray-600 mt-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus
            quaerat cumque fugit, perspiciatis cum nemo aperiam aut quia earum
            amet architecto modi odio. Soluta unde ducimus perferendis?
          </p>

          {/* CTA Button */}
          <button className="group flex items-center bg-blue-600 text-white font-medium px-6 py-3 rounded-full mt-8 transition-all duration-300 hover:bg-blue-700 shadow-md">
            <span className="text-xl transition-transform duration-300 group-hover:translate-x-1">
              ➜
            </span>
            <span
              className="text-base ml-3 whitespace-nowrap 
              max-w-xs sm:max-w-0 sm:overflow-hidden sm:group-hover:max-w-xs
              sm:transition-all sm:duration-300"
            >
              Request an Appointment
            </span>
          </button>

          {/* COUNTERS */}
          <div className="mt-14 grid grid-cols-3 gap-10">
            <div>
              <h2 className="text-[36px] font-[800] text-gray-900">30+</h2>
              <div className="w-[70px] h-[3px] bg-yellow-400 mt-1"></div>
              <p className="text-gray-600 mt-2 text-[15px]">Years of Experience</p>
            </div>

            <div>
              <h2 className="text-[36px] font-[800] text-gray-900">15+</h2>
              <div className="w-[70px] h-[3px] bg-purple-400 mt-1"></div>
              <p className="text-gray-600 mt-2 text-[15px]">Clinic Location</p>
            </div>

            <div>
              <h2 className="text-[36px] font-[800] text-gray-900">100%</h2>
              <div className="w-[70px] h-[3px] bg-blue-400 mt-1"></div>
              <p className="text-gray-600 mt-2 text-[15px]">Patient Satisfaction</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE IMAGES */}
        <div className="w-full lg:w-1/2 flex flex-col lg:flex-row items-center justify-center gap-6">
          {/* MAIN IMAGE */}
          <div className="w-[240px] h-[300px] sm:w-[260px] sm:h-[340px] lg:w-[280px] lg:h-[380px] bg-orange-300 rounded-xl shadow-lg flex items-center justify-center">
            <img src="/doctor-main.png" className="w-[85%] h-auto object-cover" />
          </div>

          {/* SMALL STACKED IMAGES */}
          <div className="flex flex-row lg:flex-col gap-4 lg:gap-6 mt-2 lg:mt-6">
            <div className="w-[160px] h-[140px] sm:w-[180px] sm:h-[160px] lg:w-[200px] lg:h-[180px] bg-purple-500 rounded-xl shadow-lg flex items-center justify-center">
              <img src="/doctor-small-1.png" className="w-[80%] h-auto object-cover" />
            </div>

            <div className="w-[160px] h-[140px] sm:w-[180px] sm:h-[160px] lg:w-[200px] lg:h-[180px] bg-cyan-500 rounded-xl shadow-lg flex items-center justify-center">
              <img src="/doctor-small-2.png" className="w-[80%] h-auto object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
