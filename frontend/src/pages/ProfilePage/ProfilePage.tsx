import React from "react";
import {
  Center,
  Box,
  Avatar,
  Heading,
  Button,
  Stack,
  Text,
  Container,
} from "@chakra-ui/react";

import { mockUsers } from "src/utils/mock";
import { ListCards } from "src/components";

const ProfilePage: React.FC = () => {
  console.log(mockUsers);
  const handleClickEdit = () => {
    alert("Click to edit");
  };

  const handleClickFavorites = () => {
    alert("Click for redirection to favorites places");
  };

  const handleSeeMoreClick = (title: string) => {
    console.log(`Navigating to details for: ${title}`);
    // Add navigation logic here
  };

  const handleAddToFavorites = (title: string) => {
    console.log(`Added to favorites: ${title}`);
    // Add favorite logic here
  };

  return (
    <Container p={0} minH={"100vh"}>
      <Stack bg={"lightgrey"} p={6} w={"full"} maxW={"md"}>
        <Text
          fontWeight={"bold"}
          textAlign={"right"}
          onClick={handleClickEdit}
          cursor={"pointer"}
          _active={{ color: "white" }}
        >
          Edit
        </Text>
        <Center>
          <Box maxW={"320px"} w={"full"} p={6} textAlign={"center"}>
            <Avatar
              size={"2xl"}
              src="https://images.unsplash.com/photo-1520810627419-35e362c5dc07?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ"
            />
            <Heading>@{mockUsers[0].username}</Heading>
            <Button
              m={"8px"}
              size={"md"}
              colorScheme="teal"
              onClick={handleClickFavorites}
            >
              Mes Favoris
            </Button>
          </Box>
        </Center>
      </Stack>
      <Stack p={4} w={"full"} maxW={"md"}>
        <Heading>Mes lieux</Heading>
        <ListCards
          onSeeMore={handleSeeMoreClick}
          onAddToFavorites={handleAddToFavorites}
        />
      </Stack>
    </Container>
  );
};

export default ProfilePage;
