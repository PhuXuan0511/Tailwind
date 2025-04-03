import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFirestore } from "~/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Head } from "~/components/shared/Head";

function EditLending() {
  const { id } = useParams<{ id: string }>();
  const firestore = useFirestore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bookTitle: "",
    borrowerName: "",
    borrowDate: "",
    returnDate: "",
    status: "Borrowed",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLending = async () => {
      try {
        const lendingDoc = doc(firestore, "lendings", id!);
        const lendingSnapshot = await getDoc(lendingDoc);
        if (lendingSnapshot.exists()) {
          setFormData(lendingSnapshot.data() as typeof formData);
        } else {
          console.error("Lending record not found");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching lending record:", error);
        setLoading(false);
      }
    };

    fetchLending();
  }, [firestore, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const lendingDoc = doc(firestore, "lendings", id!);
      await updateDoc(lendingDoc, formData);
      navigate("/manage-lending");
    } catch (error) {
      console.error("Error updating lending record:", error);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-300">Loading lending record...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head title="Edit Lending" />
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={() => navigate("/manage-lending")}
          className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 mb-4"
        >
          Back
        </button>
        <h1 className="text-3xl font-bold mb-6">Edit Lending</h1>
        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Book Title</label>
              <input
                type="text"
                name="bookTitle"
                value={formData.bookTitle}
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Borrower Name</label>
              <input
                type="text"
                name="borrowerName"
                value={formData.borrowerName}
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Borrow Date</label>
              <input
                type="date"
                name="borrowDate"
                value={formData.borrowDate}
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Return Date</label>
              <input
                type="date"
                name="returnDate"
                value={formData.returnDate}
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <input
                type="text"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Update Lending
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditLending;
