import { Box, Stack, Skeleton } from "@chakra-ui/react";
import React from "react";
import Card from "../Card/Card";
import { useNavigate } from "react-router-dom";
import noImage from "../../assets/no-image.png";
import useFavorites from "../../hooks/useFavorites"; // 🔹 ton hook

interface ListCardsProps {
  places: {
    images?: string;
    name?: string;
    description?: string;
    author?: {
      username?: string;
      profilePicture?: string;
    };
    id: string;
  }[];
  loading: boolean;
  userAvatar?: string;
}

const ListCards = ({ places, loading, userAvatar }: ListCardsProps) => {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites(); // 🔹 hook

  return (
    <>
      {loading ? (
        places?.map(() => (
          <Stack key={Math.random()}>
            <Skeleton p="4" height="700px" width="380px" />
          </Stack>
        ))
      ) : (
        <Stack spacing={4}>
          {places?.map((place) => {
            const images =
              Array.isArray(place.images) && place.images.length > 0
                ? place.images
                  .map((img: { image: { url: string } }) => img.image?.url)
                  .filter(Boolean)
                : [noImage];

            const favorite = isFavorite(place.id); // 🔹 est-ce favori ?

            return (
              <Card
                key={place.id}
                userAvatar={userAvatar || place.author?.profilePicture || noImage}
                images={images}
                title={place.name}
                description={place.description}
                username={place.author?.username}
                onClick={() => navigate(`/places/${encodeURIComponent(place.id)}`)}
                isFavorite={favorite} // 🔹 utilisation de la variable
                onFavoriteClick={() => toggleFavorite(place.id)}
              />
            );
          })}
          <Box h={54} />
        </Stack>
      )}
    </>
  );
};

export default ListCards;
