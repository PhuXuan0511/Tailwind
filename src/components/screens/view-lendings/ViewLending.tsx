import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { firestore } from "~/lib/firebase";
import { getAuth } from "firebase/auth";
import { Head } from "~/components/shared/Head";

function ViewLending() {
  const [lendings, setLendings] = useState<any[]>([]); // Use `any[]` to handle Firestore data dynamically
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLendings = async () => {
      try {
        const auth = getAuth(); // Get Firebase Auth instance
        const currentUser = auth.currentUser; // Get the currently logged-in user

        if (!currentUser) {
          alert("You must be logged in to view your lendings.");
          return;
        }

        const userId = currentUser.uid; // Get the user ID of the logged-in user

        // Query the "lendings" collection for lendings associated with the current user
        const lendingsCollection = collection(firestore, "lendings");
        const userLendingsQuery = query(lendingsCollection, where("userId", "==", userId));
        const snapshot = await getDocs(userLendingsQuery);

        const lendingsWithDetails = await Promise.all(
          snapshot.docs.map(async (docSnapshot) => {
            const lending = docSnapshot.data();

            // Fetch book title
            const bookDoc = await getDoc(doc(firestore, "books", lending.bookId));
            const bookTitle = bookDoc.exists() ? bookDoc.data().title : "Unknown Book";

            // Fetch borrower name
            const userDoc = await getDoc(doc(firestore, "users", lending.userId));
            const borrowerName = userDoc.exists() ? userDoc.data().name : "Unknown User";

            return {
              id: docSnapshot.id,
              bookTitle,
              borrowerName,
              borrowDate: lending.borrowDate,
              returnDate: lending.returnDate,
              status: lending.status,
            };
          })
        );

        setLendings(lendingsWithDetails);
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
        <h1 className="text-3xl font-bold mb-6">My Lendings</h1>
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