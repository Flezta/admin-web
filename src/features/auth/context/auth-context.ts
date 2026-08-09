import { createContext } from "react";
import type { User } from "../../../types/user";

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  isLoading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<User>;
  loginWithGoogle: () => Promise<User>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<User>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
