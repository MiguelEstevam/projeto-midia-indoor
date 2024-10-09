import React, { useState } from 'react';
import { API_URL } from '../config';

const CreatePlaylist = ({ onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description) {
      setError('Nome e descrição são obrigatórios');
      return;
    }

    if (name.length < 3 || description.length < 10) {
      setError('O nome deve ter pelo menos 3 caracteres e a descrição pelo menos 10 caracteres.');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('access_token');

    try {
      const response = await fetch(`${API_URL}/upload/playlist`, { 
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description }), 
      });      

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar playlist');
      }

      const newPlaylist = await response.json();
      onCreate(newPlaylist); // chamando o componente pai com a nova playlist criada
      setName('');
      setDescription('');
      setError('');
    } catch (error) {
      console.error('Erro ao criar a playlist:', error);
      setError(error.message);
    } finally {
      setLoading(false);
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
        minLength="3"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descrição"
        required
        minLength="10"
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Criando...' : 'Criar Playlist'}
      </button>
    </form>
  );
};

export default CreatePlaylist;
