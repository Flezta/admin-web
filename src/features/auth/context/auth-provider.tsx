import { useEffect, useState, type ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, googleProvider } from "../../../lib/firebase";
import { useLazyGetCurrentUserQuery } from "../../../store/api/authApi";
import type { User } from "../../../types/user";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // RTK Query still owns the actual request + cache; Context just consumes it
  const [triggerGetCurrentUser] = useLazyGetCurrentUserQuery();

  const fetchCurrentUser = async () => {
    const data = await triggerGetCurrentUser().unwrap();
    setUser(data);
    return data;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          setToken(await firebaseUser.getIdToken());
          await fetchCurrentUser();
        } catch {
          // token valid with Firebase but rejected by our API (disabled, not provisioned, etc.)
          setToken(null);
          setUser(null);
          await signOut(auth);
        }
      } else {
        setToken(null);
        setUser(null);
      }
      setIsLoading(false);
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loginWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    return fetchCurrentUser();
  };

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
    return fetchCurrentUser();
  };

  const logout = async () => {
    await signOut(auth);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        token,
        isLoading,
        loginWithEmail,
        loginWithGoogle,
        logout,
        refetchUser: fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
