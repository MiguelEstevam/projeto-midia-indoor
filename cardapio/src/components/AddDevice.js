import React, { useState } from 'react';
import { API_URL } from '../config';

const AddDevice = ({ onAdd }) => {
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

    setLoading(true);

    const token = localStorage.getItem('access_token');

    try {
      const response = await fetch(`${API_URL}/upload/device`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao adicionar dispositivo');
      }

      const newDevice = await response.json();
      onAdd(newDevice); // Atualiza a lista de dispositivos no componente pai
      setName('');
      setDescription('');
      setError('');
    } catch (error) {
      console.error('Erro ao adicionar dispositivo:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Adicionar Dispositivo</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nome do Dispositivo"
        required
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descrição do Dispositivo"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Adicionando...' : 'Adicionar Dispositivo'}
      </button>
    </form>
  );
};

export default AddDevice;
