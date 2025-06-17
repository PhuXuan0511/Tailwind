import React, { useEffect, useState } from "react";
import { collection, query, where, doc, getDoc, onSnapshot, addDoc } from "firebase/firestore";
import { firestore } from "~/lib/firebase";
import { getAuth } from "firebase/auth";
import { Head } from "~/components/shared/Head";
import { useNavigate } from "react-router-dom";
import Loader from "~/components/common/Loader"; // Import Loader component
import DeleteButton from "~/components/shared/buttons/DeleteButton"; // Import DeleteButton component
import BackButton from "~/components/shared/buttons/BackButton";
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
    const userLendingsQuery = query(lendingsCollection, where("userId", "==", userId)); // Query only current user's lendings

    // Use onSnapshot to listen for real-time updates
    const unsubscribe = onSnapshot(userLendingsQuery, async (snapshot) => {
      const lendingsWithDetails = await Promise.all(
        snapshot.docs.map(async (docSnapshot) => {
          const lending = docSnapshot.data();

          // Fetch book title
          const bookDoc = await getDoc(doc(firestore, "books", lending.bookId));
          const bookTitle = bookDoc.exists() ? bookDoc.data().title : "Unknown Book";

          // Fetch borrower name dynamically using userId
          const borrowerName = currentUser.displayName || "Unknown User";

          return {
            id: docSnapshot.id,
            bookTitle,
            borrowerName,
            requestDate: lending.requestDate,
            returnDate: lending.returnDate,
            status: lending.status,
            fee: lending.overdueFee,
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
        fee: 0, // Initialize fee to 0, can be updated later
      };

      await addDoc(collection(firestore, "lendings"), lendingRequest);
      alert(`Request to borrow "${book.title}" submitted successfully!`);
    } catch (error) {
      console.error("Error creating lending request:", error);
      alert("Failed to submit request. Please try again.");
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
      <BackButton className="mb-4" />
      <Head title="View Lendings" />
      <div className="container mx-auto px-4 py-6">
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
                <th className="border-b border-gray-700 p-2">Fee</th>
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
                  <td className="border-b border-gray-700 p-2">{lending.fee !== undefined ? `$${lending.fee.toFixed(2)}` : "N/A"}</td>
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