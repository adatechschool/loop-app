import React from 'react';
import { Box, Button, Text, VStack, Flex, useBreakpointValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import ImageCarousel from './ImageCarrousel';
import LikeButton from './LikeButton';

interface CardProps {
  images: string[];
  title: string;
  description: string;
  userName: string;
  onSeeMore: (title: string) => void;
  onAddToFavorites: (title: string) => void;
  isFavorite: boolean; // Expect isFavorite to be a boolean
}

const Card: React.FC<CardProps> = ({
  images,
  title,
  description,
  userName,
  onSeeMore,
  onAddToFavorites,
  isFavorite, // Destructure this prop
}) => {
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleCardClick = () => {
    navigate(`/detail/${title}`);
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
      {/* Display userName */}
      <Text fontWeight="bold" fontSize="lg" mb="2" textAlign="center" color="gray.600">
        {userName}
      </Text>

      {/* Image Carousel */}
      <ImageCarousel images={images} title={title} />

      {/* Card Content */}
      <VStack p="4" align="flex-start">
        <Text fontWeight="bold" fontSize="xl" mb="2">
          {title}
        </Text>
        <Text mb="2">{description}</Text>
      </VStack>

      {/* Footer Actions */}
      <Flex justifyContent="space-between" p="4" alignItems="center">
        {/* Like Button */}
        <LikeButton title={title} onAddToFavorites={onAddToFavorites} isFavorite={isFavorite} />

        {/* See More Button */}
        {!isMobile && (
          <Button
            colorScheme="teal"
            onClick={(e) => {
              e.stopPropagation(); 
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
