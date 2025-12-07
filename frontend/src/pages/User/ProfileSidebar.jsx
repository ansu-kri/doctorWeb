import React from "react";

const ProfileSidebar = ({ user, onLogout, onDelete }) => {
  return (
    <div className="flex flex-col items-center gap-4 w-full text-center">

      {/* Avatar */}
      <img
        src={user.photo}
        alt="User Avatar"
        className="w-24 h-24 rounded-full border"
      />

      {/* Info */}
      <h2 className="text-lg md:text-xl font-semibold break-all">{user.name}</h2>
      <p className="text-gray-600 text-sm md:text-base break-all">
        {user.email}
      </p>

      <p className="text-gray-500 text-sm">
        Blood Type: {user.bloodType || "—"}
      </p>

      {/* Buttons */}
      <button
        onClick={onLogout}
        className="bg-black text-white w-full py-3 rounded-md text-sm md:text-base"
      >
        Logout
      </button>

      <button
        onClick={onDelete}
        className="bg-red-600 text-white w-full py-3 rounded-md text-sm md:text-base"
      >
        Delete Account
      </button>
    </div>
  );
};

export default ProfileSidebar;
