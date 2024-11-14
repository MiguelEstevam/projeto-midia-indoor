import React, { useState, useEffect } from 'react';
import './EditDeviceModal.css';
import { API_URL } from '../config';

const EditDeviceModal = ({ isOpen, onClose, device, onSave }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [playlistId, setPlaylistId] = useState('');
    const [menuId, setMenuId] = useState(''); 
    const [playlists, setPlaylists] = useState([]);
    const [menus, setMenus] = useState([]); 
    const [error, setError] = useState('');

    const fetchPlaylists = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`${API_URL}/playlists/db`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Erro ao buscar playlists');
            const data = await response.json();
            setPlaylists(data.data);
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    const fetchMenus = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`${API_URL}/cardapio/db`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Erro ao buscar cardápios');
            const data = await response.json();
            setMenus(data.data);
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchPlaylists();
            fetchMenus();
            if (device) {
                setName(device.name);
                setDescription(device.description);
                setPlaylistId(device.playlist_id || '');
                setMenuId(device.cardapio_id || ''); 
            }
        }
    }, [isOpen, device]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedDevice = {
            name,
            description,
            playlist_id: playlistId || null, 
            menu_id: menuId || null, 
        };

        if (updatedDevice.playlist_id && updatedDevice.menu_id) {
            console.error('O dispositivo não pode ter uma Playlist e um Cardápio ao mesmo tempo.');
            return;
        }

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
            if (!response.ok) throw new Error('Erro ao atualizar dispositivo');
            const data = await response.json();
            onSave(data.data);
            onClose();
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal">
            <h3>Editar Dispositivo</h3>
            {error && <p className="error">{error}</p>}
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
                            onChange={(e) => {
                                setPlaylistId(e.target.value);
                                setMenuId(''); 
                            }}
                        >
                            <option value="">Sem Playlist</option>
                            {playlists.map((playlist) => (
                                <option key={playlist.id} value={playlist.id}>
                                    {playlist.name}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <div>
                    <label>
                        Cardápio:
                        <select
                            value={menuId}
                            onChange={(e) => {
                                setMenuId(e.target.value);
                                setPlaylistId(''); 
                            }}
                        >
                            <option value="">Sem Cardápio</option>
                            {menus.map((menu) => (
                                <option key={menu.id} value={menu.id}>
                                    {menu.name}
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
