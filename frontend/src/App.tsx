import React, { useState } from "react";
import { Routes, Route, } from "react-router-dom";
import {
  HomePage,
  ListPage,
  AddPage,
  SearchPage,
  ProfilePage,
  DetailPage,
} from "./pages";
import LogIn from "./pages/LogInPage/LogIn";
import LogInForm from "./pages/LogInPage/LogInForm";
import SignUpForm from "./pages/LogInPage/SignUpForm";
import { mockPlaces } from "./utils/mock";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import PrivateRoute from "./routes/PrivateRoute";
import LoginPage from "./pages/LogInPage/LogIn";

const App: React.FC = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  const handleAddToFavorites = (name: string) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(name)
        ? prevFavorites.filter((fav) => fav !== name)
        : [...prevFavorites, name]
    );
  };

  const token = localStorage.getItem("token");

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/list"
          element={
            <ListPage
              favorites={favorites}
              onAddToFavorites={handleAddToFavorites}
            />
          }
        />
        <Route
          path="/add"
          element={
            token ? (
              <PrivateRoute>
                <AddPage />
              </PrivateRoute>
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path="/search"
          element={
            <SearchPage
              favorites={favorites}
              onAddToFavorites={handleAddToFavorites}
            />
          }
        />
        <Route
          path="/profile"
          element={
            token ? (
              <PrivateRoute>
                <ProfilePage
                  favorites={favorites}
                  onAddToFavorites={handleAddToFavorites}
                />
              </PrivateRoute>
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path="/detail/:name"
          element={
            <DetailPage
              data={mockPlaces}
              favorites={favorites}
              onAddToFavorites={handleAddToFavorites}
            />
          }
        />
      </Route>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LogIn />} />
        <Route path="/login-form" element={<LogInForm />} />
        <Route path="/signup-form" element={<SignUpForm />} />
      </Route>
    </Routes>
  );
};

export default App;
