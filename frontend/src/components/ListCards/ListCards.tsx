import { Box, Stack } from "@chakra-ui/react";
import React from "react";
import Card from "../Card/Card"; // Assuming this is your card component
import { mockPlaces, mockUsers } from "../../utils/mock";

interface ListCardsProps {
  favorites: string[]; // Array of favorite place names
  onSeeMore: (title: string) => void;
  onAddToFavorites: (title: string) => void; // Function to add or remove favorites
}

const ListCards: React.FC<ListCardsProps> = ({
  favorites,
  onSeeMore,
  onAddToFavorites,
}) => {
  return (
    <Stack spacing={4}>
      {mockPlaces.map((place, index) => {
        // Check if this place is in favorites
        const isFavorite = favorites.includes(place.name);

        // Find the user based on the author field
        const user = mockUsers.find((user) => user.username === place.author);

        return (
          <Card
            key={index}
            images={place.image}
            title={place.name}
            description={place.description}
            userName={user ? user.username : "Unknown"}
            userAvatar={user?.profilePicture || "https://via.placeholder.com/150"} // Provide default avatar
            isFavorite={isFavorite} // Pass favorite status to Card component
            onSeeMore={onSeeMore}
            onAddToFavorites={onAddToFavorites} // Pass function to Card component
          />
        );
      })}
      <Box h={54} />
    </Stack>
  );
};

export default ListCards;
