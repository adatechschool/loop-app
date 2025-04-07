import { Box, Stack } from "@chakra-ui/react";
import React from "react";
import Card from "../Card/Card";
import { mockPlaces, mockUsers } from "../../utils/mock";

interface ListCardsProps {
  favorites: string[]; // Array of favorite place names
  onSeeMore: (title: string) => void;
  onAddToFavorites: (title: string) => void;
  data?: typeof mockPlaces; // Optional: array of places to display
}

const ListCards: React.FC<ListCardsProps> = ({
  favorites,
  onSeeMore,
  onAddToFavorites,
  data,
}) => {
  // Use provided data if available; otherwise, use all mockPlaces
  const places = data || mockPlaces;

  return (
    <Stack spacing={4}>
      {places.map((place, index) => {

        const isFavorite = favorites.includes(place.name);

        const user = mockUsers.find((user) => user.username === place.author);

        return (
          <Card
            key={index}
            index={index}  // Pass the index prop to the Card component
            images={place.image}
            title={place.name}
            description={place.description}
            userName={user ? user.username : "Unknown"}
            userAvatar={user?.profilePicture || "https://via.placeholder.com/150"}
            isFavorite={isFavorite}
            onSeeMore={onSeeMore}
            onAddToFavorites={onAddToFavorites}
          />
        );
      })}
      <Box h={54} />
    </Stack>
  );
};

export default ListCards;
