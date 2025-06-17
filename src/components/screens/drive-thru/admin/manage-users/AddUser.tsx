import React, { useState } from "react";
import { useFirestore } from "~/lib/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import BackButton from "~/components/shared/buttons/BackButton";
function AddUserScreen() {
    const firestore = useFirestore();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        birthyear: "",
        address: "",
        phone: "",
        email: "",
        role: "user", // Default role
        password: "",
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Helper to check for duplicate user
    const isDuplicateUser = async () => {
      const usersCollection = collection(firestore, "users");
      const snapshot = await getDocs(usersCollection);
      return snapshot.docs.some(doc => {
        const data = doc.data();
        return (
          data.name === formData.name &&
          data.birthyear === parseInt(formData.birthyear, 10) &&
          data.address === formData.address &&
          data.phone === formData.phone &&
          data.email === formData.email &&
          data.role === formData.role
        );
      });
    };

    // Modified handleSubmit to check for duplicates
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        if (await isDuplicateUser()) {
          alert("A user with identical credentials already exists.");
          return;
        }
        const usersCollection = collection(firestore, "users");
        await addDoc(usersCollection, {
          ...formData,
          birthyear: parseInt(formData.birthyear, 10),
        });
        localStorage.setItem("showToast", "true");
        navigate("/manage-user");
      } catch (error) {
        console.error("Error adding user:", error);
        alert("Failed to add user. Check the console for details.");
      }
    };
      return (
        <div className="min-h-screen bg-gray-900 text-white">
          <ToastContainer /> 
          <div className="container mx-auto px-4 py-6">
            <BackButton className="mb-4"/>
            <h1 className="text-3xl font-bold mb-6">Add New User</h1>
            <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="p-2 border border-gray-600 rounded w-full bg-gray-700 text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Birth Year</label>
                <input
                  type="number"
                  name="birthyear"
                  value={formData.birthyear}
                  onChange={handleChange}
                  className="p-2 border border-gray-600 rounded w-full bg-gray-700 text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="p-2 border border-gray-600 rounded w-full bg-gray-700 text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="p-2 border border-gray-600 rounded w-full bg-gray-700 text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="p-2 border border-gray-600 rounded w-full bg-gray-700 text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="p-2 border border-gray-600 rounded w-full bg-gray-700 text-white"
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add User
              </button>
            </form>
          </div>
        </div>
      );
}

export default AddUserScreen;