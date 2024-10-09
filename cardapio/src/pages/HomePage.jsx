import React, { useEffect, useState } from 'react';
import PlayButton from '../components/PlayButton';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const MediaPage = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
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

    //já que o token tem um prazo de validade apenas remove ele do localstorage
    //assim para receber outro é preciso fazer login novamente

    localStorage.removeItem('access_token');
    navigate('/login');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleNavigation = (type) => {
    switch (type) {
      case 'play-dev':
        navigate('/playlist');
        break;
      case 'media':
        navigate('/media');
        break;
      default:
        break;
    }
  };

  const devices = ['Dispositivo 1', 'Dispositivo 2', 'Dispositivo 3'];

  return (
    <div>
      <h2>Tela inicial</h2>
      <div className="main-container">
        <div className="play-button-container">
          <PlayButton devices={devices}/>
        </div>
        <div className="page-route-buttons">
          <button onClick={() => handleNavigation('play-dev')}>
            Playlists / Dispositivos
          </button>
          
          <button onClick={() => handleNavigation('media')}>
            Upload / Gerenciar Mídia
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>


    </div>
  );
};

export default MediaPage;
