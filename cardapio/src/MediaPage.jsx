import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom'; 
import FileUpload from './FileUpload';
import FileList from './FileList';
import TextUpload from './TextUpload';

const MediaPage = () => {
  const [session, setSession] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);

      if (!data.session) {
        navigate('/login');
      }
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigate('/login');
    }
  };

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Bem Vindo ao Gerenciador de Mídia!</h2>
      <div className="main-container">
        <TextUpload />
        <FileList />
      </div>
      <FileUpload />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default MediaPage;
