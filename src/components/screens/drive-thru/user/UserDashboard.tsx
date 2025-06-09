import React from "react";
import { useNavigate } from "react-router-dom";
import manageBookImage from "~/components/image/managebook.jpg";
import manageLendingImage from "~/components/image/managelending.jpg";

function UserDashboard() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "View Book List",
      description: "Browse the list of available books.",
      path: "/user-dashboard/book-list",
      image: manageBookImage,
    },
    {
      title: "View Lendings",
      description: "See your borrowed books and their status.",
      path: "/user-dashboard/lending-list",
      image: manageLendingImage,
    },
    {
      title: "Notifications",
      description: "View your notifications.",
      path: "/user-dashboard/notifications",
      image: manageLendingImage, // Replace with an appropriate image for notifications
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="container mx-auto px-4 py-6 flex-grow">
        <h1 className="text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text drop-shadow-lg leading-normal">
          User Dashboard
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {cards.map((card) => (
            <div
              key={card.title}
              onClick={() => navigate(card.path)}
              className="bg-gray-800 rounded-lg shadow-lg hover:shadow-xl cursor-pointer transition transform hover:scale-105 overflow-hidden"
            >
              {/* Card Image */}
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-48 object-cover"
              />
              {/* Card Content */}
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4 text-blue-400">
                  {card.title}
                </h2>
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