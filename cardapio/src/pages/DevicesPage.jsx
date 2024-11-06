import React, { useState, useEffect } from 'react';
import AddDevice from '../components/AddDevice';
import DeviceList from '../components/DeviceList';
import EditDeviceModal from '../components/EditDeviceModal';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';

const DevicesPage = () => {
    const [devices, setDevices] = useState([]);
    const [error, setError] = useState('');
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);

    const fetchDevices = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`${API_URL}/devices/db`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao buscar dispositivos');
            }

            const data = await response.json();
            setDevices(Array.isArray(data.data) ? data.data : []);
        } catch (error) {
            console.error('Erro ao buscar dispositivos:', error);
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchDevices();
    }, []);

    const handleAddDevice = (newDeviceResponse) => {
        const newDevice = newDeviceResponse.data[0];
        setDevices((prevDevices) => [
            ...prevDevices,
            {
                id: newDevice.id,
                name: newDevice.name || 'Nome não disponível',
                description: newDevice.description || 'Descrição não disponível',
                created_at: newDevice.created_at,
                playlist_id: newDevice.playlist_id,
            },
        ]);
    };

    const handleDeleteDevice = async (id) => {
        const token = localStorage.getItem('access_token');

        try {
            const response = await fetch(`${API_URL}/device/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao excluir o dispositivo');
            }

            setDevices((prevDevices) => prevDevices.filter((device) => device.id !== id));
            alert('Dispositivo excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir dispositivo:', error);
            setError(error.message);
        }
    };

    const handleEditDevice = (device) => {
        setSelectedDevice(device);
        setModalOpen(true);
    };

    const handleSaveDevice = async (updatedDevice) => {
        const token = localStorage.getItem('access_token');

        // Verifica se todos os dados necessários estão presentes
        if (!updatedDevice.id || !updatedDevice.name || !updatedDevice.description) {
            console.error('ID, Nome e Descrição são obrigatórios para atualizar o dispositivo.');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/device/update/${updatedDevice.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updatedDevice),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao atualizar o dispositivo');
            }

            // Atualiza a lista de dispositivos sem precisar recarregar
            setDevices((prevDevices) =>
                prevDevices.map((dev) =>
                    dev.id === updatedDevice.id ? { ...dev, ...updatedDevice } : dev
                )
            );

            alert('Dispositivo atualizado com sucesso!');
            setModalOpen(false); // Fecha o modal após salvar
        } catch (error) {
            console.error('Erro ao atualizar dispositivo:', error);
            setError(error.message);
        }
    };

    return (
        <div>
            <Link to="/media">
                <button className="go-back-btn">Voltar</button>
            </Link>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <AddDevice onAdd={handleAddDevice} />
            <DeviceList
                devices={devices}
                onDelete={handleDeleteDevice}
                onEdit={handleEditDevice}
            />
            <EditDeviceModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                device={selectedDevice} // Passando o dispositivo corretamente
                onSave={handleSaveDevice}
            />
        </div>
    );
};

export default DevicesPage;
