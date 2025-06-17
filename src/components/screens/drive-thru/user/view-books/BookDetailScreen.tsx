import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "~/lib/firebase";
import BackButton from "~/components/shared/buttons/BackButton";

type Book = {
  id: string;
  isbn: string;
  title: string;
  author: string; // ID
  year: number;
  edition: string;
  category: string; // ID
  quantity: number;
  restrictions: string;
  imageUrl?: string;
};

function BookDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [authorName, setAuthorName] = useState<string>("");
  const [categoryName, setCategoryName] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const bookRef = doc(firestore, "books", id!);
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
            restrictions: data.restrictions,
            imageUrl: data.imageUrl || "",
          });          

          // Fetch author name
          if (data.author) {
            const authorRef = doc(firestore, "authors", data.author);
            const authorSnap = await getDoc(authorRef);
            if (authorSnap.exists()) {
              setAuthorName(authorSnap.data().name || "");
            }
          }

          // Fetch category name
          if (data.category) {
            const categoryRef = doc(firestore, "categories", data.category);
            const categorySnap = await getDoc(categoryRef);
            if (categorySnap.exists()) {
              setCategoryName(categorySnap.data().name || "");
            }
          }
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

  if (loading) {
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
            <p className="text-gray-400 mb-2">by {authorName || "Unknown Author"}</p>
            <p className="text-gray-400 mb-2">ISBN: {book.isbn}</p>
            <p className="text-gray-400 mb-2">Year: {book.year}</p>
            <p className="text-gray-400 mb-2">Edition: {book.edition}</p>
            <p className="text-gray-400 mb-2">Category: {categoryName || "Unknown Category"}</p>
            <p className="text-gray-400 mb-2">Quantity: {book.quantity}</p>
            <p className="text-gray-400">Restrictions: {book.restrictions}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetailScreen;
