import { FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CheckoutSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-xl p-10 text-center max-w-md w-full">

        {/* Green Success Icon */}
        <div className="mx-auto w-20 h-20 flex items-center justify-center bg-green-500 rounded-full text-white text-4xl">
          <FaCheck />
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-semibold text-gray-800 mt-6">
          Payment Done!
        </h2>

        {/* Messages */}
        <p className="text-gray-600 mt-4">
          Thank you for completing your secure online payment.
        </p>

        <p className="text-gray-700 mt-2 font-medium">Have a great day!</p>

        {/* Return Button */}
        <button
          onClick={() => navigate("/home")}
          className="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Go Back to Home Page
        </button>

      </div>
    </div>
  );
};

export default CheckoutSuccess;
