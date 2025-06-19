import React, { useState, useEffect } from "react";
import { useFirestore } from "~/lib/firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import BackButton from "~/components/shared/buttons/BackButton";
// --- ISBN validation function ---
function isValidISBN(isbn: string): boolean {
  const clean = isbn.replace(/[-\s]/g, "");

  // ISBN-10: 10 digits, last can be X
  if (/^\d{9}[\dX]$/.test(clean)) {
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += (i + 1) * parseInt(clean[i]);
    sum += clean[9] === "X" ? 10 * 10 : 10 * parseInt(clean[9]);
    return sum % 11 === 0;
  }

  // ISBN-13: 13 digits
  if (/^\d{13}$/.test(clean)) {
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(clean[i]) * (i % 2 === 0 ? 1 : 3);
    }
    const check = (10 - (sum % 10)) % 10;
    return check === parseInt(clean[12]);
  }

  return false;
}

function AddBookScreen() {
  const firestore = useFirestore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    isbn: "",
    title: "",
    year: "",
    edition: "",
    quantity: "",
  });

  const [selectedAuthors, setSelectedAuthors] = useState<{ id: string; name: string }[]>([]);
  const [authors, setAuthors] = useState<{ id: string; name: string }[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<{ id: string; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [newAuthor, setNewAuthor] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [isAddingAuthor, setIsAddingAuthor] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // Fetch authors and categories from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        const authorsCollection = collection(firestore, "authors");
        const authorsSnapshot = await getDocs(authorsCollection);
        const authorList = authorsSnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setAuthors(authorList);

        const categoriesCollection = collection(firestore, "categories");
        const categoriesSnapshot = await getDocs(categoriesCollection);
        const categoryList = categoriesSnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setCategories(categoryList);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load authors or categories.");
      }
    };

    fetchData();
  }, [firestore]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageFile(file || null);
  };

  const handleAuthorSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    const selectedAuthor = authors.find((author) => author.id === selectedValue);
    if (selectedAuthor && !selectedAuthors.some((auth) => auth.id === selectedAuthor.id)) {
      setSelectedAuthors((prev) => [...prev, selectedAuthor]);
    }
  };

  const handleCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    const selectedCategory = categories.find((category) => category.id === selectedValue);
    if (selectedCategory && !selectedCategories.some((cat) => cat.id === selectedCategory.id)) {
      setSelectedCategories((prev) => [...prev, selectedCategory]);
    }
  };

  const handleAuthorRemove = (authorId: string) => {
    setSelectedAuthors((prev) => prev.filter((item) => item.id !== authorId));
  };

  const handleCategoryRemove = (categoryId: string) => {
    setSelectedCategories((prev) => prev.filter((item) => item.id !== categoryId));
  };

  const handleAddNewAuthor = () => {
    if (newAuthor.trim()) {
      const newAuthorObj = { id: `new-${Date.now()}`, name: newAuthor };
      setAuthors((prev) => [...prev, newAuthorObj]);
      setSelectedAuthors((prev) => [...prev, newAuthorObj]);
      setNewAuthor("");
      setIsAddingAuthor(false);
    }
  };

  const handleAddNewCategory = () => {
    if (newCategory.trim()) {
      const newCategoryObj = { id: `new-${Date.now()}`, name: newCategory };
      setCategories((prev) => [...prev, newCategoryObj]);
      setSelectedCategories((prev) => [...prev, newCategoryObj]);
      setNewCategory("");
      setIsAddingCategory(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // --- ISBN validation here ---
    if (!isValidISBN(formData.isbn)) {
      alert("Invalid ISBN. Please enter a valid ISBN-10 or ISBN-13.");
      return;
    }
    // If valid, check if it already exists in the database
    const booksCollection = collection(firestore, "books");
    const isbnQuery = query(booksCollection, where("isbn", "==", formData.isbn));
    const isbnSnapshot = await getDocs(isbnQuery);
    if (!isbnSnapshot.empty) {
      alert("A book with this ISBN already exists.");
      return;
    }

    // Year validation
    if (!/^\d+$/.test(formData.year) || parseInt(formData.year, 10) <= 0) {
      alert("Year must be a positive integer.");
      return;
    }

    // Edition validation
    if (!/^\d+$/.test(formData.edition) || parseInt(formData.edition, 10) <= 0) {
      alert("Edition must be a positive integer.");
      return;
    }

    // Quantity validation
    if (!/^\d+$/.test(formData.quantity) || parseInt(formData.quantity, 10) <= 0) {
      alert("Quantity must be a positive integer.");
      return;
    }

    try {
      const booksCollection = collection(firestore, "books");

      // Save new authors to Firestore
      const newAuthors = selectedAuthors.filter((auth) => auth.id.startsWith("new-"));
      for (const author of newAuthors) {
        const docRef = await addDoc(collection(firestore, "authors"), { name: author.name });
        author.id = docRef.id; // Update the ID with the Firestore-generated ID
      }

      // Save new categories to Firestore
      const newCategories = selectedCategories.filter((cat) => cat.id.startsWith("new-"));
      for (const category of newCategories) {
        const docRef = await addDoc(collection(firestore, "categories"), { name: category.name });
        category.id = docRef.id; // Update the ID with the Firestore-generated ID
      }

      // Handle image upload
      let imageUrl = "";
      if (imageFile) {
        const storage = getStorage();
        const storageRef = ref(storage, `books/${formData.isbn}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      // Add the new book
      await addDoc(booksCollection, {
        isbn: formData.isbn,
        title: formData.title,
        author: selectedAuthors.map((auth) => auth.id), // Save author as an array of IDs
        year: parseInt(formData.year, 10),
        edition: formData.edition,
        quantity: parseInt(formData.quantity, 10),
        imageUrl,
        category: selectedCategories.map((cat) => cat.id), // Save category as an array of IDs
      });

      toast.success("Book added successfully!", {
        position: "top-right",
        autoClose: 5000,
        theme: "dark",
      });
      localStorage.setItem("bookAdded", "true"); // <-- Set flag before navigating
      navigate("/manage-book");
    } catch (error) {
      console.error("Error adding book:", error);
      toast.error("Failed to add book.");
    }
  };

  const handleISBNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits, and only allow X (uppercase) as the last character for ISBN-10
    let value = e.target.value.replace(/[^0-9Xx]/g, "");
    // Remove all X/x except possibly at the end if length is 10
    if (value.length < 10) value = value.replace(/[Xx]/g, "");
    if (value.length === 10) {
      // Only allow X or x at the last position
      value = value.slice(0, 9) + (value[9] === "x" ? "X" : value[9]);
      // If X/X is not at the end, remove it
      if (value.slice(0, 9).includes("X")) value = value.replace(/X/g, "");
    } else if (value.length > 10) {
      // For ISBN-13, remove any X
      value = value.replace(/[Xx]/g, "");
    }
    setFormData((prev) => ({ ...prev, isbn: value }));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, ""); // Only allow digits
    // Prevent leading zeros
    if (value.length > 1) value = value.replace(/^0+/, "");
    setFormData((prev) => ({ ...prev, year: value }));
  };

  const handleEditionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, ""); // Only allow digits
    // Prevent leading zeros
    if (value.length > 1) value = value.replace(/^0+/, "");
    setFormData((prev) => ({ ...prev, edition: value }));
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, ""); // Only allow digits
    // Prevent leading zeros
    if (value.length > 1) value = value.replace(/^0+/, "");
    setFormData((prev) => ({ ...prev, quantity: value }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-6">
        <BackButton className="mb-4"/>
        <h1 className="text-3xl font-bold mb-6">Add New Book</h1>
        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow">
          {/* ISBN Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">ISBN</label>
            <input
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleISBNChange}
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

          {/* Author Dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Select Author</label>
            <select
              value=""
              onChange={(e) => {
                if (e.target.value === "others") {
                  setIsAddingAuthor(true);
                } else {
                  handleAuthorSelect(e);
                }
              }}
              className="p-2 border border-gray-600 rounded w-full bg-gray-700 text-white"
            >
              <option value="">Choose an author</option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
              <option value="others">Others</option>
            </select>
            {isAddingAuthor && (
              <div className="mt-2">
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="Enter new author name"
                  className="p-2 border border-gray-600 rounded w-full bg-gray-700 text-white"
                />
                <button
                  type="button"
                  onClick={handleAddNewAuthor}
                  className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Add Author
                </button>
              </div>
            )}
          </div>

          {/* Display Selected Authors */}
          <div className="mb-4">
            <h3 className="text-sm font-medium">Selected Authors:</h3>
            <ul className="list-disc pl-6">
              {selectedAuthors.map((author) => (
                <li key={author.id} className="flex items-center justify-between">
                  <span>{author.name}</span>
                  <button
                    type="button"
                    onClick={() => handleAuthorRemove(author.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Category Dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Select Category</label>
            <select
              value=""
              onChange={(e) => {
                if (e.target.value === "others") {
                  setIsAddingCategory(true);
                } else {
                  handleCategorySelect(e);
                }
              }}
              className="p-2 border border-gray-600 rounded w-full bg-gray-700 text-white"
            >
              <option value="">Choose a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
              <option value="others">Others</option>
            </select>
            {isAddingCategory && (
              <div className="mt-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter new category name"
                  className="p-2 border border-gray-600 rounded w-full bg-gray-700 text-white"
                />
                <button
                  type="button"
                  onClick={handleAddNewCategory}
                  className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Add Category
                </button>
              </div>
            )}
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

          {/* Year Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Year</label>
            <input
              type="text"
              name="year"
              value={formData.year}
              onChange={handleYearChange}
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
              onChange={handleEditionChange}
              className="p-2 border border-gray-600 rounded w-full bg-gray-700 text-white"
              required
            />
          </div>

          {/* Quantity Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <input
              type="text"
              name="quantity"
              value={formData.quantity}
              onChange={handleQuantityChange}
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
