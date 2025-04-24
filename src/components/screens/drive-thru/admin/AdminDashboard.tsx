import React from "react";
import { useNavigate } from "react-router-dom";
import { Head } from "~/components/shared/Head";
import manageBookImage from "~/components/image/managebook.jpg";
import manageUserImage from "~/components/image/manageuser.jpg";
import manageLendingImage from "~/components/image/managelending.jpg";

function AdminDashboard() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Manage Book",
      description: "View, add, edit, or delete books in the library.",
      path: "/manage-book",
      image: manageBookImage,
    },
    {
      title: "Manage User",
      description: "Manage library users and their details.",
      path: "/manage-user",
      image: manageUserImage,
    },
    {
      title: "Manage Lending",
      description: "Track and manage book lending records.",
      path: "/manage-lending",
      image: manageLendingImage,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Head title="Library Management Services" />
      <div className="container mx-auto px-4 py-6 flex-grow">
        <h1 className="text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text drop-shadow-lg leading-normal">
          Library Management Services
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                className="w-full h-40 object-cover"
              />
              {/* Card Content */}
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2 text-blue-400">
                  {card.title}
                </h2>
                <p className="text-gray-400 text-sm">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;