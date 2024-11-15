import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import MediaPage from './pages/MediaPage';
import DevicesPage from './pages/DevicesPage';
import PlaylistsPage from './pages/PlaylistsPage';
import PlaylistForm from './components/PlaylistForm';
import ProtectedRoute from './components/ProtectedRoute';
import CardapiosPage from './pages/CardapiosPage';
import EditCardapio from './components/EditCardapio';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/media" element={<ProtectedRoute><MediaPage /></ProtectedRoute>} />
        <Route path="/devices" element={<ProtectedRoute><DevicesPage /></ProtectedRoute>}></Route>
        <Route path="/playlists" element={<ProtectedRoute><PlaylistsPage /></ProtectedRoute>} />
        <Route path="/playlists/edit/:id" element={<ProtectedRoute><PlaylistForm /></ProtectedRoute>} />
        <Route path="/cardapios" element={<ProtectedRoute><CardapiosPage/></ProtectedRoute>} />
        <Route path="/cardapios/edit/:idCardapio" element={<ProtectedRoute><EditCardapio /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
};

export default App;
