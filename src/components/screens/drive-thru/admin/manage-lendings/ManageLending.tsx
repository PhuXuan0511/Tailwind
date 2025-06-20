import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFirestore } from "~/lib/firebase";
import { collection, doc, getDoc, updateDoc, deleteDoc, onSnapshot, addDoc } from "firebase/firestore";
import { Head } from "~/components/shared/Head";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showToastFromLocalStorage } from "~/components/shared/toastUtils";
import OverdueFee from "./OverdueFee";
import Loader from "~/components/common/Loader"; // Add this import
import BackButton from "~/components/shared/buttons/BackButton";

export enum LendStat { // Lending Statuses to avoid other strings
  Rq = "Requesting",
  Ap = "Approved",
  Br = "Borrowed",
  Rt = "Returned",
  Od = "Overdue",
}

type Lending = {
  id: string;
  bookId: string; // Store only the book ID
  userId: string; // Store only the user ID
  requestDate: string; // Date when the user clicks "Request"
  returnDate: string | null; // Set to null by default, updated when approved
  status: LendStat;
  overdueFee?: number; // Optional, calculated based on returnDate
  bookTitle?: string; // Dynamically fetched
  borrowerName?: string; // Dynamically fetched
  notified?: boolean; // To track if the user has been notified about overdue
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

  // Approve a lending request
  const handleApprove = async (lending: Lending) => {
    try {
      const bookTitle = await fetchBookTitle(lending.bookId); // Fetch book title dynamically

      const bookDocRef = doc(firestore, "books", lending.bookId);
      const bookDoc = await getDoc(bookDocRef);

      if (!bookDoc.exists()) {
        alert("Book not found.");
        return;
      }

      const bookData = bookDoc.data();
      const currentQuantity = bookData.quantity;

      if (currentQuantity <= 0) {
        alert("Book is out of stock.");
        return;
      }

      // Decrease the book quantity by 1
      await updateDoc(bookDocRef, { quantity: currentQuantity - 1 });

      // Update the lending status to "Approved"
      const lendingDocRef = doc(firestore, "lendings", lending.id);
      await updateDoc(lendingDocRef, { status: LendStat.Ap });

      // Add notification for approval
      const notificationsCollection = collection(firestore, "notifications");
      await addDoc(notificationsCollection, {
        message: `Your lending of "${bookTitle}" has been approved, please come and collect.`,
        userId: lending.userId,
        timestamp: new Date().toISOString(),
        read: false,
      });

      // Update the state
      setLendings((prev) =>
        prev.map((l) =>
          l.id === lending.id ? { ...l, status: LendStat.Ap } : l
        )
      );
      setFilteredLendings((prev) =>
        prev.map((l) =>
          l.id === lending.id ? { ...l, status: LendStat.Ap } : l
        )
      );

      toast.success("Lending approved successfully!");
    } catch (error) {
      console.error("Error approving lending:", error);
      toast.error("Failed to approve lending. Please try again.");
    }
  };

  // Mark a lending as borrowed (life: a client fetches the book)
  const handleMarkAsBorrowed = async (lending: Lending) => {
    try {
      const bookTitle = await fetchBookTitle(lending.bookId); // Fetch book title dynamically

      // Set the return date to 7 days from now
      const today = new Date();
      const returnDate = new Date(today);
      returnDate.setDate(today.getDate() + 7);
      const formattedReturnDate = returnDate.toISOString().split("T")[0];

      // Update the lending status to "Borrowed"
      const lendingDocRef = doc(firestore, "lendings", lending.id);
      await updateDoc(lendingDocRef, {
        status: LendStat.Br,
        returnDate: formattedReturnDate,
        overdueFee: 0,
      });

      // Add notification for borrowing
      const notificationsCollection = collection(firestore, "notifications");
      await addDoc(notificationsCollection, {
        message: `You have successfully borrowed "${bookTitle}"!`,
        userId: lending.userId,
        timestamp: new Date().toISOString(),
        read: false,
      });

      // Update the state
      setLendings((prev) =>
        prev.map((l) =>
          l.id === lending.id
            ? { ...l, status: LendStat.Br, returnDate: formattedReturnDate }
            : l
        )
      );
      setFilteredLendings((prev) =>
        prev.map((l) =>
          l.id === lending.id
            ? { ...l, status: LendStat.Br, returnDate: formattedReturnDate }
            : l
        )
      );

      toast.success("Lending marked as borrowed!");
    } catch (error) {
      console.error("Error marking lending as borrowed:", error);
      toast.error("Failed to mark lending as borrowed. Please try again.");
    }
  }

  // Mark a lending as returned
  const handleMarkAsReturned = async (lending: Lending) => {
    try {
      const bookTitle = await fetchBookTitle(lending.bookId); // Fetch book title dynamically

      // Reference to the book document
      const bookDocRef = doc(firestore, "books", lending.bookId);
      const bookDoc = await getDoc(bookDocRef);

      if (!bookDoc.exists()) {
        alert("Book not found.");
        return;
      }

      const bookData = bookDoc.data();
      const currentQuantity = bookData.quantity;

      // Increase the book quantity by 1
      await updateDoc(bookDocRef, { quantity: currentQuantity + 1 });

      // Update the lending status to "Returned"
      const lendingDocRef = doc(firestore, "lendings", lending.id);
      await updateDoc(lendingDocRef, { status: LendStat.Rt });

      // Add notification for returning
      const notificationsCollection = collection(firestore, "notifications");
      await addDoc(notificationsCollection, {
        message: `You have successfully returned "${bookTitle}"!`,
        userId: lending.userId,
        timestamp: new Date().toISOString(),
        read: false,
      });

      // Update the state
      setLendings((prev) =>
        prev.map((l) =>
          l.id === lending.id ? { ...l, status: LendStat.Rt } : l
        )
      );
      setFilteredLendings((prev) =>
        prev.map((l) =>
          l.id === lending.id ? { ...l, status: LendStat.Rt } : l
        )
      );

      toast.success("Lending marked as returned and book quantity updated!");
    } catch (error) {
      console.error("Error marking lending as returned:", error);
      toast.error("Failed to mark lending as returned. Please try again.");
    }
  };

  // Fetch lending records and dynamically fetch book titles and borrower names
  useEffect(() => {
    const lendingsCollection = collection(firestore, "lendings");
    const notificationsCollection = collection(firestore, "notifications");

    // Use onSnapshot to listen for real-time updates
    const unsubscribe = onSnapshot(lendingsCollection, async (snapshot) => {
      const lendingsWithDetails = await Promise.all(
        snapshot.docs.map(async (docSnapshot) => {
          const lending = docSnapshot.data() as Lending;

          // Fetch book title dynamically
          const bookTitle = await fetchBookTitle(lending.bookId);

          // Fetch borrower name dynamically
          const borrowerName = await fetchBorrowerName(lending.userId);

          // If the lending is overdue and not already notified, add a notification
          if (lending.status === LendStat.Od && lending.notified === false) {
            try {
              // Add notification to the notifications collection
              await addDoc(notificationsCollection, {
                message: `Your lending of "${bookTitle}" is overdue. Please return it and pay the fee as soon as possible.`,
                userId: lending.userId,
                timestamp: new Date().toISOString(),
                read: false, // Add read field
              });

              // Update the notified field in the lendings collection
              const lendingDocRef = doc(firestore, "lendings", docSnapshot.id);
              await updateDoc(lendingDocRef, { notified: true });
            } catch (error) {
              console.error("Error adding notification or updating notified field:", error);
            }
          }

          return {
            ...lending,
            id: docSnapshot.id,
            bookTitle,
            borrowerName, // Add borrowerName to the lending details
          };
        })
      );

      lendingsWithDetails.forEach(async (lending) => {    
        // If the lending is borrowed, check if it is overdue
        if (lending.status === LendStat.Br){
          if (lending.returnDate && new Date(lending.returnDate) < new Date()) {
              try {
                await updateDoc(doc(firestore, "lendings", lending.id), {
                  status: LendStat.Od,
                  overdueFee: OverdueFee(lending.returnDate),
                });
              } catch (error) {
                console.error("Error updating overdue lending:", error);
              }
            }   
        }
        // If the lending is overdue, update the overdue fee
        if (lending.status === LendStat.Od) {
          // If the return date is updated, reset the overdue fee
          if (lending.returnDate && new Date(lending.returnDate) > new Date()) {
            try {
              await updateDoc(doc(firestore, "lendings", lending.id), {
                status: LendStat.Br,
                overdueFee: 0,
              });
            } catch (error) {
              console.error("Error resetting overdue fee:", error);
            }
            return;
          }
          else try {
            await updateDoc(doc(firestore, "lendings", lending.id), { overdueFee: OverdueFee(lending.returnDate) }); 
          } catch (error) {
            console.error("Error updating overdue lending:", error);
          }
        }
      });

      setLendings(lendingsWithDetails);
      setFilteredLendings(lendingsWithDetails);
      setLoading(false);
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
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

  const handleAction = async (action: string, lendingId: string) => {
    const lending = lendings.find((l) => l.id === lendingId);

    if (!lending) {
      toast.error("Lending not found.");
      return;
    }

    if (action === "approve") {
      await handleApprove(lending); // Call the handleApprove function
    } else if (action === "markAsBorrowed") {
      await handleMarkAsBorrowed(lending); // Call the handleMarkAsBorrowed function
    } else if (action === "markAsReturned") {
      await handleMarkAsReturned(lending); // Call the handleMarkAsReturned function
    } else if (action === "edit") {
      navigate(`/manage-lending/edit/${lendingId}`);
    } else if (action === "delete") {
      const confirmDelete = window.confirm("Are you sure you want to delete this lending?");
      if (confirmDelete) {
        try {
          await deleteDoc(doc(firestore, "lendings", lendingId));
          setLendings((prev) => prev.filter((l) => l.id !== lendingId));
          setFilteredLendings((prev) => prev.filter((l) => l.id !== lendingId));
          toast.success("Lending deleted successfully!");
        } catch (error) {
          console.error("Error deleting lending:", error);
          toast.error("Failed to delete lending. Please try again.");
        }
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
      <Head title="Manage Lending" />
      <ToastContainer />
      <div className="container mx-auto px-4 py-6">
        <BackButton className="mb-4" />
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
        </div>
        <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700 min-h-[200px] flex items-center justify-center">
          {loading ? (
            <Loader />
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b border-gray-700 p-2">Book Title</th>
                  <th className="border-b border-gray-700 p-2">Borrower Name</th>
                  <th className="border-b border-gray-700 p-2">Request Date</th>
                  <th className="border-b border-gray-700 p-2">Return Date</th>
                  <th className="border-b border-gray-700 p-2">Status</th>
                  <th className="border-b border-gray-700 p-2">Fee</th>
                  <th className="border-b border-gray-700 p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLendings.map((lending) => (
                  <tr key={lending.id}>
                    <td className="border-b border-gray-700 p-2">{lending.bookTitle || "Loading..."}</td>
                    <td className="border-b border-gray-700 p-2">{lending.borrowerName || "Loading..."}</td>
                    <td className="border-b border-gray-700 p-2">{lending.requestDate}</td>
                    <td className="border-b border-gray-700 p-2">
                      {lending.returnDate || null}
                    </td>
                    <td className="border-b border-gray-700 p-2">{lending.status}</td>
                    <td className="border-b border-gray-700 p-2">
                      {lending.overdueFee !== undefined ? `$${lending.overdueFee.toFixed(2)}` : "N/A"}
                    </td>
                    <td className="border-b border-gray-700 p-2">
                      <select
                        onChange={(e) => handleAction(e.target.value, lending.id)}
                        className="bg-gray-700 text-white p-2 rounded w-48"
                      >
                        <option value="">Select Action</option>
                        {lending.status === LendStat.Rq && <option value="approve">Approve</option>}
                        {lending.status === LendStat.Ap && (
                          <option value="markAsBorrowed">Mark as Borrowed</option>
                        )}
                        {(lending.status === LendStat.Br || lending.status === LendStat.Od) && (
                          <option value="markAsReturned">Mark as Returned</option>
                        )}
                        <option value="edit">Edit</option>
                        {(lending.status != LendStat.Br && lending.status != LendStat.Od) && (
                          <option value="delete">Delete</option>
                        )}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageLending;
