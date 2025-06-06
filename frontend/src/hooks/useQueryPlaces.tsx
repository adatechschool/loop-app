import { useState, useEffect } from "react";
import apiClient from "src/utils/apiClient";

const useQueryPlaces = () => {
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/api/places");
        setPlaces(response.data.places);
      } catch (err: any) {
        console.error("Error fetching places data:", err);
        setError(err.message || "Failed to fetch places data");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  return { places, loading, error };
};

export default useQueryPlaces;
