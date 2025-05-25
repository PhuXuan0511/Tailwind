import React from "react";
import { useNavigate } from "react-router-dom";
import { Head } from "~/components/shared/Head";
import infomiscImage from "~/components/image/infomisc.jpg";
import inforulesImage from "~/components/image/inforules.jpg";

function Information() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Library Rules",
      description: "Regulations and guidelines for library usage.",
      path: "/info-rules",
      image: inforulesImage,
    },
    {
      title: "Miscellaneous",
      description: "Information about other library services.",
      path: "/info-miscellaneous",
      image: infomiscImage,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Head title="Library Management Services" />
      <div className="container mx-auto px-4 py-6 flex-grow">
        <h1 className="text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text drop-shadow-lg leading-normal">
          Library Information
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              onClick={() => navigate(card.path)}
              className="bg-gray-800 rounded-lg shadow-lg hover:shadow-xl cursor-pointer transition transform hover:scale-105 overflow-hidden"
            >
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-40 object-cover"
              />
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

export default Information;