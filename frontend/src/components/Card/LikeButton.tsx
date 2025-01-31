import React from 'react';
import { IconButton, useToast } from '@chakra-ui/react';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';

interface LikeButtonProps {
  title: string;
  onAddToFavorites: (name: string) => void;
  isFavorite: boolean; 
}

const LikeButton: React.FC<LikeButtonProps> = ({ title, onAddToFavorites, isFavorite }) => {
  const toast = useToast();

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation(); 

    onAddToFavorites(title); 
    if (!isFavorite) {
      toast({
        title: "Added to Favorites",
        description: `"${title}" has been added to your favorites.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Removed from Favorites",
        description: `"${title}" has been removed from your favorites.`,
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <IconButton
      aria-label="Add to Favorites"
      icon={isFavorite ? <MdFavorite /> : <MdFavoriteBorder />}
      onClick={toggleFavorite}
    />
  );
};

export default LikeButton;
