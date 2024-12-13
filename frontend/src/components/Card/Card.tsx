import React, { useState } from 'react';
import { Box, Button, Image, Text, VStack, Flex, IconButton, useBreakpointValue, useToast } from '@chakra-ui/react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

interface CardProps {
  images: string[];
  title: string;
  description: string;
  onSeeMore: (title: string) => void;
  onAddToFavorites: (title: string) => void; // Handles adding/removing from favorites
}

const Card: React.FC<CardProps> = ({ images, title, description, onSeeMore, onAddToFavorites }) => {
  const navigate = useNavigate();
  const toast = useToast(); // Chakra's toast for popup notifications

  // Detect if the device is mobile
  const isMobile = useBreakpointValue({ base: true, md: false });

  const [isFavorite, setIsFavorite] = useState(false);

  const handleCardClick = () => {
    navigate(`/detail/${title}`);
  };

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);

    if (!isFavorite) {
      // If not already a favorite, add to favorites
      onAddToFavorites(title);

      toast({
        title: "Place Added to Favorites",
        description: `"${title}" has been added to your favorites.`,
        status: "success",
        duration: 3000, // 3 seconds
        isClosable: true,
      });
    } else {
      // If already a favorite, remove from favorites
      onAddToFavorites(title); // Modify to call a removal function if necessary

      toast({
        title: "Place Removed from Favorites",
        description: `"${title}" has been removed from your favorites.`,
        status: "info",
        duration: 3000, // 3 seconds
        isClosable: true,
      });
    }
  };

  return (
    <Box
      maxW="sm"
      border="1px solid #ddd"
      borderRadius="md"
      overflow="hidden"
      p="4"
      onClick={handleCardClick}
      cursor="pointer"
      _hover={{ shadow: 'md' }}
    >
      {/* Carousel for images */}
      <Carousel
        swipeable={true}
        dynamicHeight={true}
        emulateTouch={true}
        infiniteLoop={true}
        showArrows={false}
        showThumbs={false}
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
              onSeeMore(title);
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
