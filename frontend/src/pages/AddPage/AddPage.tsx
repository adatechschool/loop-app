import React from "react";
import { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Switch,
  Flex,
  Textarea,
  Button,
  Stack,
  Heading,
} from "@chakra-ui/react";
import { FaAccessibleIcon } from "react-icons/fa";
import { FaLocationCrosshairs } from "react-icons/fa6";

const AddPage = () => {
  const [location, setLocation] = useState("Ma position");
  const getLocation = () => {
    return setLocation("48.849726, 2.319596");
  };
  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"} bg={"white"}>
      <Stack
        spacing={6}
        p={6}
        bg={"white"}
        w={"full"}
        maxW={"md"}
        rounded={"xl"}
      >
        <Heading textAlign={"center"}>Ajouter un lieu</Heading>

        <FormControl id="imagePlace" isRequired>
          <FormLabel>Photo</FormLabel>
          <Input type="file" />
        </FormControl>

        <FormControl id="namePlace" isRequired>
          <FormLabel>Nom</FormLabel>
          <Input placeholder="Nom" type="text" />
        </FormControl>

        <FormControl id="addressPlace" isRequired>
          <FormLabel>Adresse</FormLabel>
          <Input placeholder="Adresse" type="text" />
        </FormControl>

        <FormControl id="addressPlace">
          <FormLabel>Description</FormLabel>
          <Textarea
            h="4rem"
            placeholder="Décris-nous ta dernière découverte !"
          />
        </FormControl>

        <Flex>
          <FormControl>
            <FormLabel id="accessibilityPlace">Accessibilité</FormLabel>
            <Stack spacing={6} direction={["row"]}>
              <FaAccessibleIcon size="30px" />
              <Switch id="accessibility" size="lg" />
            </Stack>
          </FormControl>

          <FormControl>
            <FormLabel id="geoPlace">Localisation</FormLabel>
            <Stack spacing={6} direction={["row"]}>
              <FaLocationCrosshairs size="30px" />
              <button onClick={getLocation}>{location}</button>
            </Stack>
          </FormControl>
        </Flex>
        <Button
          mt={4}
          w={"full"}
          bg="#e86100"
          color={"white"}
          type="submit"
          _hover={{ bg: "#ff7000" }}
        >
          Ajouter
        </Button>
      </Stack>
    </Flex>
  );
};

export default AddPage;
