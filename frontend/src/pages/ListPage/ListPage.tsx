// src/pages/ListPage/ListPage.tsx
import React from "react";
import { Heading, SimpleGrid, Box } from "@chakra-ui/react";
import { ListCards } from "src/components";  // Assuming ListCards is imported correctly

interface ListPageProps {
  favorites: string[];  // List of favorite places passed down as a prop
  onAddToFavorites: (name: string) => void;  // Function to add or remove from favorites
}

const ListPage: React.FC<ListPageProps> = ({ favorites, onAddToFavorites }) => {
  // Function to handle the "See More" click for each place card
  const handleSeeMoreClick = (itemName: string) => {
    console.log(`See more details of ${itemName}`);
  };

  return (
    <Box>
      {/* Sticky Top Bar */}
      <Box
        position="sticky"
        top={0}
        zIndex={10}
        bg="white"          // White background
        color="black"       // Black text color
        p={4}
        boxShadow="md"      // Optional: add shadow for better visibility
      >
        <Heading as="h1" size="lg" textAlign="center">
          Lieux à proximité
        </Heading>
      </Box>

      {/* Main Content Below Sticky Header */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="15px" p="4" mt={10}>
        {/* Pass the favorites and onAddToFavorites to ListCards */}
        <ListCards
          favorites={favorites}  // Array of favorite places
          onSeeMore={handleSeeMoreClick}  // Function to handle See More
          onAddToFavorites={onAddToFavorites}  // Function to add/remove from favorites
        />
      </SimpleGrid>
    </Box>
  );
};

export default ListPage;
