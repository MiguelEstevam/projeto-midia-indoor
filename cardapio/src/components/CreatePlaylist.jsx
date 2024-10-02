import React, { useState } from 'react';
import { API_URL } from '../config';

const CreatePlaylist = ({ onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Estado para o carregamento
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!name || !description) {
      setError('Nome e descrição são obrigatórios');
      return;
    }
  
    // Adicionando validação de comprimento mínimo
    if (name.length < 3 || description.length < 10) {
      setError('O nome deve ter pelo menos 3 caracteres e a descrição pelo menos 10 caracteres.');
      return;
    }
  
    setLoading(true); // Ativar o estado de carregamento
  
    const token = localStorage.getItem('access_token'); // Obtenha o token
  
    try {
      const response = await fetch(`${API_URL}/playlists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Adicionando o token de autorização
        },
        body: JSON.stringify({ name, description }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro desconhecido');
      }
  
      const newPlaylist = await response.json();
      onCreate(newPlaylist); // Envia a nova playlist para o componente pai
      setName('');
      setDescription('');
      setError('');
    } catch (error) {
      console.error('Erro ao criar a playlist:', error);
      setError(error.message);
    } finally {
      setLoading(false); // Desativar o estado de carregamento
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <h2>Criar Nova Playlist</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nome da Playlist"
        required
        minLength="3" // Adicionando comprimento mínimo
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descrição"
        required
        minLength="10" // Adicionando comprimento mínimo
      />
      <button type="submit" disabled={loading}> {/* Desativa o botão enquanto está carregando */}
        {loading ? 'Criando...' : 'Criar Playlist'}
      </button>
    </form>
  );
};

export default CreatePlaylist;
