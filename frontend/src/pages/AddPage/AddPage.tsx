import React from "react";
import { Box, Heading, Flex } from "@chakra-ui/react";
import FormAddList from "src/components/FormAddList";

const AddPage = () => {
  return (
    <Box pb="70px">
      <Flex justify="center">
        <Box maxW="md" w="full" px={4}>
          <Heading textAlign="center" mb={6}>
            Ajouter un lieu
          </Heading>
          <FormAddList />
        </Box>
      </Flex>
      <Box minH={35} />
    </Box>
  );
};

export default AddPage;
