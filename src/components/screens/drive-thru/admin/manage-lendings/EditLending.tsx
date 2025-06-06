import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFirestore } from "~/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Head } from "~/components/shared/Head";
import { LendStat } from "./ManageLending";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const statusOptions = Object.values(LendStat);

function EditLending() {
  const { id } = useParams<{ id: string }>();
  const firestore = useFirestore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bookId: "",
    userId: "",
    borrowDate: "",
    returnDate: "",
    status: "Borrowed",
    overdueFee: 0,
  });
  const [bookTitle, setBookTitle] = useState("Loading...");
  const [borrowerName, setBorrowerName] = useState("Loading...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLending = async () => {
      try {
        const lendingDoc = doc(firestore, "lendings", id!);
        const lendingSnapshot = await getDoc(lendingDoc);
        if (lendingSnapshot.exists()) {
          const lendingData = lendingSnapshot.data();
          setFormData(lendingData as typeof formData);

          // Fetch book title
          const bookDoc = await getDoc(doc(firestore, "books", lendingData.bookId));
          if (bookDoc.exists()) {
            setBookTitle(bookDoc.data().title || "Unknown Book");
          }

          // Fetch borrower name
          const userDoc = await getDoc(doc(firestore, "users", lendingData.userId));
          if (userDoc.exists()) {
            setBorrowerName(userDoc.data().name || "Unknown User");
          }
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.returnDate < formData.borrowDate) {
      alert("Return date cannot be before borrow date.");
      return;
    }
    if (formData.returnDate < new Date().toISOString().split("T")[0]) {
      alert("Return date cannot be in the past.");
      return;
    }
    try {
      const lendingDoc = doc(firestore, "lendings", id!);
      await updateDoc(lendingDoc, {
        returnDate: formData.returnDate,
        status: formData.status,
      });
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
      <ToastContainer />
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
            {/* Book Title (Read-Only) */}
            <div>
              <label className="block text-sm font-medium mb-1">Book Title</label>
              <input
                type="text"
                value={bookTitle}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                readOnly
              />
            </div>

            {/* Borrower Name (Read-Only) */}
            <div>
              <label className="block text-sm font-medium mb-1">Borrower Name</label>
              <input
                type="text"
                value={borrowerName}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                readOnly
              />
            </div>

            {/* Borrow Date (Read-Only) */}
            <div>
              <label className="block text-sm font-medium mb-1">Borrow Date</label>
              <input
                type="date"
                name="borrowDate"
                value={formData.borrowDate}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                readOnly
              />
            </div>

            {/* Return Date (Editable) */}
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

            {/* Status (Editable) */}
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                required
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
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
