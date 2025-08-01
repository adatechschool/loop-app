// src/components/ListCards/ListCards.tsx
import { Box, Stack, Skeleton } from "@chakra-ui/react";
import React from "react";
import Card from "../Card/Card";
import { useNavigate } from "react-router-dom";
import noImage from "../../assets/no-image.png";

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

  return (
    <>
      {loading ? (
        places?.map(() => (
          <Stack>
            <Skeleton p="4" height="700px" width="380" />
          </Stack>
        ))
      ) : (
        <Stack spacing={4}>
          {places?.map((place, index) => {
            const images =
              Array.isArray(place.images) && place.images.length > 0
                ? place.images
                    .map((img: { image: { url: string } }) => img.image?.url)
                    .filter(Boolean)
                : [noImage];
            return (
              <Card
                userAvatar={
                  userAvatar || place.author?.profilePicture || noImage
                }
                key={index}
                images={images}
                title={place.name}
                description={place.description}
                username={place.author?.username}
                onClick={() =>
                  navigate(`/places/${encodeURIComponent(place.id)}`)
                }
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
