import React, { useEffect, useState } from "react";
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, where, getDocs } from "firebase/firestore";
import { useFirestore } from "~/lib/firebase";
import { Head } from "~/components/shared/Head";
import { useNavigate } from "react-router-dom";
import Loader from "~/components/common/Loader"; // Add this import
import DeleteButton from "~/components/shared/buttons/DeleteButton"; // Import DeleteButton component
import BackButton from "~/components/shared/buttons/BackButton";
import AddButton from "~/components/shared/buttons/AddButton";
type Author = {
  id: string;
  name: string;
};

function ManageAuthor() {
  const firestore = useFirestore();
  const navigate = useNavigate();
  const [authors, setAuthors] = useState<Author[]>([]);
  const [newAuthor, setNewAuthor] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    if (!firestore) {
      setError("Firestore is not initialized. Please check your configuration.");
      setLoading(false);
      return;
    }

    const authorCollection = collection(firestore, "authors");
    const unsubscribe = onSnapshot(
      authorCollection,
      (snapshot) => {
        const authorList = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setAuthors(authorList);
        setError(null);
        setLoading(false); // Set loading to false when data is loaded
      },
      (err) => {
        console.error("Error fetching authors:", err);
        setError("Failed to fetch authors. Please try again later.");
        setLoading(false); // Set loading to false on error
      }
    );

    return () => unsubscribe();
  }, [firestore]);

  const handleAddAuthor = async () => {
    if (!newAuthor.trim()) return;
    try {
      await addDoc(collection(firestore, "authors"), { name: newAuthor.trim() });
      setNewAuthor("");
    } catch (error) {
      console.error("Error adding author:", error);
      setError("Failed to add author. Please try again.");
    }
  };

  const handleDeleteAuthor = async (authorId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this author?");
    if (!confirmDelete) return;

    try {
      // Check if the author is associated with any book
      const booksQuery = query(collection(firestore, "books"), where("author", "array-contains", authorId));
      const booksSnapshot = await getDocs(booksQuery);

      if (!booksSnapshot.empty) {
        alert("This author is associated with one or more books and cannot be deleted.");
        return;
      }

      await deleteDoc(doc(firestore, "authors", authorId));
    } catch (error) {
      console.error("Error deleting author:", error);
      setError("Failed to delete author. Please try again.");
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
      <Head title="Manage Authors" />
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <BackButton className="mb-4"/>

        <h1 className="text-3xl font-bold mb-6">Manage Authors</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={newAuthor}
            onChange={(e) => setNewAuthor(e.target.value)}
            placeholder="Enter new author"
            className="p-2 border border-gray-600 rounded bg-gray-700 text-white w-full max-w-md"
          />
          <AddButton onClick={handleAddAuthor} className="mt-2" />
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b border-gray-700 p-2">Author Name</th>
              </tr>
            </thead>
            <tbody>
              {authors.map((author) => (
                <tr key={author.id}>
                  <td className="border-b border-gray-700 p-2 flex justify-between items-center">
                    {author.name}
                    <DeleteButton
                      onClick={() => handleDeleteAuthor(author.id)}
                      className="mt-2"
                    ></DeleteButton>
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

export default ManageAuthor;
