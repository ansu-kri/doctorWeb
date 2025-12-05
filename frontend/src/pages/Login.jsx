import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header/Header";

const LoginPage = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Header/>
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        
        {/* Heading */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Hello! <span className="text-blue-600">Welcome Back</span> 👋
        </h2>

        {/* Email */}
        <div className="mb-5">
          <label className="text-gray-600 text-sm">Enter Your Email</label>
          <input
            type="email"
            className="w-full border-b border-gray-300 focus:border-blue-500 outline-none py-0 mt-0"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="text-gray-600 text-sm">Password</label>
          <input
            type="password"
            className="w-full border-b border-gray-300 focus:border-blue-500 outline-none py-0 mt-0"
          />
        </div>

        {/* Login Button */}
        <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
          Login
        </button>

        {/* Register Link */}
        <p className="text-center mt-4 text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
