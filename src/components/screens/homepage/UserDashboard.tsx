import React from "react";
import { useNavigate } from "react-router-dom";

function UserDashboard() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "View Book List",
      description: "Browse the list of available books.",
      path: "/user-dashboard/book-list",
    },
    {
      title: "View Lendings",
      description: "See your borrowed books and their status.",
      path: "/user-dashboard/lending-list",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text drop-shadow-lg leading-normal">
          User Dashboard
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-center">
          {cards.map((card) => (
            <div
              key={card.title}
              onClick={() => navigate(card.path)}
              className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 cursor-pointer transition transform hover:scale-105 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-2xl font-bold mb-4 text-blue-400">{card.title}</h2>
                <p className="text-base text-gray-400">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;