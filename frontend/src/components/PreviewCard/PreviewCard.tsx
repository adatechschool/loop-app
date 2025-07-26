import React from "react";
import {
  DrawerContent,
  DrawerOverlay,
  Drawer,
  DrawerHeader,
  Button,
  Image,
  DrawerBody,
  Box,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import LikeButton from "../Card/LikeButton";

interface PreviewCardProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  address: string;
  id: string;
  image: string;
}

const PreviewCard = ({
  name,
  address,
  id,
  image,
  isOpen,
  onClose,
}: PreviewCardProps) => {
  const navigate = useNavigate();
  return (
    <Drawer placement="bottom" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent h="50%">
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">{name}</DrawerHeader>

        <DrawerBody>
          <p>{address}</p>

          <Button
            colorScheme="teal"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/places/${id}`);
            }}
          >
            Voir plus
          </Button>

          <Button ml={2}>Favoris</Button>
          <LikeButton title={name} />
          <Box w="200px" h="200px" mt={4} overflow="hidden" borderRadius="md">
            <Image src={image} objectFit="cover" w="100%" h="100%" alt={name} />
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default PreviewCard;
