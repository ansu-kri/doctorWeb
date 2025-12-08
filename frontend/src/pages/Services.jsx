import React from "react";
import { useNavigate } from "react-router-dom";

const Services = () => {
  const navigate = useNavigate();

  const handleViewDetails = (id) => {
    navigate(`/doctor/${id}`);
  };

  return (
    <div className="container mx-auto mt-20">

      {/* Doctors List Section */}
      <section className="-mt-20 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          
          {/* Doctor Card 1 */}
          <div className=" p-6 rounded-lg shadow-md flex flex-col items-center">
            <h3 className="text-xl font-semibold text-gray-800 text-left">Cancer Care</h3>

            <div className="flex justify-between w-full mt-2">
              <p className="text-gray-500 text-sm">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cum maiores sequi perspiciatis reiciendis, corrupti ad alias fuga unde similique molestias necessitatibus voluptatem, odio numquam et facilis architecto amet in!</p>
            </div>

            <div className="flex justify-between items-center w-full mt-4">

              <button
                onClick={() => handleViewDetails(1)}
                className="flex items-center bg-blue-500 text-white py-2 px-3 rounded-full"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Doctor Card 2 */}
          <div className=" p-6 rounded-lg shadow-md flex flex-col items-center">
            <h3 className="text-xl font-semibold text-gray-800">Labor & Delivery</h3>

            <div className="flex justify-between w-full mt-2">
              <p className="text-gray-500 text-sm">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Reprehenderit eos, illum impedit labore, quos magnam dignissimos beatae ipsum facilis perferendis omnis veritatis explicabo aliquid id non, repellat dolorum architecto expedita?</p>
            </div>

            <div className="flex justify-between items-center w-full mt-4">

              <button
                onClick={() => handleViewDetails(2)}
                className="flex items-center bg-blue-500 text-white py-2 px-3 rounded-full"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Doctor Card 3 */}
          <div className=" p-6 rounded-lg shadow-md flex flex-col items-center">
            <h3 className="text-xl font-semibold text-gray-800">Hert & Vascular</h3>

            <div className="flex justify-between w-full mt-2">
              <p className="text-gray-500 text-sm">Lorem ipsum dolor sit amet consectetur adipisicing elit. Id dolores dolorum sapiente vitae possimus, illo impedit alias maxime officiis dolore laboriosam, sed, fuga et animi! Ab architecto tempora earum molestiae!</p>
            </div>

            <div className="flex justify-between items-center w-full mt-4">

              <button
                onClick={() => handleViewDetails(3)}
                className="flex items-center bg-blue-500 text-white py-2 px-3 rounded-full"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          <div className=" p-6 rounded-lg shadow-md flex flex-col items-center">
            <h3 className="text-xl font-semibold text-gray-800">Hert & Vascular</h3>

            <div className="flex justify-between w-full mt-2">
              <p className="text-gray-500 text-sm">Lorem ipsum dolor sit amet consectetur adipisicing elit. Id dolores dolorum sapiente vitae possimus, illo impedit alias maxime officiis dolore laboriosam, sed, fuga et animi! Ab architecto tempora earum molestiae!</p>
            </div>

            <div className="flex justify-between items-center w-full mt-4">

              <button
                onClick={() => handleViewDetails(3)}
                className="flex items-center bg-blue-500 text-white py-2 px-3 rounded-full"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          <div className=" p-6 rounded-lg shadow-md flex flex-col items-center">
            <h3 className="text-xl font-semibold text-gray-800">Hert & Vascular</h3>

            <div className="flex justify-between w-full mt-2">
              <p className="text-gray-500 text-sm">Lorem ipsum dolor sit amet consectetur adipisicing elit. Id dolores dolorum sapiente vitae possimus, illo impedit alias maxime officiis dolore laboriosam, sed, fuga et animi! Ab architecto tempora earum molestiae!</p>
            </div>

            <div className="flex justify-between items-center w-full mt-4">

              <button
                onClick={() => handleViewDetails(3)}
                className="flex items-center bg-blue-500 text-white py-2 px-3 rounded-full"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          <div className=" p-6 rounded-lg shadow-md flex flex-col items-center">
            <h3 className="text-xl font-semibold text-gray-800">Hert & Vascular</h3>

            <div className="flex justify-between w-full mt-2">
              <p className="text-gray-500 text-sm">Lorem ipsum dolor sit amet consectetur adipisicing elit. Id dolores dolorum sapiente vitae possimus, illo impedit alias maxime officiis dolore laboriosam, sed, fuga et animi! Ab architecto tempora earum molestiae!</p>
            </div>

            <div className="flex justify-between items-center w-full mt-4">

              <button
                onClick={() => handleViewDetails(3)}
                className="flex items-center bg-blue-500 text-white py-2 px-3 rounded-full"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Services;
