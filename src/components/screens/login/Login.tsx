import React from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "~/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

function LoginScreen() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          name: user.displayName || "Unknown",
          role: "user",
          createdAt: new Date().toISOString(),
        });
      }

      navigate("/");
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Login failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-300">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center w-80">
        <h1 className="text-2xl font-semibold mb-4">Welcome</h1>
        <p className="text-sm mb-6 text-gray-400">Sign in to continue</p>
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600 transition"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default LoginScreen;
