import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Donatecard.css';
import SERVER_URL from '../hooks/SeverUrl';

export default function Donatecard({ goal, remaining, participants, onDonate, campaignState}) {
  const navigate = useNavigate();

  const handleDonateClick = async () => {
    // 토큰 확인
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
      return;
    }

    try {
      // 사용자 정보 확인
      const response = await fetch(`${SERVER_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
          navigate('/login');
          return;
        }
        throw new Error('사용자 정보를 가져오는데 실패했습니다.');
      }

      const userData = await response.json();
      
      // 학생 계정인지 확인
      if (userData.role !== 'ROLE_STUDENT') {
        alert('학생계정만 이용 가능한 서비스입니다.');
        return;
      }

      // 학생 계정인 경우 기부 진행
      onDonate();
    } catch (error) {
      console.error('사용자 확인 중 오류:', error);
      alert('서비스 이용 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="donation-status-box">
      <h2 className="donation-title">캠페인 기부 현황</h2>

      <div className="donation-row">
        <span>모금 목표</span>
        <span>{goal.toLocaleString()}ETH</span>
      </div>
      <hr className="donation-divider" />

      <div className="donation-row">
        <span>모금 완료까지</span>
        <span>{remaining.toLocaleString()}ETH</span>
      </div>
      <hr className="donation-divider" />

      <div className="donation-row">
        <span>총 참여 인원</span>
        <span>{participants.toLocaleString()}명</span>
      </div>

      <button 
        className={`donation-button ${campaignState !== 'FUNDRAISING' ? 'disabled' : ''}`}
        onClick={handleDonateClick}
        disabled={campaignState !== 'FUNDRAISING'}
        style={{
          opacity: campaignState !== 'FUNDRAISING' ? 0.5 : 1
        }}
      >
        {campaignState === 'FUNDRAISING' ? '기부하기' : '모금 종료'}
      </button>
    </div>
  );
}
