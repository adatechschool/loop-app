import React from "react";
import {
  Box,
  Flex,
  IconButton,
  useBreakpointValue,
  useTheme,
} from "@chakra-ui/react";
import { FiHome } from "react-icons/fi";
import { BiDirections } from "react-icons/bi";
import { MdAddBox } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { BsPerson } from "react-icons/bs";
import { Link, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  const theme = useTheme();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleIconClick = () => { };

  const activeColor = "#38A169";

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
      p="22px 0"
      bg={{ base: "white", md: theme.colors.primary }}
      color="white"
      position={position}
      {...{ [bottomOrTop!]: 0 }}
      zIndex="1000"
      shadow="md"
    >
      <Flex align="center" justify="space-around">
        <Link to="/">
          {" "}
          <IconButton
            icon={<FiHome />}
            aria-label="Home"
            variant="ghost"
            fontSize="25px"
            color={isActive("/") ? activeColor : theme.colors.icon}
            _hover={{ bg: theme.colors.hover }}
            onClick={handleIconClick}
          />
        </Link>
        <Link to="/places">
          {" "}
          <IconButton
            icon={<BiDirections />}
            aria-label="List"
            variant="ghost"
            fontSize="25px"
            color={isActive("/places") ? activeColor : theme.colors.icon}
            _hover={{ bg: theme.colors.hover }}
            onClick={handleIconClick}
          />
        </Link>
        <Link to="/add">
          {" "}
          <IconButton
            icon={<MdAddBox />}
            aria-label="Add"
            variant="ghost"
            fontSize="25px"
            color={isActive("/add") ? activeColor : theme.colors.icon}
            _hover={{ bg: theme.colors.hover }}
            onClick={handleIconClick}
          />
        </Link>
        <Link to="/search">
          {" "}
          <IconButton
            icon={<IoSearch />}
            aria-label="Search"
            variant="ghost"
            fontSize="25px"
            color={isActive("/search") ? activeColor : theme.colors.icon}
            _hover={{ bg: theme.colors.hover }}
            onClick={handleIconClick}
          />
        </Link>
        <Link to="/profile">
          {" "}
          <IconButton
            icon={<BsPerson />}
            aria-label="Profile"
            variant="ghost"
            fontSize="25px"
            color={isActive("/profile") ? activeColor : theme.colors.icon}
            _hover={{ bg: theme.colors.hover }}
            onClick={handleIconClick}
          />
        </Link>
      </Flex>
    </Box>
  );
};

export default Navbar;
