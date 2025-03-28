import React from "react";
import { Link } from "react-router-dom";

function UpdateBook() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Update Book Details</h1>
        <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
          <p className="mb-4 text-gray-300">
            Here you can update book details or add a new book to the system.
          </p>
          <Link
            to="/manage-book/update/add"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Add New Book
          </Link>
        </div>
      </div>
    </div>
  );
}

export default UpdateBook;