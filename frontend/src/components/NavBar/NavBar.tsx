import React, { useState } from "react";
import {
  Box,
  Flex,
  IconButton,
  useBreakpointValue,
  useTheme,
} from "@chakra-ui/react";
import { FiHome } from "react-icons/fi";
import { BiDirections } from "react-icons/bi"; // Importing BiDirections
import { MdAddBox } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { BsPerson } from "react-icons/bs";
import { Link } from "react-router-dom"; // Importing Link for navigation

const Navbar: React.FC = () => {
  const theme = useTheme(); // Accessing Chakra's theme

  // State to manage selected icon
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  const handleIconClick = (icon: string) => {
    setSelectedIcon(icon); // Set the selected icon
  };

  const position = useBreakpointValue<"static" | "fixed">({
    base: "fixed",
    md: "static",
  });
  const bottomOrTop = useBreakpointValue<"top" | "bottom">({
    base: "bottom",
    md: "top",
  });

  return (
    <Box
      as="nav"
      width="100%"
      p="22px 0" // 22px padding on top and bottom, 0px on the sides
      bg={{ base: "white", md: theme.colors.primary }} // Use the primary color from the theme
      color="white"
      position={position}
      {...{ [bottomOrTop!]: 0 }}
      zIndex="1000"
      shadow="md" // Optional: Add a shadow for better visibility
    >
      <Flex align="center" justify="space-around">
        <Link to="/">
          {" "}
          {/* Home route */}
          <IconButton
            icon={<FiHome />}
            aria-label="Home"
            variant="ghost"
            fontSize="25px"
            color={
              selectedIcon === "home"
                ? theme.colors.selected
                : theme.colors.icon
            }
            _hover={{ bg: theme.colors.hover }}
            onClick={() => handleIconClick("home")}
          />
        </Link>
        <Link to="/list">
          {" "}
          {/* Map route */}
          <IconButton
            icon={<BiDirections />} // Updated to use BiDirections
            aria-label="List"
            variant="ghost"
            fontSize="25px"
            color={
              selectedIcon === "location"
                ? theme.colors.selected
                : theme.colors.icon
            }
            _hover={{ bg: theme.colors.hover }}
            onClick={() => handleIconClick("map")}
          />
        </Link>
        <Link to="/add">
          {" "}
          {/* Add route */}
          <IconButton
            icon={<MdAddBox />}
            aria-label="Add"
            variant="ghost"
            fontSize="25px"
            color={
              selectedIcon === "add" ? theme.colors.selected : theme.colors.icon
            }
            _hover={{ bg: theme.colors.hover }}
            onClick={() => handleIconClick("add")}
          />
        </Link>
        <Link to="/search">
          {" "}
          {/* Search route */}
          <IconButton
            icon={<IoSearch />}
            aria-label="Search"
            variant="ghost"
            fontSize="25px"
            color={
              selectedIcon === "search"
                ? theme.colors.selected
                : theme.colors.icon
            }
            _hover={{ bg: theme.colors.hover }}
            onClick={() => handleIconClick("search")}
          />
        </Link>
        <Link to="/profile">
          {" "}
          {/* Profile route */}
          <IconButton
            icon={<BsPerson />}
            aria-label="Profile"
            variant="ghost"
            fontSize="25px"
            color={
              selectedIcon === "profile"
                ? theme.colors.selected
                : theme.colors.icon
            }
            _hover={{ bg: theme.colors.hover }}
            onClick={() => handleIconClick("profile")}
          />
        </Link>
      </Flex>
    </Box>
  );
};

export default Navbar;
