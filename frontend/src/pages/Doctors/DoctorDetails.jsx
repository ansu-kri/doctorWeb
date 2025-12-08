import { useState } from "react";
import { FaStar } from "react-icons/fa";
import PaymentForm from "../PaymentForm";

const DoctorDetails = () => {
  const [tab, setTab] = useState("about");
  const [showPayment, setShowPayment] = useState(false);

  // Feedback states
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");

  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: "Ahmed Ali",
      date: "June 27, 2023",
      review: "Good doctor, highly recommend 👍",
      rating: 5,
      avatar: "/doctor.png",
    },
    {
      id: 2,
      name: "Rakib",
      date: "June 27, 2023",
      review: "Good",
      rating: 5,
      avatar: "/doctor.png",
    },
  ]);

  const handleSubmitFeedback = () => {
    if (rating === 0) {
      alert("Please give a rating!");
      return;
    }

    if (message.trim() === "") {
      alert("Please write your feedback!");
      return;
    }

    const newFeedback = {
      id: Date.now(),
      name: "You",
      date: new Date().toLocaleDateString(),
      review: message,
      rating,
      avatar: "/doctor.png",
    };

    setReviews([newFeedback, ...reviews]);
    setRating(0);
    setMessage("");
    setSuccess("Feedback submitted successfully!");

    setTimeout(() => setSuccess(""), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10">

        {/* PAYMENT SCREEN */}
        {showPayment && (
          <div className="lg:col-span-12">
            <PaymentForm onClose={() => setShowPayment(false)} />
          </div>
        )}

        {/* MAIN PAGE (shown only when payment is hidden) */}
        {!showPayment && (
          <>
            {/* LEFT CONTENT */}
            <div className="lg:col-span-8 bg-white p-6 rounded-lg shadow">

              {/* Doctor Header */}
              <div className="flex items-center gap-6">
                <img
                  src="/doctor.png"
                  alt="doctor"
                  className="w-32 h-32 rounded-lg object-cover"
                />

                <div>
                  <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm">
                    neurologist
                  </span>

                  <h2 className="text-2xl font-semibold mt-2">
                    Dr. Muhibur Rahman
                  </h2>

                  <div className="flex items-center gap-2 text-yellow-500 text-sm">
                    <FaStar />
                    <span className="text-gray-700">5 (2)</span>
                  </div>

                  <p className="text-sm text-gray-500">
                    Specialization in Neurologist
                  </p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-10 mt-8 border-b">
                <button
                  className={`pb-2 ${
                    tab === "about"
                      ? "border-b-2 border-teal-600 text-teal-600 font-medium"
                      : "text-gray-500"
                  }`}
                  onClick={() => setTab("about")}
                >
                  About
                </button>

                <button
                  className={`pb-2 ${
                    tab === "feedback"
                      ? "border-b-2 border-teal-600 text-teal-600 font-medium"
                      : "text-gray-500"
                  }`}
                  onClick={() => setTab("feedback")}
                >
                  Feedback
                </button>
              </div>

              {/* ABOUT TAB */}
              {tab === "about" && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-teal-700">
                    About of Dr. Muhibur Rahman
                  </h3>
                  <p className="text-gray-600 mt-3 leading-relaxed">
                    Lorem Ipsum is simply dummy text...
                  </p>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Education</h3>

                    <div className="flex justify-between border-b py-3">
                      <span className="text-blue-600 font-medium">2006–2010</span>
                      <span className="text-gray-700">BSc degree in Neurosciences</span>
                      <span className="text-gray-500">New Apollo Hospital</span>
                    </div>

                    <div className="flex justify-between border-b py-3">
                      <span className="text-blue-600 font-medium">2010–2014</span>
                      <span className="text-gray-700">MBBS in Neurology</span>
                      <span className="text-gray-500">Dhaka Medical College</span>
                    </div>
                  </div>
                </div>
              )}

              {/* FEEDBACK TAB */}
              {tab === "feedback" && (
                <div className="mt-6">
                  {success && (
                    <p className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 text-sm">
                      {success}
                    </p>
                  )}

                  <h3 className="text-xl font-semibold text-gray-700 mb-4">
                    All Reviews ({reviews.length})
                  </h3>

                  <div className="space-y-6">
                    {reviews.map((item) => (
                      <div key={item.id} className="flex justify-between items-start">
                        <div className="flex gap-3">
                          <img
                            src={item.avatar}
                            alt="avatar"
                            className="w-10 h-10 rounded-full"
                          />

                          <div>
                            <p className="font-semibold text-gray-800">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.date}</p>
                            <p className="mt-1 text-gray-700">{item.review}</p>
                          </div>
                        </div>

                        <div className="text-yellow-500">{`★`.repeat(item.rating)}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-10">
                    <p className="font-medium text-gray-700">
                      How would you rate the overall experience?*
                    </p>

                    <div className="flex gap-2 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          size={28}
                          className={`cursor-pointer ${
                            (hover || rating) >= star
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }`}
                          onMouseEnter={() => setHover(star)}
                          onMouseLeave={() => setHover(null)}
                          onClick={() => setRating(star)}
                        />
                      ))}
                    </div>

                    <div className="mt-6">
                      <p className="font-medium text-gray-700">
                        Share your feedback or suggestions*
                      </p>

                      <textarea
                        className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        rows="4"
                        placeholder="Write your message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      ></textarea>
                    </div>

                    <button
                      onClick={handleSubmitFeedback}
                      className="mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700"
                    >
                      Submit Feedback
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="lg:col-span-4">
              <div className="bg-white shadow p-6 rounded-lg">
                <h3 className="text-gray-700 font-medium">Ticket Price</h3>
                <p className="text-2xl font-semibold text-teal-600 mt-1">1000 BDT</p>

                <h4 className="mt-5 text-gray-700 font-medium">
                  Available Time Slots:
                </h4>

                <ul className="mt-3 text-gray-600 space-y-1">
                  <li>Saturday: 5:30 pm - 8:50 pm</li>
                  <li>Monday: 10:00 am - 3:00 pm</li>
                  <li>Wednesday: 5:00 pm - 9:30 pm</li>
                </ul>

                <button
                  className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                  onClick={() => setShowPayment(true)}
                >
                  Book Appointment
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorDetails;
