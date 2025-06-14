import React, { useEffect, useState } from "react";
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, where, getDocs } from "firebase/firestore";
import { useFirestore } from "~/lib/firebase";
import { Head } from "~/components/shared/Head";
import { useNavigate } from "react-router-dom";
import Loader from "~/components/common/Loader"; // Add this import

type Category = {
  id: string;
  name: string;
};

function ManageCategory() {
  const firestore = useFirestore();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const categoryCollection = collection(firestore, "categories");
    const unsubscribe = onSnapshot(categoryCollection, (snapshot) => {
      const categoryList = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setCategories(categoryList);
      setLoading(false); // Set loading to false when data is loaded
    });

    return () => unsubscribe();
  }, [firestore]);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      await addDoc(collection(firestore, "categories"), { name: newCategory.trim() });
      setNewCategory("");
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this category?");
    if (!confirmDelete) return;

    try {
      // Check if the category is associated with any book
      const booksQuery = query(collection(firestore, "books"), where("category", "array-contains", categoryId));
      const booksSnapshot = await getDocs(booksQuery);

      if (!booksSnapshot.empty) {
        alert("This category is associated with one or more books and cannot be deleted.");
        return;
      }

      await deleteDoc(doc(firestore, "categories", categoryId));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
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
      <Head title="Manage Categories" />
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <div className="mb-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
          >
            Back
          </button>
        </div>

        <h1 className="text-3xl font-bold mb-6">Manage Categories</h1>

        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter new category"
            className="p-2 border border-gray-600 rounded bg-gray-700 text-white w-full max-w-md"
          />
          <button
            onClick={handleAddCategory}
            className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b border-gray-700 p-2">Category Name</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td className="border-b border-gray-700 p-2 flex justify-between items-center">
                    {cat.name}
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="ml-4 p-1 rounded text-red-500 hover:text-red-600 focus:outline-none"
                      aria-label="Delete category"
                    >
                      <span className="text-xs font-bold">&#10005;</span>
                    </button>
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

export default ManageCategory;
