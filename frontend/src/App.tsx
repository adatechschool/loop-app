
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { HomePage, ListPage, AddPage, SearchPage, ProfilePage, DetailPage } from "./pages";
import { Navbar } from "./components";
import { mockPlaces } from "./utils/mock"; 

const App: React.FC = () => {
  
  const [favorites, setFavorites] = useState<string[]>([]);

  
  const handleAddToFavorites = (name: string) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(name)
        ? prevFavorites.filter((fav) => fav !== name)
        : [...prevFavorites, name]
    );
  };

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/list"
          element={<ListPage favorites={favorites} onAddToFavorites={handleAddToFavorites} />}
        />
        <Route path="/add" element={<AddPage />} />
        <Route
          path="/search"
          element={<SearchPage favorites={favorites} onAddToFavorites={handleAddToFavorites} />}
        />
        <Route
          path="/profile"
          element={<ProfilePage favorites={favorites} onAddToFavorites={handleAddToFavorites} />}
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
      </Routes>
    </div>
  );
};

export default App;
