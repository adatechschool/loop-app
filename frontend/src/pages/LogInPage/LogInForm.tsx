import React, { useState, useContext } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Input,
  Stack,
  Heading,
  Container,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "src/contexts/AuthContext";
import PORT from "src/utils/constant";
import Backbutton from "src/components/BackButton";
import { InputGroup, InputRightElement, IconButton } from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const toast = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await axios.post(`http://localhost:${PORT}/api/login`, {
        username,
        password,
      });
      const { token } = response.data;
      login(token);

      toast({
        title: "Connexion réussie",
        description: `Bienvenue ${username} !`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      setErrorMessage("Nom d'utilisateur ou mot de passe invalide");
      toast({
        title: "Erreur",
        description: "Nom d'utilisateur ou mot de passe invalide",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      console.error("Login error:", error);
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
        <Backbutton />
      </Box>
      <Box w="full" maxW="md" p={6} borderWidth={1} borderRadius="md">
        <Heading textAlign="center" mb={6}>
          Connexion
        </Heading>
        <Stack as="form" spacing={4} onSubmit={handleSubmit}>
          <Input
            placeholder="Email ou Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <InputGroup>
            <Input
              placeholder="Mot de passe"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <InputRightElement>
              <IconButton
                aria-label={
                  showPassword
                    ? "Cacher le mot de passe"
                    : "Afficher le mot de passe"
                }
                icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                size="sm"
                variant="ghost"
                onClick={togglePasswordVisibility}
              />
            </InputRightElement>
          </InputGroup>
          {errorMessage && <Text color="red.500">{errorMessage}</Text>}
          <Button colorScheme="teal" type="submit">
            Se connecter
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default LoginForm;
