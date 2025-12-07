import React from "react";
import doctor from "../../assets/images/doctor-image04.png"

const AboutSection = () => {
  return (
    <section className="w-full bg-white py-16 px-6 md:px-20 lg:px-32">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* LEFT SIDE – IMAGE */}
        <div className="flex justify-center md:justify-start relative">
          <div className="w-full max-w-[420px] relative">
            <img
              src={doctor} // Replace with your image
              alt="Doctor"
              className="rounded-2xl w-full h-auto shadow-lg"
            />

            {/* Floating Card */}
            <div className="absolute -bottom-6 left-6 bg-white shadow-xl rounded-xl p-4 flex items-center gap-3 w-[230px] md:w-[260px]">
              <img
                src={doctor} // Replace with your avatar
                alt="doctor"
                className="w-11 h-11 rounded-full"
              />
              <div>
                <p className="font-semibold text-[14px] md:text-[15px]">
                  Dr. Arvind Kumar
                </p>
                <p className="text-gray-500 text-[12px] md:text-[13px]">
                  Chief Doctor of Nursing
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE – CONTENT */}
        <div className="text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-snug text-gray-900">
            Proud to be one of<br /> the nation's best
          </h1>

          <p className="text-gray-600 mt-6 text-[15px] sm:text-[16px] leading-relaxed">
            For 30 years in a row, U.S. News & World Report has recognized us as
            one of the best public hospitals in the Nation and #1 in Texas.
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas, nemo?
          </p>

          <p className="text-gray-600 mt-4 text-[15px] sm:text-[16px] leading-relaxed">
            Our best is something we strive for each day—caring for our
            patients, looking forward rather than back. Lorem ipsum dolor sit
            amet consectetur adipisicing elit. Aliquid, modi?
          </p>

          <div className="mt-8 flex md:block justify-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-full shadow-md hover:bg-blue-700 transition font-medium text-[15px]">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
