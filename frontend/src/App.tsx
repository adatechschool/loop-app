import React from "react";
import { Routes, Route } from "react-router-dom";
import {
  HomePage,
  ListPage,
  AddPage,
  SearchPage,
  ProfilePage,
  DetailPage,
  EditDetailPage,
} from "./pages";
import LogIn from "./pages/LogInPage/LogIn";
import LoginForm from "./pages/LogInPage/LogInForm";
import SignUpForm from "./pages/LogInPage/SignUpForm";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import { GeolocationProvider } from "./contexts/GeolocationContext";
import SettingsPage from "./components/User/SettingsPage";
import { AuthProvider } from "src/contexts/AuthContext";
import { PlacesProvider } from "./contexts/PlacesContext";

const App: React.FC = () => {
  return (
    <PlacesProvider>
      <GeolocationProvider>
        <AuthProvider>
          <Routes>
            <Route element={<MainLayout />}>
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <HomePage />
                  </PrivateRoute>
                }
              />
              <Route path="/places" element={<ListPage />} />
              <Route
                path="/add"
                element={
                  <PrivateRoute>
                    <AddPage />
                  </PrivateRoute>
                }
              />

              <Route path="/edit/:id" element={<EditDetailPage />} />
              <Route path="/places/:id" element={<DetailPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <ProfilePage />
                  </PrivateRoute>
                }
              />
            </Route>

            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <SettingsPage />
                </PrivateRoute>
              }
            />

            <Route element={<AuthLayout />}>
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LogIn />
                  </PublicRoute>
                }
              />
              <Route
                path="/signin"
                element={
                  <PublicRoute>
                    <LoginForm />
                  </PublicRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <PublicRoute>
                    <SignUpForm />
                  </PublicRoute>
                }
              />
            </Route>
          </Routes>
        </AuthProvider>
      </GeolocationProvider>
    </PlacesProvider>
  );
};

export default App;
