
import React from "react";
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
import { mockUsers, mockPlaces } from "src/utils/mock";
import ListCards from "src/components/ListCards/ListCards";

interface ProfilePageProps {
  favorites: string[];
  onAddToFavorites: (title: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ favorites, onAddToFavorites }) => {
  
  const favoritePlaces = mockPlaces.filter((place) => favorites.includes(place.name));

  return (
    <Container p={0} minH="100vh">
    
      <Stack bg="lightgrey" p={4} w="full" maxW="md">
        <Text fontWeight="bold" textAlign="right" cursor="pointer">
          Edit
        </Text>
        <Center>
          <Box maxW="320px" w="full" p={6} textAlign="center">
            <Avatar
              size="2xl"
              src="https://images.unsplash.com/photo-1520810627419-35e362c5dc07?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200"
            />
            <Heading>@{mockUsers[0].username}</Heading>
          </Box>
        </Center>
      </Stack>

    
      <Tabs variant="soft-rounded" colorScheme="teal" p={4} w="full" maxW="md">
        <TabList>
          <Tab>Mes Lieux</Tab>
          <Tab>Mes Favoris</Tab>
        </TabList>

        <TabPanels>
          
          <TabPanel>
            <ListCards
              favorites={favorites}
              onSeeMore={(title) => console.log(`Navigating to details for: ${title}`)}
              onAddToFavorites={onAddToFavorites}
              
            />
          </TabPanel>

          
          <TabPanel>
            {favoritePlaces.length > 0 ? (
              <ListCards
                favorites={favorites}
                onSeeMore={(title) => console.log(`Navigating to details for: ${title}`)}
                onAddToFavorites={onAddToFavorites}
                data={favoritePlaces} 
              />
            ) : (
              <Text textAlign="center" color="gray.500">
                Aucun favori ajouté.
              </Text>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default ProfilePage;
