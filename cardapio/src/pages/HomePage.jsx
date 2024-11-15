import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const HomePage = () => {
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
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  const handleNavigateToContents = () => {
    navigate('/media');
  }

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
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#225ABD' }}>Bem Vindo ao Gerenciador de Mídia!</h1>
      <br /><br />
      <div>
        <button onClick={handleNavigateToContents}>Gerenciar Conteúdos</button>
        <button onClick={handleNavigateToPlaylists}>Gerenciar Playlists</button>
        <button onClick={handleNavigateToDevices}>Gerenciar Dispositivos</button>
        <button onClick={handleNavigateToCardapios}>Gerenciar Cardápios</button>
        <br /><br /><br />
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default HomePage;
