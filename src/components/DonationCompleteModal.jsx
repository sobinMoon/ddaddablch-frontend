import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DonationCompleteModal.css';
import defaultImage from '../assets/IMG_animal.jpg';
import { IoClose } from "react-icons/io5";

function DonationCompleteModal({ isOpen, onClose, donationInfo }) {
  const navigate = useNavigate();

  const handleShare = () => {
    onClose(); // 모달 닫기
    // 이미지 URL을 state로 전달
    navigate('/community/create-post', {
      state: {
        defaultImage: defaultImage,
        donationInfo: donationInfo
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <button className='modal-close-btn' onClick={onClose}>
            <IoClose />
          </button>
        </div>
        <h2>기부 완료!</h2>
        <div className="donation-modal-info">
          <p className='donation-modal-info-text'>NFT 인증서가 발급되었어요</p>
          {/*<p>캠페인: {donationInfo.campaignName}</p>*/}
          {/*<p>기부 금액: {donationInfo.amount} ETH</p>*/}
          <img className='donation-modal-img' src={defaultImage} alt="캠페인 이미지" />
        </div>
        <div className="modal-actions">
          <button onClick={handleShare}>커뮤니티에 공유하기</button>
        </div>
      </div>
    </div>
  );
}

export default DonationCompleteModal;
