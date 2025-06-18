import React, { useEffect, useState } from "react";
import { collection, query, where, getFirestore, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Loader from "~/components/common/Loader"; // Import Loader component
import DeleteButton from "~/components/shared/buttons/DeleteButton";
import BackButton from "~/components/shared/buttons/BackButton";

type Notification = {
  id: string;
  message: string;
  timestamp: string;
};

// Helper function to format the timestamp
function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return date.toLocaleString("en-US", options);
}

function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      alert("You must be logged in to view your notifications.");
      return;
    }

    const currentUserId = currentUser.uid;
    const db = getFirestore();
    const notificationsCollection = collection(db, "notifications");

    const q = query(notificationsCollection, where("userId", "==", currentUserId), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notificationsList: Notification[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        message: doc.data().message,
        timestamp: doc.data().timestamp,
      }));
      setNotifications(notificationsList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    const db = getFirestore();
    await deleteDoc(doc(db, "notifications", id));
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
      <div className="container mx-auto px-4 py-6">
        <BackButton className="mb-4" />
        <h1 className="text-4xl font-bold mb-6">Notifications</h1>
        <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div key={notification.id} className="mb-4">
                <p className="text-gray-300">{notification.message}</p>
                <p className="text-gray-500 text-sm">
                  {formatTimestamp(notification.timestamp)}
                </p>
                <div className="flex justify-between items-end mt-2">
                  <div />
                  <DeleteButton
                  onClick={() => handleDelete(notification.id)}
                  className="self-end"
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No notifications available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notifications;