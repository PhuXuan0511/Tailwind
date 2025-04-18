import React from "react";
import { useNavigate } from "react-router-dom";
import { Head } from "~/components/shared/Head";

function AdminDashboard() {
  const navigate = useNavigate();

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
        <h1 className="text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text drop-shadow-lg leading-normal">
          Library Management Services
        </h1>
        <div className="grid grid-cols-3 sm:grid-cols-2 gap-5">
          {cards.map((card) => (
            <div
              key={card.title}
              onClick={() => navigate(card.path)}
              className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 cursor-pointer transition transform hover:scale-105 flex items-center justify-between"
            >
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4 text-blue-400">{card.title}</h2>
                <p className="text-base text-gray-400 break-words">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;