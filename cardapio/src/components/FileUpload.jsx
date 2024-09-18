import React, { useState } from 'react';
import { API_URL } from '../config';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    
    // Verifica se o arquivo é do tipo permitido
    const allowedTypes = ['image/png', 'image/jpeg', 'video/mp4'];
    if (selectedFile && !allowedTypes.includes(selectedFile.type)) {
      setError('Invalid file type. Only PNG, JPG, and MP4 are allowed.');
      setFile(null);
      return;
    }
    
    setFile(selectedFile);
    setError('');
  };

  const uploadFile = async () => {
    setUploading(true);
    setError('');
    setSuccess('');
  
    if (!file) {
      setError('Please select a file to upload.');
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
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }
  
      setSuccess('File uploaded successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };  

  return (
    <div>
      <h2>Upload Media</h2>
      <input type="file" onChange={handleFileChange} />
      {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
      {success && <p className="error-message" style={{ color: 'green' }}>{success}</p>}
      <button onClick={uploadFile} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
};

export default FileUpload;
