import React from "react";
import { useNavigate } from "react-router-dom";
import manageAuthorImg from "~/components/image/manageauthor.jpg";

function AboutUs() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-start px-4 py-8">
      <div className="w-full max-w-4xl bg-gray-800 rounded-lg shadow-lg p-8 flex flex-col md:flex-row items-center">
        <img
          src={manageAuthorImg}
          alt="Manage Author"
          className="w-64 h-64 object-cover rounded-lg mb-6 md:mb-0 md:mr-8 shadow-md border-4 border-gray-700"
        />
        <div>
          <h1 className="text-4xl font-bold mb-4 text-blue-400">About Us</h1>
          <section className="mb-4">
            <h2 className="text-xl font-semibold mb-2 text-gray-200">Our Vision</h2>
            <p className="text-gray-300">
              We believe every educational institution deserves a well-equipped and accessible library that supports both students and faculty. Our ideal library space is filled with books, digital resources, study desks, and private rooms—designed to provide a quiet, productive environment for individual or group work.
            </p>
          </section>
          <section className="mb-4">
            <h2 className="text-xl font-semibold mb-2 text-gray-200">Our Solution</h2>
            <p className="text-gray-300">
              To keep up with the demands of the fast-paced digital age, we developed a comprehensive Library Management System that eliminates the need for manual tracking. Our web-based solution helps librarians efficiently manage users, books, lending activities, and transaction histories through an intuitive, centralized platform.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2 text-gray-200">Key Features</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              <li>Streamlined library operations</li>
              <li>Improved communication with users</li>
              <li>Automated overdue alerts and borrowing limits</li>
              <li>Object-oriented design with visual diagrams</li>
              <li>TypeScript and HTML code examples</li>
              <li>Database and network integration insights</li>
            </ul>
          </section>
          <div className="mt-8 flex justify-center md:justify-start">
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

export default AboutUs;