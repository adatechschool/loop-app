import React from "react";
import {
  Flex,
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
    <Flex minH={"100vh"} justify={"center"} bg={"white"}>
      <Stack
        spacing={8}
        p={6}
        bg={"white"}
        w={"full"}
        maxW={"md"}
        rounded={"xl"}
      >
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
        {/* Pass required props to ListCards */}
        <ListCards
          onSeeMore={handleSeeMoreClick}
          onAddToFavorites={handleAddToFavorites}
        />
      </Stack>
    </Flex>
  );
};

export default SearchPage;
