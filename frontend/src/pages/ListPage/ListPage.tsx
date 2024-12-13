import React from "react";
import { Heading, SimpleGrid } from "@chakra-ui/react";
import { ListCards } from "src/components";

const ListPage: React.FC = () => {
  const handleSeeMoreClick = (itemName: string) => {
    console.log(`See more details of ${itemName}`);
  };

  const handleAddToFavorites = (itemName: string) => {
    console.log(`${itemName} added to favorites!`);
  };

  return (
    <>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="15px" p="4">
        <Heading>Lieux à proximité</Heading>
        <ListCards
          onSeeMore={handleSeeMoreClick}
          onAddToFavorites={handleAddToFavorites}
        />
      </SimpleGrid>
    </>
  );
};

export default ListPage;
