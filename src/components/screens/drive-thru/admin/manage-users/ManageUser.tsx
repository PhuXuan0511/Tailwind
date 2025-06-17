import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFirestore } from "~/lib/firebase";
import { collection, onSnapshot, deleteDoc, doc, query, where, getDocs } from "firebase/firestore";
import { Head } from "~/components/shared/Head";
import { toast, ToastContainer } from "react-toastify";
import { showToastFromLocalStorage } from "~/components/shared/toastUtils";
import Loader from "~/components/common/Loader"; // Add this import
import BackButton from "~/components/shared/buttons/BackButton";

type User = {
  id: string;
  name: string;
  birthyear: string;
  address: string;
  phone: string;
  email: string;
  role: string;
  password: string;
};

function ManageUser() {
  const firestore = useFirestore();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Use `onSnapshot` to listen for real-time updates
  useEffect(() => {
    const usersCollection = collection(firestore, "users");

    // Set up the real-time listener
    const unsubscribe = onSnapshot(usersCollection, (snapshot) => {
      const usersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || "",
        birthyear: doc.data().birthyear || "",
        address: doc.data().address || "",
        phone: doc.data().phone || "",
        email: doc.data().email || "",
        role: doc.data().role || "",
        password: doc.data().password || "",
      })) as User[];
      setUsers(usersData);
      setFilteredUsers(usersData); // Initialize filteredUsers with all users
      setLoading(false);
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, [firestore]);

  useEffect(() => {
    showToastFromLocalStorage("showToast", "👤 User added successfully!");
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredUsers(
      users.filter(
        (user) =>
          user.id.toLowerCase().includes(term) ||
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          user.role.toLowerCase().includes(term)
      )
    );
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      // Delete all lending records related to the user
      const lendingsCollection = collection(firestore, "lendings");
      const userLendingsQuery = query(lendingsCollection, where("userId", "==", userId));
      const userLendingsSnapshot = await getDocs(userLendingsQuery);

      const deleteLendingPromises = userLendingsSnapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deleteLendingPromises);

      // Delete the user document
      const userDoc = doc(firestore, "users", userId);
      await deleteDoc(userDoc);

      toast.success("User and all related data have been deleted successfully.");
    } catch (error) {
      console.error("Error deleting user and related data:", error);
      alert("Failed to delete user. Please try again.");
    }
  };

  const handleUserAction = (action: string, userId: string) => {
    if (action === "edit") {
      navigate(`/manage-user/edit/${userId}`);
    } else if (action === "delete") {
      if (window.confirm(`Are you sure you want to delete this user?`)) {
        handleDeleteUser(userId);
      }
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
      <Head title="Manage Users" />
      <ToastContainer />
      <div className="container mx-auto px-4 py-6">
        {/* Back to Homepage Button */}
        <BackButton className="mb-4" />
        <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
        <div className="mb-4 flex items-center space-x-4">
          {/* Search Box */}
          <input
            type="text"
            placeholder="Search by ID, Name, Email, or Role"
            value={searchTerm}
            onChange={handleSearch}
            className="p-2 border border-gray-600 rounded w-full max-w-lg bg-gray-700 text-white"
          />
          {/* Add New User Button */}
          <button
            onClick={() => navigate("/manage-user/add")}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
          >
            Add New User
          </button>
        </div>
        <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b border-gray-700 p-2">ID</th>
                <th className="border-b border-gray-700 p-2">Name</th>
                <th className="border-b border-gray-700 p-2">Birth Year</th>
                <th className="border-b border-gray-700 p-2">Address</th>
                <th className="border-b border-gray-700 p-2">Phone</th>
                <th className="border-b border-gray-700 p-2">Email</th>
                <th className="border-b border-gray-700 p-2">Role</th>
                <th className="border-b border-gray-700 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="border-b border-gray-700 p-2">{user.id}</td>
                  <td className="border-b border-gray-700 p-2">{user.name}</td>
                  <td className="border-b border-gray-700 p-2">{user.birthyear}</td>
                  <td className="border-b border-gray-700 p-2">{user.address}</td>
                  <td className="border-b border-gray-700 p-2">{user.phone}</td>
                  <td className="border-b border-gray-700 p-2">{user.email}</td>
                  <td className="border-b border-gray-700 p-2">{user.role}</td>
                  <td className="border-b border-gray-700 p-2">
                    <select
                      onChange={(e) => handleUserAction(e.target.value, user.id)}
                      className="bg-gray-700 text-white p-2 rounded"
                    >
                      <option value="">Select Action</option>
                      <option value="edit">Edit</option>
                      <option value="delete">Delete</option>
                    </select>
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

export default ManageUser;