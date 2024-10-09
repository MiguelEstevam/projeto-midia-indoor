import React, { useState, useEffect } from 'react';
import './EditDeviceModal.css';
import { API_URL } from '../config';

const EditDeviceModal = ({ isOpen, onClose, device, onSave }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [playlistId, setPlaylistId] = useState('');
    const [playlists, setPlaylists] = useState([]);
    const [error, setError] = useState('');

    // Função para buscar playlists
    const fetchPlaylists = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`${API_URL}/playlists/db`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao buscar playlists');
            }

            const data = await response.json();
            setPlaylists(data.data);
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchPlaylists();
            if (device) {
                setName(device.name);
                setDescription(device.description);
                setPlaylistId(device.playlist_id || ''); // Se não houver playlist, define como vazio
            }
        }
    }, [isOpen, device]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedDevice = {
            name,
            description,
            playlist_id: playlistId || null, // Se não tiver seleção, usa null
        };
    
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`${API_URL}/device/edit/${device.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updatedDevice),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao atualizar dispositivo');
            }
    
            const data = await response.json();
            console.log('Dispositivo atualizado:', data);
    
            // Chame onSave ou faça qualquer outra ação após a atualização
            onSave(data.data); // Ou o que for necessário
            onClose(); // Fecha o modal após salvar
        } catch (err) {
            console.error(err);
            setError(err.message); // Exibe mensagem de erro, se houver
        }
    };
    

    if (!isOpen) return null; // Se o modal não estiver aberto, não renderiza nada

    return (
        <div className="modal">
            <h3>Editar Dispositivo</h3>
            {error && <p className="error">{error}</p>} {/* Exibe mensagem de erro, se houver */}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Nome:
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Descrição:
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Playlist:
                        <select
                            value={playlistId}
                            onChange={(e) => setPlaylistId(e.target.value)}
                        >
                            <option value="">Sem Playlist</option> {/* Opção para não associar a uma playlist */}
                            {playlists.map((playlist) => (
                                <option key={playlist.id} value={playlist.id}>
                                    {playlist.name}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <div>
                    <button type="submit">Salvar</button>
                    <button type="button" onClick={onClose}>Cancelar</button>
                </div>
            </form>
        </div>
    );
};

export default EditDeviceModal;
