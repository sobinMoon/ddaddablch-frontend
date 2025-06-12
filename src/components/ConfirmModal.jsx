import React from 'react';
import './ConfirmModal.css';

export default function ConfirmModal({ isOpen, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal-content">
        <div className="confirm-modal-message">{message}</div>
        <div className="confirm-modal-buttons">
          <button className="confirm-modal-button cancel" onClick={onCancel}>
            취소
          </button>
          <button className="confirm-modal-button confirm" onClick={onConfirm}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
} 