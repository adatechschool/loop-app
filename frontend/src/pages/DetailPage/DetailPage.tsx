import React, { useContext } from "react";
import {
  Box,
  Text,
  VStack,
  Flex,
  Button,
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import ImageCarousel from "../../components/Card/ImageCarrousel";
import LikeButton from "../../components/Card/LikeButton";
import useGetPlace from "src/hooks/useGetPlace";
import { AuthContext } from "src/contexts/AuthContext";
import apiClient from "src/utils/apiClient";

const DetailPage: React.FC = () => {
  const { id } = useParams();
  console.log("ID depuis URL:", id);


  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useContext(AuthContext);



  const { place, loading, error } = useGetPlace(id ?? "");

  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const cancelRef = React.useRef(null);

  const isAuthor = user?.id && place?.authorUser?.id && user.id === place.authorUser.id;

  const handleDelete = async () => {
    try {
      await apiClient.delete(`/api/places/${id}`);
      toast({
        title: "Lieu supprimé",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/");
    } catch (err) {
      toast({
        title: "Erreur lors de la suppression",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (!id) {
    return (
      <Box textAlign="center" mt="10">
        <Text fontSize="xl" color="red.500">
          Invalid place ID
        </Text>
        <Button mt="4" colorScheme="blue" onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box textAlign="center" mt="10">
        <Text fontSize="xl">Chargement...</Text>
      </Box>
    );
  }

  if (error || !place) {
    console.log("Données place reçues :", place);
    return (
      <Box textAlign="center" mt="10">
        <Text fontSize="xl" color="red.500">
          Place not found
        </Text>
        <Button mt="4" colorScheme="blue" onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </Box>
    );
  }

  return (
    <Box maxW="lg" mx="auto" p="4">
      <ImageCarousel
        images={place.images?.map((img: any) => img.image?.url).filter(Boolean)}
        title={place.name}
      />

      <Flex justifyContent="space-between" my="4">
        <Button
          colorScheme="teal"
          onClick={() =>
            (window.location.href = `/?lat=${place.geo?.lat}&lng=${place.geo?.lng}`)
          }
        >
          Voir sur la carte
        </Button>
        <LikeButton title={place.name} />
      </Flex>

      <Text fontWeight="bold" fontSize="3xl" mb="1" mt="6" textAlign="left">
        {place.name}
      </Text>

      <Text fontSize="sm" color="gray.500" mb="4" textAlign="left">
        Créé par {place.authorUser?.username || "Anonyme"}
      </Text>

      <VStack align="flex-start" spacing="4" mt="6">
        <Text fontSize="lg">{place.description}</Text>

        <Text fontSize="md" fontWeight="bold">
          Adresse :
        </Text>
        <Text>{place.address}</Text>

        <Text fontSize="md" fontWeight="bold">
          Coordonnées :
        </Text>
        <Text>
          Latitude: {place.geo?.lat}, Longitude: {place.geo?.lng}
        </Text>
      </VStack>

      {isAuthor && (
        <Flex gap="4" mt="8">
          <Button
            colorScheme="yellow"
            onClick={() => navigate(`/places/${id}/edit`)}
          >
            Modifier
          </Button>
          <Button colorScheme="red" onClick={() => setIsAlertOpen(true)}>
            Supprimer
          </Button>
        </Flex>
      )}

      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Confirmer la suppression</AlertDialogHeader>
            <AlertDialogBody>
              Es-tu sûr(e) de vouloir supprimer ce lieu ? Cette action est
              irréversible.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsAlertOpen(false)}>
                Annuler
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Supprimer
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default DetailPage;
