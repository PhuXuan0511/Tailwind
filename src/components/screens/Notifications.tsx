import React, { useEffect, useState } from "react";
import { collection, query, where, getFirestore, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

type Notification = {
  id: string;
  message: string;
};

function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

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

    const q = query(notificationsCollection, where("userId", "==", currentUserId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notificationsList: Notification[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        message: doc.data().message,
      }));
      setNotifications(notificationsList);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    const db = getFirestore();
    await deleteDoc(doc(db, "notifications", id));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-4xl font-bold mb-6">Notifications</h1>
        <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div key={notification.id} className="flex items-center justify-between mb-4">
                <p className="text-gray-300">{notification.message}</p>
                <button
                  onClick={() => handleDelete(notification.id)}
                  className="ml-4 p-1 rounded text-red-500 hover:text-red-600 focus:outline-none"
                  aria-label="Delete notification"
                >
                  <span className="text-xs font-bold">&#10005;</span>
                </button>
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