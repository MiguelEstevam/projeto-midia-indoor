import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CreateCardapio from '../components/CreateCardapio';
import CardapioList from '../components/CardapioList';

const CardapiosPage = () => {
    const [isCreating, setIsCreating] = useState(false);

    // Função que alterna o estado de criação de cardápio
    const handleCreateCardapio = () => {
        setIsCreating(true); // Define como true para mostrar o formulário de criação
    };

    // Função que volta à visualização da lista de cardápios
    const handleCancelCreate = () => {
        setIsCreating(false); // Define como false para voltar à lista de cardápios
    };

    return (
        <div>
            {!isCreating ? (
                <div>
                    <Link to="/media">
                        <button className="go-back-btn">Voltar</button>
                    </Link>
                    <h2>Gerenciar Cardápios</h2>
                </div>
            ) : (
                <button className="go-back-btn" onClick={handleCancelCreate}>Voltar</button>
            )}
            
            {/* Exibe o botão de "Criar Cardápio" apenas se não estiver criando */}
            {!isCreating ? (
                <button onClick={handleCreateCardapio}>Criar Cardápio</button>
            ) : (
                <div/>
            )}

            {/* Se isCreating for true, mostra o formulário de criação, senão, mostra a lista */}
            {isCreating ? (
                <CreateCardapio />
            ) : (
                <CardapioList />
            )}
        </div>
    );
};

export default CardapiosPage;
