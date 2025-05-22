import React from "react";
import { Box, Heading, Flex } from "@chakra-ui/react";

import FormAddList from "src/components/FormAddList";

const AddPage = () => {
  return (
    <>
      <Flex justify={"center"}>
        <Box minH={"100vh"} maxW={"md"}>
          <Heading textAlign={"center"}>Ajouter un lieu</Heading>
          <FormAddList />
        </Box>
      </Flex>
      <Box minH={54} />
    </>
  );
};

export default AddPage;
