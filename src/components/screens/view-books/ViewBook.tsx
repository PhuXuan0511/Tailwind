import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore"; // Added addDoc
import { firestore } from "~/lib/firebase";
import { Head } from "~/components/shared/Head";
import { getAuth } from "firebase/auth"; // Import Firebase Auth

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

function ViewBook() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksCollection = collection(firestore, "books");
        const snapshot = await getDocs(booksCollection);
        const booksData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Book[];
        setBooks(booksData);
        setFilteredBooks(booksData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching books:", error);
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleRequestToBorrow = async (book: Book) => {
    try {
      const auth = getAuth(); // Get the Firebase Auth instance
      const currentUser = auth.currentUser; // Get the currently logged-in user

      if (!currentUser) {
        alert("You must be logged in to request a book.");
        return;
      }

      const userId = currentUser.uid; // Get the user ID from the logged-in user

      // Add a new document to the "lendings" collection
      const lendingsCollection = collection(firestore, "lendings");
      await addDoc(lendingsCollection, {
        bookId: book.id, // Store the book ID
        userId: userId, // Store the current user's ID
        borrowDate: new Date().toISOString().split("T")[0], // Current date
        returnDate: null,
        status: "Requesting",
      });

      alert(`Book "${book.title}" has been requested for borrowing!`);
    } catch (error) {
      console.error("Error adding book to lendings:", error);
      alert("Failed to request book for borrowing. Please try again.");
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
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

  if (loading) {
    return <p className="text-center text-gray-300">Loading books...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head title="View Books" />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">View Books</h1>
        <div className="mb-4 flex items-center space-x-4">
          {/* Search Box */}
          <input
            type="text"
            placeholder="Search by ISBN, Title, Author, or Category"
            value={searchTerm}
            onChange={handleSearch}
            className="p-2 border border-gray-600 rounded w-full max-w-lg bg-gray-700 text-white"
          />
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
                <th className="border-b border-gray-700 p-2">Actions</th> {/* New column */}
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
                      onClick={() => handleRequestToBorrow(book)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Request to Borrow
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredBooks.length === 0 && (
          <p className="text-center text-gray-400 mt-6">No books found.</p>
        )}
      </div>
    </div>
  );
}

export default ViewBook;
