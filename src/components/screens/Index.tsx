import React, { useState, useEffect } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthState } from "~/components/contexts/UserContext";
import { Head } from "~/components/shared/Head";
import { useFirestore } from "~/lib/firebase";
import { collection, query, getDocs } from "firebase/firestore";
import clsx from "clsx";

type Tool = {
  id: string;
  title: string;
  description: string;
  url: string;
  semester: string;
  progress: string;
};

function Index() {
  const { state } = useAuthState();
  const [tools, setTools] = useState<Tool[]>([
    {
      id: "1",
      title: "Publer",
      description: "Schedule, collaborate & analyze all your social media posts from the same spot",
      url: "https://publer.io/features/ai-assist",
      semester: "",
      progress: "",
    },
    {
      id: "2",
      title: "LetsAsk AI",
      description: "Create your website's chatbot in minutes",
      url: "https://letsask.ai/",
      semester: "",
      progress: "",
    },
    {
      id: "3",
      title: "Timely",
      description: "An AI-powered automatic time tracker to boost your productivity and save hours daily.",
      url: "https://timelyapp.com/",
      semester: "",
      progress: "",
    },
    {
      id: "4",
      title: "DeepBrain AI",
      description: "An AI-powered tool that helps you convert any text into a compelling video within seconds.",
      url: "https://www.deepbrain.io/",
      semester: "",
      progress: "",
    },
    {
      id: "5",
      title: "Another Tool",
      description: "This is description",
      url: "url",
      semester: "",
      progress: "",
    },
    {
      id: "6",
      title: "Title",
      description: "Description test",
      url: "testurl",
      semester: "",
      progress: "",
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTools = tools.filter((tool) =>
    tool.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Head title="My Courses" />
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Header */}
        <header className="bg-gray-800 shadow">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-orange-600">Vietnamese-German University</h1>
            <nav className="flex gap-6">
              <a href="#" className="text-gray-700 hover:text-orange-600 font-medium">
                Home
              </a>
              <a href="#" className="text-gray-700 hover:text-orange-600 font-medium">
                Dashboard
              </a>
              <a href="#" className="text-orange-600 font-medium border-b-2 border-orange-600">
                My Courses
              </a>
            </nav>
          </div>
        </header>

        {/* Search and Filter */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <select className="p-2 border border-gray-300 rounded">
                <option value="all">All</option>
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
              </select>
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 border border-gray-300 rounded w-64"
              />
            </div>
            <select className="p-2 border border-gray-300 rounded">
              <option value="name">Sort by course name</option>
              <option value="date">Sort by date</option>
            </select>
          </div>
        </div>

        {/* Grid of Cards */}
        <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              className="bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-700 p-4"
            >
              <h2 className="text-lg font-bold text-white">{tool.title}</h2>
              <p className="text-gray-400">{tool.description}</p>
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 mt-2 block"
              >
                {tool.url}
              </a>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Index;
