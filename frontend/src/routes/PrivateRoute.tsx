import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "src/contexts/AuthContext";
import { Center, Spinner } from "@chakra-ui/react";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps): JSX.Element => {
  const { user, loading } = useContext(AuthContext);

  // Si l'auth est en cours de vérification
  if (loading) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" color="teal.500" />
      </Center>
    );
  }

  // Si l'utilisateur n'est pas connecté
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Sinon, accès autorisé
  return <>{children}</>;
};

export default PrivateRoute;
