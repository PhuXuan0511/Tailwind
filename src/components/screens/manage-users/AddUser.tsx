import React, { useState } from "react";
import { useFirestore } from "~/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function AddUserScreen() {
    const firestore = useFirestore();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        birthyear: "",
        address: "",
        phone: "",
        email: "",
        role: "user", // Default role
        password: "",
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
          const usersCollection = collection(firestore, "users");
          await addDoc(usersCollection, {
            ...formData,
            birthyear: parseInt(formData.birthyear, 10),
            phone: parseInt(formData.phone, 10),
          });
          alert("User added successfully!");
          navigate("/manage-user"); // Redirect to ManageUser page
        } catch (error) {
          console.error("Error adding user:", error);
          alert("Failed to add user. Check the console for details.");
        }
      };
      return (
        <div className="min-h-screen bg-gray-900 text-white">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-6">Add New User</h1>
            <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">ID</label>
                <input
                  type="number"
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  className="p-2 border border-gray-600 rounded w-full bg-gray-700 text-white"
                  required
                />
              </div>
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
                  required
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
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="number"
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
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="p-2 border border-gray-600 rounded w-full bg-gray-700 text-white"
                  required
                />
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