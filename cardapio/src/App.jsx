import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MediaPage from './pages/MediaPage';
import PlaylistsPage from './components/Playlist'; // Importa a nova página de playlists
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Redireciona para a tela de login caso acesse a raiz */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Rota para a página de login */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Rota protegida para a página de mídias */}
        <Route
          path="/media"
          element={
            <ProtectedRoute>
              <MediaPage />
            </ProtectedRoute>
          }
        />

        {/* Rota protegida para a página de playlists */}
        <Route
          path="/playlists"
          element={
            <ProtectedRoute>
              <PlaylistsPage /> {/* Componente da página de playlists */}
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
