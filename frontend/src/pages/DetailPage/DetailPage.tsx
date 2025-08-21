import React, { useState, useRef } from "react";
import {
  Box,
  Text,
  VStack,
  Flex,
  Button,
  Icon,
  Tag,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useParams, useNavigate } from "react-router-dom";
import ImageCarousel from "../../components/Card/ImageCarrousel";
import LikeButton from "../../components/Card/LikeButton";
import useGetPlace from "src/hooks/useGetPlace";
import Backbutton from "src/components/BackButton";
import { AuthContext } from "src/contexts/AuthContext";
import { TAG_TYPE_PLACES_COLORS } from "src/utils/constant";
import axios from "axios";

const DetailPage: React.FC = () => {
  const params = useParams();
  const id = params.id;
  const navigate = useNavigate();
  const { place, loading, error } = useGetPlace(id ?? "");
  const { user, token } = React.useContext(AuthContext);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const handleEdit = () => {
    navigate(`/edit/${id}`);
  };

  const handleDelete = async () => {
    console.log("Frontend deleting ID:", id); // Check this value
    try {
      await axios.delete(`${process.env.LOOP_API_URL}/api/places/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/");
    } catch (err) {
      console.error("Failed to delete place", err);
    }
    setIsDeleteOpen(false);
  };

  if (!id) {
    return (
      <Box textAlign="center" mt="10">
        <Text fontSize="xl" color="red.500">
          ID de lieu non valide
        </Text>
        <Button mt="4" colorScheme="blue" onClick={() => navigate("/")}>
          Retour à la page d'accueil
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
    return (
      <Box textAlign="center" mt="10">
        <Text fontSize="xl" color="red.500">
          Lieu introuvable
        </Text>
        <Button mt="4" colorScheme="blue" onClick={() => navigate("/")}>
          Retour à la page d'accueil
        </Button>
      </Box>
    );
  }

  return (
    <Box maxW="lg" mx="auto" p="4" position="relative">
      <Box
        position="absolute"
        top="4"
        left="0"
        right="0"
        zIndex="10"
        marginLeft={4}
        marginRight={4}
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Backbutton />
          {user?.username === place.author.username && (
            <Box>
              <Icon
                as={EditIcon}
                fontSize="24px"
                onClick={handleEdit}
                cursor="pointer"
                mr={2}
              />
              <Icon
                as={DeleteIcon}
                fontSize="24px"
                cursor="pointer"
                color="red.500"
                onClick={() => setIsDeleteOpen(true)}
              />
            </Box>
          )}
        </Flex>
      </Box>

      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirmer la suppression
            </AlertDialogHeader>
            <AlertDialogBody>
              Êtes-vous sûr de vouloir supprimer ce lieu ? Cette action est
              irréversible.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDeleteOpen(false)}>
                Annuler
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Supprimer
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Box mt="16"></Box>
      <ImageCarousel
        images={place.images?.map((img: any) => img.image?.url)}
        title={place.name}
      />

      <Flex justifyContent="space-between" my="4">
        <Button
          colorScheme="teal"
          onClick={() =>
            (window.location.href = `/?lat=${place.geo?.lat}&lng=${place.geo?.lng}`)
          }
        >
          Voir sur la map
        </Button>
        <LikeButton title={undefined} />
      </Flex>

      <Text fontWeight="bold" fontSize="3xl" mt="6" textAlign="left">
        {place.name}
      </Text>
      <Text marginBottom={"6"}>{place.address}</Text>
      <Flex gap={2} mb="4">
        {place.types.map((type: any) => {
          const tag = TAG_TYPE_PLACES_COLORS.find((t) => t.key === type.typeId);
          return tag ? (
            <Tag key={type.id} colorScheme={tag.color}>
              {tag.name}
            </Tag>
          ) : null;
        })}
      </Flex>

      <VStack align="flex-start" spacing="4" mt="6">
        <Text fontSize="lg">{place.description}</Text>

        <Text fontSize="md" fontWeight="bold">
          Coordonnées
        </Text>
        <Text>
          Lat: {place.geo?.lat}, Long: {place.geo?.lng}
        </Text>
      </VStack>
      <Box boxSize={"20"} />
    </Box>
  );
};

export default DetailPage;
