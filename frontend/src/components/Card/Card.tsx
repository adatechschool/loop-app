import React from "react";
import {
  Box,
  Button,
  Text,
  VStack,
  Flex,
  Avatar,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import ImageCarousel from "./ImageCarrousel";
import LikeButton from "./LikeButton";

interface CardProps {
  images: string[];
  title: string;
  description: string;
  userName: string;
  userAvatar?: string; // New prop for avatar
  onSeeMore: (title: string) => void;
  onAddToFavorites: (title: string) => void;
  isFavorite: boolean;
}

const Card: React.FC<CardProps> = ({
  images,
  title,
  description,
  userName,
  userAvatar, // Receive avatar prop
  onSeeMore,
  onAddToFavorites,
  isFavorite,
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
      _hover={{ shadow: "md" }}
    >
      <Flex align="center" mt="3" mb="6">
        <Avatar size="sm" src={userAvatar} mr="2" />
        <Text fontWeight="bold" fontSize="lg" color="gray.600">
          {userName}
        </Text>
      </Flex>

      <ImageCarousel images={images} title={title} />

      <VStack p="4" align="flex-start">
        <Text fontWeight="bold" fontSize="xl" mb="2">
          {title}
        </Text>
        <Text mb="2">{description}</Text>
      </VStack>

      <Flex justifyContent="space-between" p="4" alignItems="center">
        <LikeButton
          title={title}
          onAddToFavorites={onAddToFavorites}
          isFavorite={isFavorite}
        />
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
