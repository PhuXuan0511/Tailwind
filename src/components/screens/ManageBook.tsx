import React from "react";
import { Head } from "~/components/shared/Head";
import { Link } from "react-router-dom"; // Import Link

type BookAction = {
  id: string;
  title: string;
  description: string;
  path: string;
};

function ManageBook() {
  const bookActions: BookAction[] = [
    {
      id: "1",
      title: "Update Book Details",
      description: "Modify book information like title, author, and availability.",
      path: "/manage-book/update",
    },
    {
      id: "2",
      title: "View Book List",
      description: "Browse and manage the list of available books.",
      path: "/manage-book/list",
    },
    {
      id: "3",
      title: "Search Book",
      description: "Find books by title, author, or category.",
      path: "/manage-book/search",
    },
  ];

  return (
    <>
      <Head title="Manage Book" />
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold mb-4">Manage Book</h1>
          {/* Grid of Clickable Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookActions.map((action) => (
              <Link to={action.path} key={action.id} className="block">
                <div className="bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-700 p-4 hover:bg-gray-700 transition">
                  <h2 className="text-lg font-bold text-white">{action.title}</h2>
                  <p className="text-gray-400">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default ManageBook;
