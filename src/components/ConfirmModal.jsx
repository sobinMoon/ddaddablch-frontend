import React from 'react';
import './ConfirmModal.css';

export default function ConfirmModal({ isOpen, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-message">{message}</div>
        <div className="modal-buttons">
          <button className="modal-button cancel" onClick={onCancel}>
            취소
          </button>
          <button className="modal-button confirm" onClick={onConfirm}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
} 