import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import FileUpload from '../components/FileUpload';
import HtmlUpload from '../components/HtmlUpload';
import FileList from '../components/FileList';
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

  return (
    <div>
      <h2>Bem Vindo ao Gerenciador de Mídia!</h2>
      <div className="main-container">
        <HtmlUpload />
        <FileList />
      </div>
      <FileUpload />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default MediaPage;
