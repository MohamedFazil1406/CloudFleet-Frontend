import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  login as loginApi,
  register as registerApi,
} from "../services/authApi";

import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from "../types/auth";

interface AuthContextType {
  user: LoginResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;

  login: (request: LoginRequest) => Promise<LoginResponse>;

  register: (request: RegisterRequest) => Promise<LoginResponse>;

  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "cloudfleet_auth";

interface StoredAuth {
  user: LoginResponse;
  token: string;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<LoginResponse | null>(null);

  const [token, setToken] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  /*
   * Restore authentication after
   * page refresh.
   */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);

      if (!stored) {
        setLoading(false);
        return;
      }

      const auth: StoredAuth = JSON.parse(stored);

      if (auth?.token && auth?.user) {
        setToken(auth.token);

        setUser(auth.user);
      }
    } catch (error) {
      console.error("Failed to restore authentication:", error);

      localStorage.removeItem(AUTH_STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  /*
   * Save authentication.
   */
  const saveAuth = (response: LoginResponse) => {
    const auth: StoredAuth = {
      user: response,
      token: response.token,
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));

    setUser(response);

    setToken(response.token);
  };

  /*
   * Login.
   */
  const login = async (request: LoginRequest): Promise<LoginResponse> => {
    const response = await loginApi(request);

    saveAuth(response);

    return response;
  };

  /*
   * Register.
   */
  const register = async (request: RegisterRequest): Promise<LoginResponse> => {
    const response = await registerApi(request);

    saveAuth(response);

    return response;
  };

  /*
   * Logout.
   */
  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);

    setUser(null);

    setToken(null);
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/*
 * Hook used by Login, Navbar,
 * ProtectedRoute, etc.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
