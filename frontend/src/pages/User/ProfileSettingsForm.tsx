import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import ProfileImageUpload from "../../components/ProfileImageUpload";

interface User {
  [key: string]: unknown;
  photo?: string;
  profilePic?: string;
  name?: string;
  email?: string;
  password?: string;
  bloodType?: string;
  gender?: string;
}

const ProfileSettingsForm = ({ user, onUpdate }: { user: User; onUpdate: (data: User) => void }) => {
  const [formData, setFormData] = useState(user);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitForm = (e: FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <form className="space-y-4" onSubmit={submitForm}>
      <input
        className="border w-full p-3 rounded text-sm md:text-base"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />

      <input
        className="border w-full p-3 rounded text-sm md:text-base"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />

      <input
        className="border w-full p-3 rounded text-sm md:text-base"
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
      />

      <input
        className="border w-full p-3 rounded text-sm md:text-base"
        name="bloodType"
        value={formData.bloodType}
        onChange={handleChange}
      />

      <div className="flex flex-col md:flex-row md:items-center gap-2">
        <label className="font-semibold text-sm md:text-base">Gender:</label>

        <select
          name="gender"
          className="border p-3 rounded text-sm md:text-base"
          value={formData.gender}
          onChange={handleChange}
        >
          <option>Male</option>
          <option>Female</option>
        </select>
      </div>

      <ProfileImageUpload
        profilePic={user.profilePic ?? user.photo}
        onUploaded={onUpdate}
      />

      <button
        type="submit"
        className="bg-blue-600 text-white w-full py-3 rounded-md text-sm md:text-lg"
      >
        Update Profile
      </button>
    </form>
  );
};

export default ProfileSettingsForm;