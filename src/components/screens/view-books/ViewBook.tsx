import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc, onSnapshot, doc, setDoc } from "firebase/firestore"; // Added doc and setDoc
import { firestore } from "~/lib/firebase";
import { Head } from "~/components/shared/Head";
import { getAuth } from "firebase/auth"; // Import Firebase Auth
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import Firebase Storage

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
  imageUrl?: string; // Added imageUrl property
};

function ViewBook() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const booksCollection = collection(firestore, "books");

    // Use onSnapshot to listen for real-time updates
    const unsubscribe = onSnapshot(booksCollection, (snapshot) => {
      const booksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Book[];
      setBooks(booksData);
      setFilteredBooks(booksData); // Initialize filteredBooks with all books
      setLoading(false);
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
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
        requestDate: new Date().toISOString().split("T")[0], // Current date as the request date
        returnDate: null, // Return date is null by default
        status: "Requesting", // Initial status
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const storage = getStorage();
      const storageRef = ref(storage, `books/${file.name}`); // Save the file in the "books" folder
      await uploadBytes(storageRef, file);

      const imageUrl = await getDownloadURL(storageRef); // Get the image URL
      console.log("Image URL:", imageUrl);

      // Save the imageUrl to Firestore (example)
      const bookDoc = doc(firestore, "books", "bookId"); // Replace "bookId" with the actual book ID
      await setDoc(bookDoc, { imageUrl }, { merge: true });

      alert("Image uploaded and URL saved successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    }
  };

  if (loading) {
    return <p className="text-center text-gray-300">Loading books...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head title="View Books" />
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <div className="mb-4">
          <button
            onClick={() => navigate(-1)} // Navigate to the previous page
            className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
          >
            Back
          </button>
        </div>

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
                <th className="border-b border-gray-700 p-2">Image</th>
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
                    <img
                      src={book.imageUrl || "https://via.placeholder.com/150"} // Fallback to a placeholder image
                      alt={book.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
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
