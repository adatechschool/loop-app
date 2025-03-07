import React, { useState } from 'react';
import { Box, Button, Input, Stack, Heading, Container } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const SignupForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Création de compte pour', username, email);
    navigate('/profile'); 
  };

  return (
    <Container p={0} minH="100vh" display="flex" alignItems="center" justifyContent="center">
      <Box w="full" maxW="md" p={6} borderWidth={1} borderRadius="md">
        <Heading textAlign="center" mb={6}>Créer un compte</Heading>
        <Stack spacing={4} as="form" onSubmit={handleSubmit}>
          <Input placeholder="Nom d'utilisateur" value={username} onChange={(e) => setUsername(e.target.value)} />
          <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input placeholder="Mot de passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button colorScheme="blue" type="submit">Créer un compte</Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default SignupForm;
