import React from 'react';
import { Link } from 'react-router-dom';
import './PlaylistList.css'; // Importa um arquivo CSS para estilização

const PlaylistList = ({ playlists, onDelete }) => {
  return (
    <ul>
      {playlists.map((playlist) => (
        <li key={playlist.id}>
          <div className="li-playlist-container">
            <div className="playlist-info-container">
              <h2> {playlist.name || 'Nome não disponível'}</h2>
              <p><strong>Descrição: </strong>{playlist.description|| 'Descrição não disponível'}</p>
            </div>
            <div className="edit-delete-btn-container">
              <Link to={`/playlists/edit/${playlist.id}`}>
                <button className="edit-btn" onClick={() => console.log(`Editar ${playlist.id}`)}>Editar</button>
              </Link>
              <button className="delete-btn" onClick={() => onDelete(playlist.id)}>Excluir</button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default PlaylistList;
