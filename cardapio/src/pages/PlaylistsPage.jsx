import React, { useState, useEffect } from 'react';
import PlaylistForm from '../components/PlaylistForm';
import PlaylistList from '../components/PlaylistList';
import { API_URL } from '../config'; // Ajuste o caminho de importação se necessário

const PlaylistsPage = () => {
  const [playlists, setPlaylists] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_URL}/playlists/db`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao buscar playlists');
        }

        const data = await response.json();
        setPlaylists(data.data); // Acesse os dados da resposta corretamente
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchPlaylists();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('access_token');

    try {
      const response = await fetch(`${API_URL}/playlist/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao excluir a playlist');
      }

      // Atualiza a lista de playlists após a exclusão
      setPlaylists(playlists.filter((playlist) => playlist.id !== id));
      alert('Playlist excluída com sucesso!');
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleAddPlaylist = (newPlaylist) => {
    // Adiciona a nova playlist à lista existente
    setPlaylists((prevPlaylists) => [...prevPlaylists, newPlaylist]);
  };

  return (
    <div>
      <h1>Gerenciar Playlists</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <PlaylistForm onAddPlaylist={handleAddPlaylist} />
      <PlaylistList playlists={playlists} onDelete={handleDelete} />
    </div>
  );
};

export default PlaylistsPage;
