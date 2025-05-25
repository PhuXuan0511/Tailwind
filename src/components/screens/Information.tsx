import React from "react";
import { useNavigate } from "react-router-dom";
import library1 from "~/components/image/library1.jpg";

function Information() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl bg-gray-800 rounded-lg shadow-lg p-8 flex flex-col md:flex-row items-center">
        <img
          src={library1}
          alt="Library"
          className="w-48 h-48 object-cover rounded-lg mb-6 md:mb-0 md:mr-8 shadow-md border-4 border-gray-700"
        />
        <div>
          <h1 className="text-4xl font-bold mb-6 text-blue-400 text-center md:text-left">Information</h1>
          <p className="mb-4 text-gray-200">
            Welcome to the Information section of our Library Management System. Here, you can find comprehensive details about our library services, usage policies, and available resources to support your academic and research needs.
          </p>
          <p className="mb-4 text-gray-200">
            Our library offers a wide range of services, including book lending, digital media access, private study room bookings, and research assistance. To ensure smooth operation and fair access, all users are expected to follow our borrowing policies, which include loan durations, renewal rules, and overdue return procedures.
          </p>
          <p className="mb-4 text-gray-200">
            You’ll also find guides on how to use our web-based platform to search for books, manage your borrowing history, receive automated notifications, and stay updated with the latest library activities. Whether you’re a student, lecturer, or guest, our system is designed to make your library experience as seamless and productive as possible.
          </p>
          <p className="mb-8 text-gray-200">
            Explore this section to stay informed and make the most out of your library access.
          </p>
          <div className="flex justify-center md:justify-start">
            <button
              onClick={() => navigate("/Homepage")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Back to Homepage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Information;