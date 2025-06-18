import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFirestore } from "~/lib/firebase";
import { collection, onSnapshot, deleteDoc, doc, setDoc, getDocs } from "firebase/firestore";
import { Head } from "~/components/shared/Head";
import { toast, ToastContainer } from "react-toastify";
import Loader from "~/components/common/Loader"; // Add this import
import BackButton from "~/components/shared/buttons/BackButton";
import AddButton from "~/components/shared/buttons/AddButton";
// Define the structure of a Book object
type Book = {
  id: string;
  isbn: string;
  title: string;
  author: string[]; // Changed to array of author IDs
  year: number;
  edition: number;
  category: string[]; // Changed to array of category IDs
  quantity: number;
};

type Category = {
  id: string;
  name: string;
};

type Author = {
  id: string;
  name: string;
};

function ManageBook() {
  const firestore = useFirestore();
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch categories and authors from Firestore
  useEffect(() => {
    const fetchCategoriesAndAuthors = async () => {
      try {
        // Fetch categories
        const categoriesCollection = collection(firestore, "categories");
        const categorySnapshot = await getDocs(categoriesCollection);
        const categoryList = categorySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setCategories(categoryList);

        // Fetch authors
        const authorsCollection = collection(firestore, "authors");
        const authorSnapshot = await getDocs(authorsCollection);
        const authorList = authorSnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setAuthors(authorList);
      } catch (error) {
        console.error("Error fetching categories and authors:", error);
      }
    };

    fetchCategoriesAndAuthors();
  }, [firestore]);

  // Use `onSnapshot` to listen for real-time updates
  useEffect(() => {
    const booksCollection = collection(firestore, "books");

    // Set up the real-time listener
    const unsubscribe = onSnapshot(booksCollection, (snapshot) => {
      const booksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Book[];
      setBooks(booksData);
      setFilteredBooks(booksData);
      setLoading(false);
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, [firestore]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    // Filter books based on ISBN, title, author, or category
    setFilteredBooks(
      books.filter(
        (book) =>
          book.isbn.toLowerCase().includes(term) ||
          book.title.toLowerCase().includes(term) ||
          book.author.some((author) => author.toLowerCase().includes(term)) ||
          book.category.some((category) => category.toLowerCase().includes(term))
      )
    );
  };

  const handleDeleteBook = async (bookId: string) => {
    try {
      const bookDoc = doc(firestore, "books", bookId);
      await deleteDoc(bookDoc);
      alert("Book deleted successfully.");
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Failed to delete book. Please try again.");
    }
  };

  const handleAddOrEditBook = async (book: Book) => {
    if (!["horror", "action", "romance", "education"].every((category) => book.category.includes(category))) {
      alert("Invalid category. Please select one of the following: horror, action, romance, education.");
      return;
    }

    try {
      // Add or update the book in Firestore
      const bookDoc = book.id
        ? doc(firestore, "books", book.id) // Update existing book
        : doc(collection(firestore, "books")); // Add new book

      await setDoc(bookDoc, {
        isbn: book.isbn,
        title: book.title,
        authors: book.author,
        year: book.year,
        edition: book.edition,
        categories: book.category,
        quantity: book.quantity,
      });

      alert(book.id ? "Book updated successfully." : "Book added successfully.");
      navigate("/manage-books");
    } catch (error) {
      console.error("Error saving book:", error);
      alert("Failed to save book. Please try again.");
    }
  };

  const handleBookAction = (action: string, bookId: string) => {
    if (action === "edit") {
      navigate(`/manage-book/edit/${bookId}`);
    } else if (action === "delete") {
      const confirmDelete = window.confirm("Are you sure you want to delete this book?");
      if (confirmDelete) {
        handleDeleteBook(bookId);
      }
    }
  };

  // Helper function to get category names from category IDs
  const getCategoryNames = (categoryIds: string[]) => {
    return categoryIds
      .map((categoryId) => categories.find((cat) => cat.id === categoryId)?.name || "Unknown")
      .join(", ");
  };

  // Helper function to get author names from author IDs
  const getAuthorNames = (authorIds: string[]) => {
    return authorIds
      .map((authorId) => authors.find((auth) => auth.id === authorId)?.name || "Unknown")
      .join(", ");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head title="Manage Books" />
      <ToastContainer />
      <div className="container mx-auto px-4 py-6">
        {/* Back to Homepage Button */}
        <BackButton className="mb-4"/>
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
          <AddButton onClick={() => navigate("/manage-book/add")} />
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
                  <td className="border-b border-gray-700 p-2">{getAuthorNames(book.author)}</td>
                  <td className="border-b border-gray-700 p-2">{book.year}</td>
                  <td className="border-b border-gray-700 p-2">{book.edition}</td>
                  <td className="border-b border-gray-700 p-2">{getCategoryNames(book.category)}</td>
                  <td className="border-b border-gray-700 p-2">{book.quantity}</td>
                  <td className="border-b border-gray-700 p-2">
                    <select
                      onChange={(e) => handleBookAction(e.target.value, book.id)}
                      className="bg-gray-700 text-white p-2 rounded"  
                    >
                      <option value="">Select Action</option>
                      <option value="edit">Edit</option>
                      <option value="delete">Delete</option>
                    </select>
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
