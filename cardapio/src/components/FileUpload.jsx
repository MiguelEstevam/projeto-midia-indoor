import React, { useState, useRef } from 'react';
import { API_URL } from '../config';
import './FileUpload.css';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    const allowedTypes = ['image/png', 'image/jpeg', 'video/mp4'];
    if (selectedFile && !allowedTypes.includes(selectedFile.type)) {
      setError('Tipo de arquivo inválido. Apenas PNG, JPG e MP4 são permitidos.');
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setFile(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadFile = async () => {
    setUploading(true);
    setError('');
    setSuccess('');

    if (!file) {
      setError('Por favor, selecione um arquivo para upload.');
      setUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('access_token');

    try {
      const response = await fetch(`${API_URL}/upload/file`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 413) {
          throw new Error('O arquivo é muito grande. O tamanho máximo permitido é de 4,5 MB.');
        }

        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha no upload.');
      }

      setSuccess('Arquivo enviado com sucesso!');
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err.message || 'Ocorreu um erro durante o upload.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h2>Upload de Mídia</h2>
      <div className="file-upload-container">
        <div className="input-cancel-container">
          <input
            className="input-file"
            type="file"
            onChange={handleFileChange}
            ref={fileInputRef}
            disabled={uploading}
          />
          {file && (
            <button
              className="cancel-button"
              onClick={handleCancel}
              disabled={uploading}
            >
              Cancelar
            </button>
          )}
        </div>
        {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
        {success && <p className="success-message" style={{ color: 'green' }}>{success}</p>}
        <button onClick={uploadFile} disabled={uploading || !file}>
          {uploading ? 'Enviando...' : 'Enviar mídia'}
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
