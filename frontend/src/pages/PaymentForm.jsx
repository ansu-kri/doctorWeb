import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentForm = ({ onClose }) => {
  const navigate = useNavigate();

  // --- Handle Pay Button ---
  const handlePay = () => {
    // You can add real validation or API calls here later
    navigate("/checkout-success"); // Redirect to success page
  };

  return (
    <div className="bg-white shadow-lg p-8 rounded-lg mt-10 grid lg:grid-cols-2 gap-10">

      {/* LEFT SIDE */}
      <div>
        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
          TEST MODE
        </span>

        <h2 className="text-xl font-semibold mt-3">Dr. Muhibur Rahman</h2>

        <p className="text-3xl font-bold text-teal-600 mt-2">BDT 1,000.00</p>

        <p className="text-gray-500 mt-1">Specialization in Neurologist</p>

        <img
          src="/doctor.png"
          alt="Doctor"
          className="w-64 mt-6 rounded-lg"
        />

        <div className="text-xs text-gray-400 mt-4">
          Powered by stripe • Terms • Privacy
        </div>
      </div>

      {/* RIGHT SIDE: FORM */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Pay with card
        </h2>

        <div className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            className="w-full border p-3 rounded-md"
          />

          <div>
            <p className="text-sm text-gray-600 mb-1">Card information</p>
            <input
              type="text"
              placeholder="1234 1234 1234 1234"
              className="w-full border p-3 rounded-t-md"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="MM / YY"
                className="w-1/2 border p-3 rounded-bl-md"
              />
              <input
                type="text"
                placeholder="CVC"
                className="w-1/2 border p-3 rounded-br-md"
              />
            </div>
          </div>

          <input
            type="text"
            placeholder="Name on card"
            className="w-full border p-3 rounded-md"
          />

          <select className="w-full border p-3 rounded-md">
            <option>Bangladesh</option>
            <option>India</option>
            <option>USA</option>
          </select>

          <div className="flex items-center gap-2">
            <input type="checkbox" />
            <p className="text-sm text-gray-600">
              Securely save my information for 1-click checkout
            </p>
          </div>

          {/* ---- PAY BUTTON ---- */}
          <button
            onClick={handlePay}
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700"
          >
            Pay
          </button>

          <button
            onClick={onClose}
            className="w-full bg-gray-200 py-3 rounded-md text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
