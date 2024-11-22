import {
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
} from "@chakra-ui/react";
import { IoSearch } from "react-icons/io5";
import React from "react";

const SearchPage: React.FC = () => {
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
      </Stack>
    </Flex>
  );
};

export default SearchPage;
