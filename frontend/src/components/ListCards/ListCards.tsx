import { Box } from "@chakra-ui/react";
import React from "react";
import { Card } from "src/components";
import { mockPlaces } from "src/utils/mock";

// Define the props for ListCards
interface ListCardsProps {
  onSeeMore: (title: string) => void;
  onAddToFavorites: (title: string) => void;
}

const ListCards: React.FC<ListCardsProps> = ({
  onSeeMore,
  onAddToFavorites,
}) => {
  const displayPlaces = mockPlaces.map((place, index) => (
    <Card
      key={index}
      images={place.image}
      title={place.name}
      description={place.description}
      onSeeMore={onSeeMore}
      onAddToFavorites={onAddToFavorites}
    />
  ));

  return (
    <>
      {displayPlaces}
      <Box h={54} />
    </>
  );
};

export default ListCards;
