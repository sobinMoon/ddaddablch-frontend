import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DonationCompleteModal.css';
// import defaultImage1 from '../assets/IMG_environment.png';
// import defaultImage2 from '../assets/IMG_animal.png';
// import defaultImage3 from '../assets/IMG_elderly.png';
// import defaultImage4 from '../assets/IMG_children.png';
// import defaultImage5 from '../assets/IMG_disabled.png';
// import defaultImage6 from '../assets/IMG_social.jpg';
import { IoClose } from "react-icons/io5";
import { createDonationImage } from '../hooks/imageUtils';

function DonationCompleteModal({ isOpen, onClose, donationInfo }) {
  const navigate = useNavigate();
  const [compositeImage, setCompositeImage] = useState(null);

  const getDefaultImageByCategory = (category) => {
    switch (category) {
      case '아동청소년':
        return "/images/IMG_elderly.png";
      case '노인':
        return "/images/IMG_environment.png";
      case '환경':
        return "/images/IMG_environment.png";
      case '사회':
        return "/images/IMG_social.png";
      case '동물':
        return "/images/IMG_animal.png";
      case '장애인':
        return "/images/IMG_disabled.png";
      default:
        return "/images/IMG_animal.png"; // 기본값으로 동물 이미지 사용
    }
  };

  useEffect(() => {
    if (isOpen && donationInfo) {
      const defaultImage = getDefaultImageByCategory(donationInfo.category);
      createDonationImage(defaultImage, donationInfo)
        .then(imageUrl => {
          setCompositeImage(imageUrl);
        })
        .catch(error => {
          console.error('이미지 합성 실패:', error);
          setCompositeImage(defaultImage);
        });
    }
  }, [isOpen, donationInfo]);

  const handleShare = () => {
    onClose();
    navigate('/community/create-post', {
      state: {
        defaultImage: compositeImage || "/images/IMG_animal.png",
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
          <img 
            className='donation-modal-img' 
            src={compositeImage || defaultImage2} 
            alt="기부 인증서" 
          />
        </div>
        <div className="modal-actions">
          <button onClick={handleShare}>커뮤니티에 공유하기</button>
        </div>
      </div>
    </div>
  );
}

export default DonationCompleteModal;
