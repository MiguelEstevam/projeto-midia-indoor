import React, { useEffect, useState } from 'react';
import { API_URL } from '../config'; // Importando o API_URL

const MediaList = ({ playlistId, refreshPlaylist }) => {
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true); // Estado para controle de carregamento
  const [error, setError] = useState(''); // Estado para mensagens de erro

  const fetchMedia = async () => {
    setLoading(true); // Ativar carregamento
    const token = localStorage.getItem('access_token'); // Obtenha o token
    try {
      const response = await fetch(`${API_URL}/playlists/${playlistId}/media`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Adicionando o token de autorização
        },
      });
      if (!response.ok) {
        throw new Error('Erro ao buscar mídias');
      }
      const data = await response.json();
      // Aqui, estamos acessando o array de mídias corretamente
      setMediaItems(data.data || []); // Use um array vazio se data não existir
    } catch (error) {
      console.error('Error fetching media:', error);
      setError(error.message); // Armazenar a mensagem de erro
    } finally {
      setLoading(false); // Desativar carregamento
    }
  };

  const handleRemoveMedia = async (mediaId) => {
    const token = localStorage.getItem('access_token'); // Obtenha o token
    try {
      await fetch(`${API_URL}/playlists/${playlistId}/media/${mediaId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`, // Adicionando o token de autorização
        },
      });
      refreshPlaylist(); // Atualiza a lista de mídias na playlist pai
    } catch (error) {
      console.error('Error removing media:', error);
      setError('Erro ao remover a mídia.'); // Armazenar a mensagem de erro
    }
  };

  useEffect(() => {
    fetchMedia(); // Busca as mídias ao montar o componente
  }, [playlistId]);

  return (
    <div>
      <h4>Conteúdo da Playlist</h4>
      {loading && <p>Carregando mídias...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {mediaItems.length === 0 && !loading && <p>Não há mídias na playlist.</p>}
      <ul>
        {mediaItems.map((media) => (
          <li key={media.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p>{media?.media_content?.file_name || "Arquivo desconhecido"}</p>
            <button
              onClick={() => handleRemoveMedia(media.id)}
              style={{
                backgroundColor: 'red',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                padding: '5px 10px',
              }}
            >
              Remover
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MediaList;
