import React from "react";
import { Center, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import { ListCards } from "src/components";
import { usePlacesContext } from "../../contexts/PlacesContext";

const ListPage: React.FC = () => {
  const placesContext = usePlacesContext();

  const fetchedPlaces = placesContext?.places ?? [];
  const loadingPlaces = placesContext?.loading ?? false;
  const error = placesContext?.error;

  const reverseOrderedPlaces = [...fetchedPlaces].reverse();

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="15px" p="4">
      <Heading>Lieux à proximité</Heading>
      {error && (
        <Center>
          <Text color="red.500">{error}</Text>
        </Center>
      )}
      {reverseOrderedPlaces ? (
        <ListCards places={reverseOrderedPlaces} loading={loadingPlaces} />
      ) : (
        <Center>
          <Text>Aucun lieux disponibles</Text>
        </Center>
      )}
    </SimpleGrid>
  );
};

export default ListPage;
