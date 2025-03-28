import React, { useState } from "react";
import { useFirestore } from "~/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

function AddBook() {
  const firestore = useFirestore();
  const [isbn, setIsbn] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState<number | "">("");
  const [edition, setEdition] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");

  const handleAddBook = async () => {
    if (!isbn || !title || !author || !year || !edition || !category || !quantity) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const book = {
        isbn,
        title,
        author,
        year: Number(year),
        edition,
        category,
        quantity: Number(quantity),
        createdAt: new Date(),
      };
      const booksCollection = collection(firestore, "books");
      const docRef = await addDoc(booksCollection, book);
      alert(`Book added successfully with ID: ${docRef.id}`);
      setIsbn("");
      setTitle("");
      setAuthor("");
      setYear("");
      setEdition("");
      setCategory("");
      setQuantity("");
    } catch (error) {
      console.error("Error adding book:", error);
      alert("Failed to add book. Check the console for details.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Add a New Book</h1>
        <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">ISBN</label>
            <input
              type="text"
              placeholder="ISBN"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              className="p-2 border border-gray-600 rounded w-full bg-gray-700 text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-2 border border-gray-600 rounded w-full bg-gray-700 text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Author</label>
            <input
              type="text"
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="p-2 border border-gray-600 rounded w-full bg-gray-700 text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Year</label>
            <input
              type="number"
              placeholder="Year"
              value={year}
              onChange={(e) => setYear(e.target.value ? Number(e.target.value) : "")}
              className="p-2 border border-gray-600 rounded w-full bg-gray-700 text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Edition</label>
            <input
              type="text"
              placeholder="Edition"
              value={edition}
              onChange={(e) => setEdition(e.target.value)}
              className="p-2 border border-gray-600 rounded w-full bg-gray-700 text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-2 border border-gray-600 rounded w-full bg-gray-700 text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : "")}
              className="p-2 border border-gray-600 rounded w-full bg-gray-700 text-white"
            />
          </div>
          <button
            onClick={handleAddBook}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Book
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddBook;