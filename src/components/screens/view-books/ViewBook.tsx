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
  author: string; // This will store author name after mapping
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
              imageUrl: data.imageUrl, // Include imageUrl
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
  }, []);

  const fetchBooks = async () => {
    const booksCollection = collection(firestore, "books");
    const snapshot = await getDocs(booksCollection);
    const booksData = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        isbn: data.isbn || "",
        title: data.title || "",
        author: data.author || "Unknown Author",
        year: data.year || 0,
        edition: data.edition || "",
        category: data.category || "Unknown Category",
        quantity: data.quantity || 0,
        restrictions: data.restrictions || "",
        imageUrl: data.imageUrl || "",
      };
    });
    setBooks(booksData);
  };

  const handleRequestToBorrow = async (book: Book) => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        alert("You must be logged in to request a book.");
        return;
      }

      const userId = currentUser.uid;

      await addDoc(collection(firestore, "lendings"), {
        bookId: book.id,
        userId,
        requestDate: new Date().toISOString().split("T")[0],
        returnDate: null,
        status: "Requesting",
      });

      alert(`Book "${book.title}" has been requested for borrowing!`);
    } catch (error) {
      console.error("Error requesting book:", error);
      alert("Failed to request book. Please try again.");
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
        <div className="mb-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
          >
            Back
          </button>
        </div>

        <h1 className="text-3xl font-bold mb-6">View Books</h1>
        <div className="mb-4 flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search by ISBN, Title, Author, or Category"
            value={searchTerm}
            onChange={handleSearch}
            className="p-2 border border-gray-600 rounded w-full max-w-lg bg-gray-700 text-white"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const bookId = "bookId"; // Replace with actual book ID
            }}
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
                      src={book.imageUrl || "https://console.firebase.google.com/u/0/project/new1-4bca7/storage/new1-4bca7.firebasestorage.app/files?fb_gclid=Cj0KCQjwh_i_BhCzARIsANimeoEqktiktQ0pRDUQTtNaOcjXGRBTHOtKYfdXjfUGVfp5GjnOCwy2XKoaAlu4EALw_wcB"} // Fallback to a placeholder image
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
