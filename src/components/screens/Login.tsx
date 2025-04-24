import React, { useState } from "react";
import { SignInButton } from "~/components/domain/auth/SignInButton";
import { useNavigate } from "react-router-dom";
import library5 from "~/components/image/library5.jpg";

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
        backgroundImage: `url(${library5})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="bg-gray-800 bg-opacity-90 p-6 rounded-lg shadow-lg w-full [width:600px] max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Welcome Back</h1>
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
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition normal-case min-w-60"
          >
            Login
          </button>
        </form>
        <div className="flex flex-col items-center mt-6 space-y-4">
          <SignInButton />
          <button
            onClick={() => navigate("/signup")}
            type="button"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition normal-case min-w-60"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;