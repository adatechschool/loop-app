import React, { useState, useEffect } from "react";
import {
  Center,
  Box,
  Avatar,
  Heading,
  Stack,
  Text,
  Container,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { mockUsers } from "src/utils/mock"; // Assuming this has mock data for users
import { ListCards } from "src/components"; // Your ListCards component for displaying places

const ProfilePage: React.FC = () => {
  // Load favorites from localStorage or initialize with an empty array
  const [favorites, setFavorites] = useState<string[]>(() => {
    const storedFavorites = localStorage.getItem("favorites");
    console.log("Stored favorites from localStorage:", storedFavorites); // Debugging
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    console.log("Favorites state updated:", favorites); // Debugging state update
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]); // This effect will run every time favorites change

  // Handle adding/removing places from favorites
  const handleAddToFavorites = (title: string) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(title)
        ? prevFavorites.filter((fav) => fav !== title) // Remove from favorites if already there
        : [...prevFavorites, title] // Add to favorites if not already in the list
    );
  };

  return (
    
    <Container p={0} minH="100vh">
      {/* Profile Section */}
      <Stack bg="lightgrey" p={4} w={"full"} maxW={"md"}>
        <Text
          fontWeight="bold"
          textAlign="right"
          cursor="pointer"
        >
          Edit
        </Text>
        <Center>
          <Box maxW="320px" w="full" p={6} textAlign="center">
            <Avatar
              size="2xl"
              src="https://images.unsplash.com/photo-1520810627419-35e362c5dc07?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ"
            />
            <Heading>@{mockUsers[0].username}</Heading>
          </Box>
        </Center>
      </Stack>

      {/* Tabs for "Mes Lieux" and "Mes Favoris" */}
      <Tabs variant="soft-rounded" colorScheme="teal" p={4} w="full" maxW="md">
        <TabList>
          <Tab>Mes Lieux</Tab>
          <Tab>Mes Favoris</Tab>
        </TabList>

        <TabPanels>
          {/* "Mes Lieux" Tab */}
          <TabPanel>
            <Heading size="md" mb={4}>Mes Lieux</Heading>
            <ListCards
              favorites={favorites} // Pass favorites to ListCards
              onSeeMore={(title) => console.log(`Navigating to details for: ${title}`)}
              onAddToFavorites={handleAddToFavorites} // Pass the add-to-favorites function
            />
          </TabPanel>

          {/* "Mes Favoris" Tab */}
          <TabPanel>
            <Heading size="md" mb={4}>Mes Favoris</Heading>
            {favorites.length > 0 ? (
              <ListCards
                favorites={favorites} // Render only the favorited places
                onSeeMore={(title) => console.log(`Navigating to details for: ${title}`)}
                onAddToFavorites={handleAddToFavorites}
              />
            ) : (
              <Text textAlign="center" color="gray.500">Aucun favori ajouté.</Text>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default ProfilePage;
