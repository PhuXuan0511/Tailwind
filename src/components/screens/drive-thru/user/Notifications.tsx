import React, { useEffect, useState } from "react";
import { collection, query, where, getFirestore, onSnapshot } from "firebase/firestore";
import { useAuth } from "~/lib/useAuth"; // Use your context

function Notifications() {
  const [notifications, setNotifications] = useState<string[]>([]);
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return; // Wait for auth to load
    if (!user) return;

    const currentUserId = user.uid;
    const db = getFirestore();
    const notificationsCollection = collection(db, "notifications");

    // Query notifications for the current user
    const q = query(notificationsCollection, where("userId", "==", currentUserId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notificationsList: string[] = snapshot.docs.map((doc) => doc.data().message);
      setNotifications(notificationsList);
    });

    return () => unsubscribe();
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <span className="text-gray-300">Loading...</span>
      </div>
    );
  }

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
