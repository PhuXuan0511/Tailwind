import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { getAuth } from "firebase/auth";

export const SignInButton = () => {
  const handleClick = () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    // @see https://firebase.google.com/docs/auth/web/google-signin
    auth.languageCode = "ja";

    signInWithRedirect(auth, provider);
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className="btn btn-primary normal-case min-w-60"
    >
      Sign In With Google
    </button>
  );
};
