import React from 'react';
import './DeviceList.css';

const DeviceList = ({ devices, onDelete, onEdit }) => {
    return (
        <ul>
            {devices.map((device) => (
                <li key={device.id}>
                  <div className="li-device-container">
                    <div className='device-info-container'>
                        <p><strong>Nome:</strong> {device.name || 'Nome não disponível'}</p>
                        <p><strong>Descrição:</strong> {device.description || 'Descrição não disponível'}</p>
                    </div>
                    <div className='edit-delete-btn-container'>
                        <button className="edit-btn" onClick={() => onEdit(device)}>Configurar</button>
                        <button className="delete-btn" onClick={() => onDelete(device.id)}>Excluir</button>
                    </div>
                  </div>
                </li>
            ))}
        </ul>
    );
};

export default DeviceList;
