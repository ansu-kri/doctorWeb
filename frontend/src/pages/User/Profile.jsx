import React, { useState } from "react";
import ProfileSidebar from "./ProfileSidebar";
import ProfileTabs from "./ProfileTabs";
import ProfileSettingsForm from "./ProfileSettingsForm";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("settings");

  const [user, setUser] = useState({
    name: "Ansu",
    email: "ansu@gmail.com",
    bloodType: "",
    gender: "Female",
    // photo: avatar,
  });

  const updateProfile = (data) => {
    setUser({ ...user, ...data });
    alert("Profile updated!");
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Sidebar first on mobile */}
        <div className="bg-white shadow rounded-lg p-6 order-1 md:order-none">
          <ProfileSidebar
            user={user}
            onLogout={() => alert("Logged out")}
            onDelete={() => alert("Account deleted")}
          />
        </div>

        {/* Content */}
        <div className="bg-white shadow rounded-lg p-6 md:col-span-2">

          <ProfileTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {activeTab === "settings" ? (
            <ProfileSettingsForm user={user} onUpdate={updateProfile} />
          ) : (
            <p className="text-gray-500 text-center md:text-left">
              You have no bookings yet.
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;
