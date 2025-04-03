import React, { useEffect, useState, createContext, useContext } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "~/lib/firebase"; // Import Firebase instances

type AuthContextType = {
  user: User | null; // Firebase user object
  role: string | null; // User role (e.g., "admin" or "user")
  loading: boolean; // Loading state
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
          setRole(userDoc.exists() ? userDoc.data().role : null);
        } catch (error) {
          console.error("Error fetching user role:", error);
          setRole(null);
        }
      } else {
        setRole(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
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