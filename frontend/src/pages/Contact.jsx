
import React, { useState } from "react";

const ContactPage = () => {
  const [form, setForm] = useState({
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setStatus("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      // Connect this endpoint to your backend API.
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Unable to send your message.");
      }

      setStatus("success");
      setForm({
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-cyan-500 text-white">
        <div className="max-w-7xl mx-auto px-6 py-14 md:py-20 text-center">

          <div className="inline-block bg-white/20 px-5 py-2 rounded-full text-sm mb-5">
            ♥ Your Health, Our Priority
          </div>

          <h1 className="text-3xl md:text-5xl font-bold mb-5">
            We're Here to Help You
          </h1>

          <p className="text-blue-50 max-w-2xl mx-auto text-base md:text-lg">
            Have questions about appointments, doctors, or medical services?
            Our healthcare support team is ready to assist you.
          </p>

        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-7xl mx-auto px-6 py-14">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">

            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-3">
                Get in Touch
              </h2>

              <p className="text-gray-500 leading-relaxed">
                We're committed to making your healthcare experience
                simple, comfortable, and convenient.
              </p>
            </div>

            {/* Phone */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
                📞
              </div>

              <div>
                <h3 className="font-semibold text-slate-800">
                  Call Us
                </h3>
                <p className="text-gray-500 text-sm">
                  +91 98765 43210
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
                ✉️
              </div>

              <div>
                <h3 className="font-semibold text-slate-800">
                  Email Support
                </h3>
                <p className="text-gray-500 text-sm">
                  support@medicare.com
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">
                📍
              </div>

              <div>
                <h3 className="font-semibold text-slate-800">
                  Our Location
                </h3>
                <p className="text-gray-500 text-sm">
                  Bengaluru, India
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl">
              <h3 className="font-bold text-blue-800 mb-2">
                Need Medical Assistance?
              </h3>
              <p className="text-sm text-blue-700">
                For emergencies, contact your local emergency
                services instead of using this contact form.
              </p>
            </div>

          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 md:p-10">

              <div className="mb-8">
                <span className="text-blue-600 font-semibold text-sm">
                  CONTACT SUPPORT
                </span>

                <h2 className="text-3xl font-bold text-slate-800 mt-2">
                  Send Us a Message
                </h2>

                <p className="text-gray-500 mt-2">
                  Fill out the form below and our team will get
                  back to you shortly.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="example@gmail.com"
                    required
                    className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject
                  </label>

                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    required
                    className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Message
                  </label>

                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    rows="6"
                    required
                    className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                  />
                </div>

                {/* Status */}
                {status === "success" && (
                  <div
                    role="status"
                    className="bg-green-50 text-green-700 p-4 rounded-xl"
                  >
                    ✓ Your message has been sent successfully!
                  </div>
                )}

                {status === "error" && (
                  <div
                    role="alert"
                    className="bg-red-50 text-red-700 p-4 rounded-xl"
                  >
                    Unable to send your message. Please try again.
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition duration-300 flex justify-center items-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin">⟳</span>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      Send Message
                      <span>➜</span>
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-gray-400">
                  Your information should be handled securely.
                  Please don't include sensitive medical details.
                </p>

              </form>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-gray-300 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">

          <h2 className="text-xl font-bold text-white mb-2">
            <span className="text-blue-400">✚</span> Medicare
          </h2>

          <p className="text-sm text-gray-400">
            Your Health, Our Priority.
          </p>

          <div className="border-t border-gray-700 mt-6 pt-5 text-sm">
            © {new Date().getFullYear()} Medicare. All rights reserved.
          </div>

        </div>
      </footer>

    </div>
  );
};

export default ContactPage;
