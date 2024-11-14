import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Para capturar o idCardapio da URL
import { API_URL } from '../config';
import { Link } from 'react-router-dom';
import './CreateCardapio.css';

const EditCardapio = () => {
    const { idCardapio } = useParams();  // Captura o idCardapio da URL
    const [cardapio, setCardapio] = useState({ nome: '', descricao: '', categorias: [] });
    const [novaCategoria, setNovaCategoria] = useState('');
    const [produto, setProduto] = useState({ nome: '', descricao: '', preco: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoriaIndexSelecionada, setCategoriaIndexSelecionada] = useState(null);

    useEffect(() => {
        // Verifique se o idCardapio está presente
        if (!idCardapio) {
            console.error('ID do cardápio não encontrado');
            return;
        }

        // Fetch cardápio data
        const fetchCardapio = async () => {
            const token = localStorage.getItem('access_token');

            try {
                const response = await fetch(`${API_URL}/cardapio/${idCardapio}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                });

                if (!response.ok) {
                    throw new Error('Erro ao buscar o cardápio');
                }

                const data = await response.json();
                const cardapioData = data.data[0];

                // Parse the content string to JSON
                const categorias = JSON.parse(cardapioData.content);

                setCardapio({
                    nome: cardapioData.name,
                    descricao: cardapioData.description,
                    categorias: categorias,
                });
            } catch (error) {
                console.error("Erro ao carregar cardápio:", error);
            }
        };

        fetchCardapio();
    }, [idCardapio]); // A dependência de idCardapio garante que o efeito só execute quando o id mudar

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
    
        const content = JSON.stringify(cardapio.categorias);
    
        try {
            const response = await fetch(`${API_URL}/cardapio/edit/${idCardapio}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nome: cardapio.nome,
                    descricao: cardapio.descricao, 
                    content: content,
                }),
            });
    
            if (!response.ok) {
                throw new Error('Erro ao salvar o cardápio');
            }
    
            alert("Cardápio atualizado com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar cardápio:", error);
        }
    };

    return (
        <div>
            <Link to="/cardapios">
                <button className="go-back-btn">Voltar</button>
            </Link>
            <h1>Editar Cardápio</h1>
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
                                    <p><b>Preço: </b>R$ {(Number(prod.preco) || 0).toFixed(2)}</p>  
                                </div>
                                <div className="buttons-container">
                                    <button className="remove-button" onClick={() => handleRemoveProduto(index, idx)}>Remover</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}

            <br />

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

export default EditCardapio;
