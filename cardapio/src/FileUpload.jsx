import React, { useState } from 'react';
import { supabase } from './supabaseClient';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
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

    const { data, error } = await supabase.storage
      .from('media') // Nome do bucket criado
      .upload(`uploads/${file.name}`, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      setError('Upload failed: ' + error.message);
    } else {
      setSuccess('File uploaded successfully!');
    }

    setUploading(false);
  };

  return (
    <div>
      <h2>Upload Media</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadFile} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

export default FileUpload;
