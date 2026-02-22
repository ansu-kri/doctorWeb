import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Header/Navbar";
import { useLoginMutation } from "../app/auth/authApi" // adjust path

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login, { isLoading, isError, error, isSuccess }] =
    useLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await login({ email, password }).unwrap();

      console.log("Login Success:", response);

      // ✅ Optional: store token if backend sends it
      if (response?.token) {
        localStorage.setItem("token", response.token);
      }

      // ✅ Redirect after login
      navigate("/home"); // change route if needed

    } catch (err) {
      console.error("Login Failed:", err);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Navbar />

      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Hello! <span className="text-blue-600">Welcome Back</span> 👋
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-5">
            <label className="text-gray-600 text-sm">Enter Your Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b border-gray-300 focus:border-blue-500 outline-none py-1 mt-1"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="text-gray-600 text-sm">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-gray-300 focus:border-blue-500 outline-none py-1 mt-1"
            />
          </div>

          {/* Error Message */}
          {isError && (
            <p className="text-red-500 text-sm mb-3">
              {error?.data?.message || "Login failed. Try again."}
            </p>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

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