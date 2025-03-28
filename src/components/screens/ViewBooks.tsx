import React, { useEffect, useState } from "react";
import { useFirestore } from "~/lib/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

type Book = {
  id: string;
  isbn: string;
  title: string;
  author: string;
  year: number;
  edition: string;
  category: string;
  quantity: number;
};

function ViewBooks() {
  const firestore = useFirestore();
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [quantityChanges, setQuantityChanges] = useState<{ [id: string]: number }>({});

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
        setFilteredBooks(booksData); // Initialize filteredBooks with all books
        setLoading(false);
      } catch (error) {
        console.error("Error fetching books:", error);
        setLoading(false);
      }
    };

    fetchBooks();
  }, [firestore]);

  const handleUpdateQuantity = async (id: string, change: number) => {
    const book = books.find((b) => b.id === id);
    if (!book) return;

    const newQuantity = book.quantity + change;
    if (newQuantity < 0) {
      alert("Quantity cannot be negative.");
      return;
    }

    try {
      const bookDoc = doc(firestore, "books", id);
      await updateDoc(bookDoc, {
        quantity: newQuantity,
      });

      // Update the local state
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.id === id ? { ...book, quantity: newQuantity } : book
        )
      );
      setFilteredBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.id === id ? { ...book, quantity: newQuantity } : book
        )
      );

      // Clear the input box for this book
      setQuantityChanges((prev) => ({
        ...prev,
        [id]: 0, // Reset the value for this book
      }));

      alert("Quantity updated successfully.");
    } catch (error) {
      console.error("Error updating book quantity:", error);
      alert("Failed to update book quantity. Check the console for details.");
    }
  };

  const handleQuantityChange = (id: string, value: string) => {
    const parsedValue = parseInt(value, 10);
    setQuantityChanges((prev) => ({
      ...prev,
      [id]: isNaN(parsedValue) ? 0 : parsedValue,
    }));
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

  if (books.length === 0) {
    return <p className="text-center text-gray-300">No books found.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Book List</h1>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by ISBN, Title, Author, or Category"
            value={searchTerm}
            onChange={handleSearch}
            className="p-2 border border-gray-600 rounded w-full bg-gray-700 text-white"
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
                  <td className="border-b border-gray-700 p-2">
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={quantityChanges[book.id] || ""}
                        onChange={(e) => handleQuantityChange(book.id, e.target.value)}
                        className="w-16 text-center mx-2 bg-gray-700 text-white border border-gray-600 rounded"
                        placeholder="Enter"
                      />
                      <button
                        onClick={() =>
                          handleUpdateQuantity(book.id, quantityChanges[book.id] || 0)
                        }
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mx-1"
                      >
                        +
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(book.id, -(quantityChanges[book.id] || 0))
                        }
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 mx-1"
                      >
                        -
                      </button>
                    </div>
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

export default ViewBooks;