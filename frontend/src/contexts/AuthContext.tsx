import React, { createContext, useState, useEffect, useCallback } from "react";
import apiClient from "src/utils/apiClient";
interface AuthContextType {
    user: any | null;
    token: string | null;
    loading: boolean;
    error: string | null;
    login: (token: string) => void;
    logout: () => void;
    refetchUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    loading: true,
    error: null,
    login: () => { },
    logout: () => { },
    refetchUser: async () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any | null>(null);
    const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUser = useCallback(async () => {
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const response = await apiClient.get("/api/user", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(response.data.user);
            setError(null);
        } catch (err: any) {
            console.error("Fetch user error:", err);
            setUser(null);
            setError(err.message || "Failed to fetch user");
            localStorage.removeItem("token");
            setToken(null);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const login = (newToken: string) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
        fetchUser();
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, error, login, logout, refetchUser: fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
};
