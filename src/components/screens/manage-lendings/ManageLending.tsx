import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFirestore } from "~/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Head } from "~/components/shared/Head";

type Lending = {
  id: string;
  bookTitle: string;
  borrowerName: string;
  borrowDate: string;
  returnDate: string | null;
  status: string; // e.g., "Borrowed", "Returned"
};

function ManageLending() {
  const firestore = useFirestore();
  const [lendings, setLendings] = useState<Lending[]>([]);
  const [filteredLendings, setFilteredLendings] = useState<Lending[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLendings = async () => {
      try {
        const lendingsCollection = collection(firestore, "lendings");
        const snapshot = await getDocs(lendingsCollection);
        const lendingsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Lending[];
        setLendings(lendingsData);
        setFilteredLendings(lendingsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching lending records:", error);
        setLoading(false);
      }
    };

    fetchLendings();
  }, [firestore]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredLendings(
      lendings.filter(
        (lending) =>
          lending.bookTitle.toLowerCase().includes(term) ||
          lending.borrowerName.toLowerCase().includes(term) ||
          lending.status.toLowerCase().includes(term)
      )
    );
  };

  if (loading) {
    return <p className="text-center text-gray-300">Loading lending records...</p>;
  }


  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head title="Manage Lending" />
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <div className="mb-4">
          <button
            onClick={() => navigate("/")}
            className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
          >
            Back
          </button>
        </div>
        <h1 className="text-3xl font-bold mb-6">Manage Lending</h1>
        <div className="mb-4 flex items-center space-x-4">
          {/* Search Box */}
          <input
            type="text"
            placeholder="Search by Book Title, Borrower Name, or Status"
            value={searchTerm}
            onChange={handleSearch}
            className="p-2 border border-gray-600 rounded w-full max-w-lg bg-gray-700 text-white"
          />
          {/* Add New Lending Record Button */}
          <button
            onClick={() => navigate("/manage-lending/add")}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
          >
            Add New Lending
          </button>
        </div>
        <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b border-gray-700 p-2">Book Title</th>
                <th className="border-b border-gray-700 p-2">Borrower Name</th>
                <th className="border-b border-gray-700 p-2">Borrow Date</th>
                <th className="border-b border-gray-700 p-2">Return Date</th>
                <th className="border-b border-gray-700 p-2">Status</th>
                <th className="border-b border-gray-700 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLendings.map((lending) => (
                <tr key={lending.id}>
                  <td className="border-b border-gray-700 p-2">{lending.bookTitle}</td>
                  <td className="border-b border-gray-700 p-2">{lending.borrowerName}</td>
                  <td className="border-b border-gray-700 p-2">{lending.borrowDate}</td>
                  <td className="border-b border-gray-700 p-2">
                    {lending.returnDate || "Not Returned"}
                  </td>
                  <td className="border-b border-gray-700 p-2">{lending.status}</td>
                  <td className="border-b border-gray-700 p-2">
                    <button
                      onClick={() => navigate(`/manage-lending/edit/${lending.id}`)}
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

export default ManageLending;
