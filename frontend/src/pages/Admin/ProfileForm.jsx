import React, { useState } from "react";

const ProfileForm = () => {
  const [formData, setFormData] = useState({
    name: "Dylan Kaufman",
    email: "tites@mailinator.com",
    phone: "",
    bio: "",
    gender: "",
    specialization: "",
    ticketPrice: "",
    qualifications: [],
    experience: [],
    timeslots: [],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addQualification = () => {
    const newQ = {
      startDate: "",
      endDate: "",
      degree: "",
      university: "",
    };

    setFormData({
      ...formData,
      qualifications: [...formData.qualifications, newQ],
    });
  };

  const handleQualificationChange = (index, field, value) => {
    const updated = [...formData.qualifications];
    updated[index][field] = value;
    setFormData({ ...formData, qualifications: updated });
  };

  const deleteQualification = (index) => {
    const updated = [...formData.qualifications];
    updated.splice(index, 1);
    setFormData({ ...formData, qualifications: updated });
  };

  const addExperience = () => {
    const newExp = prompt("Enter experience");
    if (newExp) {
      setFormData({
        ...formData,
        experience: [...formData.experience, newExp],
      });
    }
  };

  const addTimeSlot = () => {
    const newSlot = prompt("Enter time slot");
    if (newSlot) {
      setFormData({
        ...formData,
        timeslots: [...formData.timeslots, newSlot],
      });
    }
  };

  return (
    <div className="w-full bg-white rounded-xl p-4">
      <h2 className="text-xl font-semibold mb-6">Profile Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
        {/* NAME */}
        <div>
          <label className="font-medium text-gray-600">Name*</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 mt-1 focus:outline-blue-500"
          />
        </div>

        {/* EMAIL */}
        <div>
          <label className="font-medium text-gray-600">Email*</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 mt-1 focus:outline-blue-500"
          />
        </div>

        {/* PHONE */}
        <div>
          <label className="font-medium text-gray-600">Phone*</label>
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 mt-1 focus:outline-blue-500"
          />
        </div>

        {/* BIO */}
        <div>
          <label className="font-medium text-gray-600">Bio*</label>
          <input
            type="text"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 mt-1 focus:outline-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* GENDER */}
          <div>
            <label className="font-medium text-gray-600">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-1"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* SPECIALIZATION */}
          <div>
            <label className="font-medium text-gray-600">Specialization*</label>
            <select
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-1"
            >
              <option value="">Select</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Dermatology">Dermatology</option>
            </select>
          </div>

          {/* TICKET PRICE */}
          <div>
            <label className="font-medium text-gray-600">Ticket Price*</label>
            <input
              type="number"
              name="ticketPrice"
              value={formData.ticketPrice}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-1"
            />
          </div>
        </div>
      </div>

      {/* QUALIFICATIONS */}
      <div className="mt-6">
        <h3 className="font-medium text-gray-700 mb-2">Qualifications*</h3>

        <div className="space-y-6">
          {formData.qualifications.map((q, index) => (
            <div key={index} className=" rounded-lg">
              {/* Line 1 – Start & End Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Start Date</label>
                  <input
                    type="date"
                    value={q.startDate}
                    onChange={(e) =>
                      handleQualificationChange(
                        index,
                        "startDate",
                        e.target.value
                      )
                    }
                    className="w-full border rounded-lg p-2 mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">End Date</label>
                  <input
                    type="date"
                    value={q.endDate}
                    onChange={(e) =>
                      handleQualificationChange(
                        index,
                        "endDate",
                        e.target.value
                      )
                    }
                    className="w-full border rounded-lg p-2 mt-1"
                  />
                </div>
              </div>

              {/* Line 2 – Degree & University */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="text-sm text-gray-600">Degree</label>
                  <input
                    type="text"
                    value={q.degree}
                    onChange={(e) =>
                      handleQualificationChange(index, "degree", e.target.value)
                    }
                    className="w-full border rounded-lg p-2 mt-1"
                    placeholder="e.g. MBBS, MD"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">University</label>
                  <input
                    type="text"
                    value={q.university}
                    onChange={(e) =>
                      handleQualificationChange(
                        index,
                        "university",
                        e.target.value
                      )
                    }
                    className="w-full border rounded-lg p-2 mt-1"
                    placeholder="e.g. Stanford University"
                  />
                </div>
              </div>

              {/* Delete Icon */}
              <div className="flex justify-end mt-3">
                <button
                  onClick={() => deleteQualification(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <button
          onClick={addQualification}
          className="bg-black text-white px-4 py-2 rounded-lg mb-3 mt-1"
        >
          Add Qualification
        </button>
      </div>

      {/* EXPERIENCE */}
      <div className="mt-6">
        <h3 className="font-medium text-gray-700 mb-2">Experience*</h3>

        <button
          onClick={addExperience}
          className="bg-black text-white px-4 py-2 rounded-lg mb-3"
        >
          Add Experience
        </button>

        <ul className="text-gray-700 list-disc ml-5">
          {formData.experience.map((q, index) => (
            <li key={index}>{q}</li>
          ))}
        </ul>
      </div>

      {/* TIME SLOTS */}
      <div className="mt-6">
        <h3 className="font-medium text-gray-700 mb-2">Time Slots*</h3>

        <button
          onClick={addTimeSlot}
          className="bg-black text-white px-4 py-2 rounded-lg mb-3"
        >
          Add Time Slot
        </button>

        <ul className="text-gray-700 list-disc ml-5">
          {formData.timeslots.map((q, index) => (
            <li key={index}>{q}</li>
          ))}
        </ul>
      </div>

      {/* ABOUT */}
      <div>
        <label>About*</label>
        <textarea
          name="about"
          value={formData.about || ""}
          onChange={handleChange}
          className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          rows="4"
          placeholder="Write your message"
        ></textarea>
      </div>
      <div className="flex items-center gap-4">
        <img
          src="./photo"
          alt="Profile"
          className="w-16 h-16 rounded-full object-cover"
        />
        <span>
          <button className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700">
            Upload Photo
          </button>
        </span>
      </div>

      {/* SUBMIT BUTTON */}
      <button className="w-full mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg">
        Upload Profile
      </button>
    </div>
  );
};

export default ProfileForm;