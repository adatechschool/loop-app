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
import { mockPlaces } from "src/utils/mock";
import ListCards from "src/components/ListCards/ListCards";
import useQueryUser from "src/hooks/useQueryUser";

interface ProfilePageProps {
  favorites: string[];
  onAddToFavorites: (title: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({
  favorites,
  onAddToFavorites,
}) => {
  const navigate = useNavigate();
  const { user, loading } = useQueryUser();
  const favoritePlaces = mockPlaces.filter((place) =>
    favorites.includes(place.name)
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Container p={0} minH="100vh">
      <Stack p={4} w="full" maxW="md">
        <Container display="flex" justifyContent="flex-end">
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<HamburgerIcon />}
            />
            <MenuList>
              <MenuItem onClick={() => navigate("/settings")}>Paramètres</MenuItem>
              <MenuItem color="red" onClick={handleLogout}>
                Se déconnecter
              </MenuItem>
            </MenuList>
          </Menu>
        </Container>

        <Center>
          <Box maxW="320px" w="full" p={6} textAlign="center">
            {loading ? (
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

      <Tabs variant="soft-rounded" colorScheme="teal" p={4} w="full" maxW="md">
        <TabList>
          <Tab>Mes Lieux</Tab>
          <Tab>Mes Favoris</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <ListCards
              favorites={favorites}
              onSeeMore={(title) =>
                console.log(`Navigating to details for: ${title}`)
              }
              onAddToFavorites={onAddToFavorites}
            />
          </TabPanel>

          <TabPanel>
            {favoritePlaces.length > 0 ? (
              <ListCards
                favorites={favorites}
                onSeeMore={(title) =>
                  console.log(`Navigating to details for: ${title}`)
                }
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
