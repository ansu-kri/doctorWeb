import React from "react";

const ProfileTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex gap-3 mb-6 justify-center md:justify-start">

      <button
        className={`px-4 py-2 rounded-md text-sm md:text-base w-1/2 md:w-auto ${
          activeTab === "bookings"
            ? "bg-blue-600 text-white"
            : "bg-white border text-black"
        }`}
        onClick={() => setActiveTab("bookings")}
      >
        My Bookings
      </button>

      <button
        className={`px-4 py-2 rounded-md text-sm md:text-base w-1/2 md:w-auto ${
          activeTab === "settings"
            ? "bg-blue-600 text-white"
            : "bg-white border text-black"
        }`}
        onClick={() => setActiveTab("settings")}
      >
        Settings
      </button>
    </div>
  );
};

export default ProfileTabs;
