import React, { useState, useEffect } from "react";
import { useFirestore } from "~/lib/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

function AddBookScreen() {
  const firestore = useFirestore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    isbn: "",
    title: "",
    author: "",
    year: "",
    edition: "",
    quantity: "",
  });

  const [selectedCategories, setSelectedCategories] = useState<{ id: string; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]); // State for categories with both id and name
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Fetch categories from Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesCollection = collection(firestore, "categories");
        const categorySnapshot = await getDocs(categoriesCollection);
        const categoryList = categorySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name, // Assuming the category name is stored in the "name" field
        }));
        setCategories(categoryList);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories.");
      }
    };

    fetchCategories();
  }, [firestore]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageFile(file || null);
  };

  // Handle category selection and add it to the list
  const handleCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    const selectedCategory = categories.find((category) => category.id === selectedValue);
    if (selectedCategory && !selectedCategories.some((cat) => cat.id === selectedCategory.id)) {
      setSelectedCategories((prev) => [...prev, selectedCategory]);
    }
  };

  // Remove category from selected list
  const handleCategoryRemove = (categoryId: string) => {
    setSelectedCategories((prev) => prev.filter((item) => item.id !== categoryId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const booksCollection = collection(firestore, "books");
      const authorsCollection = collection(firestore, "authors");
  
      // Handle image upload
      let imageUrl = "";
      if (imageFile) {
        const storage = getStorage();
        const storageRef = ref(storage, `books/${formData.isbn}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }
  
      // Check if author exists or create new one
      let authorId = "";
      const authorsSnapshot = await getDocs(authorsCollection);
      const existingAuthor = authorsSnapshot.docs.find(
        doc => doc.data().name.toLowerCase() === formData.author.trim().toLowerCase()
      );
      if (existingAuthor) {
        authorId = existingAuthor.id;
      } else {
        const newAuthorDoc = await addDoc(authorsCollection, {
          name: formData.author.trim(),
        });
        authorId = newAuthorDoc.id;
      }
  
      // Add the new book
      await addDoc(booksCollection, {
        isbn: formData.isbn,
        title: formData.title,
        author: authorId,
        year: parseInt(formData.year, 10),
        edition: formData.edition,
        quantity: parseInt(formData.quantity, 10),
        restrictions: "",
        imageUrl,
        category: selectedCategories[0]?.id || "", // If using one category
        // For multiple: categories: selectedCategories.map(c => c.id)
      });
  
      toast.success("Book added successfully!");
      navigate("/manage-book");
    } catch (error) {
      console.error("Error adding book:", error);
      toast.error("Failed to add book.");
    }
  };
  
  

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Add New Book</h1>
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

          {/* Category Dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Select Category</label>
            <select
              value=""
              onChange={handleCategorySelect}
              className="p-2 border border-gray-600 rounded w-full bg-gray-700 text-white"
            >
              <option value="">Choose a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Display Selected Categories */}
          <div className="mb-4">
            <h3 className="text-sm font-medium">Selected Categories:</h3>
            <ul className="list-disc pl-6">
              {selectedCategories.map((category) => (
                <li key={category.id} className="flex items-center justify-between">
                  <span>{category.name}</span>
                  <button
                    type="button"
                    onClick={() => handleCategoryRemove(category.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
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

          {/* Image Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Image</label>
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
            Add Book
          </button>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
}

export default AddBookScreen;
