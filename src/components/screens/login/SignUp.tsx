import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc, doc, setDoc } from "firebase/firestore"; // Import Firestore functions
import { toast, ToastContainer } from "react-toastify"; // Import toast functions
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import library6 from "~/components/image/library6.jpg";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState(""); // New state for username
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const firestore = getFirestore(); // Initialize Firestore

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add user data to Firestore with the `uid` as the document ID
      const userDocRef = doc(firestore, "users", user.uid); // Use `uid` as the document ID
      await setDoc(userDocRef, {
        uid: user.uid,
        email: email,
        name: username, // Store the username as "name"
        role: "user", // Default role
        createdAt: new Date().toISOString(),
      });

      // Show success toast
      toast.success("Sign-up successful! Welcome to Tailwind Library!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });

      console.log("User signed up successfully:", email);
      setTimeout(() => navigate("/"), 3000); // Navigate to the login page after 3 seconds
    } catch (err: any) {
      console.error("Error during sign-up:", err.message);
      setError(err.message);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center"
      style={{
        backgroundImage: `url(${library6})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <ToastContainer /> {/* Toast container for displaying notifications */}
      <div className="bg-gray-800 bg-opacity-90 p-6 rounded-lg shadow-lg w-full [width:600px] max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Create an Account</h1>
        <p className="text-gray-400 text-center mb-8">
          Sign up to explore our library and access exclusive features.
        </p>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSignUp} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-4 py-2 bg-gray-700 text-gray-100 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your username"
              required
            />
          </div>
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
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 bg-gray-700 text-gray-100 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Confirm your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition normal-case min-w-60"
          >
            Sign Up
          </button>
        </form>
        <div className="flex justify-center mt-6">
          <button
            onClick={() => navigate("/")} // Navigate to the login page ("/") when clicked
            type="button"
            className="text-blue-400 hover:underline"
          >
            Already have an account? Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignUp;

