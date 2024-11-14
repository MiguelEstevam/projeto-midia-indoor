import React, { useEffect } from 'react';
import './AlertModal.css';

const AlertModal = ({ message, type = 'Info', duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`alert-modal ${type.toLowerCase()}`}>
      <span>{message}</span>
    </div>
  );
};

export default AlertModal;
