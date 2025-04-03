import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFirestore } from "~/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Head } from "~/components/shared/Head";

// Define the structure of a Book object
type Book = {
  id: string;
  isbn: string;
  title: string;
  author: string;
  year: number;
  edition: string;
  category: string;
  quantity: number;
  restrictions: string;
};

function ManageBook() {
  // Initialize Firestore instance
  const firestore = useFirestore();

  // State to store all books fetched from Firestore
  const [books, setBooks] = useState<Book[]>([]);

  // State to store filtered books based on search input
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);

  // State to store the current search term
  const [searchTerm, setSearchTerm] = useState("");

  // State to track whether data is still loading
  const [loading, setLoading] = useState(true);

  // React Router's navigate function for programmatic navigation
  const navigate = useNavigate();

  // Fetch books from Firestore when the component mounts
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // Reference the "books" collection in Firestore
        const booksCollection = collection(firestore, "books");

        // Fetch all documents in the "books" collection
        const snapshot = await getDocs(booksCollection);

        // Map the documents to an array of Book objects
        const booksData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Book[];

        // Update state with the fetched books
        setBooks(booksData);

        // Initialize filteredBooks with all books
        setFilteredBooks(booksData);

        // Set loading to false after data is fetched
        setLoading(false);
      } catch (error) {
        console.error("Error fetching books:", error);

        // Set loading to false if an error occurs
        setLoading(false);
      }
    };

    fetchBooks();
  }, [firestore]);

  // Handle search input and filter books based on the search term
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    // Filter books based on ISBN, title, author, or category
    setFilteredBooks(
      books.filter(
        (book) =>
          book.isbn.toLowerCase().includes(term) ||
          book.title.toLowerCase().includes(term) ||
          book.author.toLowerCase().includes(term) ||
          book.category.toLowerCase().includes(term)
      )
    );
  };

  // Show a loading message while data is being fetched
  if (loading) {
    return <p className="text-center text-gray-300">Loading books...</p>;
  }

  // Render the ManageBook UI
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Set the page title */}
      <Head title="Manage Books" />

      <div className="container mx-auto px-4 py-6">
        {/* Back to Homepage Button */}
        <div className="mb-4">
          <button
            onClick={() => navigate("/")}
            className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
          >
            Back
          </button>
        </div>
        <h1 className="text-3xl font-bold mb-6">Manage Books</h1>
        <div className="mb-4 flex items-center space-x-4">
          {/* Search Box */}
          <input
            type="text"
            placeholder="Search by ISBN, Title, Author, or Category"
            value={searchTerm}
            onChange={handleSearch}
            className="p-2 border border-gray-600 rounded w-full max-w-lg bg-gray-700 text-white"
          />
          {/* Add New Book Button */}
          <button
            onClick={() => navigate("/manage-book/add")}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
          >
            Add New Book
          </button>
        </div>
        <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b border-gray-700 p-2">ISBN</th>
                <th className="border-b border-gray-700 p-2">Title</th>
                <th className="border-b border-gray-700 p-2">Author</th>
                <th className="border-b border-gray-700 p-2">Year</th>
                <th className="border-b border-gray-700 p-2">Edition</th>
                <th className="border-b border-gray-700 p-2">Category</th>
                <th className="border-b border-gray-700 p-2">Quantity</th>
                <th className="border-b border-gray-700 p-2">Restrictions</th>
                <th className="border-b border-gray-700 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book) => (
                <tr key={book.id}>
                  <td className="border-b border-gray-700 p-2">{book.isbn}</td>
                  <td className="border-b border-gray-700 p-2">{book.title}</td>
                  <td className="border-b border-gray-700 p-2">{book.author}</td>
                  <td className="border-b border-gray-700 p-2">{book.year}</td>
                  <td className="border-b border-gray-700 p-2">{book.edition}</td>
                  <td className="border-b border-gray-700 p-2">{book.category}</td>
                  <td className="border-b border-gray-700 p-2">{book.quantity}</td>
                  <td className="border-b border-gray-700 p-2">{book.restrictions}</td>
                  <td className="border-b border-gray-700 p-2">
                    <button
                      onClick={() => navigate(`/manage-book/edit/${book.id}`)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManageBook;