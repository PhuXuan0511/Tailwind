import React, { useEffect, useState } from "react";
import { collection, addDoc, onSnapshot, getDocs } from "firebase/firestore";
import { firestore } from "~/lib/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
  imageUrl?: string;
};

function ViewBook() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    const fetchBooks = async () => {
      try {
        const booksCollection = collection(firestore, "books");
        unsubscribe = onSnapshot(booksCollection, (snapshot) => {
          const booksData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Book[];
          setBooks(booksData);
          setFilteredBooks(booksData); // Initialize filteredBooks with all books
          setLoading(false);
        });
      } catch (error) {
        console.error("Error fetching books:", error);
        setLoading(false);
      }
      
        const fetchBooksAuthorsAndCategories = async () => {
          try {
            // Step 1: Get all authors and build a mapping
            const authorsSnapshot = await getDocs(collection(firestore, "authors"));
            const authorMap: Record<string, string> = {};
            authorsSnapshot.forEach((doc) => {
              authorMap[doc.id] = doc.data().name;
            });
      
            // Step 2: Get all categories and build a mapping
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
                  author: authorMap[data.author] || "Unknown Author",
                  year: data.year,
                  edition: data.edition,
                  category: categoryMap[data.category] || "Unknown Category", // Map category
                  quantity: data.quantity,
                  restrictions: data.restrictions,
                  imageUrl: data.imageUrl || "https://firebasestorage.googleapis.com/v0/b/your-project-id.appspot.com/o/images%2Fbook-cover.jpg?alt=media", // Default image URL
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
      
          fetchBooksAuthorsAndCategories();
        };
  
        fetchBooks();
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
      const lendingRequest = {
        bookId: book.id,
        userId: "currentUserId", // Replace with the actual logged-in user's ID
        requestDate: new Date().toISOString().split("T")[0],
        returnDate: null,
        status: "Requesting",
      };

      await addDoc(collection(firestore, "lendings"), lendingRequest);
      toast.success(`Request to borrow "${book.title}" submitted successfully!`);
    } catch (error) {
      console.error("Error creating lending request:", error);
      toast.error("Failed to submit request. Please try again.");
    }
  };

  if (loading) {
    return <p className="text-center text-gray-300">Loading books...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Books</h1>
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
              className="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition flex flex-col sm:flex-row"
            >
              {/* Book Image */}
              <img
                src={book.imageUrl || "https://via.placeholder.com/150"}
                alt={book.title}
                className="w-32 h-48 object-cover rounded sm:mr-6"
              />
              {/* Book Details */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{book.title}</h2>
                <p className="text-gray-400 mb-1">by {book.author}</p>
                <p className="text-gray-400 mb-1">Category: {book.category}</p>
                <p className="text-gray-400 mb-1">Year: {book.year}</p>
                <p className="text-gray-400 mb-1">Edition: {book.edition}</p>
                <p className="text-gray-400 mb-1">Quantity: {book.quantity}</p>
                <div className="mt-4 flex space-x-2">
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ViewBook;
