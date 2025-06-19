import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "~/lib/firebase";
import BackButton from "~/components/shared/buttons/BackButton";
import { createRoot } from 'react-dom/client';

type Book = {
  id: string;
  isbn: string;
  title: string;
  author: string; // ID
  year: number;
  edition: string;
  category: string; // ID
  quantity: number;
  imageUrl?: string;
};

function BookDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [authorName, setAuthorName] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookDetails = async () => {
      if (!id || typeof id !== "string") return; // Prevents error if id is undefined or not a string
      try {
        const bookRef = doc(firestore, "books", id);
        const bookSnap = await getDoc(bookRef);

        if (bookSnap.exists()) {
          const data = bookSnap.data() as Book;
          setBook({
            id: bookSnap.id,
            isbn: data.isbn,
            title: data.title,
            author: data.author,
            year: data.year,
            edition: data.edition,
            category: data.category,
            quantity: data.quantity,
            imageUrl: data.imageUrl || "",
          });

          // Fetch author name
          let fetchedAuthorName = "";
          if (data.author && typeof data.author === "string") {
            console.log("Fetching author for ID:", data.author);
            const authorRef = doc(firestore, "authors", data.author);
            const authorSnap = await getDoc(authorRef);
            if (authorSnap.exists()) {
              fetchedAuthorName = authorSnap.data().name || "";
            } else {
              console.log("Author not found for ID:", data.author);
            }
          }
          setAuthorName(fetchedAuthorName);

          // Fetch category name
          let fetchedCategoryName = "";
          if (data.category && typeof data.category === "string") {
            console.log("Fetching category for ID:", data.category);
            const categoryRef = doc(firestore, "categories", data.category);
            const categorySnap = await getDoc(categoryRef);
            if (categorySnap.exists()) {
              fetchedCategoryName = categorySnap.data().name || "";
            } else {
              console.log("Category not found for ID:", data.category);
            }
          }
          setCategoryName(fetchedCategoryName);
        } else {
          console.error("Book not found.");
        }
      } catch (error) {
        console.error("Error fetching book details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  if (loading || authorName === null || categoryName === null) {
    return <p className="text-center text-gray-300">Loading book details...</p>;
  }

  if (!book) {
    return <p className="text-center text-gray-300">Book not found.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-6">
        <BackButton className="mb-4" onClick={() => navigate(-1)} />
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col sm:flex-row">
          <img
            src={book.imageUrl || "https://via.placeholder.com/150"}
            alt={book.title}
            className="w-full sm:w-1/3 h-auto object-cover rounded mb-4 sm:mb-0 sm:mr-6"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
            <p className="text-gray-400 mb-2">
              by {authorName ? authorName : (book.author ? `Author ID: ${book.author}` : "Unknown Author")}
            </p>
            <p className="text-gray-400 mb-2">ISBN: {book.isbn}</p>
            <p className="text-gray-400 mb-2">Year: {book.year}</p>
            <p className="text-gray-400 mb-2">Edition: {book.edition}</p>
            <p className="text-gray-400 mb-2">
              Category: {categoryName ? categoryName : (book.category ? `: ${book.category}` : "Unknown Category")}
            </p>
            <p className="text-gray-400 mb-2">Quantity: {book.quantity}</p>
          </div>
        </div>
      </div>
    </div>
  );
}


export default BookDetailScreen;
