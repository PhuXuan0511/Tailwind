import React, { useEffect, useState } from "react";
import { useFirestore } from "~/lib/firebase";
import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate, useParams } from "react-router-dom";

function EditBookScreen() {
  const firestore = useFirestore();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState({
    isbn: "",
    title: "",
    year: "",
    edition: "",
    quantity: "",
    restrictions: "",
    imageUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [authors, setAuthors] = useState<{ id: string; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<{ id: string; name: string }[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchBookAndOptions = async () => {
      try {
        const bookDoc = doc(firestore, "books", id!);
        const bookSnapshot = await getDoc(bookDoc);

        const authorsSnapshot = await getDocs(collection(firestore, "authors"));
        const authorsList = authorsSnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
        setAuthors(authorsList);

        const categoriesSnapshot = await getDocs(collection(firestore, "categories"));
        const categoriesList = categoriesSnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
        setCategories(categoriesList);

        if (bookSnapshot.exists()) {
          const bookData = bookSnapshot.data();
          setFormData({
            isbn: bookData.isbn || "",
            title: bookData.title || "",
            year: bookData.year?.toString() || "",
            edition: bookData.edition || "",
            quantity: bookData.quantity?.toString() || "",
            restrictions: bookData.restrictions || "",
            imageUrl: bookData.imageUrl || "",
          });

          // Set selected authors
          if (bookData.author && Array.isArray(bookData.author)) {
            const matchedAuthors = authorsList.filter(author => bookData.author.includes(author.id));
            setSelectedAuthors(matchedAuthors);
          }

          // Set selected categories
          if (bookData.category && Array.isArray(bookData.category)) {
            const matchedCategories = categoriesList.filter(category => bookData.category.includes(category.id));
            setSelectedCategories(matchedCategories);
          }
        } else {
          alert("Book not found!");
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching book or options:", error);
        alert("Failed to fetch book details. Check the console for details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookAndOptions();
  }, [firestore, id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      setSelectedAuthors((prev) => [...prev, selectedAuthor]); // Allow multiple authors
    }
  };

  const handleAuthorRemove = (authorId: string) => {
    setSelectedAuthors((prev) => prev.filter((item) => item.id !== authorId));
  };

  const handleCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    const selectedCategory = categories.find((category) => category.id === selectedValue);
    if (selectedCategory && !selectedCategories.some((cat) => cat.id === selectedCategory.id)) {
      setSelectedCategories((prev) => [...prev, selectedCategory]); // Allow multiple categories
    }
  };

  const handleCategoryRemove = (categoryId: string) => {
    setSelectedCategories((prev) => prev.filter((item) => item.id !== categoryId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const bookDoc = doc(firestore, "books", id!);

      let imageUrl = formData.imageUrl;
      if (imageFile) {
        const storage = getStorage();
        const storageRef = ref(storage, `books/${formData.isbn}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      // Save all selected authors and categories as arrays
      const authorIds = selectedAuthors.map((author) => author.id);
      const categoryIds = selectedCategories.map((category) => category.id);

      await updateDoc(bookDoc, {
        ...formData,
        year: parseInt(formData.year, 10),
        quantity: parseInt(formData.quantity, 10),
        imageUrl,
        author: authorIds, // Save authors as an array
        category: categoryIds, // Save categories as an array
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

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Select Author</label>
            <select
              value=""
              onChange={handleAuthorSelect}
              className="p-2 border border-gray-600 rounded w-full bg-gray-700 text-white"
            >
              <option value="">Choose an author</option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-medium">Selected Authors:</h3>
            {selectedAuthors.length > 0 ? (
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
            ) : (
              <p className="text-gray-400">No authors selected.</p>
            )}
          </div>

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

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Edition</label>
            <input
              type="number"
              name="edition"
              value={formData.edition}
              onChange={handleChange}
              className="p-2 border border-gray-600 rounded w-full bg-gray-700 text-white"
              required
            />
          </div>

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

          <div className="mb-4">
            <h3 className="text-sm font-medium">Selected Categories:</h3>
            {selectedCategories.length > 0 ? (
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
            ) : (
              <p className="text-gray-400">No categories selected.</p>
            )}
          </div>

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