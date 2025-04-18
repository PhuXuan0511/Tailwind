import React, { useEffect, useState } from "react";
import { useFirestore } from "~/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import Firebase Storage
import { useNavigate, useParams } from "react-router-dom";

function EditBookScreen() {
  const firestore = useFirestore();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState({
    isbn: "",
    title: "",
    author: "",
    year: "",
    edition: "",
    category: "",
    quantity: "",
    restrictions: "",
    imageUrl: "", // Add imageUrl to the form data
  });

  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null); // State for the new image file

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const bookDoc = doc(firestore, "books", id!);
        const bookSnapshot = await getDoc(bookDoc);

        if (bookSnapshot.exists()) {
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
            imageUrl: bookData.imageUrl || "", // Populate imageUrl
          });
        } else {
          alert("Book not found!");
          navigate("/"); // Redirect if the book doesn't exist
        }
      } catch (error) {
        console.error("Error fetching book:", error);
        alert("Failed to fetch book details. Check the console for details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [firestore, id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageFile(file || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const bookDoc = doc(firestore, "books", id!);

      // Upload the new image to Firebase Storage if a new image is selected
      let imageUrl = formData.imageUrl; // Keep the existing imageUrl if no new image is uploaded
      if (imageFile) {
        const storage = getStorage();
        const storageRef = ref(storage, `books/${formData.isbn}`); // Use ISBN as the file name
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef); // Get the new image URL
      }

      // Update the book document in Firestore
      await updateDoc(bookDoc, {
        ...formData,
        year: parseInt(formData.year, 10),
        quantity: parseInt(formData.quantity, 10),
        imageUrl, // Update the imageUrl
      });

      alert("Book updated successfully!");
      navigate("/manage-book");
    } catch (error) {
      console.error("Error updating book:", error);
      alert("Failed to update book. Check the console for details.");
    }
  };

  if (loading) {
    return <p className="text-center text-gray-300">Loading book details...</p>;
  }

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

          {/* Image Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Image</label>
            {formData.imageUrl && (
              <img
                src={formData.imageUrl}
                alt={formData.title}
                className="w-32 h-32 object-cover rounded mb-2"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="p-2 border border-gray-600 rounded w-full bg-gray-700 text-white"
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