import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import library1 from "~/components/image/library1.jpg";
import library2 from "~/components/image/library2.jpg";
import library3 from "~/components/image/library3.jpg";
import library4 from "~/components/image/library4.jpg";
import { NewspaperIcon, InformationCircleIcon, UserGroupIcon, AcademicCapIcon } from "@heroicons/react/24/solid";
import { useAuth } from "~/lib/useAuth";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Homepage() {
  const { role, loading } = useAuth();
  const navigate = useNavigate();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensure the slider only renders on the client side
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show a loading state while role is being fetched
  }

  const cards = [
    {
      title: "Drive-Thru Model",
      description: "Experience our convenient drive-thru service to borrow and return books without leaving your car.",
      path: role === "admin" ? "/admin-dashboard" : "/book-list", // Updated path
      icon: <AcademicCapIcon className="h-12 w-12 text-blue-400 mb-4" />,
    },
    {
      title: "News",
      description: "Stay updated with the latest news and announcements from our library.",
      path: role === "admin" ? "/admin-manage-news" : "/news",
      icon: <NewspaperIcon className="h-12 w-12 text-blue-400 mb-4" />,
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

  const slides = [
    {
      image: library1,
      title: "Drive-Thru Model",
      description:
        "Experience our convenient drive-thru service to borrow and return books without leaving your car.",
    },
    {
      image: library2,
      title: "Explore Our Collection",
      description: "Discover a wide range of books and resources available at our library.",
    },
    {
      image: library3,
      title: "Digital Access",
      description: "Access e-books, audiobooks, and digital resources anytime, anywhere.",
    },
    {
      image: library4,
      title: "Community Events",
      description: "Join exciting events and workshops hosted by our library.",
    },
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    fade: true,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    pauseOnHover: true,
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Hero Slider */}
      {isClient && (
        <div className="relative w-full h-[500px]">
          <Slider {...sliderSettings}>
            {slides.map((slide, index) => (
              <div key={index} className="relative">
                {/* Background Image */}
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-[500px] object-cover"
                />
                {/* Overlay Content */}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center px-4">
                  <h1
                    className="text-4xl sm:text-5xl font-bold text-white mb-4 drop-shadow-lg animate-fade-in"
                    style={{
                      textShadow: "2px 2px 6px rgba(0, 0, 0, 0.8)", // Deep border effect
                    }}
                  >
                    {slide.title}
                  </h1>
                  <p
                    className="text-lg sm:text-xl text-gray-300 max-w-2xl animate-fade-in"
                    style={{
                      textShadow: "1px 1px 4px rgba(0, 0, 0, 0.8)", // Subtle border effect
                    }}
                  >
                    {slide.description}
                  </p>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      )}

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