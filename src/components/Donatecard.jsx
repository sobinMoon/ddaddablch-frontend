import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Donatecard.css';
import { AuthContext } from '../hooks/AuthContext';

export default function Donatecard({ goal, remaining, participants, onDonate}) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleDonateClick = () => {
    // 토큰 확인
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('학생계정 로그인이 필요한 서비스입니다.');
      navigate('/login');
      return;
    }

    // Context의 user 정보 확인
    if (!user || user.type !== 'student') {
      alert('학생계정 로그인이 필요한 서비스입니다.');
      navigate('/login');
      return;
    }

    // 학생 계정인 경우 기존 onDonate 함수 실행
    onDonate();
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

      <button className="donation-button" onClick={handleDonateClick}>기부하기</button>
    </div>
  );
}
