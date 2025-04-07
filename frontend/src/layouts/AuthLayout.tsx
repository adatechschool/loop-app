// src/layouts/AuthLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import { Center } from "@chakra-ui/react";

const AuthLayout: React.FC = () => {
  return (
    <Center h="100vh">
      <Outlet />
    </Center>
  );
};

export default AuthLayout;
