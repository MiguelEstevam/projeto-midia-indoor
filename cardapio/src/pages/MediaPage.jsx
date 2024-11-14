import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import HtmlUpload from '../components/HtmlUpload';
import FileList from '../components/FileList';
import HtmlList from '../components/HtmlList';
import { API_URL } from '../config';

const MediaPage = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isContentListVisible, setIsContentListVisible] = useState(false); // Adiciona estado para alternar entre as divs
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`${API_URL}/session`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          setSession(result.data);
        } else {
          localStorage.removeItem('access_token');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error checking session:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  const handleToggleContent = () => {
    setIsContentListVisible(!isContentListVisible); // Alterna o estado
  };

  const handleNavigateToPlaylists = () => {
    navigate('/playlists');
  };

  const handleNavigateToDevices = () => {
    navigate('/devices');
  }

  const handleNavigateToCardapios = () => {
    navigate('/cardapios');
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div
        className="upload-container"
        style={{
          display: isContentListVisible ? 'none' : 'block',
          fontFamily: "Candara, Calibri, Segoe, Segoe UI, Optima, Arial, sans-serif", // Define a fonte aqui
          color: '#633' // Escolha uma cor de fonte atraente
        }}
      >
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#225ABD' }}>Bem Vindo ao Gerenciador de Mídia!</h1>
        <div className="main-container">
          <HtmlUpload />
        </div>
        <FileUpload />
      </div>

      <div className="content-list-container" style={{ display: isContentListVisible ? 'block' : 'none' }}>
        <FileList />
        <br />
        <HtmlList />
      </div>

      <div>
        <button onClick={handleToggleContent}>{isContentListVisible ? "Voltar para Upload" : "Gerenciar Conteúdos"}</button>
        <button onClick={handleNavigateToPlaylists}>Gerenciar Playlists</button>
        <button onClick={handleNavigateToDevices}>Gerenciar Dispositivos</button>
        <button onClick={handleNavigateToCardapios}>Gerenciar Cardápios</button>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default MediaPage;
