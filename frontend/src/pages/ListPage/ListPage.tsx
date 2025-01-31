import React from "react";
import { Heading, SimpleGrid } from "@chakra-ui/react";
import { ListCards } from "src/components";

interface ListPageProps {
  favorites: string[]; 
  onAddToFavorites: (name: string) => void; 
}

const ListPage: React.FC<ListPageProps> = ({ favorites, onAddToFavorites }) => {
  const handleSeeMoreClick = (itemName: string) => {
    console.log(`See more details of ${itemName}`);
  };

  return (
  
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="15px" p="4">
        <Heading>Lieux à proximité</Heading>
        <ListCards
          favorites={favorites} 
          onSeeMore={handleSeeMoreClick}
          onAddToFavorites={onAddToFavorites} 
        />
      </SimpleGrid>
  
  );
};

export default ListPage;
