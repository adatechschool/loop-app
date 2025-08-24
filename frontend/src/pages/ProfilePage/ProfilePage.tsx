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
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  IconButton,
  SkeletonCircle,
  SkeletonText,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import ListCards from "src/components/ListCards/ListCards";
import useQueryUser from "src/hooks/useQueryUser";
import useQueryPlaces from "src/hooks/useQueryPlaces";
import useFavorites from "src/hooks/useFavorites";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, loading: loadingUser } = useQueryUser();
  const {
    places: fetchedPlaces,
    loading: loadingPlaces,
  } = useQueryPlaces();
  const { favorites, loading: loadingFavorites } = useFavorites();

  // lieux créés par l'utilisateur connecté
  const userPlaces = fetchedPlaces.filter(
    (place) => place.author?.username === user?.username
  );
  const reverseOrderedPlaces = [...userPlaces].reverse();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Container p={0} minH="100vh">
      {/* Menu en haut à droite */}
      <Stack p={4} w="full" maxW="md">
        <Container display="flex" justifyContent="flex-end">
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<HamburgerIcon />}
            />
            <MenuList>
              <MenuItem onClick={() => navigate("/settings")}>
                Paramètres
              </MenuItem>
              <MenuItem color="red" onClick={handleLogout}>
                Se déconnecter
              </MenuItem>
            </MenuList>
          </Menu>
        </Container>

        {/* Profil utilisateur */}
        <Center>
          <Box maxW="320px" w="full" p={6} textAlign="center">
            {loadingUser ? (
              <>
                <Stack align="center" spacing={4}>
                  <SkeletonCircle size="20" />
                </Stack>
                <SkeletonText mt={2} noOfLines={1} skeletonHeight="6" />
              </>
            ) : (
              <>
                <Avatar
                  size="2xl"
                  src={user?.profilePicture || "https://bit.ly/broken-link"}
                />
                <Heading>{user?.username}</Heading>
              </>
            )}
          </Box>
        </Center>
      </Stack>

      {/* Onglets : Mes lieux / Favoris */}
      <Tabs variant="soft-rounded" colorScheme="teal" p={4} w="full" maxW="md">
        <TabList>
          <Tab>Mes Lieux</Tab>
          <Tab>Mes Favoris</Tab>
        </TabList>

        <TabPanels>
          {/* Onglet Mes Lieux */}
          <TabPanel>
            {loadingPlaces ? (
              <Text textAlign="center">Chargement...</Text>
            ) : userPlaces.length > 0 ? (
              <ListCards
                places={reverseOrderedPlaces}
                loading={loadingPlaces}
                userAvatar={user?.profilePicture}
              />
            ) : (
              <Center>
                <Text>Aucun lieux disponibles</Text>
              </Center>
            )}
          </TabPanel>

          {/* Onglet Mes Favoris */}
          <TabPanel>
            {loadingFavorites ? (
              <Text textAlign="center">Chargement des favoris...</Text>
            ) : favorites.length > 0 ? (
              <ListCards
                places={favorites} // ✅ on affiche directement les lieux favoris
                loading={loadingFavorites}
                userAvatar={user?.profilePicture}
              />
            ) : (
              <Center>
                <Text>Aucun favori ajouté.</Text>
              </Center>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default ProfilePage;
