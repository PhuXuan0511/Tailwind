import React from "react";
import { useNavigate } from "react-router-dom";
import libraryImage from "~/components/image/library.jpg"; // Ensure this path is correct
import { NewspaperIcon, InformationCircleIcon, UserGroupIcon, AcademicCapIcon } from "@heroicons/react/24/solid";

function Homepage() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole") || "user"; // Default to "user" if no role is found

  const cards = [
    {
      title: "Drive-Thru Model",
      description: "Experience our convenient drive-thru service to borrow and return books without leaving your car.",
      path: userRole === "admin" ? "/admin-dashboard" : "/user-dashboard",
      icon: <AcademicCapIcon className="h-12 w-12 text-blue-400 mb-4" />, // Adjusted for dark theme
    },
    {
      title: "News",
      description: "Stay updated with the latest news and announcements from our library.",
      path: "/news",
      icon: <NewspaperIcon className="h-12 w-12 text-blue-400 mb-4" />, // Adjusted for dark theme
    },
    {
      title: "Information",
      description: "Find detailed information about our library services, policies, and resources.",
      path: "/information",
      icon: <InformationCircleIcon className="h-12 w-12 text-blue-400 mb-4" />, // Adjusted for dark theme
    },
    {
      title: "About Us",
      description: "Learn more about our mission, vision, and the team behind the library.",
      path: "/about-us",
      icon: <UserGroupIcon className="h-12 w-12 text-blue-400 mb-4" />, // Adjusted for dark theme
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100"> {/* Changed to dark theme */}
      {/* Hero Section */}
      <div className="relative w-full h-[500px]">
        <img
          src={libraryImage} // Use the imported image
          alt="Library" // Accessibility improvement
          className="w-full h-full object-cover"
        />
        {/* Overlay Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-gray-100 bg-black bg-opacity-70">
          <h1 className="text-5xl font-bold">Welcome to Tailwind Library</h1>
          <p className="text-lg mt-4">
            Explore our collection of books and manage your account with ease.
          </p>
          <button
            onClick={() => navigate("/about-us")}
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            More Info
          </button>
        </div>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 w-full max-w-6xl mx-auto px-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition text-center border border-gray-700"
          >
            {/* Icon Box */}
            <div className="flex items-center justify-center w-16 h-16 bg-blue-900 mx-auto mb-4 rounded-full">
              {card.icon}
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-100">{card.title}</h2>
            <p className="text-gray-400 mb-4">{card.description}</p>
            <button
              onClick={() => navigate(card.path)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              More Info
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Homepage;