import React, { useState, useEffect, useCallback } from 'react';
import { API_URL } from '../config'; // URL da sua API
import './FileList.css'; // Estilos

const FileList = () => {
  const [files, setFiles] = useState([]);  // Lista de arquivos
  const [baseUrl, setBaseUrl] = useState('');  // Base URL para acessar arquivos
  const [loading, setLoading] = useState(true);  // Estado de carregamento
  const [error, setError] = useState(null);  // Estado de erro
  const [offset, setOffset] = useState(0);  // Controle de paginação (offset)
  const [hasMoreFiles, setHasMoreFiles] = useState(true);  // Verifica se há mais arquivos para carregar

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
  
      // Verificar se o result e result.data estão definidos
      if (!result || !result.data) {
        throw new Error('Invalid API response');
      }
  
      setBaseUrl(result.base_url);
      setFiles((prevFiles) => {
        // Filtrar arquivos novos apenas se result.data existir
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
  

  // Faz a chamada para buscar arquivos na montagem do componente
  useEffect(() => {
    fetchFiles(0);
  }, [fetchFiles]);

  // Função chamada ao clicar em "Load More"
  const handleLoadMore = () => {
    if (hasMoreFiles) {
      fetchFiles(offset);
    }
  };

  // Função para deletar arquivo
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

        // Remove o arquivo deletado da lista
        setFiles((prevFiles) => prevFiles.filter(file => file.id !== fileId));
      } catch (error) {
        console.error('Erro ao deletar arquivo:', error.message);
        setError(error.message);
      }
    }
  };

  // Função para renderizar a visualização do arquivo, baseado na extensão
  const renderFilePreview = (file) => {
    const fileExtension = file.file_extension;
    const fileUrl = file.file_url ? `${baseUrl}/${file.file_url}` : '#';

    if (!fileUrl) {
      return <span>Carregando...</span>;
    }

    // Renderiza imagens
    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
      return <img src={fileUrl} alt={file.file_name} />;
    } 
    // Renderiza vídeos
    else if (['mp4', 'webm', 'ogg'].includes(fileExtension)) {
      return (
        <video width="100" controls>
          <source src={fileUrl} type={`video/${fileExtension}`} />
          Seu navegador não suporta a tag de vídeo.
        </video>
      );
    } 
    // Se for outro tipo de arquivo, apenas exibe o nome
    else {
      return <span>{file.file_name}</span>;
    }
  };

  return (
    <div className="file-list-container">
      <header className="file-list-header">
        <h2 className="component-title">Arquivos Enviados</h2>
      </header>

      {/* Renderiza enquanto está carregando ou exibe erro */}
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
                    {renderFilePreview(file)}  {/* Visualiza o preview do arquivo */}
                    <span className="file-name">{file.file_name}</span>
                  </a>
                </div>
                {/* Botão de deletar arquivo */}
                <button
                  className="file-delete-button"
                  onClick={() => handleDelete(file.id)}
                >
                  Deletar
                </button>
              </li>
            ))}
          </ul>

          {/* Botão para carregar mais arquivos */}
          <button
            className="load-more-button"
            onClick={handleLoadMore}
            disabled={!hasMoreFiles || loading}
          >
            {loading ? 'Carregando...' : 'Carregar Mais'}
          </button>
        </>
      )}
    </div>
  );
};

export default FileList;
