import React, { useEffect, useState, useCallback } from 'react';
import CreatePlaylist from './CreatePlaylist'; // Assumindo que você tenha esse componente
import MediaList from './MediaList'; // Assumindo que você tenha esse componente
import { API_URL } from '../config';

const Playlist = () => {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistMedia, setPlaylistMedia] = useState([]);
  const [mediaToAdd, setMediaToAdd] = useState('');
  const [mediaOptions, setMediaOptions] = useState([]);
  const [time, setTime] = useState(5); // Tempo padrão de 5 segundos

  const fetchPlaylists = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch(`${API_URL}/playlists`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Erro ao buscar playlists');
      }
      const data = await response.json();
      setPlaylists(data);
    } catch (error) {
      console.error('Error fetching playlists:', error);
      setPlaylists([]);
    }
  };

  const fetchMediaOptions = useCallback(async () => {
    const token = localStorage.getItem('access_token'); // Buscando o token do localStorage
  
    try {
      const response = await fetch(`${API_URL}/files/db`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Usando o token aqui
        },
      });
  
      const result = await response.json();
  
      // Verifica se o result.files é realmente um array
      if (!Array.isArray(result.files)) {
        throw new Error('Dados de mídia não são um array');
      }
  
      // Use result.files ao invés de result diretamente
      const mediaFiles = result.files.map(file => ({
        url: `${result.base_url}/${file.file_name}`,
        name: file.file_name,
        id: file.id,
      }));
  
      setMediaOptions(mediaFiles);
    } catch (error) {
      console.error('Erro ao buscar opções de mídia:', error.message);
    }
  }, []);
  
  
  const fetchPlaylistMedia = async (playlistId) => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch(`${API_URL}/playlists/${playlistId}/media`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Erro ao buscar mídias da playlist');
      }
  
      const mediaData = await response.json();
  
      // Garante que 'mediaData.data' seja um array
      if (mediaData && Array.isArray(mediaData.data)) {
        setPlaylistMedia(mediaData.data);
      } else {
        console.warn('Dados de mídia da playlist não são um array:', mediaData);
        setPlaylistMedia([]); // Definir uma lista vazia se os dados não forem válidos
      }
    } catch (error) {
      console.error('Error fetching playlist media:', error);
      setPlaylistMedia([]); // Garantir que o estado seja resetado em caso de erro
    }
  };
  
  
  const handleCreatePlaylist = async (playlist) => {
    fetchPlaylists();
  };
  
  const handleSelectPlaylist = async (playlist) => {
    setSelectedPlaylist(playlist);
    await fetchPlaylistMedia(playlist.id);
  };
  
  const handleAddMedia = async () => {
    const token = localStorage.getItem('access_token');
    const mediaId = mediaToAdd;
    try {
      const response = await fetch(`${API_URL}/playlists/${selectedPlaylist.id}/media`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ mediaId, time }),
      });
      if (response.ok) {
        fetchPlaylists();
        fetchPlaylistMedia(selectedPlaylist.id);
      }
    } catch (error) {
      console.error('Error adding media:', error);
    }
  };
  
  const handleDeleteMedia = async (mediaId) => {
    const token = localStorage.getItem('access_token');
    try {
      await fetch(`${API_URL}/playlists/${selectedPlaylist.id}/media/${mediaId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      fetchPlaylistMedia(selectedPlaylist.id);
    } catch (error) {
      console.error('Error deleting media:', error);
    }
  };
  
  const handleDeletePlaylist = async (playlistId) => {
    const token = localStorage.getItem('access_token');
    try {
      await fetch(`${API_URL}/playlists/${playlistId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      fetchPlaylists();
    } catch (error) {
      console.error('Error deleting playlist:', error);
    }
  };
  
  const handlePlay = async () => {
    console.log(`Reproduzindo a playlist: ${selectedPlaylist.name}`);
  };

  useEffect(() => {
    fetchPlaylists();
    fetchMediaOptions();
  }, []);

  return (
    <div>
      <CreatePlaylist onCreate={handleCreatePlaylist} />

      <h2>Playlists</h2>
      <ul>
        {playlists.map((playlist) => (
          <li key={playlist.id} style={{ display: 'flex', alignItems: 'center' }}>
            <button onClick={() => handleSelectPlaylist(playlist)}>
              {playlist.name}
            </button>
            <button 
              className="play-button" 
              onClick={handlePlay} // Reproduz a playlist
              style={{
                backgroundColor: 'green',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                marginLeft: '10px',
                cursor: 'pointer',
                border: 'none',
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              ▶️
            </button>
            <button 
              className="delete-button" 
              onClick={() => handleDeletePlaylist(playlist.id)} 
              style={{
                backgroundColor: 'red',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                marginLeft: '10px',
                cursor: 'pointer',
                border: 'none',
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              &times;
            </button>
          </li>
        ))}
      </ul>

      {selectedPlaylist && (
        <div>
          <h3>Playlist Selecionada: {selectedPlaylist.name}</h3>
          <MediaList
            playlistId={selectedPlaylist.id}
            refreshPlaylist={() => fetchPlaylistMedia(selectedPlaylist.id)}
          />

          <h4>Conteúdo da Playlist</h4>
          <ul>
            {playlistMedia.map((media) => (
              <li key={media.id}>
                <p>{media?.media_content?.file_name || "Arquivo desconhecido"}</p>
                <button onClick={() => handleDeleteMedia(media.id)}>Remover</button>
              </li>
            ))}
          </ul>

          <h4>Adicionar Mídia à Playlist</h4>
          <select onChange={(e) => setMediaToAdd(e.target.value)} value={mediaToAdd}>
            <option value="">Selecione uma mídia</option>
            {Array.isArray(mediaOptions) && mediaOptions.map(media => (
              <option key={media.id} value={media.id}>{media.file_name}</option>
            ))}
          </select>
          <input 
            type="number" 
            value={time} 
            onChange={(e) => setTime(e.target.value)} 
            placeholder="Tempo em segundos" 
          />
          <button onClick={handleAddMedia}>Adicionar Mídia</button>
        </div>
      )}

      <button onClick={() => window.location.href = '/media'}>Voltar para Upload</button>
    </div>
  );
};

export default Playlist;
