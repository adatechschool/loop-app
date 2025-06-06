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

export interface CardProps {
  images: string[];
  title: string | undefined;
  description: string | undefined;
  username: string | undefined;
  userAvatar?: string; // New prop for avatar
  onSeeMore?: (title: string) => void;
  onAddToFavorites?: (title: string) => void;
  isFavorite?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  images,
  title,
  description,
  username,
  userAvatar,
  onClick,
}) => {
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box
      maxW="sm"
      border="1px solid #ddd"
      borderRadius="md"
      overflow="hidden"
      p="4"
      onClick={onClick}
      cursor={onClick ? "pointer" : undefined}
      _hover={{ shadow: "md" }}
    >
      <Flex align="center" mt="3" mb="6">
        <Avatar size="sm" mr="2" src={userAvatar} />
        <Text fontWeight="bold" fontSize="lg" color="gray.600">
          {username}
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
        <LikeButton title={title} />
        {!isMobile && (
          <Button
            colorScheme="teal"
            onClick={(e) => {
              e.stopPropagation();
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
