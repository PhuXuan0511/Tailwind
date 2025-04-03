import React, { useEffect, useState } from "react";
import { useFirestore } from "~/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";

// Component for editing an existing book
function EditBookScreen() {
  // Initialize Firestore instance
  const firestore = useFirestore();

  // Initialize navigation hook to redirect users after editing a book
  const navigate = useNavigate();

  // Get the book ID from the URL parameters
  const { id } = useParams<{ id: string }>();

  // State to manage form data for the book being edited
  const [formData, setFormData] = useState({
    isbn: "",
    title: "",
    author: "",
    year: "",
    edition: "",
    category: "",
    quantity: "",
    restrictions: "",
  });

  // State to manage the loading state while fetching book details
  const [loading, setLoading] = useState(true);

  // Fetch the book details from Firestore when the component mounts
  useEffect(() => {
    const fetchBook = async () => {
      try {
        // Reference the specific book document in Firestore
        const bookDoc = doc(firestore, "books", id!);

        // Fetch the book document
        const bookSnapshot = await getDoc(bookDoc);

        if (bookSnapshot.exists()) {
          // If the book exists, populate the form with its data
          const bookData = bookSnapshot.data();
          setFormData({
            isbn: bookData.isbn || "",
            title: bookData.title || "",
            author: bookData.author || "",
            year: bookData.year?.toString() || "",
            edition: bookData.edition || "",
            category: bookData.category || "",
            quantity: bookData.quantity?.toString() || "",
            restrictions: bookData.restrictions || "",
          });
        } else {
          // If the book doesn't exist, show an alert and redirect to the homepage
          alert("Book not found!");
          navigate("/"); // Redirect back to ManageBook if the book doesn't exist
        }
      } catch (error) {
        // Handle errors during the Firestore operation
        console.error("Error fetching book:", error);
        alert("Failed to fetch book details. Check the console for details.");
      } finally {
        // Set loading to false after fetching the book
        setLoading(false);
      }
    };

    fetchBook();
  }, [firestore, id, navigate]);

  // Handle changes in form inputs and update the state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission to update the book in Firestore
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      // Reference the specific book document in Firestore
      const bookDoc = doc(firestore, "books", id!);

      // Update the book document with the new form data
      await updateDoc(bookDoc, {
        ...formData,
        year: parseInt(formData.year, 10), // Convert year to a number
        quantity: parseInt(formData.quantity, 10), // Convert quantity to a number
      });

      // Show success message and redirect to the ManageBook page
      alert("Book updated successfully!");
      navigate("/manage-book");
    } catch (error) {
      // Handle errors during the Firestore operation
      console.error("Error updating book:", error);
      alert("Failed to update book. Check the console for details.");
    }
  };

  // Show a loading message while fetching book details
  if (loading) {
    return <p className="text-center text-gray-300">Loading book details...</p>;
  }

  // Render the form for editing the book
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Edit Book</h1>
        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow">
          {/* ISBN Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">ISBN</label>
            <input
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              className="p-2 border border-gray-600 rounded w-full bg-gray-700 text-white"
              required
            />
          </div>

          {/* Title Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="p-2 border border-gray-600 rounded w-full bg-gray-700 text-white"
              required
            />
          </div>

          {/* Author Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Author</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="p-2 border border-gray-600 rounded w-full bg-gray-700 text-white"
              required
            />
          </div>

          {/* Year Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Year</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="p-2 border border-gray-600 rounded w-full bg-gray-700 text-white"
              required
            />
          </div>

          {/* Edition Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Edition</label>
            <input
              type="text"
              name="edition"
              value={formData.edition}
              onChange={handleChange}
              className="p-2 border border-gray-600 rounded w-full bg-gray-700 text-white"
              required
            />
          </div>

          {/* Category Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="p-2 border border-gray-600 rounded w-full bg-gray-700 text-white"
              required
            />
          </div>

          {/* Quantity Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="p-2 border border-gray-600 rounded w-full bg-gray-700 text-white"
              required
            />
          </div>

          {/* Restrictions Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Restrictions</label>
            <textarea
              name="restrictions"
              value={formData.restrictions}
              onChange={handleChange}
              className="p-2 border border-gray-600 rounded w-full bg-gray-700 text-white"
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Update Book
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditBookScreen;