import React from "react";

const AppointmentTable = () => {
  const data = [
    {
      name: "John Doe",
      gender: "Male",
      payment: "Paid",
      price: "₹1200",
      bookedOn: "2025-01-12",
    },
    {
      name: "Anita Sharma",
      gender: "Female",
      payment: "Pending",
      price: "₹900",
      bookedOn: "2025-01-11",
    },
    {
      name: "Rahul Verma",
      gender: "Male",
      payment: "Paid",
      price: "₹1500",
      bookedOn: "2025-01-10",
    },
  ];

  return (
    <div className="p-6 min-h-auto">
      <div className="bg-white rounded-xl p-5">

        <div className="overflow-x-auto rounded-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700 text-left">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Gender</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Booked On</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4">{item.name}</td>
                  <td className="py-3 px-4">{item.gender}</td>
                  <td
                    className={`py-3 px-4 font-medium ${
                      item.payment === "Paid"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {item.payment}
                  </td>
                  <td className="py-3 px-4">{item.price}</td>
                  <td className="py-3 px-4">{item.bookedOn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AppointmentTable;
