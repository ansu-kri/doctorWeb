import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAlldoctorsQuery } from "../../app/auth/authApi"

const Doctors = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("")

  // RTK Query Hook
  const { data, isLoading, isError, error } = useGetAlldoctorsQuery();

  const doctors = data?.data || [];
  const filterData = useMemo(() => {
    return doctors.filter((doctor) =>
      doctor.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      doctor.specialization?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, doctors]);

  const handleViewDetails = (id) => {
    navigate(`/doctor/${id}`);
  };

  return (
    <div className="container mx-auto py-0">

      {/* Search Section */}
      <section className="w-full max-w-4xl mx-auto flex justify-between items-center mb-0">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by doctor name or specialization"
          className="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="ml-4 bg-blue-500 text-white p-3 px-6 rounded-lg font-semibold hover:bg-blue-600">
          Search
        </button>
      </section>

      {/* Loading */}
      {isLoading && (
        <p className="text-center text-lg">Loading doctors...</p>
      )}

      {/* Error */}
      {isError && (
        <p className="text-center text-red-500">
          {error?.data?.message || "Something went wrong"}
        </p>
      )}

      {/* Doctors List */}
      {!isLoading && !isError && (
        <section className="px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {filterData.map((doctor) => (
              <div
                key={doctor._id}
                className="bg-blue-100 p-6 rounded-lg shadow-md flex flex-col items-center"
              >
                <img
                  src={
                    doctor.profilePic
                      ? `http://localhost:5000/${doctor.profilePic}`
                      : "https://via.placeholder.com/150"
                  }
                  alt="Doctor"
                  className="rounded-full mb-4 w-32 h-32 object-cover"
                />

                <h3 className="text-xl font-semibold text-gray-800">
                  {doctor.fullName}
                </h3>

                <div className="flex justify-between w-full mt-2">
                  <p className="text-gray-500 text-sm">
                    {doctor.specialization || "General"}
                  </p>
                </div>

                <div className="flex justify-between items-center w-full mt-4">
                  <p className="text-gray-600 text-[13px]">
                    {doctor.hospital || "Not Available"}
                  </p>

                  <button
                    onClick={() => handleViewDetails(doctor._id)}
                    className="flex items-center bg-blue-500 text-white py-2 px-3 rounded-full"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 12h14M12 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {doctors.length === 0 && (
            <p className="text-center text-gray-500 mt-10">
              No doctors available
            </p>
          )}
        </section>
      )}
    </div>
  );
};

export default Doctors;