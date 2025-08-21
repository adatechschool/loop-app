import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Stack,
  useToast,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import apiClient from "src/utils/apiClient";
import useQueryUser from "src/hooks/useQueryUser";
import axios from "axios";
import BackButton from "../BackButton";
import InstallPWAButton from "../InstallPWAButton";

interface FormData {
  username: string;
  email: string;
  profilePicture: FileList;
}

const SettingsPage: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { user, loading } = useQueryUser();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const [uploading, setUploading] = useState(false);
  const [currentProfilePic, setCurrentProfilePic] = useState<string>("");

  // Pré-remplir les champs quand user est chargé
  useEffect(() => {
    if (user) {
      setValue("username", user.username);
      setValue("email", user.email);
      setCurrentProfilePic(user.profilePicture || "");
    }
  }, [user, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      let profilePictureUrl = currentProfilePic;

      // Si une nouvelle image est sélectionnée -> upload sur Cloudinary
      if (data.profilePicture && data.profilePicture.length > 0) {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", data.profilePicture[0]);
        formData.append("upload_preset", "unsigned_demo"); // adapte si besoin

        const uploadRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dpqyho229/image/upload",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        profilePictureUrl = uploadRes.data.secure_url;
        setCurrentProfilePic(profilePictureUrl);
        setUploading(false);
      }

      // Appel API PATCH pour mettre à jour user
      await apiClient.patch("/api/user", {
        username: data.username,
        email: data.email,
        profilePicture: profilePictureUrl,
      });

      toast({
        title: "Profil mis à jour.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Erreur mise à jour:", error);
      toast({
        title: "Erreur lors de la mise à jour.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await apiClient.delete("/api/user");
      toast({
        title: "Compte supprimé.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      toast({
        title: "Erreur lors de la suppression.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <Box p={6} maxW="md" mx="auto">
      <BackButton />
      <Heading mb={6} mt={16} textAlign={"center"}>
        Paramètres du compte
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          <FormControl isInvalid={!!errors.username}>
            <FormLabel>Nom d'utilisateur</FormLabel>
            <Input
              {...register("username", {
                required: "Le nom d'utilisateur est requis",
                minLength: {
                  value: 3,
                  message: "Minimum 3 caractères",
                },
              })}
            />
            {errors.username && (
              <Text color="red.500" fontSize="sm">
                {errors.username.message}
              </Text>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              {...register("email", {
                required: "Email requis",
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                  message: "Email invalide",
                },
              })}
            />
            {errors.email && (
              <Text color="red.500" fontSize="sm">
                {errors.email.message}
              </Text>
            )}
          </FormControl>

          <FormControl>
            <FormLabel>Photo de profil</FormLabel>
            {currentProfilePic && (
              <Box mb={2}>
                <img
                  src={currentProfilePic}
                  alt="Profil"
                  style={{ width: 100, borderRadius: "50%" }}
                />
              </Box>
            )}
            <Input
              type="file"
              accept="image/*"
              {...register("profilePicture")}
            />
          </FormControl>

          <Button
            colorScheme="teal"
            type="submit"
            isLoading={isSubmitting || uploading}
          >
            Sauvegarder les modifications
          </Button>

          <Button colorScheme="red" onClick={handleDelete}>
            Supprimer mon compte
          </Button>
          <InstallPWAButton />
        </Stack>
      </form>
    </Box>
  );
};

export default SettingsPage;
