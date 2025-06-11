import React, { useEffect, useState } from "react";
import { collection, query, where, getFirestore, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";

function Notifications() {
  const [notifications, setNotifications] = useState<string[]>([]);
  
  useEffect(() => {
    const auth = getAuth(); // Get Firebase Auth instance
    const currentUser = auth.currentUser; // Get the currently logged-in user

    if (!currentUser) {
      alert("You must be logged in to view your notifications.");
      return;
    }

    const currentUserId = currentUser.uid; // Get the user ID of the logged-in user
    const db = getFirestore();
    const notificationsCollection = collection(db, "notifications");

    // Query notifications for the current user
    const q = query(notificationsCollection, where("userId", "==", currentUserId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notificationsList: string[] = snapshot.docs.map((doc) => doc.data().message);
      setNotifications(notificationsList);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-4xl font-bold mb-6">Notifications</h1>
        <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
          {notifications.length > 0 ? (
            notifications.map((message, index) => (
              <p key={index} className="text-gray-300 mb-4">
                {message}
              </p>
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