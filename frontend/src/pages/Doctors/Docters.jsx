import React from "react";
import { useNavigate } from "react-router-dom";

const Doctors = () => {
  const navigate = useNavigate();

  const handleViewDetails = (id) => {
    navigate(`/doctor/${id}`);
  };

  return (
    <div className="container mx-auto">
      
      {/* Search Section */}
      <section className="w-full max-w-4xl mx-auto flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by doctor name or specialization"
          className="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="ml-4 bg-blue-500 text-white p-3 px-6 rounded-lg font-semibold hover:bg-blue-600">
          Search
        </button>
      </section>

      {/* Doctors List Section */}
      <section className="-mt-20 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          
          {/* Doctor Card 1 */}
          <div className="bg-orange-100 p-6 rounded-lg shadow-md flex flex-col items-center">
            <img src="https://via.placeholder.com/150" alt="Doctor" className="rounded-full mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">Dr. Alfaz Ahmed</h3>

            <div className="flex justify-between w-full mt-2">
              <p className="text-gray-500 text-sm">Surgeon</p>
              <div className="flex items-center">
                <span className="text-yellow-500">★★★★☆</span>
                <span className="ml-1 text-gray-400">(2)</span>
              </div>
            </div>

            <div className="flex justify-between items-center w-full mt-4">
              <p className="text-gray-600 text-[13px]">At Mount Adora Hospital, Sylhet</p>

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
          <div className="bg-purple-100 p-6 rounded-lg shadow-md flex flex-col items-center">
            <img src="https://via.placeholder.com/150" alt="Doctor" className="rounded-full mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">Dr. Muhibur Rahman</h3>

            <div className="flex justify-between w-full mt-2">
              <p className="text-gray-500 text-sm">Neurologist</p>
              <div className="flex items-center">
                <span className="text-yellow-500">★★★★★</span>
                <span className="ml-1 text-gray-400">(5)</span>
              </div>
            </div>

            <div className="flex justify-between items-center w-full mt-4">
              <p className="text-gray-600 text-[13px]">At Mount Adora Hospital, Sylhet</p>

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
          <div className="bg-teal-100 p-6 rounded-lg shadow-md flex flex-col items-center">
            <img src="https://via.placeholder.com/150" alt="Doctor" className="rounded-full mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">Regina Albert</h3>

            <div className="flex justify-between w-full mt-2">
              <p className="text-gray-500 text-sm">Dermatologist</p>
              <div className="flex items-center">
                <span className="text-yellow-500">☆</span>
                <span className="ml-1 text-gray-400">(0)</span>
              </div>
            </div>

            <div className="flex justify-between items-center w-full mt-4">
              <p className="text-gray-600 text-[13px]">At Error Blanditis</p>

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

export default Doctors;
