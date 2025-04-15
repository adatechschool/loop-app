import React, { useState } from 'react';
import {
  Box,
  Button,
  Input,
  Stack,
  Heading,
  Container,
  Text,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BackButton from 'src/components/BackButton';

const SignupForm: React.FC = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError('Veuillez sélectionner une photo de profil.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('profilePicture', file);
    try {
      const response = await axios.post(
        'http://localhost:5001/api/auth/signup',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true, // This is important to send cookies across domains
        }
      );

      console.log('Inscription réussie :', response.data);
      navigate('/profile');
    } catch (err: any) {
      console.error('Erreur API:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container p={4} minH="100vh" display="flex" alignItems="center" justifyContent="center">
      <Box position="absolute" top={4} left={4}>
        <BackButton />
      </Box>

      <Box w="full" maxW="md" p={6} borderWidth={1} borderRadius="md">
        <Heading textAlign="center" mb={6}>Créer un compte</Heading>
        {error && <Text color="red.500" mb={2}>{error}</Text>}
        <Stack spacing={4} as="form" onSubmit={handleSubmit}>
          <Input placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Pseudo" value={username} onChange={(e) => setUsername(e.target.value)} />
          <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input placeholder="Mot de passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
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
