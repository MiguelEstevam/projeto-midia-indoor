import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { API_URL } from '../config';

const HtmlUpload = () => {
  const [editorData, setEditorData] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleEditorChange = (event, editor) => {
    setEditorData(editor.getData());
  };

  const uploadHtml = async () => {
    setUploading(true);
    setError('');
    setSuccess('');

    if (!editorData) {
      setError('Insira algum conteúdo HTML antes do upload.');
      setUploading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/upload/html`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({ content: editorData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      setSuccess('HTML uploaded successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className='ckeditor-container'>
      <h2>Upload de conteúdo HTML</h2>
      <CKEditor
        editor={ClassicEditor}
        data={editorData}
        onChange={handleEditorChange}
      />
      <button onClick={uploadHtml} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload HTML'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

export default HtmlUpload;
