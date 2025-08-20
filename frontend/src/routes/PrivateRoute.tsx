import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "src/contexts/AuthContext";
import { Center, Spinner } from "@chakra-ui/react";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps): JSX.Element => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" color="teal.500" />
      </Center>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
