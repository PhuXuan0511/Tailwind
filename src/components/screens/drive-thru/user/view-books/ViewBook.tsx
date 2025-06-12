import React, { useEffect, useState } from "react";
import { collection, addDoc, onSnapshot, getDocs, doc, getDoc } from "firebase/firestore";
import { firestore } from "~/lib/firebase";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { getAuth } from "firebase/auth";

type Book = {
  id: string;
  isbn: string;
  title: string;
  author: string[]; // Array of Author IDs from Firestore
  year: number;
  edition: string;
  category: string[]; // Array of category IDs
  quantity: number;
  restrictions: string;
  imageUrl?: string;
};

function ViewBook() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [authorMap, setAuthorMap] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuthorsAndCategories = async () => {
      try {
        // Step 1: Fetch all authors and build a mapping
        const authorsSnapshot = await getDocs(collection(firestore, "authors"));
        const authorMapping: Record<string, string> = {};
        authorsSnapshot.forEach((doc) => {
          authorMapping[doc.id] = doc.data().name;
        });
        setAuthorMap(authorMapping);

        // Step 2: Fetch all categories and build a mapping
        const categoriesSnapshot = await getDocs(collection(firestore, "categories"));
        const categoryMap: Record<string, string> = {};
        categoriesSnapshot.forEach((doc) => {
          categoryMap[doc.id] = doc.data().name;
        });

        // Step 3: Real-time listen to books collection
        const booksCollection = collection(firestore, "books");
        const unsubscribe = onSnapshot(booksCollection, (snapshot) => {
          const booksData = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              isbn: data.isbn,
              title: data.title,
              author: Array.isArray(data.author)
                ? data.author.map((authorId: string) => authorMapping[authorId] || "Unknown Author")
                : ["Unknown Author"], // Ensure `author` is an array
              year: data.year,
              edition: data.edition,
              category: Array.isArray(data.category)
                ? data.category.map((categoryId: string) => categoryMap[categoryId] || "Unknown Category")
                : ["Unknown Category"], // Ensure `category` is an array
              quantity: data.quantity,
              restrictions: data.restrictions,
              imageUrl: data.imageUrl || "https://via.placeholder.com/150",
            };
          });

          setBooks(booksData);
          setFilteredBooks(booksData);
          setLoading(false);
        });

        // Cleanup listener on component unmount
        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchAuthorsAndCategories();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredBooks(
      books.filter((book) =>
        book.title.toLowerCase().includes(term)
      )
    );
  };

  const handleRequestToBorrow = async (book: Book) => {
    try {
      // Show a confirmation dialog
      const confirmRequest = window.confirm(`Are you sure you want to request "${book.title}"?`);
      if (!confirmRequest) {
        return; // Exit if the user cancels the request
      }

      const auth = getAuth(); // Get Firebase Auth instance
      const currentUser = auth.currentUser; // Get the currently logged-in user

      if (!currentUser) {
        // Redirect to login if the user is not logged in
        toast.error("You must be logged in to borrow a book.");
        navigate("/login"); // Redirect to the login page
        return;
      }

      const lendingRequest = {
        bookId: book.id,
        userId: currentUser.uid, // Use the logged-in user's ID
        requestDate: new Date().toISOString().split("T")[0],
        returnDate: null,
        status: "Requesting",
        overdueFee: 0,
        notified: false, // Add notified field
      };

      await addDoc(collection(firestore, "lendings"), lendingRequest);

      // Show a success notification
      toast.success(`Request to borrow "${book.title}" submitted successfully!`);
    } catch (error) {
      console.error("Error creating lending request:", error);
      toast.error("Failed to submit request. Please try again."); // Show error notification
    }
  };

  if (loading) {
    return <p className="text-center text-gray-300">Loading books...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <ToastContainer />
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <div className="mb-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
          >
            Back
          </button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">Books</h1>
            <button
              onClick={() => navigate("/user-dashboard/lending-list")}
              className="ml-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              My Lending
            </button>
          </div>
          <input
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={handleSearch}
            className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition relative flex flex-col min-h-[350px]" // Increased minimum height
            >
              <div className="flex">
                {/* Book Image */}
                <img
                  src={book.imageUrl || "https://via.placeholder.com/150"}
                  alt={book.title}
                  className="w-32 h-48 object-cover rounded mr-4"
                />
                {/* Book Details */}
                <div className="flex-1 flex flex-col">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{book.title}</h2>
                    <p className="text-gray-400 mb-1">by {book.author.join(", ")}</p>
                    <p className="text-gray-400 mb-1">Categories: {book.category.join(", ")}</p>
                    <p className="text-gray-400 mb-1">Year: {book.year}</p>
                    <p className="text-gray-400 mb-1">Edition: {book.edition}</p>
                    <p className="text-gray-400 mb-1">Quantity: {book.quantity}</p>
                  </div>
                </div>
              </div>
              {/* Buttons */}
              <div className="mt-auto flex justify-end space-x-2">
                <button
                  onClick={() => navigate(`/user-dashboard/book-detail/${book.id}`)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Preview
                </button>
                <button
                  onClick={() => handleRequestToBorrow(book)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Request to Borrow
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ViewBook;
