import React, { useState } from "react";

const ContactPage = () => {
  const [form, setForm] = useState({
    email: "",
    subject: "",
    message: ""
  });

  // Handle Input Change (JavaScript – No TypeScript)
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", form);

    alert("Message sent successfully!");

    // Reset form
    setForm({
      email: "",
      subject: "",
      message: ""
    });
  };

  return (
    <div className="bg-white w-full min-h-screen flex justify-center items-start p-6 bg-gray-100">
      <div className="w-full max-w-lg rounded-xl p-6">
        
        {/* Heading */}
        <h1 className="text-2xl font-bold mb-2 text-center">Contact Us</h1>

        {/* Description */}
        <p className="text-gray-600 mb-6 text-center text-sm">
          Have questions? Send us a message and we’ll get back to you shortly.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Email */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Your Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:border-blue-500 outline-none"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Your Subject
            </label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:border-blue-500 outline-none"
              placeholder="Enter subject"
              required
            />
          </div>

          {/* Message */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Your Message
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 h-32 focus:border-blue-500 outline-none"
              placeholder="Write your message here..."
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Send Message
          </button>

        </form>
      </div>
    </div>
  );
};

export default ContactPage;
