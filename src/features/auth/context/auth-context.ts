import { createContext } from "react";
import type { User } from "../../../types/user";

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  isLoading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<User>;
  loginWithGoogle: () => Promise<User>;
  signUpWithEmail: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) => Promise<User>;
  signUpWithGoogle: (firstName?: string, lastName?: string) => Promise<User>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<User>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
