import React, { useState } from 'react';
import { Box, Button, Image, Text, VStack, Flex, IconButton, useBreakpointValue, useToast } from '@chakra-ui/react';
import { Carousel } from 'react-responsive-carousel'; 
import 'react-responsive-carousel/lib/styles/carousel.min.css'; 
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md'; 
import { useNavigate } from 'react-router-dom';

interface CardProps {
  images: string[]; // Array of image URLs
  title: string; // Title of the card
  description: string; // Description of the card
  onSeeMore: (title: string) => void;
  onAddToFavorites: (title: string) => void;
}

const Card: React.FC<CardProps> = ({ images, title, description, onSeeMore, onAddToFavorites }) => {
  const navigate = useNavigate();
  const toast = useToast(); // Chakra's toast for popup notifications

  // Detect if the device is mobile
  const isMobile = useBreakpointValue({ base: true, md: false });

  const [isFavorite, setIsFavorite] = useState(false); // Track favorite status

  const handleCardClick = () => {
    navigate(`/detail/${title}`); // Navigate to PageDetail with a dynamic route
  };

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev); // Toggle the favorite status

    // Call the parent function to handle adding to favorites
    onAddToFavorites(title);

    // Show a success toast notification
    toast({
      title: "Place Added to Favorites",
      description: `"${title}" has been added to your favorites.`,
      status: "success",
      duration: 3000, // 3 seconds
      isClosable: true,
    });
  };

  return (
    <Box
      maxW="sm"
      border="1px solid #ddd"
      borderRadius="md"
      overflow="hidden"
      p="4"
      onClick={handleCardClick} // Make the entire card clickable
      cursor="pointer"
      _hover={{ shadow: 'md' }}
    >
      {/* Carousel for images */}
      <Carousel
        swipeable={true} // Enable swipe on mobile
        dynamicHeight={true} // Adjust height based on the image size
        emulateTouch={true} // Enable touch events on mobile
        infiniteLoop={true} // Infinite loop for the carousel
        showArrows={false} // Hide arrows
        showThumbs={false} // Hide thumbnails
      >
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

      {/* Always render the heart button, both on mobile and desktop */}
      <Flex justifyContent="space-between" p="4" alignItems="center">
        <IconButton
          aria-label="Add to Favorites"
          icon={isFavorite ? <MdFavorite /> : <MdFavoriteBorder />}
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering card click
            toggleFavorite(); // Toggle favorite status and show popup
          }}
        />
        
        {/* Only show the "See More" button on Desktop */}
        {!isMobile && (
          <Button
            colorScheme="teal"
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering card click
              onSeeMore(title); // Call the "See More" function
            }}
          >
            See More
          </Button>
        )}
      </Flex>
    </Box>
  );
};

export default Card;
