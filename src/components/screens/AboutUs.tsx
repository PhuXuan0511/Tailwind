import React from "react";
import { useNavigate } from "react-router-dom";
import manageAuthorImg from "~/components/image/manageauthor.jpg";

function AboutUs() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-1000 text-slate flex flex-col items-start justify-start px-4">
      <h1 className="text-4xl font-bold mb-6 text-left self-start ml-4 mt-4 text-blue-500">About Us</h1>
      <p className="text-lg text-gray-450 max-w-4xl text-center leading-relaxed">
        Welcome to our university library initiative—a collaborative project driven by a passionate team of students, faculty, and researchers dedicated to advancing access to knowledge and resources. 
        Our mission is to empower the academic community through innovative digital tools, comprehensive collections, and inclusive learning spaces. 
        At the heart of our project is a shared vision of academic excellence, collaboration, and accessibility. 
        Whether you're a student seeking resources or a researcher exploring new frontiers, our team is here to support and inspire your journey.
      </p>
    </div>
  );
}

export default AboutUs;