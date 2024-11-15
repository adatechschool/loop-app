
import React from 'react';
import { Routes, Route } from 'react-router-dom'; 
import HomePage from './pages/HomePage'; 
import ListPage from './pages/ListPage';
import AddPage from './pages/AddPage';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import Navbar from './components/NavBar';
const App: React.FC = () => {
  return (
    <div>
      <Navbar /> {/* Your navigation bar */}
      <Routes>
        <Route path="/home" element={<HomePage />} /> {/* Route for Home Page */}
        <Route path="/map" element={<ListPage />} /> {/* Route for Map Page */}
        <Route path="/add" element={<AddPage />} /> {/* Route for Add Page */}
        <Route path="/search" element={<SearchPage />} /> {/* Route for Search Page */}
        <Route path="/profile" element={<ProfilePage />} /> {/* Route for Profile Page */}
        {/* You can add a default route or fallback */}
      </Routes>
    </div>
  );
};

export default App;
