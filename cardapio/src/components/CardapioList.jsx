import React, { useEffect, useState } from 'react';
import { API_URL } from '../config';
import { Link } from 'react-router-dom';
import './CardapioList.css'; // Importando o arquivo CSS

const CardapioList = () => {
  const [cardapios, setCardapios] = useState([]);

  // Função para buscar os cardápios no banco de dados
  useEffect(() => {
    const fetchCardapios = async () => {
        const token = localStorage.getItem('access_token');
      try {
        const response = await fetch(`${API_URL}/cardapio/db`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const { data } = await response.json();
        setCardapios(data);
      } catch (error) {
        console.error('Erro ao buscar cardápios:', error);
      }
    };

    fetchCardapios();
  }, []);

  const handleDelete = async (idCardapio) => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch(`${API_URL}/cardapio/delete/${idCardapio}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir cardápio');
      }

      setCardapios(cardapios.filter(cardapio => cardapio.id !== idCardapio));

    } catch (error) {
      console.error('Erro ao excluir cardápio:', error);
    }
  };

  return (
    <div className="cardapio-list">
        <h3>Cardapios: </h3>
      {cardapios.length > 0 ? (
        <ul>
          {cardapios.map((cardapio) => (
            <li key={cardapio.id} className="cardapio-item">
              <div className="cardapio-info">
                <h3 className="cardapio-name">{cardapio.name}</h3>
                <p className="cardapio-description">{cardapio.description}</p>
              </div>
              <div className="cardapio-actions">
                <Link to={`/cardapios/edit/${cardapio.id}`}>
                    <button className="cardapio-edit" onClick={() => console.log('Editar:', cardapio.id)}>Editar</button>
                </Link>
                <button className="cardapio-delete" onClick={() => handleDelete(cardapio.id)}>Excluir</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhum cardápio cadastrado.</p>
      )}
    </div>
  );
};

export default CardapioList;
