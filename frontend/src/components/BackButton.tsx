import { IconButton, useMediaQuery } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  return (
    <IconButton 
      aria-label="Retour"
      icon={<ArrowBackIcon boxSize={8} />} 
      colorScheme="blue" 
    //   variant="ghost" 
      borderRadius="full" 
      onClick={() => navigate(-1)}
      size="lg"
      _hover={!isMobile ? { bg: "blue.100" } : undefined}
    />
  );
};

export default BackButton;