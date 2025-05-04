import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import library6 from "~/components/image/library6.jpg"; // Correctly importing library6
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore"; // Firestore functions
import { firestore } from "~/lib/firebase"; // Import Firestore instance
import { toast, ToastContainer } from "react-toastify"; // Import toast functions
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

const SignInButton = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log("Google Sign-In successful:", user.uid); // Log the user's UID

      // Check if the user document exists in Firestore
      const userDocRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Create a new user document if it doesn't exist
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          name: user.displayName || "Anonymous", // Map displayName to name
          role: "user", // Default role
          createdAt: new Date().toISOString(),
        });
        console.log("User document created in Firestore");
      } else {
        console.log("User document already exists in Firestore");
      }

      toast.success("Google Sign-In successful!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });

      navigate("/homepage"); // Redirect to the homepage after login
    } catch (error: any) {
      console.error("Error during Google Sign-In:", error.message);
      toast.error("Failed to sign in with Google. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition normal-case max-w-xs w-full"
    >
      Sign in with Google
    </button>
  );
};

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const auth = getAuth();
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

      console.log("Login successful:", user.uid);

      // Check if the user document exists in Firestore
      const userDocRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // If the user document is missing, show an error
        console.error("User document is missing in Firestore.");
        toast.error("Your account is incomplete. Please contact support.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });
        return; // Stop further execution
      }

      toast.success("Login successful! Redirecting to homepage...", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });

      setTimeout(() => navigate("/homepage"), 3000); // Navigate to the homepage after 3 seconds
    } catch (error: any) {
      console.error("Error during login:", error.message);
      toast.error("Failed to log in. Please check your credentials and try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center"
      style={{
        backgroundImage: `url(${library6})`, // Using library6 as the background image
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <ToastContainer /> {/* Toast container for displaying notifications */}
      <div className="bg-gray-800 bg-opacity-90 p-6 rounded-lg shadow-lg w-full [width:600px] max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-purple-500">
          Welcome Back
        </h1>
        <p className="text-gray-400 text-center mb-8">
          Sign in to access your account and explore our library.
        </p>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 bg-gray-700 text-gray-100 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 bg-gray-700 text-gray-100 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition normal-case max-w-xs w-full"
            >
              Login
            </button>
          </div>
        </form>
        <div className="flex flex-col items-center mt-6 space-y-4">
          <SignInButton />
          <a
            onClick={() => navigate("/signup")}
            className="text-blue-400 hover:underline cursor-pointer"
          >
            Don't have an account? Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;