import React, { useState, useEffect, useCallback } from 'react';
import { API_URL } from '../config';
import './HtmlList.css';

const HtmlList = () => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMoreContents, setHasMoreContents] = useState(true);
  const [playlists, setPlaylists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedContentId, setSelectedContentId] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [duration, setDuration] = useState(20);

  const getToken = () => localStorage.getItem('access_token');

  const fetchContents = useCallback(async (newOffset) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/html/db/?limit=5&offset=${newOffset}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      setContents((prevContents) => {
        const newContents = result.data.filter(content => !prevContents.some(prevContent => prevContent.id === content.id));
        return [...prevContents, ...newContents];
      });
      setOffset(newOffset + 5);
      setHasMoreContents(result.data.length === 5);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching contents:', error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContents(0);
  }, [fetchContents]);

  const handleLoadMore = () => {
    if (hasMoreContents) {
      fetchContents(offset);
    }
  };

  const handleDelete = async (contentId) => {
    if (window.confirm('Você quer realmente deletar esse conteúdo?')) {
      try {
        const response = await fetch(`${API_URL}/html/delete/${contentId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${getToken()}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete content');
        }

        setContents((prevContents) => prevContents.filter(content => content.id !== contentId));
      } catch (error) {
        console.error('Error deleting content:', error.message);
        setError(error.message);
      }
    }
  };

  const handleExpand = (id) => {
    setContents(contents.map(content =>
      content.id === id ? { ...content, expanded: !content.expanded } : content
    ));
  };

  const fetchPlaylists = async () => {
    try {
      const response = await fetch(`${API_URL}/playlists/db`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch playlists');
      }

      const result = await response.json();
      setPlaylists(result.data || []);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  const handleAddToPlaylist = async () => {
    try {
      const response = await fetch(`${API_URL}/playlist/add/html/${selectedContentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          playlistId: selectedPlaylist,
          duration: duration
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to associate content with playlist');
      }

      setShowModal(false);
      setSelectedContentId(null);
      setSelectedPlaylist(null);
      setDuration(20);
    } catch (error) {
      console.error('Error associating content:', error);
    }
  };

  const handleOpenModal = (contentId) => {
    setSelectedContentId(contentId);
    fetchPlaylists();
    setShowModal(true);
  };

  return (
    <div className="html-list-container">
      <header className="html-list-header">
        <h2 className="component-title">HTML Contents</h2>
      </header>
      {loading && !contents.length ? (
        <p>Loading contents...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          <ul className="html-list">
            {contents.map((content) => (
              <li key={content.id} className="html-item">
                <div className="html-title">
                  <div className="html-info-container">
                    <h3>{content.title}</h3>
                    <img
                      src="/arrow.svg"
                      alt={content.expanded ? '-' : '+'}
                      className={`expand-icon ${content.expanded ? 'rotated' : ''}`}
                      onClick={() => handleExpand(content.id)}
                    />
                  </div>
                  <div className="li-buttons">
                    <button
                      className="html-delete-button"
                      onClick={() => handleDelete(content.id)}
                    >
                      Deletar
                    </button>
                    <button
                      className="html-add-button"
                      onClick={() => handleOpenModal(content.id)}
                    >
                      Add
                    </button>
                  </div>
                </div>
                {content.expanded && (
                  <div className="html-content" dangerouslySetInnerHTML={{ __html: content.content }} />
                )}
              </li>
            ))}
            <button
              className="load-more-button"
              onClick={handleLoadMore}
              disabled={!hasMoreContents || loading}
            >
              {loading ? 'Carregando...' : 'Carregar Mais'}
            </button>
          </ul>
        </>
      )}

      {showModal && (
        <div className="modal">
          <h3>Escolha a playlist</h3>
          <select onChange={(e) => setSelectedPlaylist(e.target.value)} value={selectedPlaylist || ""}>
            <option value="">Selecione uma playlist</option>
            {playlists.map((playlist) => (
              <option key={playlist.id} value={playlist.id}>
                {playlist.name}
              </option>
            ))}
          </select>
          <div>
            <label>Duração:</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              min="1" // Duração mínima
            />
          </div>
          <button onClick={handleAddToPlaylist}>Confirmar</button>
          <button onClick={() => setShowModal(false)}>Cancelar</button>
        </div>
      )}
    </div>
  );
};

export default HtmlList;
