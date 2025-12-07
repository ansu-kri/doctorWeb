// components/ServicesSection.jsx
import React from "react";
import icon1 from "../assets/images/icon01.png"
import icon2 from "../assets/images/icon02.png"
import icon3 from "../assets/images/icon03.png"

const serviceItems = [
  {
    title: "Find a Doctor",
    desc: "World-class care for everyone. Our health System offers unmatched, expert health care. From the lab to the clinic.",
    img: icon1,
  },
  {
    title: "Find a Location",
    desc: "World-class care for everyone. Our health System offers unmatched, expert health care. From the lab to the clinic.",
    img: icon2,
  },
  {
    title: "Book Appointment",
    desc: "World-class care for everyone. Our health System offers unmatched, expert health care. From the lab to the clinic.",
    img: icon3,
  },
];


const ServicesSection = () => {
  return (
    <section className="py-0 bg-white">
      <div className="max-w-6xl mx-auto px-4 text-center">

        {/* HEADING */}
        <h2 className="text-[32px] md:text-[42px] font-semibold text-gray-900 leading-tight">
          Providing the best <br /> medical services
        </h2>

        {/* PARAGRAPH */}
        <p className="text-gray-600 text-[16px] md:text-[17px] max-w-2xl mx-auto mt-4">
          World-class care for everyone. Our health System offers unmatched, expert health care.
        </p>

        {/* SERVICE CARDS */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14 place-items-center">

          {serviceItems.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center">

              {/* IMAGE */}
              <img
                src={item.img}
                alt={item.title}
                className="w-[140px] h-auto mb-6"
              />

              {/* TITLE */}
              <h3 className="text-xl font-semibold text-gray-900">
                {item.title}
              </h3>

              {/* DESCRIPTION */}
              <p className="text-gray-600 text-sm mt-3 max-w-xs leading-[22px]">
                {item.desc}
              </p>

              {/* BUTTON */}
              <button
                className="
                  mt-5 w-[40px] h-[40px] 
                  border border-gray-600 rounded-full 
                  flex items-center justify-center 
                  hover:bg-black hover:text-white
                  transition
                "
              >
                →
              </button>

            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
