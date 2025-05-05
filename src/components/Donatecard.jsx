import React from 'react';
import './Donatecard.css';

export default function Donatecard({ goal, remaining, participants, onDonate }) {
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

    <button className="donation-button" onClick={onDonate}>기부하기</button>
</div>
  )
}
