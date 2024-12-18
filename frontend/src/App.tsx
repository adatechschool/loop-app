import React from "react";
import { Routes, Route } from "react-router-dom";
import { HomePage, ListPage, AddPage, SearchPage, ProfilePage } from "./pages";
import { Navbar } from "./components";

const App: React.FC = () => {
  return (
    <div>
      <Navbar /> {/* Your navigation bar */}
      <Routes>
        <Route path="/" element={<HomePage />} /> {/* Route for Home Page */}
        <Route path="/list" element={<ListPage />} /> {/* Route for Map Page */}
        <Route path="/add" element={<AddPage />} /> {/* Route for Add Page */}
        <Route path="/search" element={<SearchPage />} />{" "}
        {/* Route for Search Page */}
        <Route path="/profile" element={<ProfilePage />} />{" "}
        {/* Route for Profile Page */}
        {/* You can add a default route or fallback */}
      </Routes>
    </div>
  );
};

export default App;
