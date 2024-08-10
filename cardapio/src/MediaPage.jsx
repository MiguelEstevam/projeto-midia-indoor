import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom'; // React Router para navegação
import FileUpload from './FileUpload';
import FileList from './FileList';

const MediaPage = () => {
  const [session, setSession] = useState(null);
  const navigate = useNavigate(); // React Router para navegação

  useEffect(() => {
    // Verificar a sessão atual
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);

      // Redirecionar para a página de login se não estiver logado
      if (!data.session) {
        navigate('/login'); // Supondo que sua rota de login seja "/login"
      }
    };

    checkSession();

    // Monitorar mudanças na sessão
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
      navigate('/login'); // Redireciona para a página de login após logout
    }
  };

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Bem Vindo ao Gerenciador de Mídia!</h2>
      <FileUpload />
      <FileList />
      <button onClick={handleLogout}>Logout</button> {/* Botão de logout */}
    </div>
  );
};

export default MediaPage;
