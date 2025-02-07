import React, { useEffect, useState } from 'react';
import { IconButton, useToast } from '@chakra-ui/react';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';

interface LikeButtonProps {
  title: string;
  onAddToFavorites: (name: string) => void;
  isFavorite: boolean; 
}

const LikeButton: React.FC<LikeButtonProps> = ({ title, onAddToFavorites, isFavorite }) => {
  const [favorite, setFavorite] = useState(isFavorite); // Local state to track if the place is a favorite
  const toast = useToast();

  // Update the local state when the `isFavorite` prop changes
  useEffect(() => {
    setFavorite(isFavorite);
  }, [isFavorite]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();  // Prevents the click from triggering parent card click event

    // Toggle the favorite status
    setFavorite((prev) => {
      const newFavoriteStatus = !prev;
      // Call the callback function to update favorites in ProfilePage
      onAddToFavorites(title);
      
      // Show the toast based on whether the place is being added or removed from favorites
      toast({
        title: newFavoriteStatus ? "Added to Favorites" : "Removed from Favorites",
        description: `"${title}" has been ${newFavoriteStatus ? "added to" : "removed from"} your favorites.`,
        status: newFavoriteStatus ? "success" : "info",
        duration: 3000,
        isClosable: true,
      });

      return newFavoriteStatus; // Return the new state
    });
  };

  return (
    <IconButton
      aria-label="Add to Favorites"
      icon={favorite ? <MdFavorite color="red" /> : <MdFavoriteBorder />}
      onClick={toggleFavorite} // Handle toggle
    />
  );
};

export default LikeButton;
