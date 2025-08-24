import React, { useEffect, useState } from "react";
import { IconButton, useToast } from "@chakra-ui/react";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";

interface LikeButtonProps {
  title: string;
  isFavorite?: boolean;
  onClick?: () => void; // 🔹 renommé depuis onAddToFavorites
}

const LikeButton: React.FC<LikeButtonProps> = ({ title, isFavorite, onClick }) => {
  const [favorite, setFavorite] = useState(isFavorite);
  const toast = useToast();
  const token = localStorage.getItem("token");

  useEffect(() => {
    setFavorite(isFavorite);
  }, [isFavorite]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorite((prev) => {
      const newFavoriteStatus = !prev;
      toast({
        title: newFavoriteStatus ? "Added to Favorites" : "Removed from Favorites",
        description: `"${title}" has been ${newFavoriteStatus ? "added to" : "removed from"} your favorites.`,
        status: newFavoriteStatus ? "success" : "info",
        duration: 1500,
        isClosable: true,
      });

      if (onClick) onClick(); // 🔹 appelle le callback du parent
      return newFavoriteStatus;
    });
  };

  if (!token) return null;

  return (
    <IconButton
      ml={2}
      aria-label="Add to Favorites"
      icon={favorite ? <MdFavorite color="red" /> : <MdFavoriteBorder />}
      onClick={toggleFavorite}
    />
  );
};

export default LikeButton;


