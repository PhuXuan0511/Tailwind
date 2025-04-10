import React from "react";
import { useNavigate } from "react-router-dom";
import libraryImage from "~/components/image/library.jpeg"; // Import the image

function Homepage() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole") || "user"; // Default to "user" if no role is found

  const cards = [
    {
      title: "Drive-Thru Model",
      description: "Experience our convenient drive-thru service to borrow and return books without leaving your car.",
      path: userRole === "admin" ? "/admin-dashboard" : "/user-dashboard",
    },
    {
      title: "News",
      description: "Stay updated with the latest news and announcements from our library.",
      path: "/news",
    },
    {
      title: "Information",
      description: "Find detailed information about our library services, policies, and resources.",
      path: "/information",
    },
    {
      title: "About Us",
      description: "Learn more about our mission, vision, and the team behind the library.",
      path: "/about-us",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">
      {/* Big Image */}
      <img
        src={libraryImage} // Use the imported image
        alt="Library"
        style={{ width: "1000px", height: "auto" }} // Set custom width
        className="rounded-lg shadow-lg"
      />

      {/* Welcome Text */}
      <h1 className="text-4xl font-bold mt-8 text-center">
        Welcome to the Library Management System
      </h1>
      <p className="text-lg mt-4 text-center text-gray-400">
        Explore our collection of books and manage your account with ease.
      </p>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 w-full max-w-6xl">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => navigate(card.path)} // Navigate to the card's path
            className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 cursor-pointer transition transform hover:scale-105"
          >
            <h2 className="text-2xl font-bold mb-4 text-blue-400">{card.title}</h2>
            <p className="text-gray-400">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Homepage;