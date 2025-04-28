import React, { useEffect, useState } from "react";
import { collection, query, where, doc, getDoc, onSnapshot, addDoc } from "firebase/firestore";
import { firestore } from "~/lib/firebase";
import { getAuth } from "firebase/auth";
import { Head } from "~/components/shared/Head";
import { useNavigate } from "react-router-dom";

function ViewLending() {
  const [lendings, setLendings] = useState<any[]>([]); // Use `any[]` to handle Firestore data dynamically
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth(); // Get Firebase Auth instance
    const currentUser = auth.currentUser; // Get the currently logged-in user

    if (!currentUser) {
      alert("You must be logged in to view your lendings.");
      return;
    }

    const userId = currentUser.uid; // Get the user ID of the logged-in user
    const lendingsCollection = collection(firestore, "lendings");
    const userLendingsQuery = query(lendingsCollection, where("userId", "==", userId));

    // Use onSnapshot to listen for real-time updates
    const unsubscribe = onSnapshot(userLendingsQuery, async (snapshot) => {
      const lendingsWithDetails = await Promise.all(
        snapshot.docs.map(async (docSnapshot) => {
          const lending = docSnapshot.data();

          // Fetch book title
          const bookDoc = await getDoc(doc(firestore, "books", lending.bookId));
          const bookTitle = bookDoc.exists() ? bookDoc.data().title : "Unknown Book";

          // Fetch borrower name dynamically using userId
          let borrowerName = "Unknown User";
          if (lending.userId) {
            const userDoc = await getDoc(doc(firestore, "users", lending.userId));
            borrowerName = userDoc.exists() && userDoc.data().name ? userDoc.data().name : "Unknown User";
          }

          return {
            id: docSnapshot.id,
            bookTitle,
            borrowerName,
            requestDate: lending.requestDate, // Use requestDate instead of borrowDate
            returnDate: lending.returnDate, // Keep returnDate as is
            status: lending.status,
          };
        })
      );

      setLendings(lendingsWithDetails);
      setLoading(false);
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const handleRequestToBorrow = async (book: any) => {
    try {
      const auth = getAuth(); // Get Firebase Auth instance
      const currentUser = auth.currentUser; // Get the currently logged-in user

      if (!currentUser) {
        alert("You must be logged in to borrow a book.");
        return;
      }

      const lendingRequest = {
        bookId: book.id,
        userId: currentUser.uid, // Use the logged-in user's ID
        requestDate: new Date().toISOString().split("T")[0],
        returnDate: null,
        status: "Requesting",
      };

      await addDoc(collection(firestore, "lendings"), lendingRequest);
      alert(`Request to borrow "${book.title}" submitted successfully!`);
    } catch (error) {
      console.error("Error creating lending request:", error);
      alert("Failed to submit request. Please try again.");
    }
  };

  if (loading) {
    return <p className="text-center text-gray-300">Loading lendings...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head title="View Lendings" />
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <div className="mb-4">
          <button
            onClick={() => navigate(-1)} // Navigate to the previous page
            className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
          >
            Back
          </button>
        </div>

        <h1 className="text-3xl font-bold mb-6">My Lendings</h1>
        <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b border-gray-700 p-2">Title</th>
                <th className="border-b border-gray-700 p-2">Borrower</th>
                <th className="border-b border-gray-700 p-2">Request Date</th>
                <th className="border-b border-gray-700 p-2">Due Date</th>
                <th className="border-b border-gray-700 p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {lendings.map((lending) => (
                <tr key={lending.id}>
                  <td className="border-b border-gray-700 p-2">{lending.bookTitle}</td>
                  <td className="border-b border-gray-700 p-2">{lending.borrowerName}</td>
                  <td className="border-b border-gray-700 p-2">{lending.requestDate}</td>
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