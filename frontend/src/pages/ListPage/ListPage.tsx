import React from 'react';
import { SimpleGrid } from '@chakra-ui/react';
import Card from 'src/components/Card/Card';
import ListCards from 'src/components/ListCards/ListCards';



const ListPage: React.FC = () => {
  const handleSeeMoreClick = (itemName: string) => {
    console.log(`See more details of ${itemName}`);
  };

  const handleAddToFavorites = (itemName: string) => {
    console.log(`${itemName} added to favorites!`);
  }

  return (
    <div>
      <h1>Page List</h1>
      <p>Here you can view the list of places </p>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="15px" p="4">
        <ListCards/>
      </SimpleGrid>
    </div>
  );
};

export default ListPage;
