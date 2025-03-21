import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Input,
  Stack,
  Heading,
  Container,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import BackButton from "src/components/BackButton";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        username,
        password,
      });

      const { token } = response.data;
      console.log(response.data);
      localStorage.setItem("token", token);

      console.log("Connexion réussie, token :", response.data.token);
      console.log("Réponse du serveur:", response.data);

      navigate("/profile");
    } catch (error) {
      setErrorMessage("Mot de passe ou nom d'utilisateur invalide");
      console.error("Erreur :", (error as Error).message);
    }
  };
  return (
    <Container
      p={4}
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
    >
      <Box position="absolute" top={4} left={4}>
        <BackButton />
      </Box>

      <Box w="full" maxW="md" p={6} borderWidth={1} borderRadius="md">
        <Heading textAlign="center" mb={6}>
          Connexion
        </Heading>
        <Stack spacing={4} as="form" onSubmit={handleSubmit}>
          <Input
            placeholder="Email ou Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            placeholder="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {errorMessage && <p style={{ color: "red" }}> {errorMessage} </p>}
          <Button colorScheme="teal" type="submit">
            Se connecter
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default LoginForm;
