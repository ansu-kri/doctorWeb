import React, { useState } from "react";

const ProfileSettingsForm = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState(user);
  const [preview, setPreview] = useState(user.photo);

  const handleChange = (e) => {
    if (e.target.name === "photo") {
      const file = e.target.files[0];
      if (file) setPreview(URL.createObjectURL(file));
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitForm = (e) => {
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

      {/* Gender */}
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

      {/* Upload Photo */}
      <div className="flex items-center gap-4">
        <img
          src={preview}
          alt="preview"
          className="w-14 h-14 rounded-full border"
        />

        <label className="cursor-pointer bg-gray-200 px-4 py-2 rounded text-sm">
          Upload Photo
          <input
            type="file"
            name="photo"
            className="hidden"
            onChange={handleChange}
          />
        </label>
      </div>

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
