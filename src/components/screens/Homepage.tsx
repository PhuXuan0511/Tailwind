import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import library1 from "~/components/image/library1.jpg";
import { NewspaperIcon, InformationCircleIcon, UserGroupIcon, AcademicCapIcon } from "@heroicons/react/24/solid";

function Homepage() {
  const navigate = useNavigate();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensure the slider only renders on the client side
  }, []);

  // Dynamically determine the path based on the user's role
  const userRole = localStorage.getItem("userRole") || "user"; // Default to "user" if no role is found

  const cards = [
    {
      title: "Drive-Thru Model",
      description: "Experience our convenient drive-thru service to borrow and return books without leaving your car.",
      path: userRole === "admin" ? "/admin-dashboard" : "/user-dashboard", // Navigate based on role
      icon: <AcademicCapIcon className="h-12 w-12 text-blue-400 mb-4" />,
    },
    {
      title: "News",
      description: "Stay updated with the latest news and announcements from our library.",
      path: userRole === "admin" ? "/admin-manage-news" : "/news", // Admins go to ManageNews, others go to News
      icon: <NewspaperIcon className="h-12 w-12 text-blue-400 mb-4" />, // Adjusted for dark theme
    },
    {
      title: "Information",
      description: "Find detailed information about our library services, policies, and resources.",
      path: "/information",
      icon: <InformationCircleIcon className="h-12 w-12 text-blue-400 mb-4" />,
    },
    {
      title: "About Us",
      description: "Learn more about our mission, vision, and the team behind the library.",
      path: "/about-us",
      icon: <UserGroupIcon className="h-12 w-12 text-blue-400 mb-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Hero Section */}
      <div className="relative w-full h-[500px]">
        <img
          src={library1}
          alt="Library"
          className="w-full h-[500px] object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center px-4">
          <h1
            className="text-4xl sm:text-5xl font-bold text-white mb-4 drop-shadow-lg"
            style={{
              textShadow: "2px 2px 6px rgba(0, 0, 0, 0.8)", // Deep border effect
            }}
          >
            Welcome to Our Library
          </h1>
          <p
            className="text-lg sm:text-xl text-gray-300 max-w-2xl"
            style={{
              textShadow: "1px 1px 4px rgba(0, 0, 0, 0.8)", // Subtle border effect
            }}
          >
            Discover a world of knowledge and resources at your fingertips.
          </p>
        </div>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 w-full max-w-6xl mx-auto px-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition text-center border border-gray-700 flex flex-col justify-between"
          >
            {/* Icon */}
            <div className="flex items-center justify-center mb-4">
              {card.icon}
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-100">{card.title}</h2>
            <p className="text-gray-400 mb-4">{card.description}</p>
            {/* Button */}
            <button
              onClick={() => navigate(card.path)} // Navigate to the appropriate path
              className="mt-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
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