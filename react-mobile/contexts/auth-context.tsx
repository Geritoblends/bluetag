import { createContext, useEffect, useState, ReactNode } from "react";
import * as SecureStore from "expo-secure-store";
// import jwtDecode from "jwt-decode";

type User = {
  token: string;
  userId: number;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

function isExpired(token: string) {
  try {
    const decoded: any = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const token = await SecureStore.getItemAsync("token");
      if (!token || isExpired(token)) {
        setUser(null);
        setLoading(false);
        return;
      }

      const decoded: any = jwtDecode(token);
      setUser({ token, userId: decoded.userId });
      setLoading(false);
    }

    load();
  }, []);

  const login = async (token: string) => {
    await SecureStore.setItemAsync("token", token);
    // const decoded: any = jwtDecode(token);
    alert("fuck u");
    setUser({ token, userId: 8 });
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
