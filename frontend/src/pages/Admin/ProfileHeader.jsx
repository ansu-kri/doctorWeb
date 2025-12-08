import React from "react";

const ProfileHeader = ({ profile }) => {
  return (
    <div className="flex items-center gap-4">
      <img
        src={profile.photo}
        alt="profile"
        className="w-24 h-24 rounded-xl object-cover shadow"
      />

      <div>
        <h2 className="text-xl font-semibold">{profile.name}</h2>
        <div className="flex items-center gap-1 text-yellow-500 text-sm">
          ⭐ <span className="text-gray-600">0 (0)</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
