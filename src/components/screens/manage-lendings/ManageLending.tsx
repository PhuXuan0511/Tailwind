import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFirestore } from "~/lib/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { Head } from "~/components/shared/Head";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { showToastFromLocalStorage } from "~/components/shared/toastUtils";

type Lending = {
  id: string;
  bookId: string; // Store only the book ID
  userId: string; // Store only the user ID
  borrowDate: string;
  returnDate: string | null;
  status: string; // e.g., "Borrowed", "Returned"
  bookTitle?: string; // Dynamically fetched
  borrowerName?: string; // Dynamically fetched
};

function ManageLending() {
  const firestore = useFirestore();
  const [lendings, setLendings] = useState<Lending[]>([]);
  const [filteredLendings, setFilteredLendings] = useState<Lending[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch book title by bookId
  async function fetchBookTitle(bookId: string): Promise<string> {
    try {
      const bookDoc = await getDoc(doc(firestore, "books", bookId));
      if (bookDoc.exists()) {
        return bookDoc.data().title || "Unknown Book";
      }
    } catch (error) {
      console.error("Error fetching book title:", error);
    }
    return "Unknown Book";
  }

  // Fetch borrower name by userId
  async function fetchBorrowerName(userId: string): Promise<string> {
    try {
      const userDoc = await getDoc(doc(firestore, "users", userId));
      if (userDoc.exists()) {
        return userDoc.data().name || "Unknown User";
      }
    } catch (error) {
      console.error("Error fetching borrower name:", error);
    }
    return "Unknown User";
  }

  // Fetch lending records and dynamically fetch book titles and borrower names
  useEffect(() => {
    const fetchLendings = async () => {
      try {
        const lendingsCollection = collection(firestore, "lendings");
        const snapshot = await getDocs(lendingsCollection);

        const lendingsWithDetails = await Promise.all(
          snapshot.docs.map(async (docSnapshot) => {
            const lending = docSnapshot.data() as Lending;

            // Fetch book title and borrower name dynamically
            const bookTitle = await fetchBookTitle(lending.bookId);
            const borrowerName = await fetchBorrowerName(lending.userId);

            return {
              ...lending,
              id: docSnapshot.id,
              bookTitle,
              borrowerName,
            };
          })
        );

        setLendings(lendingsWithDetails);
        setFilteredLendings(lendingsWithDetails);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching lending records:", error);
        setLoading(false);
      }
    };

    fetchLendings();
  }, [firestore]);

  useEffect(() => {
    showToastFromLocalStorage("showToast", "🦄 Lending added successfully!");
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredLendings(
      lendings.filter(
        (lending) =>
          lending.bookTitle?.toLowerCase().includes(term) ||
          lending.borrowerName?.toLowerCase().includes(term) ||
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
      <ToastContainer />
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
                  <td className="border-b border-gray-700 p-2">{lending.bookTitle || "Loading..."}</td>
                  <td className="border-b border-gray-700 p-2">{lending.borrowerName || "Loading..."}</td>
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
