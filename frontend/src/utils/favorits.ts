import apiClient from "./apiClient";

export const getUserFavorites = async () => {
  const res = await apiClient.get("/api/favorites"); // <-- ajouté /api
  return res.data;
};

export const addFavorite = async (placeId: string) => {
  const res = await apiClient.post("/api/favorites", { placeId });
  return res.data;
};

export const removeFavorite = async (placeId: string) => {
  const res = await apiClient.delete(`/api/favorites/${placeId}`);
  return res.data;
};