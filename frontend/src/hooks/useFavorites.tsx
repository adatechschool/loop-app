import { useEffect, useState } from "react";
import { addFavorite, removeFavorite, getUserFavorites } from "../utils/favorits";

const useFavorites = () => {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const res = await getUserFavorites();
        if (res.success && res.favorites) {
          setFavorites(res.favorites); // ✅ on garde directement les lieux
        }
      } catch (err) {
        console.error("Error fetching favorites:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const toggleFavorite = async (placeId: string) => {
    try {
      if (favorites.includes(placeId)) {
        await removeFavorite(placeId); // 🔴 peut-être number ici
        setFavorites((prev) => prev.filter((id) => id !== placeId));
      } else {
        await addFavorite(placeId);
        setFavorites((prev) => [...prev, placeId]);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };


  const isFavorite = (placeId: string) =>
    favorites.some((place) => place.id === placeId);

  return { favorites, toggleFavorite, isFavorite, loading };
};

export default useFavorites;
