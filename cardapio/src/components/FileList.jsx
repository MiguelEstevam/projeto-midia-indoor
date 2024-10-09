import React, { useState, useEffect, useCallback } from 'react';
import { API_URL } from '../config'; // URL da sua API
import './FileList.css'; // Estilos

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [baseUrl, setBaseUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMoreFiles, setHasMoreFiles] = useState(true);
  const [playlists, setPlaylists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [duration, setDuration] = useState(20); // Duração padrão

  // Função para pegar o token de autenticação
  const getToken = () => localStorage.getItem('access_token');

  // Função para buscar arquivos, usa o offset para paginação
  const fetchFiles = useCallback(async (newOffset) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/files/db?limit=10&offset=${newOffset}`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();

      if (!result || !result.data) {
        throw new Error('Invalid API response');
      }

      setBaseUrl(result.base_url);
      setFiles((prevFiles) => {
        const newFiles = result.data?.filter(file => !prevFiles.some(prevFile => prevFile.id === file.id)) || [];
        return [...prevFiles, ...newFiles];
      });

      setOffset(newOffset + 10);
      setHasMoreFiles(result.data.length === 10);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching files:', error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles(0);
  }, [fetchFiles]);

  const handleLoadMore = () => {
    if (hasMoreFiles) {
      fetchFiles(offset);
    }
  };

  const handleDelete = async (fileId) => {
    if (window.confirm('Você quer realmente deletar esse arquivo?')) {
      try {
        const response = await fetch(`${API_URL}/files/delete/${fileId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${getToken()}`,
          },
        });

        if (!response.ok) {
          throw new Error('Falha ao deletar arquivo');
        }

        setFiles((prevFiles) => prevFiles.filter(file => file.id !== fileId));
      } catch (error) {
        console.error('Erro ao deletar arquivo:', error.message);
        setError(error.message);
      }
    }
  };

  // Função para renderizar a visualização do arquivo
  const renderFilePreview = (file) => {
    const fileExtension = file.file_extension;
    const fileUrl = file.file_url ? `${baseUrl}/${file.file_url}` : '#';

    if (!fileUrl) {
      return <span>Carregando...</span>;
    }

    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
      return <img src={fileUrl} alt={file.file_name} />;
    } else if (['mp4', 'webm', 'ogg'].includes(fileExtension)) {
      return (
        <video width="100" controls>
          <source src={fileUrl} type={`video/${fileExtension}`} />
          Seu navegador não suporta a tag de vídeo.
        </video>
      );
    } else {
      return <span>{file.file_name}</span>;
    }
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
      const response = await fetch(`${API_URL}/playlist/add/file/${selectedFileId}`, {
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
        throw new Error('Failed to associate file with playlist');
      }

      setShowModal(false);
      setSelectedFileId(null);
      setSelectedPlaylist(null);
      setDuration(20);
    } catch (error) {
      console.error('Error associating file:', error);
    }
  };

  const handleOpenModal = (fileId) => {
    setSelectedFileId(fileId);
    fetchPlaylists();
    setShowModal(true);
  };

  return (
    <div className="file-list-container">
      <header className="file-list-header">
        <h2 className="component-title">Arquivos Enviados</h2>
      </header>

      {loading && !files.length ? (
        <p>Carregando arquivos...</p>
      ) : error ? (
        <p>Erro: {error}</p>
      ) : (
        <>
          <ul className="file-list">
            {files.map((file) => (
              <li key={file.id} className="file-item">
                <div className="file-info">
                  <a
                    href={file.file_url ? `${baseUrl}/${file.file_url}` : '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="file-link"
                  >
                    {renderFilePreview(file)}
                    {file.file_name}
                  </a>
                </div>
                <div className="li-buttons">
                  <button
                    className="file-delete-button"
                    onClick={() => handleDelete(file.id)}
                  >
                    Deletar
                  </button>
                  <button
                    className="file-add-button"
                    onClick={() => handleOpenModal(file.id)}
                  >
                    Add
                  </button>
                </div>
              </li>
            ))}
            <button
              className="load-more-button"
              onClick={handleLoadMore}
              disabled={!hasMoreFiles || loading}
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

export default FileList;
