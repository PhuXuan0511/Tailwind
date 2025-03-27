import React, { useState } from "react";
import { Head } from "~/components/shared/Head";
import { Link } from "react-router-dom"; // Import Link

type ManagementItem = {
  id: string;
  title: string;
  description: string;
  path: string;
};

function Index() {
  const [searchTerm, setSearchTerm] = useState("");

  const managementItems: ManagementItem[] = [
    {
      id: "1",
      title: "Manage User",
      description: "View and manage user accounts, roles, and permissions.",
      path: "/manage-user",
    },
    {
      id: "2",
      title: "Manage Book",
      description: "Add, edit, and remove books from the system.",
      path: "/manage-book", // 👈 This links to ManageBook.tsx
    },
    {
      id: "3",
      title: "Manage Transaction Log",
      description: "Track and review all transactions in the system.",
      path: "/manage-transaction-log",
    },
    {
      id: "4",
      title: "Manage Lending",
      description: "Monitor book lending status and due dates.",
      path: "/manage-lending",
    },
  ];

  const filteredItems = managementItems.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Head title="Management Dashboard" />
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Search */}
        <div className="container mx-auto px-4 py-6">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 rounded w-64"
          />
        </div>

        {/* Grid of Clickable Cards */}
        <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Link to={item.path} key={item.id} className="block">
              <div className="bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-700 p-4 hover:bg-gray-700 transition">
                <h2 className="text-lg font-bold text-white">{item.title}</h2>
                <p className="text-gray-400">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export default Index;
