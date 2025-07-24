import React from "react";
import { IconButton } from "@chakra-ui/react";
import GpsIconActive from "../Icons/GpsIconActive";
import GpsIconDefault from "../Icons/GpsIconDefault";

const GpsButton = () => {
  const [isActive, setIsActive] = React.useState(false);

  const handleClick = () => {
    setIsActive((prev) => !prev);
  };

  return (
    <IconButton
      style={{
        position: "absolute",
        bottom: "100px",
        right: "20px",
        zIndex: 1000,
      }}
      onClick={handleClick}
      title="Use GPS"
      aria-label={""}
      icon={isActive ? <GpsIconActive /> : <GpsIconDefault />}
      w={"50px"}
      h={"50px"}
      borderRadius={"50%"}
      backgroundColor={"white"}
    ></IconButton>
  );
};

export default GpsButton;
