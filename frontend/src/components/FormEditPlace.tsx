import React, { useState, useContext, useEffect } from "react";
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
} from "@chakra-ui/react";
import { FaAccessibleIcon } from "react-icons/fa";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { useGeolocationContext } from "src/contexts/GeolocationContext";
import { AuthContext } from "src/contexts/AuthContext";
import useGetPlace from "src/hooks/useGetPlace";
import axios from "axios";

const FormEditPlace = () => {
  const { id } = useParams<{ id: string }>();
  const { place, loading, error } = useGetPlace(id || "");
  const { token } = useContext(AuthContext);
  const { location: currentLocation } = useGeolocationContext();
  const navigate = useNavigate();
  const toast = useToast();

  const [formValues, setFormValues] = useState({
    name: "",
    address: "",
    description: "",
    types: [] as string[],
    accessibility: false,
    geo: {
      lat: place?.geo.lat || 0,
      lng: place?.geo.lng || 0,
    },
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (place) {
      setFormValues({
        name: place.name,
        address: place.address,
        description: place.description || "",
        types: place?.types?.map((t: any) => t.typeId) ?? [],
        accessibility: place.accessibility || false,
        geo: {
          lat: place?.geo.lat || 0,
          lng: place?.geo.lng || 0,
        },
      });
    }
  }, [place]);

  const handleChange = (field: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitting(true);
    try {
      const payload = {
        ...formValues,
        // geo: {
        //   lat: currentLocation?.coords.latitude,
        //   lng: currentLocation?.coords.longitude,
        // },
      };

      await axios.patch(
        `${process.env.LOOP_API_URL}/api/places/${id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast({
        title: "Lieu modifié",
        description: "Les informations ont été mises à jour avec succès !",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      navigate("/places");
    } catch (err: any) {
      console.error("Erreur modification:", err);
      toast({
        title: "Erreur",
        description:
          err.response?.data?.message || "Erreur lors de la modification",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Flex minH="calc(100vh - 70px)" align="center" justify="center">
        <CircularProgress isIndeterminate color="green.300" />
      </Flex>
    );
  }

  return (
    <Flex minH="calc(100vh - 70px)" align="center" justify="center" bg="white">
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <Stack spacing={6} p={6} bg="white" w="full" maxW="md" rounded="xl">
          {error && <Text color="red.500">{error}</Text>}
          <FormControl isRequired>
            <FormLabel>Nom</FormLabel>
            <Input
              value={formValues.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Adresse</FormLabel>
            <Input
              value={formValues.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={formValues.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Catégorie</FormLabel>
            <Select
              value={formValues.types[0] || ""}
              onChange={(e) => handleChange("types", [e.target.value])}
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
              <FormLabel>Accessibilité</FormLabel>
              <Stack direction="row" align="center">
                <FaAccessibleIcon size="30px" />
                <Switch
                  isChecked={formValues.accessibility}
                  onChange={(e) =>
                    handleChange("accessibility", e.target.checked)
                  }
                />
              </Stack>
            </FormControl>
            <FormControl>
              <FormLabel>Localisation</FormLabel>
              <Stack direction="row" align="center">
                <FaLocationCrosshairs size="30px" />
                <Button type="button" isDisabled>
                  {currentLocation
                    ? `${place?.geo.lat.toFixed(4)}, ${place?.geo.lng.toFixed(
                        4
                      )}`
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
            isLoading={submitting}
          >
            Modifier
          </Button>
        </Stack>
      </form>
    </Flex>
  );
};

export default FormEditPlace;
