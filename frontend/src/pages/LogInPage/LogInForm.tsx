import React, { useState } from 'react';
import { Box, Button, Input, Stack, Heading, Container } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Connexion en cours avec', username, password);
    // Simuler une connexion réussie
    navigate('/profile'); 
  };

  return (
    <Container p={4} minH="100vh" display="flex" alignItems="center" justifyContent="center">
      <Box w="full" maxW="md" p={6} borderWidth={1} borderRadius="md">
        <Heading textAlign="center" mb={6}>Connexion</Heading>
        <Stack spacing={4} as="form" onSubmit={handleSubmit}>
          <Input placeholder="Email ou Nom d'utilisateur" value={username} onChange={(e) => setUsername(e.target.value)} />
          <Input placeholder="Mot de passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button colorScheme="teal" type="submit">Se connecter</Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default LoginForm;
