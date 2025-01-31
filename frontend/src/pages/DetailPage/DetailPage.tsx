import React from 'react';
import { Box, Text, VStack, Flex, Button } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import ImageCarousel from '../../components/Card/ImageCarrousel';
import LikeButton from '../../components/Card/LikeButton'; 

interface DetailPageProps {
  data: {
    name: string;
    description: string;
    address: string;
    geo: {
      lat: number;
      lng: number;
    };
    image: string[];
  }[];
  favorites: string[]; 
  onAddToFavorites: (name: string) => void;
}

const DetailPage: React.FC<DetailPageProps> = ({ data, favorites, onAddToFavorites }) => {
  const { name } = useParams<{ name: string }>(); 
  const navigate = useNavigate();

  
  const item = data.find((item) => item.name.toLowerCase() === name?.toLowerCase());

  if (!item) {
    return (
      <Box textAlign="center" mt="10">
        <Text fontSize="xl" color="red.500">
          Item not found
        </Text>
        <Button mt="4" colorScheme="blue" onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </Box>
    );
  }

  
  const isFavorite = favorites.includes(item.name);

  return (
    <Box maxW="lg" mx="auto" p="4">

      <ImageCarousel images={item.image} title={item.name} />


      <Flex justifyContent="space-between" my="4">
       
        <LikeButton title={item.name} onAddToFavorites={onAddToFavorites} isFavorite={isFavorite} />

        <Button colorScheme="teal" onClick={() => navigate("/list")}>
          View on Map
        </Button>
      </Flex>

     
      <Text fontWeight="bold" fontSize="3xl" mb="4" mt="6" textAlign="left">
        {item.name}
      </Text>

    
      <VStack align="flex-start" spacing="4" mt="6">
   
        <Text fontSize="lg">{item.description}</Text>

      
        <Text fontSize="md" fontWeight="bold">
          Address:
        </Text>
        <Text>{item.address}</Text>


        <Text fontSize="md" fontWeight="bold">
          Coordinates:
        </Text>
        <Text>
          Latitude: {item.geo.lat}, Longitude: {item.geo.lng}
        </Text>
      </VStack>
    </Box>
  );
};

export default DetailPage;
