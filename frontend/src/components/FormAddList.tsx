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
} from "@chakra-ui/react";
import { FaAccessibleIcon } from "react-icons/fa";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import PORT from "src/utils/constant";

const FormAddList = () => {
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [errorMessage, setErrorMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [accessibility, setAccessibility] = useState(false);
  const [placeFieldsValues, setPlaceFieldsValues] = useState({
    name: "",
    address: "",
    description: "",
    types: [] as string[],
    accessibility,
    images: [] as string[],
  });

  // const getLocation = () => {
  //   return setLocation("48.849726, 2.319596");
  // };
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
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          const imageId = response.data.imageId;
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
      setPlaceFieldsValues((prev) => ({
        ...prev,
        name: name as string,
        address: address as string,
        description: description as string,
        types: [types as string],
        accessibility,
        geo: location,
      }));

      // console.log({
      //   name,
      //   address,
      //   description,
      //   accessibility,
      //   types,
      //   geo: location,
      // });

      const payload = {
        name,
        address,
        description,
        accessibility,
        geo: location,
        types: placeFieldsValues.types.length
          ? placeFieldsValues.types
          : ["type-id-1"],
        images: placeFieldsValues.images.length
          ? placeFieldsValues.images
          : [""],
      };

      try {
        const response = await axios.post(
          `http://localhost:${PORT}/api/places`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const { user } = response.data;
        localStorage.setItem("token", user.token);
        navigate("/list");
      } catch (error) {
        setErrorMessage("Mot de passe ou nom d'utilisateur invalide");
        console.error("Error :", (error as Error).message);
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

  console.log("accessibility", accessibility);
  console.log("placeFieldsValues", placeFieldsValues);
  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"} bg={"white"}>
      <form onSubmit={handleSubmit}>
        <Stack
          spacing={6}
          p={6}
          bg={"white"}
          w={"full"}
          maxW={"md"}
          rounded={"xl"}
        >
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
            >
              <option value="Parc">Parc</option>
              <option value="Street art">Street art</option>
              <option value="Rue piétonne">Rue piétonne</option>
              <option value="Monument">Monument</option>
              <option value="Architecture">Architecture</option>
            </Select>
          </FormControl>

          <Flex>
            <FormControl>
              <FormLabel htmlFor="accessibilityPlace">Accessibilité</FormLabel>
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
                  {location.lat}, {location.lng}
                </Button>
              </Stack>
            </FormControl>
          </Flex>

          <Button mt={4} w={"full"} colorScheme="teal" type="submit">
            Ajouter
          </Button>
        </Stack>
      </form>
    </Flex>
  );
};

export default FormAddList;
