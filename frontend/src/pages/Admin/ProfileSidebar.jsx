import React from "react";

const ProfileSidebar = ({ activeTab, setActiveTab, onLogout, onDelete }) => {
  return (
    <div className="w-full md:w-1/3 bg-white rounded-xl shadow p-5 h-fit">
      <div className="flex flex-col gap-3">
        {["Overview", "Appointments", "Profile"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 rounded-lg font-medium ${
              activeTab === tab
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <button
          onClick={onLogout}
          className="bg-black text-white py-3 rounded-lg"
        >
          Logout
        </button>

        <button
          onClick={onDelete}
          className="bg-red-600 text-white py-3 rounded-lg"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default ProfileSidebar;
