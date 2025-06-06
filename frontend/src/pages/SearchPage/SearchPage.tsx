import React from "react";
import {
  Center,
  Container,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
} from "@chakra-ui/react";
import { IoSearch } from "react-icons/io5";
import ListCards from "src/components/ListCards/ListCards";
import useQueryPlaces from "src/hooks/useQueryPlaces";

const SearchPage = () => {
  const {
    places: fetchedPlaces,
    loading: loadingPlaces,
    error,
  } = useQueryPlaces();

  return (
    <Container p={0} minH={"100vh"}>
      <Stack p={4} w={"full"} maxW={"md"}>
        <InputGroup>
          <InputRightElement
            marginTop={"4px"}
            marginRight={"4px"}
            pointerEvents="none"
            children={<IoSearch color="grey" size="28px" />}
          />
          <Input
            size="lg"
            type="text"
            placeholder="Rechercher"
            borderRadius="16px"
          />
        </InputGroup>
        {fetchedPlaces ? (
          <ListCards places={fetchedPlaces} loading={loadingPlaces} />
        ) : (
          <Center>
            <Text>Aucun lieux disponibles</Text>
          </Center>
        )}
      </Stack>
    </Container>
  );
};

export default SearchPage;
