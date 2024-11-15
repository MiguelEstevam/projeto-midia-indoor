import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import HtmlUpload from '../components/HtmlUpload';
import FileList from '../components/FileList';
import HtmlList from '../components/HtmlList';


const MediaPage = () => {
    const [isContentListVisible, setIsContentListVisible] = useState(true); // Adiciona estado para alternar entre as divs

    const handleToggleContent = () => {
        setIsContentListVisible(!isContentListVisible); // Alterna o estado
    };

    return (
        <div>
            <Link to="/home">
                <button className="go-back-btn">Voltar</button>
            </Link>
            <br />
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#225ABD' }}>{isContentListVisible ? "Gerenciar Conteúdos" : "Fazer Upload"}</h1>
            <br />
            <button onClick={handleToggleContent}>{isContentListVisible ? "Fazer upload" : "Gerenciar Conteúdos"}</button>
            <br />
            <br />
            <div
                className="upload-container"
                style={{
                    display: isContentListVisible ? 'none' : 'block',
                    fontFamily: "Candara, Calibri, Segoe, Segoe UI, Optima, Arial, sans-serif", // Define a fonte aqui
                    color: '#633' // Escolha uma cor de fonte atraente
                }}
            >
                {/* colocar uma porra de titulo aqui */}
                <div className="main-container">
                    <HtmlUpload />
                </div>
                <br />
                <FileUpload />
            </div>

            <div className="content-list-container" style={{ display: isContentListVisible ? 'block' : 'none' }}>
                <FileList />
                <br />
                <HtmlList />
            </div>
        </div>
    );
};

export default MediaPage;