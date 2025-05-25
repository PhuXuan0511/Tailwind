import React from "react";

function AboutUs() {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-black rounded-lg shadow-md mt-8">
      <h1 className="text-2xl font-bold mb-6 text-center">About Us</h1>
        Welcome to our university library initiative—a collaborative project driven by a passionate team of students, faculty, and researchers dedicated to advancing access to knowledge and resources. 
        Our mission is to empower the academic community through innovative digital tools, comprehensive collections, and inclusive learning spaces. 
        At the heart of our project is a shared vision of academic excellence, collaboration, and accessibility. 
        Whether you're a student seeking resources or a researcher exploring new frontiers, our team is here to support and inspire your journey.  
      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Our Team</h2>
        <ul className="list-disc list-inside space-y-1 text-white">
            <li>
            <a href="mailto:10422019@student.vgu.edu.vn" className="text-blue-400 underline">
              Manh Duc, Tran
            </a> - Scrum Master
            </li>
            <li>
            <a href="mailto:10422024@student.vgu.edu.vn" className="text-blue-400 underline">
              Minh Giap, Nguyen
            </a> - Backend Developer
            </li>
            <li>
            <a href="mailto:10422065@student.vgu.edu.vn" className="text-blue-400 underline">
              Xuan Phu, Nguyen
            </a> - Frontend Developer
            </li>
            <li>
            <a href="mailto:10422071@student.vgu.edu.vn" className="text-blue-400 underline">
              Phuc Quy, Tran
            </a> - Database Manager
            </li>
        </ul>
      </section>
    </div>        
  );
}

export default AboutUs;