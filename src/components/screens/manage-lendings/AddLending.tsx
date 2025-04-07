import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFirestore } from "~/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Head } from "~/components/shared/Head";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";

function AddLending() {
  const firestore = useFirestore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bookId: "", // Admin types in the book ID
    userId: "", // Admin types in the user ID
    borrowDate: "",
    returnDate: "",
    status: "Borrowed",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const lendingsCollection = collection(firestore, "lendings");
      await addDoc(lendingsCollection, formData);
      localStorage.setItem("showToast", "true"); // Set flag for toast
      navigate("/manage-lending");
    } catch (error) {
      console.error("Error adding lending record:", error);
      toast.error("Failed to add lending record.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <ToastContainer />
      <Head title="Add New Lending" />
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={() => navigate("/manage-lending")}
          className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 mb-4"
        >
          Back
        </button>
        <h1 className="text-3xl font-bold mb-6">Add New Lending</h1>
        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
          <div className="grid grid-cols-1 gap-4">
            {/* Book ID Input */}
            <div>
              <label className="block text-sm font-medium mb-1">Book ID</label>
              <input
                type="text"
                name="bookId"
                value={formData.bookId}
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                placeholder="Enter Book ID"
                required
              />
            </div>

            {/* User ID Input */}
            <div>
              <label className="block text-sm font-medium mb-1">User ID</label>
              <input
                type="text"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                placeholder="Enter User ID"
                required
              />
            </div>

            {/* Borrow Date Input */}
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

            {/* Return Date Input */}
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
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Lending
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddLending;
