import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFirestore } from "~/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Head } from "~/components/shared/Head";

type User = {
    id: "",
    name: "",
    birthyear: "",
    address: "",
    phone: "",
    email: "",
    role: "",
    password: "",
}

function ManageUser(){
    const firestore = useFirestore();
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
          try {
            const usersCollection = collection(firestore, "users");
            const snapshot = await getDocs(usersCollection);
            const usersData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as User[];
            setUsers(usersData);
            setFilteredUsers(usersData); // Initialize filteredUsers with all users
            setLoading(false);
          } catch (error) {
            console.error("Error fetching users:", error);
            setLoading(false);
          }
        };
    
        fetchUsers();
    }, [firestore]);
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        setFilteredUsers(
          users.filter(
            (user) =>
              user.id.toString().toLowerCase().includes(term) ||
              user.name.toLowerCase().includes(term) ||
              user.email.toLowerCase().includes(term) ||
              user.role.toLowerCase().includes(term) 
          )
        );
      };
    if (loading) {
       return <p className="text-center text-gray-300">Loading users...</p>;
    }
    /*
    if (users.length === 0) {
       return <p className="text-center text-gray-300">No users found.</p>;
    }
    */
    return (
        <div className="min-h-screen bg-gray-900 text-white">
          <Head title="Manage Users" />
          <div className="container mx-auto px-4 py-6">
            {/* Back to Homepage Button */}
            <div className="mb-4">
              <button
                onClick={() => navigate("/")}
                className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
              >
                Back
              </button>
            </div>
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
                        <button
                          onClick={() => navigate(`/manage-user/edit/${user.id}`)}
                          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                        >
                          Edit
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
export default ManageUser;