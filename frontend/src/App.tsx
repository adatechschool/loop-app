import React, { useState } from "react";
import { Routes, Route, } from "react-router-dom";
import { HomePage, ListPage, AddPage, SearchPage, ProfilePage, DetailPage } from "./pages";
import LogIn from "./pages/LogInPage/LogIn";
import LoginForm from "./pages/LogInPage/LogInForm";
import SignUpForm from "./pages/LogInPage/SignUpForm";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import { GeolocationProvider } from "./providers/GeolocationContext";
import SettingsPage from "./components/User/SettingsPage";
import { AuthProvider } from "src/contexts/AuthContext";
import { mockPlaces } from "./utils/mock";

const App: React.FC = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  const handleAddToFavorites = (name: string) => {
    setFavorites((prev) =>
      prev.includes(name) ? prev.filter((fav) => fav !== name) : [...prev, name]
    );
  };

  return (
    <AuthProvider>
      <GeolocationProvider>
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
            <Route
              path="/list"
              element={
                <ListPage favorites={favorites} onAddToFavorites={handleAddToFavorites} />
              }
            />
            <Route
              path="/add"
              element={
                <PrivateRoute>
                  <AddPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/search"
              element={
                <SearchPage favorites={favorites} onAddToFavorites={handleAddToFavorites} />
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage favorites={favorites} onAddToFavorites={handleAddToFavorites} />
                </PrivateRoute>
              }
            />
            <Route
              path="/detail/:name"
              element={
                <DetailPage data={mockPlaces} favorites={favorites} onAddToFavorites={handleAddToFavorites} />
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
              path="/login-form"
              element={
                <PublicRoute>
                  <LoginForm />
                </PublicRoute>
              }
            />
            <Route
              path="/signup-form"
              element={
                <PublicRoute>
                  <SignUpForm />
                </PublicRoute>
              }
            />
          </Route>

        </Routes>
      </GeolocationProvider>
    </AuthProvider>
  );
};

export default App;
