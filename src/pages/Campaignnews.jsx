import React, { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import SERVER_URL from '../hooks/SeverUrl';
import './Campaignnews.css';
import no_message from '../assets/no_message.png';
import ConfirmModal from '../components/ConfirmModal';
import Plandetailcard from '../components/Plandetailcard';

export default function Campaignnews() {
  const { campaign } = useOutletContext();
  const navigate = useNavigate();
  const [isOrg, setIsOrg] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    message: '',
    onConfirm: null
  });

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
              // console.log('userData (refresh):', userData);
              setIsOrg(userData.role === 'ROLE_ORGANIZATION');
              setUserData(userData);
            }
          }
        } else if (response.ok) {
          const userData = await response.json();
          // console.log('userData:', userData);
          setIsOrg(userData.role === 'ROLE_ORGANIZATION');
          setUserData(userData);
        }
      } catch (error) {
        console.error('Error checking user role:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserRole();
  }, []);

  const showModal = (message, onConfirm) => {
    setModalConfig({
      isOpen: true,
      message,
      onConfirm: () => {
        setModalConfig(prev => ({ ...prev, isOpen: false }));
        onConfirm?.();
      }
    });
  };

  const handleCreateNews = () => {
    if (campaign.statusFlag === 'IN_PROGRESS') {
      showModal('아직 사업기간이 끝나지 않았어요.\n지금 바로 사업기간을 종료하고 소식을 작성하시겠습니까?', async () => {
        try {
          const accessToken = localStorage.getItem('token');
          const response = await fetch(`${SERVER_URL}/api/v1/campaigns/${campaign.id}/status`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
              status: 'COMPLETED'
            })
          });

          if (response.ok) {
            navigate(`/organization/create-campaign-news/${campaign.id}`, { state: { campaign } });
          } else {
            const errorData = await response.json();
            alert(errorData.message || '캠페인 상태 변경에 실패했습니다.');
          }
        } catch (error) {
          console.error('Error:', error);
          alert('캠페인 상태 변경 중 오류가 발생했습니다.');
        }
      });
      return;
    }
    else {
      navigate(`/organization/create-campaign-news/${campaign.id}`, { state: { campaign } });
    }
  };

  if (isLoading) {
    return <div></div>;
  }

  return (
    <div className="campaign-news-container">
      {(!campaign.campaignSpendings || campaign.campaignSpendings.length === 0) && (
        <div className="news-center-wrapper">
          <div className="no-news-message-container">
            <img src={no_message} alt="no-message" className="no-news-image" />
            <div className="no-news-message-title">아직 추가된 소식이 없어요.</div>
            <div className="no-news-message">
              모금기간: {campaign.donateStart} ~ {campaign.donateEnd}
            </div>
            <div className="no-news-message">
              사업기간: {campaign.businessStart} ~ {campaign.businessEnd}
            </div>
            <div style={{ marginTop: '12px' }}></div>

            {isOrg
              && (campaign.statusFlag === 'IN_PROGRESS' || campaign.statusFlag === 'COMPLETED')
              && campaign.organization.id === userData?.id
              && (!campaign.campaignSpendings || campaign.campaignSpendings.length === 0) && (
                <button
                  className="create-news-button"
                  onClick={handleCreateNews}
                >
                  캠페인 소식 작성
                </button>
              )}

          </div>
        </div>
      )}

      {campaign.campaignSpendings && campaign.campaignSpendings.length > 0 && (
        <div>
          <div className='news-list-container'>
            <h2>{campaign.campaignUpdate.title}</h2>
            {campaign.campaignUpdate.imageUrl && (
              <img
                src={`${SERVER_URL}/images/${campaign.campaignUpdate.imageUrl}`}
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
            <p style={{
              padding: '0px',
              borderRadius: '10px',
              whiteSpace: 'pre-line',
              fontSize: '1.05rem',
            }}>{campaign.campaignUpdate.content.replace(/\\n|¶/g, '\n')}</p>
          </div>
          <Plandetailcard flag="isNews" campaignPlans={campaign.campaignSpendings} goal={campaign.goal} amount={campaign.currentAmount} />
        </div>
      )}

      <ConfirmModal
        isOpen={modalConfig.isOpen}
        message={modalConfig.message}
        onConfirm={modalConfig.onConfirm}
        onCancel={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
