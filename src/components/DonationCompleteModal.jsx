import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DonationCompleteModal.css';

import { IoClose } from "react-icons/io5";
import { createDonationImage } from '../hooks/imageUtils';
import SERVER_URL from '../hooks/SeverUrl';

function DonationCompleteModal({ isOpen, onClose, donationInfo, userNickname }) {
  const navigate = useNavigate();
  const [compositeImage, setCompositeImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const getDefaultImageByCategory = (category) => {
    // 여러 가능한 경로를 시도할 수 있도록 기본 경로만 반환
    const imagePath = `/image/IMG_${category === '아동청소년' ? 'children' : 
                      category === '노인' ? 'elderly' : 
                      category === '환경' ? 'environment' : 
                      category === '사회' ? 'social' : 
                      category === '동물' ? 'animal' : 
                      category === '장애인' ? 'disabled' : 'animal'}.png`;
    return imagePath;
  };

  useEffect(() => {
    if (isOpen && donationInfo) {
      setIsLoading(true);
      setError(null);
      
      const defaultImage = getDefaultImageByCategory(donationInfo.category);
      // nickname을 userNickname이나 donationInfo에서 가져오기
      const nickname = userNickname || donationInfo.nickname || '익명';
      
      console.log('이미지 합성 시작:', { defaultImage, donationInfo, nickname });
      
      createDonationImage(defaultImage, donationInfo, nickname)
        .then(async imageUrl => {
          console.log('이미지 합성 성공:', imageUrl);
          setCompositeImage(imageUrl);
          setIsLoading(false);
          
          // 이미지가 생성되면 자동으로 업로드
          try {
            await uploadNFTImage(imageUrl);
          } catch (error) {
            console.error('자동 업로드 실패:', error);
            // 업로드 실패해도 이미지는 보여주기
          }
        })
        .catch(error => {
          console.error('이미지 합성 실패:', error);
          setError('이미지 생성에 실패했습니다: ' + error.message);
          setCompositeImage(defaultImage); // 기본 이미지라도 보여주기
          setIsLoading(false);
        });
    }
  }, [isOpen, donationInfo, userNickname]);

  const uploadNFTImage = async (imageUrl) => {
    try {
      setIsUploading(true);
      
      // 이미지 URL을 Blob으로 변환
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error('이미지 다운로드 실패');
      }
      
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

      console.log('NFT 업로드 성공:', data.result[0]);
      return data.result[0];
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

  // 이미지 로드 에러 처리
  const handleImageError = () => {
    console.error('이미지 로드 실패');
    setCompositeImage('/image/IMG_animal.png'); // fallback 이미지
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
          
          {/* 에러 메시지 표시 */}
          {error && (
            <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>
          )}
          
          {isLoading ? (
            <div 
              className='donation-modal-img' 
              style={{ 
                backgroundColor: '#e0e0e0',
                width: '100%',
                height: '300px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#666'
              }}
            >
              이미지 생성 중...
            </div>
          ) : (
            <img 
              className='donation-modal-img' 
              src={compositeImage} 
              alt="기부 인증서" 
              onError={handleImageError}
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