import React from "react";
import { useNavigate } from "react-router-dom";
function AboutUs() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen py-10 relative overflow-hidden bg-library-gradient">
      <div className="max-w-2xl w-full mx-auto p-6 rounded-lg shadow-md relative z-10">
        <div className="mb-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
          >
            Back
          </button>
        </div>
        <h1 className="text-2xl font-bold mb-6 text-center">About Us</h1>
        Welcome to our university library initiative—a collaborative project driven by a passionate team of students, faculty, and researchers dedicated to advancing access to knowledge and resources.
        Our mission is to empower the academic community through innovative digital tools, comprehensive collections, and inclusive learning spaces.
        At the heart of our project is a shared vision of academic excellence, collaboration, and accessibility.
        Whether you're a student seeking resources or a researcher exploring new frontiers, our team is here to support and inspire your journey.
        <section className="mb-4">
          <h2 className="text-xl font-semibold mb-2 text-white">Our Vision</h2>
          <p className="text-white">
            We believe every educational institution deserves a well-equipped and accessible library that supports both students and faculty. Our ideal library space is filled with books, digital resources, study desks, and private rooms—designed to provide a quiet, productive environment for individual or group work.
          </p>
        </section>
        <section className="mb-4">
          <h2 className="text-xl font-semibold mb-2 text-white">Our Solution</h2>
          <p className="text-white">
            To keep up with the demands of the fast-paced digital age, we developed a comprehensive Library Management System that eliminates the need for manual tracking. Our web-based solution helps librarians efficiently manage users, books, lending activities, and transaction histories through an intuitive, centralized platform.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2 text-white">Key Features</h2>
          <ul className="list-disc list-inside text-white space-y-1">
            <li>Streamlined library operations</li>
            <li>Improved communication with users</li>
            <li>Automated overdue alerts and borrowing limits</li>
            <li>Object-oriented design with visual diagrams</li>
            <li>TypeScript and HTML code examples</li>
            <li>Database and network integration insights</li>
          </ul>
        </section>
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Our Team</h2>
          <ul className="list-disc list-inside space-y-1 text-white">
            <li>
              <a href="mailto:10422019@student.vgu.edu.vn" className="text-blue-400 underline">
                Manh Duc, Tran
              </a> - Scrum Master
            </li>
            <li>
              <a href="mailto:10422024@student.vgu.edu.vn" className="text-blue-400 underline">
                Minh Giap, Nguyen
              </a> - Backend Developer
            </li>
            <li>
              <a href="mailto:10422065@student.vgu.edu.vn" className="text-blue-400 underline">
                Xuan Phu, Nguyen
              </a> - Frontend Developer
            </li>
            <li>
              <a href="mailto:10422071@student.vgu.edu.vn" className="text-blue-400 underline">
                Phuc Quy, Tran
              </a> - Database Manager
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default AboutUs;