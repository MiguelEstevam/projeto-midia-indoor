import React, { useState, useEffect, useCallback } from 'react';
import { API_URL } from '../config';
import './HtmlList.css'; // Certifique-se de que os estilos estão atualizados

const HtmlList = () => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMoreContents, setHasMoreContents] = useState(true);

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
                  <h3>{content.title}</h3>
                  <img
                    src="../src/assets/arrow.svg"
                    alt={content.expanded ? '-' : '+'}
                    className={`expand-icon ${content.expanded ? 'rotated' : ''}`}
                    onClick={() => handleExpand(content.id)}
                  />
                  <button
                    className="html-delete-button"
                    onClick={() => handleDelete(content.id)}
                  >
                    Delete
                  </button>
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
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </ul>
        </>
      )}
    </div>
  );
};

export default HtmlList;
