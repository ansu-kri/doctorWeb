import React from "react";

const ProfileDetails = ({ profile }) => {
  return (
    <div className="mt-6">
      <h3 className="font-semibold text-lg mb-2">
        About <span className="text-blue-500">{profile.name}</span>
      </h3>
      <p className="text-gray-600 mb-5">{profile.about || "No details added."}</p>

      <h3 className="font-semibold text-lg mb-2">Education</h3>
      <p className="text-gray-600 mb-5">{profile.education || "Not added."}</p>

      <h3 className="font-semibold text-lg mb-2">Experience</h3>
      <p className="text-gray-600 mb-5">{profile.experience || "Not added."}</p>
    </div>
  );
};

export default ProfileDetails;
