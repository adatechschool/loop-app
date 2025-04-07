// src/layouts/MainLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components";
import BackgroundWrapper from "../components/BackgroundWrapper";
import { Box, Flex } from "@chakra-ui/react";  // Chakra UI components

const MainLayout: React.FC = () => {
  return (
    <BackgroundWrapper>
      <Box minH="100vh">
        <Navbar />
        <Flex direction="column" >
          <Outlet />
        </Flex>
      </Box>
    </BackgroundWrapper>
  );
};

export default MainLayout;
