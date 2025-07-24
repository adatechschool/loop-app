import React, { useState, useContext } from "react";
import axios from "axios";
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
  useToast,
  VStack,
  Icon,
  Image,
  Box,
  IconButton,
} from "@chakra-ui/react";
import { FaAccessibleIcon, FaPlus, FaTimes } from "react-icons/fa";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import PORT from "src/utils/constant";
import { useGeolocationContext } from "src/contexts/GeolocationContext";
import { AuthContext } from "src/contexts/AuthContext";

const FormAddList = () => {
  const { location: currentLocation } = useGeolocationContext();
  const { token } = useContext(AuthContext);
  const [error, setError] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
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

  const toast = useToast();
  const navigate = useNavigate();

  const handleImageUpload = async (selectedFile: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("upload_preset", "unsigned_demo");

    try {
      const uploadRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dpqyho229/image/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const imageUrl = uploadRes.data.secure_url;

      const imageRes = await axios.post(
        `http://localhost:${PORT}/api/images`,
        { url: imageUrl },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const imageId = imageRes.data.image_id;
      setPlaceFieldsValues((prev) => ({
        ...prev,
        images: [imageId],
      }));

      toast({
        title: "Image uploadée",
        description: "L'image a été uploadée avec succès !",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      console.error("Erreur lors de l'upload image", error);
      setError("Erreur lors du téléchargement de l'image");
      setImagePreview(null);
      // setFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;

    if (selectedFile) {
      if (!selectedFile.type.startsWith("image/")) {
        toast({
          title: "Erreur",
          description: "Veuillez sélectionner une image valide.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        return;
      }

      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({
          title: "Erreur",
          description: "L'image ne peut pas dépasser 10MB.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);

      handleImageUpload(selectedFile);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setPlaceFieldsValues((prev) => ({
      ...prev,
      images: [],
    }));

    const fileInput = document.getElementById(
      "hiddenFileInput"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleImageAreaClick = () => {
    if (!imagePreview) {
      document.getElementById("hiddenFileInput")?.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (isUploading) {
      toast({
        title: "Upload en cours",
        description: "Veuillez attendre que l'image soit uploadée.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData(e.currentTarget);
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
        navigate("/places");
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
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'ajout du lieu.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      minH={"calc(100vh - 70px)"}
      align="center"
      justify="center"
      bg="white"
    >
      {loading ? (
        <CircularProgress isIndeterminate color="green.300" />
      ) : (
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Stack spacing={6} p={6} bg="white" w="full" maxW="md" rounded="xl">
            {error && (
              <Text color="red.500" mb={2}>
                {error}
              </Text>
            )}

            <FormControl id="imagePlace" isRequired>
              <FormLabel>Image du lieu</FormLabel>

              {imagePreview ? (
                <Box position="relative" w="full">
                  <Image
                    src={imagePreview}
                    alt="Aperçu"
                    w="full"
                    h="200px"
                    objectFit="cover"
                    borderRadius="xl"
                    border="2px solid"
                    borderColor="gray.200"
                  />
                  <Flex position="absolute" top={2} right={2} gap={2}>
                    <IconButton
                      aria-label="Supprimer l'image"
                      icon={<FaTimes />}
                      size="sm"
                      colorScheme="red"
                      variant="solid"
                      onClick={handleRemoveImage}
                      isDisabled={isUploading}
                    />
                    <Button
                      size="sm"
                      colorScheme="blue"
                      variant="solid"
                      onClick={() =>
                        document.getElementById("hiddenFileInput")?.click()
                      }
                      isDisabled={isUploading}
                    >
                      Remplacer
                    </Button>
                  </Flex>
                  {isUploading && (
                    <Flex
                      position="absolute"
                      bottom={2}
                      left={2}
                      align="center"
                      gap={2}
                      bg="blackAlpha.700"
                      color="white"
                      px={3}
                      py={1}
                      borderRadius="md"
                    >
                      <CircularProgress
                        size="4"
                        isIndeterminate
                        color="white"
                      />
                      <Text fontSize="sm">Upload en cours...</Text>
                    </Flex>
                  )}
                </Box>
              ) : (
                <VStack
                  border="2px dashed gray"
                  borderRadius="xl"
                  p={12}
                  spacing={3}
                  justify="center"
                  align="center"
                  cursor="pointer"
                  onClick={handleImageAreaClick}
                  _hover={{ borderColor: "teal.300", bg: "gray.50" }}
                  transition="all 0.2s"
                >
                  <Icon as={FaPlus} boxSize={10} color="gray.400" />
                  <Text fontSize="lg" color="gray.600" textAlign="center">
                    Ajouter une image
                  </Text>
                  <Text fontSize="sm" color="gray.400" textAlign="center">
                    Cliquez pour sélectionner une image
                    <br />
                    (max 10MB)
                  </Text>
                </VStack>
              )}

              <Input
                id="hiddenFileInput"
                type="file"
                accept="image/*"
                name="imagePlace"
                display="none"
                onChange={handleFileSelect}
              />
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
                <Stack spacing={6} direction={"row"} align="center">
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
                <Stack spacing={6} direction={"row"} align="center">
                  <FaLocationCrosshairs size="30px" />
                  <Button type="button" isDisabled>
                    {currentLocation
                      ? `${currentLocation.coords.latitude.toFixed(
                          4
                        )}, ${currentLocation.coords.longitude.toFixed(4)}`
                      : "Localisation inconnue"}
                  </Button>
                </Stack>
              </FormControl>
            </Flex>

            <Button
              mt={4}
              w="full"
              colorScheme="teal"
              type="submit"
              isDisabled={isUploading}
              loadingText="Upload en cours..."
            >
              Ajouter
            </Button>
          </Stack>
        </form>
      )}
    </Flex>
  );
};

export default FormAddList;
