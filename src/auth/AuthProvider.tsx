import { useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import { clearToken, getToken, saveToken } from "./tokenStorage";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => getToken());

  const login = (newToken: string) => {
    saveToken(newToken);
    setToken(newToken);
  };

  const logout = () => {
    clearToken();
    setToken(null);
  };

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: !!token,
      login,
      logout,
    }),
    [token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
