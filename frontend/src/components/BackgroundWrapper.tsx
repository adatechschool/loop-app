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
            bg="linear-gradient(135deg, #2c3e50 0%, #34495e 100%)"  // Default gradient (blue to pink for desktop)

        >
            {children}
        </Box>
    );
};

export default BackgroundWrapper;
