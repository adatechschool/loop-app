import React from "react";
import {
  Box,
  Button,
  Center,
  Heading,
  Container,
  Stack,
  Avatar,
  Icon,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";

const LogIn: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container
      p={4}
      minH="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        w="full"
        maxW={{ base: "90%", sm: "md" }}
        p={6}
        borderWidth={1}
        borderRadius="md"
        textAlign="center"
        boxShadow="md"
      >
        <Center mb={4}>
          <Avatar size="xl" icon={<Icon as={FaUser} w={8} h={8} />} />
        </Center>

        <Heading fontSize={{ base: "xl", sm: "2xl" }} mb={6}>
          Bienvenue
        </Heading>
        <Stack spacing={4}>
          <Button
            colorScheme="teal"
            w="full"
            onClick={() => navigate("/login-form")}
          >
            Se connecter
          </Button>
          <Button
            colorScheme="blue"
            w="full"
            onClick={() => navigate("/signup-form")}
          >
            Créer un compte
          </Button>
        </Stack>
        <Text mt={4}>
          <Button
            variant="link"
            colorScheme="teal"
            onClick={() => navigate("/")}
          >
            Décider plus tard ?
          </Button>
        </Text>
      </Box>
    </Container>
  );
};

export default LogIn;
