import React from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "~/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

function LoginScreen() {
  const navigate = useNavigate();

  // Handle Google Login
  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if the user exists in Firestore
      const userDocRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // If the user doesn't exist, create a new document with a default role
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          name: user.displayName || "Unknown",
          role: "user", // Default role
          createdAt: new Date().toISOString(),
        });
      }

      alert("Login successful!");
      navigate("/"); // Redirect to the homepage after login
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Failed to log in. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-6">Login</h1>
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Login with Google
        </button>
      </div>
    </div>
  );
}

export default LoginScreen;