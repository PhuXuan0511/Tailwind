import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "~/lib/firebase";
import { Head } from "~/components/shared/Head";

type Lending = {
  id: string;
  bookTitle: string;
  borrowerName: string;
  borrowDate: string;
  returnDate: string | null;
  status: string;
};

function ViewLending() {
  const [lendings, setLendings] = useState<Lending[]>([]);
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      } catch (error) {
        console.error("Error fetching lendings:", error);
        setLoading(false);
      }
    };

    fetchLendings();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-300">Loading lendings...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head title="View Lendings" />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">View Lendings</h1>
        <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b border-gray-700 p-2">Title</th>
                <th className="border-b border-gray-700 p-2">Borrower</th>
                <th className="border-b border-gray-700 p-2">Date Borrowed</th>
                <th className="border-b border-gray-700 p-2">Due Date</th>
                <th className="border-b border-gray-700 p-2">Status</th>
                
              </tr>
            </thead>
            <tbody>
              {lendings.map((lending) => (
                <tr key={lending.id}>
                  <td className="border-b border-gray-700 p-2">{lending.bookTitle}</td>
                  <td className="border-b border-gray-700 p-2">{lending.borrowerName}</td>
                  <td className="border-b border-gray-700 p-2">{lending.borrowDate}</td>
                  <td className="border-b border-gray-700 p-2">{lending.returnDate || "N/A"}</td>
                  <td className="border-b border-gray-700 p-2">{lending.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ViewLending;
