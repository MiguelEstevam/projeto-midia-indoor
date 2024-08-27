import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [fileUrls, setFileUrls] = useState({});

  const getToken = () => localStorage.getItem('access_token');

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(`${API_URL}/files`, {
          headers: {
            'Authorization': `Bearer ${getToken()}`,
          },
        });
        const data = await response.json();
        setFiles(data);
      } catch (error) {
        console.error('Error fetching files:', error.message);
      }
    };

    fetchFiles();
  }, []);

  useEffect(() => {
    const fetchFileUrls = async () => {
      const urls = {};
      for (const file of files) {
        try {
          const response = await fetch(`${API_URL}/files/${file.name}/url`, {
            headers: {
              'Authorization': `Bearer ${getToken()}`,
            },
          });
          const data = await response.json();
          urls[file.name] = data.publicUrl;
        } catch (error) {
          console.error(`Error fetching URL for ${file.name}:`, error.message);
        }
      }
      setFileUrls(urls);
    };

    if (files.length > 0) {
      fetchFileUrls();
    }
  }, [files]);

  const renderFilePreview = (file) => {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const fileUrl = fileUrls[file.name];

    if (!fileUrl) {
      return <span>Loading...</span>;
    }

    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
      return <img src={fileUrl} alt={file.name} />;
    } else if (['mp4', 'webm', 'ogg'].includes(fileExtension)) {
      return (
        <video width="100" autoPlay="false" muted>
          <source src={fileUrl} type={`video/${fileExtension}`} />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return <span>{file.name}</span>;
    }
  };

  return (
    <div className="file-list-container">
      <h2>Uploaded Files</h2>
      <ul className="file-list">
        {files.map((file) => (
          <li key={file.name}>
            <a
              href={fileUrls[file.name] || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="file-link"
            >
              {renderFilePreview(file)}
              <span className="file-name">{file.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
