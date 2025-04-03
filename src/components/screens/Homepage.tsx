import React from "react";
import { useNavigate } from "react-router-dom";
import { Head } from "~/components/shared/Head";
import {PencilSquareIcon} from "@heroicons/react/24/outline";

function Homepage() {
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
    {
      title: "Manage Transaction",
      description: "View and manage all library transactions.",
      path: "/manage-transaction",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-1300 text-">
      <Head title="Library Management" />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text drop-shadow-lg">
          Library Management Services
        </h1>
        <div className="grid grid-cols-3 sm:grid-cols-2 gap-5">
          {cards.map((card) => (
            <div
              key={card.title}
              onClick={() => navigate(card.path)}
              className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 cursor-pointer transition transform hover:scale-105"
            >
              <h2 className="text-2xl font-bold mb-4 text-blue-400">{card.title}</h2>
              <p className="text-base text-gray-400">{card.description}</p>
              <PencilSquareIcon className="w-6 h-6 text-blue-400 mt-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Homepage;
