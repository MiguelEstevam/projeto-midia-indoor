import React, { useState, useEffect, useCallback } from 'react';
import { API_URL } from '../config';
import './FileList.css';

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [baseUrl, setBaseUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMoreFiles, setHasMoreFiles] = useState(true);

  const getToken = () => localStorage.getItem('access_token');

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
      setBaseUrl(result.base_url);
      setFiles((prevFiles) => {
        const newFiles = result.data.filter(file => !prevFiles.some(prevFile => prevFile.id === file.id));
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
          throw new Error('Failed to delete file');
        }

        // Remove o arquivo deletado da lista
        setFiles((prevFiles) => prevFiles.filter(file => file.id !== fileId));
      } catch (error) {
        console.error('Error deleting file:', error.message);
        setError(error.message);
      }
    }
  };

  const renderFilePreview = (file) => {
    const fileExtension = file.file_extension;
    const fileUrl = file.file_url ? `${baseUrl}/${file.file_url}` : '#';

    if (!fileUrl) {
      return <span>Loading...</span>;
    }

    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
      return <img src={fileUrl} alt={file.file_name} />;
    } else if (['mp4', 'webm', 'ogg'].includes(fileExtension)) {
      return (
        <video width="100" autoPlay={false} muted>
          <source src={fileUrl} type={`video/${fileExtension}`} />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return <span>{file.file_name}</span>;
    }
  };

  return (
    <div className="file-list-container">
      <header className="file-list-header">
        <h2 className="component-title">Uploaded Files</h2>
      </header>

      {loading && !files.length ? (
        <p>Loading files...</p>
      ) : error ? (
        <p>Error: {error}</p>
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
                    <span className="file-name">{file.file_name}</span>
                  </a>
                </div>
                <button
                  className="file-delete-button"
                  onClick={() => handleDelete(file.id)}
                >
                  Delete
                </button>
              </li>
            ))}
            <button
            className="load-more-button"
            onClick={handleLoadMore}
            disabled={!hasMoreFiles || loading}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
          </ul>
          
        </>
      )}
    </div>
  );
};

export default FileList;