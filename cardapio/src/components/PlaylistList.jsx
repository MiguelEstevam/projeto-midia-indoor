import React from 'react';
import { Link } from 'react-router-dom';
import './PlaylistList.css'; // Importa um arquivo CSS para estilização (se necessário)

const PlaylistList = ({ playlists, onDelete }) => {
  return (
    <div>
      <ul>
        {playlists.map((playlist) => (
          <li key={playlist.id}>
            <div className="playlist-container">
              <div className="info-playlist-container">
                <h3>{playlist.name}</h3>
                <p>{playlist.description}</p>
              </div>
              <div className="button-container">
                <Link to={`/playlists/edit/${playlist.id}`}>
                  <button className="edit-playlist-button">Editar</button>
                </Link>
                <button className="delete-playlist-button" onClick={() => onDelete(playlist.id)}>Excluir</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlaylistList;
