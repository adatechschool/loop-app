import React from "react";
import { Box, Text, VStack, Flex, Button } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import ImageCarousel from "../../components/Card/ImageCarrousel";
import LikeButton from "../../components/Card/LikeButton";
import useGetPlace from "src/hooks/useGetPlace";
import Backbutton from "src/components/BackButton";

const DetailPage: React.FC = () => {
  const params = useParams();
  const id = params.id;
  const navigate = useNavigate();
  const { place, loading, error } = useGetPlace(id ?? "");

  if (!id) {
    return (
      <Box textAlign="center" mt="10">

        <Text fontSize="xl" color="red.500">
          Invalid place ID
        </Text>
        <Button mt="4" colorScheme="blue" onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box textAlign="center" mt="10">
        <Text fontSize="xl">Chargement...</Text>
      </Box>
    );
  }

  if (error || !place) {
    return (
      <Box textAlign="center" mt="10">
        <Text fontSize="xl" color="red.500">
          Place not found
        </Text>
        <Button mt="4" colorScheme="blue" onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </Box>
    );
  }

  return (
    <Box maxW="lg" mx="auto" p="4" position='relative'>
      <Box position="absolute" top="4" left="4" zIndex="10">
        <Backbutton />
      </Box>
      <Box mt="16"></Box>
      <ImageCarousel
        images={place.images?.map((img: any) => img.image?.url)}
        title={place.name}
      />

      <Flex justifyContent="space-between" my="4">
        <Button
          colorScheme="teal"
          onClick={() =>
            (window.location.href = `/?lat=${place.geo?.lat}&lng=${place.geo?.lng}`)
          }
        >
          Voir sur la map
        </Button>
        <LikeButton title={undefined} />
      </Flex>

      <Text fontWeight="bold" fontSize="3xl" mb="4" mt="6" textAlign="left">
        {place.name}
      </Text>

      <VStack align="flex-start" spacing="4" mt="6">
        <Text fontSize="lg">{place.description}</Text>

        <Text fontSize="md" fontWeight="bold">
          Address:
        </Text>
        <Text>{place.address}</Text>

        <Text fontSize="md" fontWeight="bold">
          Coordinates:
        </Text>
        <Text>
          Latitude: {place.geo?.lat}, Longitude: {place.geo?.lng}
        </Text>
      </VStack>
    </Box>
  );
};

export default DetailPage;
