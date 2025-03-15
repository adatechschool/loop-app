import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  Stack,
  Heading,
  Container,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BackButton from "src/components/BackButton";
import PORT from "src/utils/constant";

const SignupForm: React.FC = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(`http://localhost:${PORT}/api/signup`, {
        name,
        username,
        email,
        password,
        role: "user",
        profilePicture,
      });

      console.log("Réponse de l'API:", response.data);
      navigate("/profile");
    } catch (err: any) {
      if (err.response) {
        console.error("API Error response:", err.response);
        setError(err.response?.data?.message || "Erreur lors de l'inscription");
      } else if (err.request) {
        console.error("API Error request:", err.request);
      } else {
        console.error("Unknown error:", err.message);
      }
    }
  };

  return (
    <Container
      p={4}
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box position="absolute" top={4} left={4}>
        <BackButton />
      </Box>

      <Box w="full" maxW="md" p={6} borderWidth={1} borderRadius="md">
        <Heading textAlign="center" mb={6}>
          Créer un compte
        </Heading>
        {error && (
          <Box mb={4} color="red.500" textAlign="center">
            {error}
          </Box>
        )}
        <Stack spacing={4} as="form" onSubmit={handleSubmit}>
          <Input
            placeholder="Nom complet"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            placeholder="Photo de profil (URL)"
            value={profilePicture}
            onChange={(e) => setProfilePicture(e.target.value)}
          />
          <Button colorScheme="blue" type="submit" w="100%">
            Créer un compte
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default SignupForm;
