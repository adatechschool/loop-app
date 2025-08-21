import React from "react";
import { Box, Button, Center, Container, Stack, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import InstallPWAButton from "../../components/InstallPWAButton";
import logo from "../../assets/logo-loop.svg";

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
          <Image src={logo} style={{ width: "80%" }} />
        </Center>
        <Stack spacing={4}>
          <Button
            colorScheme="teal"
            w="full"
            onClick={() => navigate("/signin")}
          >
            Se connecter
          </Button>
          <Button
            colorScheme="gray"
            w="full"
            onClick={() => navigate("/signup")}
          >
            S'inscrire
          </Button>
        </Stack>
        {/* <Text mt={4}>
          <Button
            variant="link"
            colorScheme="teal"
            onClick={() => navigate("/")}
          >
            Décider plus tard ?
          </Button>
        </Text> */}
      </Box>
      <InstallPWAButton />
    </Container>
  );
};

export default LogIn;
