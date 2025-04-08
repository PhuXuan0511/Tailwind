import React from "react";
import { useNavigate } from "react-router-dom";

function UserHomepage() {
  const navigate = useNavigate();

  const viewProfile = () => {
    navigate("/view-profile");
  };

  const cards = [
    {
      title: "View Book List",
      description: "Browse the list of available books.",
      path: "/user-homepage/book-list", // Path to ViewBook
    },
    {
      title: "View Account",
      description: "Check your account details.",
      path: "/account",
    },
    {
      title: "View Lendings",
      description: "See your borrowed books and their status.",
      path: "/user-homepage/lending-list", // Path to ViewBook
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
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

        <h1 className="text-3xl font-bold mb-6 text-center">User Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              onClick={() => navigate(card.path)}
              className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 cursor-pointer transition transform hover:scale-105"
            >
              <h2 className="text-xl font-bold mb-2 text-blue-400">{card.title}</h2>
              <p className="text-gray-400">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserHomepage;