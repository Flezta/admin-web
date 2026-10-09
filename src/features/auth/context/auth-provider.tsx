import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  deleteUser,
  getAdditionalUserInfo,
  updateProfile,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth, googleProvider } from "../../../lib/utils/firebase";
import {
  useCreateUserMutation,
  useLazyGetCurrentUserQuery,
} from "../../../store/api/authApi";
import type { User } from "../../../types/user";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const explicitAuthPending = useRef(false);
  const [createUser] = useCreateUserMutation();

  // RTK Query still owns the actual request + cache; Context just consumes it
  const [triggerGetCurrentUser] = useLazyGetCurrentUserQuery();

  const fetchCurrentUser = async () => {
    const data = await triggerGetCurrentUser().unwrap();
    setUser(data);
    return data;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (explicitAuthPending.current) return;
      if (firebaseUser) {
        try {
          const nextToken = await firebaseUser.getIdToken();
          const nextUser = await triggerGetCurrentUser().unwrap();
          if (
            explicitAuthPending.current ||
            auth.currentUser?.uid !== firebaseUser.uid
          )
            return;
          setToken(nextToken);
          setUser(nextUser);
        } catch {
          if (
            explicitAuthPending.current ||
            auth.currentUser?.uid !== firebaseUser.uid
          )
            return;
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

  const runAuthOperation = async (operation: () => Promise<User>) => {
    if (explicitAuthPending.current)
      throw new Error("An authentication request is already in progress.");
    explicitAuthPending.current = true;
    setIsLoading(true);
    try {
      const nextUser = await operation();
      if (!auth.currentUser)
        throw new Error("Your session expired. Please try again.");
      setToken(await auth.currentUser.getIdToken());
      setUser(nextUser);
      return nextUser;
    } catch (error) {
      setToken(null);
      setUser(null);
      await signOut(auth);
      throw error;
    } finally {
      explicitAuthPending.current = false;
      setIsLoading(false);
    }
  };

  const loginWithEmail = (email: string, password: string) =>
    runAuthOperation(async () => {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      return fetchCurrentUser();
    });

  const loginWithGoogle = () =>
    runAuthOperation(async () => {
      await signInWithPopup(auth, googleProvider);
      return fetchCurrentUser();
    });

  const recoverFailedRegistration = async (
    firebaseUser: FirebaseUser,
    registrationError: unknown,
  ): Promise<User> => {
    try {
      return await triggerGetCurrentUser().unwrap();
    } catch (profileError) {
      const requestStatus = (registrationError as { status?: number | string })
        ?.status;
      if (
        (profileError as { status?: number })?.status !== 404 ||
        requestStatus === "FETCH_ERROR" ||
        requestStatus === "TIMEOUT_ERROR"
      ) {
        throw new Error(
          "Your sign-in account was created, but profile setup could not be confirmed. Please contact support before registering again.",
          { cause: profileError },
        );
      }
    }
    try {
      await deleteUser(firebaseUser);
    } catch {
      throw new Error(
        "Your sign-in account was created, but profile setup failed. Please contact support before registering again.",
      );
    }
    throw registrationError;
  };

  const signUpWithEmail = (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) =>
    runAuthOperation(async () => {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );
      try {
        await updateProfile(credential.user, {
          displayName: `${firstName.trim()} ${lastName.trim()}`,
        });
        return await createUser({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: credential.user.email!,
        }).unwrap();
      } catch (error) {
        return recoverFailedRegistration(credential.user, error);
      }
    });

  const signUpWithGoogle = (firstName = "", lastName = "") =>
    runAuthOperation(async () => {
      const credential = await signInWithPopup(auth, googleProvider);
      const additionalInfo = getAdditionalUserInfo(credential);
      try {
        try {
          return await triggerGetCurrentUser().unwrap();
        } catch (error) {
          if ((error as { status?: number }).status !== 404) throw error;
        }
        const profile = additionalInfo?.profile;
        const givenName =
          firstName.trim() ||
          (typeof profile?.given_name === "string"
            ? profile.given_name.trim()
            : "");
        const familyName =
          lastName.trim() ||
          (typeof profile?.family_name === "string"
            ? profile.family_name.trim()
            : "");
        if (!givenName || !familyName)
          throw new Error(
            "Enter your first and last names, then continue with Google again.",
          );
        if (!credential.user.email)
          throw new Error("Your Google account must have an email address.");
        return await createUser({
          firstName: givenName,
          lastName: familyName,
          email: credential.user.email,
        }).unwrap();
      } catch (error) {
        if (additionalInfo?.isNewUser) {
          return recoverFailedRegistration(credential.user, error);
        }
        throw error;
      }
    });

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email.trim());
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
        signUpWithEmail,
        signUpWithGoogle,
        resetPassword,
        logout,
        refetchUser: fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
