import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const FileList = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      const { data, error } = await supabase.storage
        .from('media')
        .list('uploads', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' },
        });

      if (error) {
        console.error('Error fetching files:', error.message);
      } else {
        setFiles(data);
      }
    };

    fetchFiles();
  }, []);

  const getFileUrl = (fileName) => {
    const { data, error } = supabase.storage
      .from('media')
      .getPublicUrl(`uploads/${fileName}`);

    if (error) {
      console.error('Error getting public URL:', error.message);
      return '#';
    }
    
    return data.publicUrl;
  };

  return (
    <div className="file-list-container">
      <h2>Uploaded Files</h2>
      <ul className="file-list">
        {files.map((file) => (
          <li key={file.name}>
            <a 
              href={getFileUrl(file.name)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="file-link"
            >
              {file.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
