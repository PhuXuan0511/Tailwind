import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getFirestore, onSnapshot } from 'firebase/firestore'; // Add onSnapshot import
import { useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth";

interface UserProfile {
  displayName: string;
  email: string;
  photoURL: string;
  uid: string;
  createdAt?: string;
  birthyear?: string;
  address?: string;
  phoneNumber?: string;
  role?: string;

  // Add any other user attributes you want to display
}

const ViewProfile: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  const handleLogout = async () => {
    try {
      const authInstance = getAuth(); // Ensure auth is initialized
      await signOut(authInstance);
      alert("You have been logged out.");
      navigate("/"); // Redirect to login page after logout
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);

        // Use onSnapshot to listen for real-time updates
        const unsubscribeUserDoc = onSnapshot(userDocRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data() as Omit<
              UserProfile,
              "displayName" | "email" | "photoURL" | "uid"
            >;

            setUser({
              displayName: currentUser.displayName || "No Name",
              email: currentUser.email || "No Email",
              photoURL:
                currentUser.photoURL || "https://via.placeholder.com/150",
              uid: currentUser.uid,
              ...userData,
            });
          } else {
            setUser({
              displayName: currentUser.displayName || "No Name",
              email: currentUser.email || "No Email",
              photoURL:
                currentUser.photoURL || "https://via.placeholder.com/150",
              uid: currentUser.uid,
            });
          }
        });

        return () => unsubscribeUserDoc(); // Cleanup Firestore listener
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe(); // Cleanup Auth listener
  }, [auth, db, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center p-4 max-w-md">
          <h2 className="text-2xl font-bold text-red-600">User Not Found</h2>
          <p className="mt-2">Please sign in to view your profile.</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 btn btn-primary"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)} // Navigate to the previous page
          className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
        >
          Back
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 ml-2"
        >
          Logout
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto">
        <div className="md:flex">
          <div className="md:w-1/3 bg-primary p-8 text-center">
            <div className="w-32 h-32 rounded-full mx-auto overflow-hidden border-4 border-white">
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://via.placeholder.com/150?text=No+Image";
                }}
              />
            </div>
            <h2 className="mt-4 text-xl font-bold text-white">
              {user.displayName}
            </h2>
            <p className="text-primary-content opacity-80">
              {user.role || "User"}
            </p>
          </div>

          <div className="md:w-2/3 p-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
              User Profile
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="profile-item">
                <h3 className="text-gray-500 text-sm">Email</h3>
                <p className="text-gray-800">{user.email}</p>
              </div>

              <div className="profile-item">
                <h3 className="text-gray-500 text-sm">User ID</h3>
                <p className="text-gray-800 truncate">{user.uid}</p>
              </div>

              {user.birthyear && (
                <div className="profile-item">
                  <h3 className="text-gray-500 text-sm">Birth Year</h3>
                  <p className="text-gray-800">{user.birthyear}</p>
                </div>
              )}

              {user.phoneNumber && (
                <div className="profile-item">
                  <h3 className="text-gray-500 text-sm">Phone Number</h3>
                  <p className="text-gray-800">{user.phoneNumber}</p>
                </div>
              )}

              {user.address && (
                <div className="profile-item">
                  <h3 className="text-gray-500 text-sm">Address</h3>
                  <p className="text-gray-800">{user.address}</p>
                </div>
              )}

              {user.createdAt && (
                <div className="profile-item">
                  <h3 className="text-gray-500 text-sm">Account Created</h3>
                  <p className="text-gray-800">{user.createdAt}</p>
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => navigate("../manage-user/edit/" + user.uid)}
                className="btn btn-primary"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
