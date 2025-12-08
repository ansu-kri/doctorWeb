import React, { useState } from "react";
import ProfileSidebar from "./ProfileSidebar";
import ProfileHeader from "./ProfileHeader";
import ProfileDetails from "./ProfileDetails";
import ProfileForm from "./ProfileForm";
import AppointmentTable from "./Appointment Table";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("Overview");

  const profile = {
    name: "Dylan Kaufman",
    photo:
      "https://images.unsplash.com/photo-1606813907291-820cbaad6a5f?auto=format&fit=crop&w=500&q=80",
    about: "",
    education: "",
    experience: ""
  };

  const handleLogout = () => alert("Logout clicked");
  const handleDelete = () => alert("Delete Account clicked");

  return (
    <div className="min-h-screen bg-gray-100 px-4 md:px-10 py-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">

        {/* LEFT SIDEBAR */}
        <ProfileSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={handleLogout}
          onDelete={handleDelete}
        />

        {/* RIGHT CONTENT */}
        <div className="flex-1 bg-white rounded-xl shadow p-6">

          {activeTab === "Overview" && (
            <>
              <ProfileHeader profile={profile} />
              <ProfileDetails profile={profile} />
            </>
          )}

          {activeTab === "Appointments" && <AppointmentTable/>
          }

          {activeTab === "Profile" && <ProfileForm/>
          }
        </div>
      </div>
    </div>
  );
};

export default Profile;
