import React, { useState } from 'react';

const TextUpload = () => {
  const [textContent, setTextContent] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleImageChange = (event) => {
    setBackgroundImage(event.target.files[0]);
  };

  const uploadText = async () => {
    setUploading(true);
    setError('');
    setSuccess('');

    let backgroundImageUrl = null;

    if (backgroundImage) {
      const { data, error } = await supabase.storage
        .from('media') // Nome do bucket
        .upload(`backgrounds/${backgroundImage.name}`, backgroundImage, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        setError('Upload da imagem falhou: ' + error.message);
        setUploading(false);
        return;
      } else {
        backgroundImageUrl = data.path;
      }
    }

    const { error: insertError } = await supabase
      .from('Content')
      .insert([
        {
          text_content: textContent,
          html_content: htmlContent,
          background_image: backgroundImageUrl,
        },
      ]);

    if (insertError) {
      setError('Falha ao inserir conteúdo: ' + insertError.message);
    } else {
      setSuccess('Conteúdo inserido com sucesso!');
    }

    setUploading(false);
  };

  return (
    <div>
      <h2>Upload de Texto e HTML</h2>
      <textarea
        placeholder="Digite o texto simples aqui"
        value={textContent}
        onChange={(e) => setTextContent(e.target.value)}
        rows="4"
        cols="50"
      />
      <textarea
        placeholder="Cole o conteúdo HTML aqui"
        value={htmlContent}
        onChange={(e) => setHtmlContent(e.target.value)}
        rows="4"
        cols="50"
      />
      <input type="file" onChange={handleImageChange} />
      <button onClick={uploadText} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

export default TextUpload;
