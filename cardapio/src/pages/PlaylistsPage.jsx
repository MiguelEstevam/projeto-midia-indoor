import React, { useState, useEffect } from 'react';
import PlaylistForm from '../components/PlaylistForm';
import PlaylistList from '../components/PlaylistList';
import { API_URL } from '../config';
import AlertModal from '../components/AlertModal';

const PlaylistsPage = () => {
  const [playlists, setPlaylists] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
        setPlaylists(data.data);
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
      setSuccess('Playlist excluída com sucesso!');

      // Limpa a mensagem de sucesso após 5 segundos
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleAddPlaylist = (newPlaylist) => {
    // Adiciona a nova playlist à lista existente
    setPlaylists((prevPlaylists) => [newPlaylist, ...prevPlaylists ]);
    setSuccess('Playlist criada com sucesso!');

    // Limpa a mensagem de sucesso após 5 segundos
    setTimeout(() => {
      setSuccess('');
    }, 5000);
  };

  return (
    <div>
      <div className="playlists-nav"></div>
      {(error || success) && (
        <AlertModal
          message={error || success}
          type={error ? 'Error' : 'success'}
          duration={5000}
          onClose={() => {
            setError('');
            setSuccess('');
          }}
        />
      )}
      <PlaylistForm onAddPlaylist={handleAddPlaylist} />
      <PlaylistList playlists={playlists} onDelete={handleDelete} />
    </div>
  );
};

export default PlaylistsPage;
