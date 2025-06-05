import React, { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import SERVER_URL from '../hooks/SeverUrl';

export default function Campaignnews() {
  const { campaign } = useOutletContext();
  const navigate = useNavigate();
  const [isOrg, setIsOrg] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const accessToken = localStorage.getItem('token');
        if (!accessToken) {
          setIsLoading(false);
          return;
        }

        const response = await fetch(`${SERVER_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (response.status === 401) {
          // 토큰이 만료된 경우 refresh token으로 재발급 시도
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) {
            setIsLoading(false);
            return;
          }

          const refreshResponse = await fetch(`${SERVER_URL}/api/v1/auth/login/refresh`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refreshToken })
          });

          if (refreshResponse.ok) {
            const { accessToken: newAccessToken } = await refreshResponse.json();
            localStorage.setItem('accessToken', newAccessToken);

            // 새로운 토큰으로 다시 사용자 정보 요청
            const newResponse = await fetch(`${SERVER_URL}/auth/me`, {
              headers: {
                'Authorization': `Bearer ${newAccessToken}`
              }
            });

            if (newResponse.ok) {
              const userData = await newResponse.json();
              console.log('userData (refresh):', userData);
              setIsOrg(userData.role === 'ROLE_ORGANIZATION');
            }
          }
        } else if (response.ok) {
          const userData = await response.json();
          console.log('userData:', userData);
          setIsOrg(userData.role === 'ROLE_ORGANIZATION');
        }
      } catch (error) {
        console.error('Error checking user role:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserRole();
  }, []);

  const handleCreateNews = () => {
    navigate(`/organization/create-campaign-news/${campaign.id}`, { state: { campaign } });
  };

  if (isLoading) {
    return <div></div>;
  }

  return (
    <div className="campaign-news-container">
      { (!campaign.campaignSpendings || campaign.campaignSpendings.length === 0) && (
        <div className='no-news-message-container'>
          <div className='no-news-message'>아직 추가된 소식이 없어요.</div>
          <div className='no-news-message'>모금기간: {campaign.donateStart} ~ {campaign.donateEnd}</div>
          <div className='no-news-message'>사업기간: {campaign.businessStart} ~ {campaign.businessEnd}</div>
        </div>
      )}
      {isOrg && (!campaign.campaignSpendings || campaign.campaignSpendings.length === 0) && (
        <button 
          className="create-news-button"
          onClick={handleCreateNews}
        >
          캠페인 소식 작성
        </button>
      )}

     {campaign.campaignSpendings && campaign.campaignSpendings.length > 0 && (
      <div className='news-list-container'>
        <h2>{campaign.campaignUpdate.title} 소식</h2>
        {campaign.campaignUpdate.imageUrl && (
          <img 
            src={campaign.campaignUpdate.imageUrl} 
            alt="캠페인 소식 이미지" 
            className="news-image"
            style={{
              maxWidth: '100%',
              height: 'auto',
              borderRadius: '8px',
              marginBottom: '16px'
            }}
          />
        )}
        <p>{campaign.campaignUpdate.content}</p>
      </div>
     )}
    </div>
  );
}
