import React from "react";
import {
  Container,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
} from "@chakra-ui/react";
import { IoSearch } from "react-icons/io5";
import ListCards from "src/components/ListCards/ListCards";

const SearchPage: React.FC = () => {
  // Define handlers for the ListCards component
  const handleSeeMoreClick = (title: string) => {
    console.log(`Navigating to details for: ${title}`);
    // Add navigation logic here
  };

  const handleAddToFavorites = (title: string) => {
    console.log(`Added to favorites: ${title}`);
    // Add favorite logic here
  };

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
        <ListCards
          onSeeMore={handleSeeMoreClick}
          onAddToFavorites={handleAddToFavorites}
        />
      </Stack>
    </Container>
  );
};

export default SearchPage;
