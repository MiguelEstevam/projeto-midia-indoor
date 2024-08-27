import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import '../App.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(API_URL + '/login', {
        method: 'POST',
        mode: 'no-cors', // Configura o modo para 'no-cors'
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Como o modo 'no-cors' não permite acessar o corpo da resposta,
      // você pode não conseguir processar a resposta da forma desejada
      // No entanto, você pode verificar se a resposta foi bem-sucedida
      if (response.ok) {
        // Lembre-se de que você não poderá acessar o corpo da resposta
        console.log('Login bem-sucedido, mas sem acesso aos dados da resposta');
        // Redirecione para a página de mídia ou trate a resposta de outra forma
        navigate('/media');
      } else {
        setError('Login falhou');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setError('Ocorreu um erro. Tente novamente.');
    }
  };

  return (
    <div id="root">
      <h2>Mídia Indoor</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
