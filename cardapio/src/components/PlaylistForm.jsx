import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_URL } from '../config';
import { Link } from 'react-router-dom';
import './PlaylistForm.css'; // Importando o arquivo de estilo

const PlaylistForm = ({ onAddPlaylist }) => {
  const [playlistName, setPlaylistName] = useState('');
  const [playlistDescription, setPlaylistDescription] = useState('');
  const [isEditing, setIsEditing] = useState(true);
  const [baseUrl, setBaseUrl] = useState('');
  const [contents, setContents] = useState([]);
  const [error, setError] = useState('');
  const [expandedHtmlContent, setExpandedHtmlContent] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchPlaylist = async () => {
      if (!id) {
        setIsEditing(false);
        return;
      }

      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_URL}/playlist/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao buscar a playlist');
        }

        const data = await response.json();
        setPlaylistName(data.playlist.name || '');
        setPlaylistDescription(data.playlist.description || '');
        setBaseUrl(data.base_url || '');
        setContents(data.contents || []);

      } catch (err) {
        window.alert(`Erro ao buscar pela playlist ${id}: ` + err.message);
        setError(err.message);
        navigate('/playlists');
      }
    };

    fetchPlaylist();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');

    if (isEditing) {
      try {
        const response = await fetch(`${API_URL}/playlist/edit/${id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: playlistName,
            description: playlistDescription,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao editar a playlist');
        }

        alert('Playlist editada com sucesso!');
        navigate('/playlists');
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    } else {
      try {
        const response = await fetch(`${API_URL}/upload/playlist`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: playlistName,
            description: playlistDescription,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao criar a playlist');
        }

        const newPlaylist = await response.json(); // Pega a nova playlist do retorno
        onAddPlaylist(newPlaylist.data[0]); // Chama a função para adicionar a nova playlist à lista
        alert('Playlist criada com sucesso!');
        setPlaylistName(''); // Limpa os campos após criar
        setPlaylistDescription('');
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    }
  };

  const handleDurationChange = async (contentId, newDuration) => {
    const updatedContents = contents.map(content =>
      content.ca_id === contentId ? { ...content, duration: newDuration } : content
    );
    setContents(updatedContents);
  };

  const handleRemoveContent = async (contentId, contentType) => {
    const token = localStorage.getItem('access_token');

    try {
      const response = await fetch(`${API_URL}/playlist/${id}/delete/${contentType}/${contentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao remover o conteúdo da playlist');
      }

      // Atualizando a lista local de conteúdos após remoção
      setContents(contents.filter(content => {
        if (contentType === 'file' && content.media) {
          return content.media.id !== contentId;
        }
        if (contentType === 'html' && content.html) {
          return content.html.id !== contentId;
        }
        return true;
      }));

      alert('Conteúdo removido com sucesso!');
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const toggleHtmlContent = (contentId) => {
    setExpandedHtmlContent(expandedHtmlContent === contentId ? null : contentId);
  };

  const renderContentPreview = (content) => {
    const fileUrl = content.media?.file_url ? `${baseUrl}/${content.media.file_url}` : '#';
    const fileExtension = content.media?.file_extension;

    if (!fileUrl) {
      return <span>Carregando...</span>;
    }

    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
      return <img src={fileUrl} alt={content.media.file_name} width="100" />;
    } else if (['mp4', 'webm', 'ogg'].includes(fileExtension)) {
      return (
        <video width="100" controls>
          <source src={fileUrl} type={`video/${fileExtension}`} />
          Seu navegador não suporta a tag de vídeo.
        </video>
      );
    } else {
      return <span>{content.media.file_name}</span>;
    }
  };

  return (
    <div>
      <Link to={isEditing ? '/playlists' : '/media'}>
        <button className="go-back-btn">Voltar</button>
      </Link>
      <h2>{isEditing ? 'Editar Playlist' : 'Criar Nova Playlist'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome da Playlist"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Descrição da Playlist"
          value={playlistDescription}
          onChange={(e) => setPlaylistDescription(e.target.value)}
          required
        />
        <button type="submit">{isEditing ? 'Salvar' : 'Criar'}</button>
      </form>

      <h3>{isEditing ? 'Conteúdos da Playlist' : 'Playlists'}</h3>
      <ul className="content-list">
        {contents.map(content => (
          <li key={content.ca_id} className="content-item">
            <div className="content-info">
              {content.contentType === 'file' && content.media && (
                <>
                  {renderContentPreview(content)}
                  <div>
                    <p><strong>{content.media.file_name}</strong></p>
                  </div>
                </>
              )}

              {content.contentType === 'html' && content.html && (
                <div>
                  <h4>{content.html.title}</h4>
                  <button
                    onClick={() => toggleHtmlContent(content.ca_id)}
                    className="toggle-btn"
                  >
                    {expandedHtmlContent === content.ca_id ? 'Ocultar' : 'Expandir'}
                  </button>
                  {expandedHtmlContent === content.ca_id && (
                    <div className="html-content" dangerouslySetInnerHTML={{ __html: content.html.content }} />
                  )}
                </div>
              )}
            </div>

            <div>
              <p>
                Duração:
                <input
                  type="number"
                  value={content.duration}
                  onChange={(e) => handleDurationChange(content.ca_id, parseInt(e.target.value))}
                  min="0"
                  className="duration-input"
                /> segundos
              </p>

              <button
                onClick={() => handleRemoveContent(content.media ? content.media.id : content.html.id, content.contentType)}
                className="remove-btn"
              >
                Remover
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlaylistForm;
