import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import library6 from "~/components/image/library6.jpg"; // Correctly importing library6
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const SignInButton = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log("Google Sign-In successful:", user.uid); // Log the user's UID
      navigate("/homepage"); // Redirect to the homepage or another page after login
    } catch (error: any) {
      console.error("Error during Google Sign-In:", error.message);
      alert("Failed to sign in with Google. Please try again.");
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here (e.g., Firebase authentication)
    console.log("Email:", email);
    console.log("Password:", password);
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
          <button
            onClick={() => navigate("/signup")}
            type="button"
            className="text-blue-400 hover:underline"
          >
            Don't have an account? Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;