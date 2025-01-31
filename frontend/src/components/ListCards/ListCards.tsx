import { Box } from "@chakra-ui/react";
import React from "react";
import Card from '../Card/Card';
import { mockPlaces } from '../../utils/mock';
import { mockUsers } from '../../utils/mock';

interface ListCardsProps {
  favorites: string[];
  onSeeMore: (title: string) => void;
  onAddToFavorites: (title: string) => void;
  isFavorite?: boolean;
}

const ListCards: React.FC<ListCardsProps> = ({ favorites, onSeeMore, onAddToFavorites }) => {
  const displayPlaces = mockPlaces.map((place, index) => {
    const isFavorite = favorites.includes(place.name);  // Check if the place is in the favorites

    return (
      <Card
        key={index}
        images={place.image}
        title={place.name}
        description={place.description}
        userName={mockUsers.find((user) => user.id === place.id)?.name || "Unknown User"}
        isFavorite={isFavorite}  
        onSeeMore={onSeeMore}
        onAddToFavorites={onAddToFavorites}
      />
    );
  });

  return (
    <>
      {displayPlaces}
      <Box h={54} />
    </>
  );
};

export default ListCards;
