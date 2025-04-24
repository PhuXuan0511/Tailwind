import React, { useEffect, useState } from "react";
import { collection, addDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { useFirestore } from "~/lib/firebase";
import { Head } from "~/components/shared/Head";

type Category = {
  id: string;
  name: string;
};

function ManageCategory() {
  const firestore = useFirestore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    const categoryCollection = collection(firestore, "categories");
    const unsubscribe = onSnapshot(categoryCollection, (snapshot) => {
      const categoryList = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setCategories(categoryList);
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
      await deleteDoc(doc(firestore, "categories", categoryId));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head title="Manage Categories" />
      <div className="container mx-auto px-4 py-6">
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
                <th className="border-b border-gray-700 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td className="border-b border-gray-700 p-2">{cat.name}</td>
                  <td className="border-b border-gray-700 p-2">
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="bg-red-500 px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Delete
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
