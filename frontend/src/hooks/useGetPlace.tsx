import React, { useEffect, useState } from "react";
import apiClient from "src/utils/apiClient";

const useGetPlace = (placeId: string) => {
  const [place, setPlace] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/api/places/${placeId}`);
        console.log("Réponse API place :", response.data);

        if (!response.data.place) {
          throw new Error("Place not found");
        }

        // On récupère l'objet place dans response.data.place
        setPlace(response.data.place);
      } catch (err: any) {
        console.error("Error fetching place data:", err);
        setError(err.message || "Failed to fetch place data");
      } finally {
        setLoading(false);
      }
    };

    if (placeId) {
      fetchPlace();
    }
  }, [placeId]);

  return { place, loading, error };
};

export default useGetPlace;
