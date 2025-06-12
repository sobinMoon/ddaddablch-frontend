import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DonationCompleteModal.css';
import { IoClose } from "react-icons/io5";
import { createDonationImage } from '../hooks/imageUtils';
import SERVER_URL from '../hooks/SeverUrl';

function DonationCompleteModal({ isOpen, onClose, donationInfo }) {
  const navigate = useNavigate();
  const [compositeImage, setCompositeImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [nickname, setNickname] = useState('');

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${SERVER_URL}/api/v1/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.nickname) {
        setNickname(data.nickname);
      }
    } catch (error) {
      console.error('사용자 정보 조회 실패:', error);
    }
  };

  const getDefaultImageByCategory = (category) => {
    switch (category) {
      case '아동청소년':
        return '/image/IMG_children.PNG';
      case '노인':
        return '/image/IMG_elderly.PNG';
      case '환경':
        return '/image/IMG_environment.PNG';
      case '사회':
        return '/image/IMG_social.PNG';
      case '동물':
        return '/image/IMG_animal.PNG';
      case '장애인':
        return '/image/IMG_disabled.PNG';
      default:
        return '/image/IMG_animal.PNG';   
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (isOpen && donationInfo) {
      setIsLoading(true);
      fetchUserInfo();
      const defaultImage = getDefaultImageByCategory(donationInfo.category);
      createDonationImage(defaultImage, donationInfo, nickname)
        .then(async imageUrl => {
          setCompositeImage(imageUrl);
          setIsLoading(false);
          // 이미지가 생성되면 자동으로 업로드
          try {
            await uploadNFTImage(imageUrl);
          } catch (error) {
            console.error('자동 업로드 실패:', error);
          }
        })
        .catch(error => {
          console.error('이미지 합성 실패:', error);
          setCompositeImage(defaultImage);
          setIsLoading(false);
        });
    }
  }, [isOpen, donationInfo, nickname]); // nickname 의존성 추가

  const uploadNFTImage = async (imageUrl) => {
    try {
      setIsUploading(true);
      // 이미지 URL을 Blob으로 변환
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // Blob을 File 객체로 변환
      const file = new File([blob], "donation-nft.jpg", { type: "image/jpeg" });

      // FormData 생성 및 파일 추가
      const formData = new FormData();
      formData.append('image', file);

      const token = localStorage.getItem('token');
      const uploadResponse = await fetch(`${SERVER_URL}/api/v1/mypage/student/nft`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await uploadResponse.json();
      if (!data.isSuccess) {
        throw new Error(data.message || 'NFT 이미지 업로드에 실패했습니다.');
      }

      return data.result[0]; // 업로드된 이미지 경로 반환
    } catch (error) {
      console.error('NFT 이미지 업로드 실패:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleShare = () => {
    onClose();
    navigate('/community/create-post', {
      state: {
        defaultImage: compositeImage || '/image/IMG_animal.png',
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
          {isLoading ? (
            <div 
              className='donation-modal-img' 
              style={{ 
                backgroundColor: '#e0e0e0',
                width: '100%',
                height: '300px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            />
          ) : (
            <img 
              className='donation-modal-img' 
              src={compositeImage} 
              alt="기부 인증서" 
            />
          )}
        </div>
        <div className="modal-actions">
          <button 
            onClick={handleShare}
            disabled={isUploading}
          >
            {isUploading ? '업로드 중...' : '커뮤니티에 공유하기'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DonationCompleteModal;
