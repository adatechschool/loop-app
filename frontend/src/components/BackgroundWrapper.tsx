// src/components/BackgroundWrapper.tsx
import { Box } from "@chakra-ui/react";
import React from "react";

interface BackgroundWrapperProps {
    children: React.ReactNode;
}

const BackgroundWrapper: React.FC<BackgroundWrapperProps> = ({ children }) => {
    return (
        <Box
            minH="100vh"
            bg="#0b0b59"  // Default blue background

        >
            {children}
        </Box>
    );
};

export default BackgroundWrapper;
