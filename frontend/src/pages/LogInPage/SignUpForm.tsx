import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  Stack,
  Heading,
  Container,
  Text,
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
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {


      // If the user selected a file, upload it to Cloudinary
      if (file) {
        const formData = new FormData();
        formData.append("file", file);  // "file" is the field name for Cloudinary
        formData.append("upload_preset", "unsigned_demo"); // Your Cloudinary upload preset

        const uploadRes = await axios.post("https://api.cloudinary.com/v1_1/dpqyho229/image/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log(uploadRes);
        setProfilePicture(uploadRes.data.secure_url)  // Cloudinary returns the URL here
      }

      // Signup API call
      const response = await axios.post(`http://localhost:${PORT}/api/signup`, {
        name,
        username,
        email,
        password,
        role: "user",
        profilePicture: profilePicture || "",  // Include the Cloudinary image URL if uploaded
      });

      console.log("Réponse de l'API:", response.data);
      navigate("/profile");
    } catch (err: any) {
      console.error("Signup error:", err);
      if (err.response) {
        setError(err.response?.data?.message || "Erreur lors de l'inscription");
      } else {
        setError("Erreur inconnue");
      }
    } finally {
      setLoading(false);
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
          <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          {file && <Text>📁 {file.name}</Text>}
          <Button type="submit" colorScheme="blue" isLoading={loading}>
            Créer un compte
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default SignupForm;
