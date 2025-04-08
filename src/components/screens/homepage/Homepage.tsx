import React from "react";
import { useNavigate } from "react-router-dom";
import { Head } from "~/components/shared/Head";
import ViewProfile from "../view-profile/ViewProfile";

function Homepage() {
  const navigate = useNavigate();

  const viewProfile = () => {
    navigate("/view-profile");
  };

  const cards = [
    {
      title: "Manage Book",
      description: "View, add, edit, or delete books in the library.",
      path: "/manage-book",
    },
    {
      title: "Manage User",
      description: "Manage library users and their details.",
      path: "/manage-user",
    },
    {
      title: "Manage Lending",
      description: "Track and manage book lending records.",
      path: "/manage-lending",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head title="Library Management Services" />
      <div className="container mx-auto px-4 py-6">
        {/* Profile Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={viewProfile}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Profile
          </button>
        </div>

        <h1 className="text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text drop-shadow-lg">
          Library Management Services
        </h1>
        <div className="grid grid-cols-3 sm:grid-cols-2 gap-5">
          {cards.map((card) => (
            <div
              key={card.title}
              onClick={() => navigate(card.path)}
              className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 cursor-pointer transition transform hover:scale-105 flex items-center justify-between"
            >
              <div>
                <h2 className="text-2xl font-bold mb-4 text-blue-400">{card.title}</h2>
                <p className="text-base text-gray-400">{card.description}</p>
              </div>
              {card.title === "Manage User" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-8 h-8 text-blue-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                  />
                </svg>
              )}
              {card.title === "Manage Book" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-8 h-8 text-blue-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                  />
                </svg>
              )}
              {card.title === "Manage Lending" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-8 h-8 text-blue-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                  />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Homepage;