import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MediaPage from './pages/MediaPage';
import PlaylistsPage from './pages/PlaylistsPage'; // Agora importando o PlaylistsPage
import PlaylistForm from './components/PlaylistForm';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/media" element={<ProtectedRoute><MediaPage /></ProtectedRoute>} />
        <Route path="/playlists" element={<ProtectedRoute><PlaylistsPage /></ProtectedRoute>} />
        <Route path="/playlists/edit/:id" element={<PlaylistForm />} />
      </Routes>
    </Router>
  );
};

export default App;
