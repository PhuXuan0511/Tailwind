import React, { useEffect, useState, createContext, useContext } from "react";
import { onAuthStateChanged, User, signOut as firebaseSignOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "~/lib/firebase"; // Import Firebase instances

type AuthContextType = {
  user: User | null; // Firebase user object
  role: string | null; // User role (e.g., "admin" or "user")
  loading: boolean; // Loading state
  signOut: () => Promise<void>; // Sign-out method
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(firestore, "users", currentUser.uid));
          const fetchedRole = userDoc.exists() ? userDoc.data().role || "user" : "user";
          console.log("Fetched role:", fetchedRole); // Debug role
          setRole(fetchedRole);
        } catch (error) {
          console.error("Error fetching user role:", error);
          setRole("user"); // Default to "user" on error
        }
      } else {
        setRole(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await firebaseSignOut(auth); // Sign out the user using Firebase Auth
      setUser(null); // Clear the user state
      setRole(null); // Clear the role state
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};