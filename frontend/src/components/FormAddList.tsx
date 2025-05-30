import React from "react";
import axios from "axios";
import { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Switch,
  Flex,
  Textarea,
  Stack,
  Button,
  Select,
  Text,
  CircularProgress,
} from "@chakra-ui/react";
import { FaAccessibleIcon } from "react-icons/fa";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import PORT from "src/utils/constant";
import { useGeolocationContext } from "src/providers/GeolocationContext";

const FormAddList = () => {
  const { location: currentLocation } = useGeolocationContext();
  const [error, setError] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [accessibility, setAccessibility] = useState(false);
  const [placeFieldsValues, setPlaceFieldsValues] = useState({
    name: "",
    address: "",
    description: "",
    types: [] as string[],
    accessibility,
    images: [] as string[],
  });
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  const handleUploadCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_demo");

    try {
      const uploadRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dpqyho229/image/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return uploadRes.data.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      return null;
    }
  };

  const handleFileupload = async (file: File) => {
    if (file) {
      const imageUrl = await handleUploadCloudinary(file);
      if (imageUrl) {
        try {
          const response = await axios.post(
            `http://localhost:${PORT}/api/images`,
            { url: imageUrl },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const imageId = response.data.image_id;
          setPlaceFieldsValues((prev) => ({
            ...prev,
            images: [imageId] as string[],
          }));
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      } else {
        setError("Erreur lors du téléchargement de l'image");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement);

      const name = formData.get("namePlace");
      const address = formData.get("addressPlace");
      const description = formData.get("descriptionPlace");
      const types = formData.get("typePlace");

      const payload = {
        name,
        address,
        description,
        accessibility,
        geo: {
          lat: currentLocation?.coords.latitude,
          lng: currentLocation?.coords.longitude,
        },
        types: types ? [types as string] : [],
        images: placeFieldsValues.images.length
          ? placeFieldsValues.images
          : [""],
      };

      try {
        await axios.post(`http://localhost:${PORT}/api/places`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLoading(true);
        navigate("/list");
      } catch (error: any) {
        if (
          error.response &&
          error.response.data &&
          (error.response.data.message === "Invalid token" ||
            error.response.data.message === "jwt expired")
        ) {
          setError("Votre session a expiré. Veuillez vous reconnecter.");
          localStorage.removeItem("token");
          navigate("/login");
        }
        console.error("Error :", error.message);
      }
    } catch (err: any) {
      console.error("Erreur de l'ajout:", err);
      if (err.response) {
        setError(err.response?.data?.message || "Erreur lors de l'ajout");
      } else {
        setError("Erreur inconnue");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"} bg={"white"}>
      {loading ? (
        <CircularProgress isIndeterminate color="green.300" />
      ) : (
        <form onSubmit={handleSubmit}>
          <Stack
            spacing={6}
            p={6}
            bg={"white"}
            w={"full"}
            maxW={"md"}
            rounded={"xl"}
          >
            {error && (
              <Text color="red.500" mb={2}>
                {error}
              </Text>
            )}

            <FormControl id="imagePlace" isRequired>
              <FormLabel>Photo</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0] || null;
                  setFile(selectedFile);
                  if (selectedFile) {
                    handleFileupload(selectedFile);
                  }
                }}
                name="imagePlace"
                placeholder="Télécharge une image"
              />
              {file && <Text>📁 {file.name}</Text>}
            </FormControl>

            <FormControl id="namePlace" isRequired>
              <FormLabel>Nom</FormLabel>
              <Input placeholder="Nom" type="text" name="namePlace" />
            </FormControl>

            <FormControl id="addressPlace" isRequired>
              <FormLabel>Adresse</FormLabel>
              <Input placeholder="Adresse" type="text" name="addressPlace" />
            </FormControl>

            <FormControl id="descriptionPlace">
              <FormLabel>Description</FormLabel>
              <Textarea
                h="4rem"
                placeholder="Décris-nous ta dernière découverte !"
                name="descriptionPlace"
              />
            </FormControl>

            <FormControl id="typePlace">
              <FormLabel>Catégorie</FormLabel>
              <Select
                placeholder="Choisis une catégorie"
                size="lg"
                name="typePlace"
                onChange={(e) => {
                  setPlaceFieldsValues((prev) => ({
                    ...prev,
                    types: [e.target.value],
                  }));
                }}
              >
                <option value="park_id">Parc</option>
                <option value="street_id">Street art</option>
                <option value="pedestrian_id">Rue piétonne</option>
                <option value="monument_id">Monument</option>
                <option value="architecture_id">Architecture</option>
              </Select>
            </FormControl>

            <Flex>
              <FormControl>
                <FormLabel htmlFor="accessibilityPlace">
                  Accessibilité
                </FormLabel>
                <Stack spacing={6} direction={["row"]}>
                  <FaAccessibleIcon size="30px" />
                  <Switch
                    id="accessibilityPlace"
                    name="accessibilityPlace"
                    size="lg"
                    isChecked={accessibility}
                    onChange={(e) => setAccessibility(e.target.checked)}
                  />
                </Stack>
              </FormControl>

              <FormControl>
                <FormLabel>Localisation</FormLabel>
                <Stack spacing={6} direction={["row"]}>
                  <FaLocationCrosshairs size="30px" />
                  <Button type="button">
                    {currentLocation?.coords.latitude},
                    {currentLocation?.coords.longitude}
                  </Button>
                </Stack>
              </FormControl>
            </Flex>

            <Button mt={4} w={"full"} colorScheme="teal" type="submit">
              Ajouter
            </Button>
          </Stack>
        </form>
      )}
    </Flex>
  );
};

export default FormAddList;
