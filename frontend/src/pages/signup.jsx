import React, { useState } from "react";
import { useSignupMutation } from "../app/auth/authApi"
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [signup, { isLoading }] = useSignupMutation();
  const navigate = useNavigate();

  const [formDataState, setFormDataState] = useState({
    fullName: "",
    email: "",
    password: "",
    // phone: "",
    role: "Patient",
    gender: "",
    // bloodType: "",
  });

  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    setFormDataState({
      ...formDataState,
      [e.target.name]: e.target.value,
    });
  };

  // Handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    setPreview(URL.createObjectURL(file));
  };

  // Handle submit
const handleSubmit = async (event) => {
  event.preventDefault();

  const formData = new FormData();
  formData.append('fullName', formDataState.fullName);
  formData.append('email', formDataState.email);
  formData.append('password', formDataState.password);
  formData.append('role', formDataState.role);
  formData.append('gender', formDataState.gender);

  if (profilePic) {
    formData.append('profilePic', profilePic);
  }

  try {
    const response = await signup(formData).unwrap(); // Wait for API response
    console.log("Signup successful:", response);

    // Redirect to home after signup
    navigate("/home");
  } catch (error) {
    console.error("Signup failed:", error);
    // Optionally show error to user
  }
};

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* LEFT Illustration Section */}
      <div className="hidden md:flex w-1/2 bg-blue-600 justify-center items-center p-6">
        <img
          src="/signup-illustration.png"
          alt="Signup Illustration"
          className="w-4/5 h-auto"
        />
      </div>

      {/* RIGHT Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">
            Create an <span className="text-blue-600">Account</span>
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            
            {/* Full Name */}
            <div>
              <label className="text-gray-600">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formDataState.fullName}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-3 border rounded-lg"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                value={formDataState.email}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-3 border rounded-lg"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-gray-600">Password</label>
              <input
                type="password"
                name="password"
                value={formDataState.password}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-3 border rounded-lg"
              />
            </div>

            {/* Role + Gender */}
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="text-gray-600">Are you?</label>
                <select
                  name="role"
                  value={formDataState.role}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-3 border rounded-lg"
                >
                  <option value="patient">Patient</option>
                  <option value="doctors">Doctor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="w-1/2">
                <label className="text-gray-600">Gender</label>
                <select
                  name="gender"
                  value={formDataState.gender}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-3 border rounded-lg"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Upload Photo */}
            <div className="flex items-center gap-4">
              <img
                src={preview || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover"
              />
              <label className="bg-gray-200 px-4 py-2 rounded-md cursor-pointer">
                Upload Photo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg hover:bg-blue-700 transition"
            >
              {isLoading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-4 text-center text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}