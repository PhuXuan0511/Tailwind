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
    author: "",
    year: "",
    edition: "",
    category: "",
    quantity: "",
    restrictions: "",
    imageUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [authors, setAuthors] = useState<{ id: string; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

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
            author: bookData.author || "",
            year: bookData.year?.toString() || "",
            edition: bookData.edition || "",
            category: bookData.category || "",
            quantity: bookData.quantity?.toString() || "",
            restrictions: bookData.restrictions || "",
            imageUrl: bookData.imageUrl || "",
          });
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

      await updateDoc(bookDoc, {
        ...formData,
        year: parseInt(formData.year, 10),
        quantity: parseInt(formData.quantity, 10),
        imageUrl,
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
            <label className="block text-sm font-medium mb-1">Author</label>
            <select
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="p-2 border border-gray-600 rounded w-full bg-gray-700 text-white"
              required
            >
              <option value="">Select Author</option>
              {authors.map(author => (
                <option key={author.id} value={author.id}>{author.name}</option>
              ))}
            </select>
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
              type="text"
              name="edition"
              value={formData.edition}
              onChange={handleChange}
              className="p-2 border border-gray-600 rounded w-full bg-gray-700 text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="p-2 border border-gray-600 rounded w-full bg-gray-700 text-white"
              required
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
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