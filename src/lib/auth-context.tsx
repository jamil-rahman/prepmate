"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  type UserCredential 
} from "firebase/auth";
import { auth } from "./firebase";
import type { ReactNode, ReactElement } from "react";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<UserCredential>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): ReactElement {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);

      // When user signs in, send their data to our API
      if (user) {
        sendUserToAPI(user);
      }
    });

    return () => unsubscribe();
  }, []);

  const sendUserToAPI = async (user: User): Promise<void> => {
    try {
      const idToken = await user.getIdToken();
      
      await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          email: user.email,
          name: user.displayName,
        }),
      });
    } catch (error) {
      console.error("Error sending user data to API:", error);
    }
  };

  const signInWithGoogle = async (): Promise<UserCredential> => {
    if (!auth) {
      throw new Error("Firebase auth not initialized");
    }

    const provider = new GoogleAuthProvider();
    provider.addScope("email");
    provider.addScope("profile");
    
    return signInWithPopup(auth, provider);
  };

  const signOut = async (): Promise<void> => {
    if (!auth) {
      throw new Error("Firebase auth not initialized");
    }

    return firebaseSignOut(auth);
  };

  const value: AuthContextType = {
    user,
    loading,
    signInWithGoogle,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}