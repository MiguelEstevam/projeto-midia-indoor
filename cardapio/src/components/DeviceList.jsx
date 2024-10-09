//btc
import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';

const DeviceList = () => {
  const [devices, setDevices] = useState([]);
  const [error, setError] = useState('');

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
      setDevices(data);
    } catch (error) {
      console.error('Erro ao buscar dispositivos:', error);
      setError(error.message);
    }
  };

  const deleteDevice = async (deviceId) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_URL}/device/delete/${deviceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao deletar o dispositivo');
      }

      setDevices(devices.filter((device) => device.id !== deviceId));
    } catch (error) {
      console.error('Erro ao deletar dispositivo:', error);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  return (
    <div>
      <h2>Listar Dispositivos</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {devices.map((device) => (
          <li key={device.id}>
            {device.name} - {device.description}
            <button onClick={() => deleteDevice(device.id)}>Deletar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeviceList;
