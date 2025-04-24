import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export const SignInButton = () => {
  const navigate = useNavigate();

  const handleClick = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    auth.languageCode = "en";

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Handle successful sign-in
      console.log("Signed in user:", user);
      navigate("/homepage");
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition normal-case min-w-60"
    >
      Sign In With Google
    </button>
  );
};
