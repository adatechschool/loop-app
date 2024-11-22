import React from 'react';
import { SimpleGrid } from '@chakra-ui/react';
import Card from 'src/components/Card/Card'; // Adjust the path to your Card component

const ListPage: React.FC = () => {
  const handleSeeMoreClick = (itemName: string) => {
    console.log(`See more details of ${itemName}`);
  };

  const handleAddToFavorites = (itemName: string) => {
    console.log(`${itemName} added to favorites!`);
  };

  return (
    <div>
      <h1>Page List</h1>
      <p>Here you can view the list of places </p>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="15px" p="4">
        <Card
          images={[
            'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
            'https://images.unsplash.com/photo-1501594907353-7f1f618c7f4c?crop=entropy&cs=tinysrgb&fit=max&ixid=MXwyMDg0OXwwfDF8c2VhY2h8MXx8c29mYSUyMGNlbnRyZSUyMGNodXx8ZW58MHx8fDEwNTZ8&ixlib=rb-1.2.1&q=80&w=400'
          ]}
          title="Living Room Sofa"
          description="This sofa is perfect for modern tropical spaces, baroque-inspired spaces."
          seeMoreClick={() => handleSeeMoreClick('Living Room Sofa')}
          addToFavorites={() => handleAddToFavorites('Living Room Sofa')}
        />
        <Card
          images={[
            'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
            'https://images.unsplash.com/photo-1501594907353-7f1f618c7f4c?crop=entropy&cs=tinysrgb&fit=max&ixid=MXwyMDg0OXwwfDF8c2VhY2h8MXx8c29mYSUyMGNlbnRyZSUyMGNodXx8ZW58MHx8fDEwNTZ8&ixlib=rb-1.2.1&q=80&w=400'
          ]}
          title="Modern Chair"
          description="A modern design chair for a minimalist space."
          seeMoreClick={() => handleSeeMoreClick('Modern Chair')}
          addToFavorites={() => handleAddToFavorites('Modern Chair')}
        />
        {/* Add more Card components here */}
      </SimpleGrid>
    </div>
  );
};

export default ListPage;
