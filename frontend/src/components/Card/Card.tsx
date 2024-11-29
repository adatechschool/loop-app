import React from 'react';
import { Button, Box, Image, Text, VStack, Flex } from '@chakra-ui/react';
import { Carousel } from 'react-responsive-carousel'; 
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import carousel styles

interface CardProps {
  images: string[]; // Array of image URLs
  title: string; // Title of the card
  description: string; // Description of the card
  // seeMoreClick: () => void; // Function that runs when the 'See More' button is clicked
  // addToFavorites: () => void; // Function that runs when the 'Add to Favorites' button is clicked
}

const Card: React.FC<CardProps> = ({ images, title, description}) => {
  return (
    <Box maxW="sm" overflow="hidden" border="1px solid #ddd" borderRadius="md" p="4">
      <Carousel>
        {images.map((image, index) => (
          <div key={index}>
            <Image src={image} alt={title} objectFit="cover" />
          </div>
        ))}
      </Carousel>
      <VStack p="4" align="flex-start">
        <Text fontWeight="bold" fontSize="xl" mb="2">
          {title}
        </Text>
        <Text mb="2">{description}</Text>
      </VStack>
      <Flex justifyContent="space-between" p="4">
        <Button variant="solid" colorScheme="teal">
          See More
        </Button>
        <Button variant="ghost" >
          Add to Favorites
        </Button>
      </Flex>
    </Box>
  );
};

export default Card;

