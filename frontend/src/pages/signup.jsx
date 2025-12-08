import React from "react";

export default function Signup() {
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

          <form className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="text-gray-600">Full Name</label>
              <input
                type="text"
                placeholder="Enter full name"
                className="w-full mt-1 px-3 py-3 border rounded-lg outline-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-gray-600">Email</label>
              <input
                type="email"
                placeholder="admin@gmail.com"
                className="w-full mt-1 px-3 py-3 border rounded-lg outline-blue-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-gray-600">Password</label>
              <input
                type="password"
                className="w-full mt-1 px-3 py-3 border rounded-lg outline-blue-500"
              />
            </div>

            {/* Role + Gender */}
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="text-gray-600">Are you?</label>
                <select className="w-full mt-1 px-3 py-3 border rounded-lg outline-blue-500">
                  <option>Patient</option>
                  <option>Doctor</option>
                  <option>Admin</option>
                </select>
              </div>

              <div className="w-1/2">
                <label className="text-gray-600">Gender</label>
                <select className="w-full mt-1 px-3 py-3 border rounded-lg outline-blue-500">
                  <option>Select</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
            </div>

            {/* Upload Photo */}
            <div className="flex items-center gap-4">
              <img
                src="./photo"
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover"
              />
              <span>
                <button
                  type="button"
                  className="bg-gray-200 px-4 py-2 rounded-md text-gray-700"
                >
                  Upload Photo
                </button></span>
            </div>

            {/* Submit */}
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg hover:bg-blue-700 transition">
              Sign Up
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
