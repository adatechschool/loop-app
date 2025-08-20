import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "src/contexts/AuthContext";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps): JSX.Element => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <Navigate to="/" replace /> : <>{children}</>;
};

export default PublicRoute;
