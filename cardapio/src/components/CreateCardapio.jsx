import React, { useState } from 'react';
import { API_URL } from '../config';
import './CreateCardapio.css';

const CreateCardapio = () => {
    const [cardapio, setCardapio] = useState({ nome: '', descricao: '', categorias: [] });
    const [novaCategoria, setNovaCategoria] = useState('');
    const [produto, setProduto] = useState({ nome: '', descricao: '', preco: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoriaIndexSelecionada, setCategoriaIndexSelecionada] = useState(null);

    const handleAddCategoria = () => {
        if (novaCategoria.trim()) {
            setCardapio({
                ...cardapio,
                categorias: [...cardapio.categorias, { nome_categoria: novaCategoria, produtos: [] }]
            });
            setNovaCategoria('');
        }
    };

    const handleRemoveCategoria = (index) => {
        const categoriasAtualizadas = [...cardapio.categorias];
        categoriasAtualizadas.splice(index, 1);
        setCardapio({ ...cardapio, categorias: categoriasAtualizadas });
    };

    const openModal = (index) => {
        setCategoriaIndexSelecionada(index);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setProduto({ nome: '', descricao: '', preco: '' });
    };

    const handleAddProduto = () => {
        if (categoriaIndexSelecionada !== null) {
            const categoriasAtualizadas = [...cardapio.categorias];
            categoriasAtualizadas[categoriaIndexSelecionada].produtos.push({ ...produto });
            setCardapio({ ...cardapio, categorias: categoriasAtualizadas });
            closeModal();
        }
    };

    const handleRemoveProduto = (categoriaIndex, produtoIndex) => {
        const categoriasAtualizadas = [...cardapio.categorias];
        categoriasAtualizadas[categoriaIndex].produtos.splice(produtoIndex, 1);
        setCardapio({ ...cardapio, categorias: categoriasAtualizadas });
    };

    const handleSaveCardapio = async () => {
        const token = localStorage.getItem('access_token');

        try {
            const response = await fetch(`${API_URL}/upload/cardapio`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ conteudo: cardapio })
            });

            if (!response.ok) {
                throw new Error('Erro ao salvar o cardápio');
            }

            alert("Cardápio salvo com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar cardápio:", error);
        }
    };

    return (
        <div>
            <h1>Editor de Cardápio</h1>
            <label>Nome:</label>
            <input
                type="text"
                placeholder="Nome do cardápio"
                value={cardapio.nome}
                required
                onChange={(e) => setCardapio({ ...cardapio, nome: e.target.value })}
            />
            <label>Descrição:</label>
            <textarea
                placeholder="Descrição do cardápio"
                value={cardapio.descricao}
                onChange={(e) => setCardapio({ ...cardapio, descricao: e.target.value })}
            />

            <h2>Categorias</h2>
            <input
                type="text"
                placeholder="Nome da categoria"
                value={novaCategoria}
                onChange={(e) => setNovaCategoria(e.target.value)}
            />
            <button onClick={handleAddCategoria}>Adicionar Categoria</button>

            {cardapio.categorias.map((categoria, index) => (
                <div key={index} className="categoria-container">
                    <div className="categoria-header">
                        <h3>{categoria.nome_categoria}</h3>
                        <div className="buttons-container">
                            <button className="add-button" onClick={() => openModal(index)}>Adicionar <br />Produto</button>
                            <button className="remove-button" onClick={() => handleRemoveCategoria(index)}>Excluir <br />Categoria</button>
                        </div>
                    </div>

                    <ul>
                        {categoria.produtos.map((prod, idx) => (
                            <li key={idx} className="produto-item">
                                <div className="info-produto">
                                    <p><b>Nome: </b> {prod.nome}</p>
                                    <p><b>Descrição: </b> {prod.descricao}</p>
                                    <p><b>Preço: </b>R$ {prod.preco}</p>  
                                </div>
                                <div className="buttons-container">
                                    <button className="remove-button" onClick={() => handleRemoveProduto(index, idx)}>Remover</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}

            <br/>

            <button className="cardapio-save-btn" onClick={handleSaveCardapio}>Salvar Cardápio</button>

            {isModalOpen && (
                <div className="overlay">
                    <div className="modal">
                        <h2>Adicionar Produto</h2>
                        <input
                            type="text"
                            placeholder="Nome do produto"
                            value={produto.nome}
                            onChange={(e) => setProduto({ ...produto, nome: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Descrição do produto (Opcional)"
                            value={produto.descricao}
                            onChange={(e) => setProduto({ ...produto, descricao: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Preço do produto"
                            value={produto.preco}
                            onChange={(e) => setProduto({ ...produto, preco: e.target.value })}
                        />
                        <button onClick={handleAddProduto}>Adicionar</button>
                        <button onClick={closeModal}>Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateCardapio;
