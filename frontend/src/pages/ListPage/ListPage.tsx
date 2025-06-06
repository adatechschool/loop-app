import React from "react";
import {
  Center,
  Heading,
  SimpleGrid,
  Text,
  Stack,
  Skeleton,
} from "@chakra-ui/react";
import { ListCards } from "src/components";
import useQueryPlaces from "src/hooks/useQueryPlaces";

const ListPage = () => {
  const {
    places: fetchedPlaces,
    loading: loadingPlaces,
    error,
  } = useQueryPlaces();

  const reverseOrderedPlaces = [...fetchedPlaces].reverse();

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="15px" p="4">
      <Heading>Lieux à proximité</Heading>
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
