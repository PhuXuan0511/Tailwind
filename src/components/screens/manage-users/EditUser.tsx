import React, { useEffect, useState } from "react";
import { useFirestore } from "~/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";

function EditUserScreen(){
    const firestore = useFirestore();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>(); // Get the user ID from the URL
    const [formData, setFormData] = useState({
        name: "",
        birthyear: "",
        address: "",
        phone: "",
        email: "",
        role: "",
        password: "",
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => { 
        const fetchUser = async () => {
          try {
            const userDoc = doc(firestore, "users", id!);
            const userSnapshot = await getDoc(userDoc);
            if (userSnapshot.exists()) {
              const userData = userSnapshot.data();
              setFormData({
                name: userData.name || "",
                birthyear: userData.birthyear?.toString() || "",
                address: userData.address || "",
                phone: userData.phone || "",
                email: userData.email || "",
                role: userData.role || "",
                password: userData.password || "",
              });
            } else {
              alert("User not found!");
              navigate("/"); // Redirect back to ManageUser if the user doesn't exist
            }
          } catch (error) {
            console.error("Error fetching user:", error);
            alert("Failed to fetch user details. Check the console for details.");
          } finally {
            setLoading(false);
          }
        };
    
        fetchUser();
      }, [firestore, id, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
          const userDoc = doc(firestore, "users", id!);
          await updateDoc(userDoc, {
            ...formData,
            birthyear: parseInt(formData.birthyear),
            phone: parseInt(formData.phone),
          });
          alert("User updated successfully!");
          navigate("/manage-user"); // Redirect to ManageUser page
        } catch (error) {
          console.error("Error updating user:", error);
          alert("Failed to update user. Check the console for details.");
        }
      };

    if (loading) {
        return <p className="text-center text-gray-300">Loading user details...</p>;
    }   
    
    return (
        <div className="min-h-screen bg-gray-900 text-white">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-6">Edit User</h1>
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
                <label className="block text-sm font-medium mb-1">Birthyear</label>
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
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">E-Mail</label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="p-2 border border-gray-600 rounded w-full bg-gray-700 text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Role</label> {/* Corrected label */}
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
                Update User
              </button>
            </form>
          </div>
        </div>
      );
}
export default EditUserScreen;
