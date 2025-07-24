import { useState, useEffect, useCallback } from "react";
import apiClient from "src/utils/apiClient";

const useQueryUser = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("Aucun token trouvé dans localStorage.");
      setUser(null);
      setError("Utilisateur non authentifié");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.get(`/api/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(response.data.user);
      setError(null);
    } catch (err: any) {
      console.error("Erreur lors de la récupération de l'utilisateur :", err);
      setError(err.response?.data?.message || err.message || "Erreur inconnue");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, loading, error, refetch: fetchUser };
};

export default useQueryUser;
