import React from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ 추가
import defaultImage from '../assets/dog.jpg';
import './Campaigncard.css';

export default function Campaigncard({ campaign, sortOption }) {
    const navigate = useNavigate(); // ✅ 추가

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const year = date.getFullYear(); // 'YYYY'
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}.${month}.${day}`; // 예: 2025.05.04
    };

    const getRemainingTime = endDate => {
        const now = new Date();
        const end = new Date(endDate);
        const diff = end - now;
        if (diff <= 0) return '마감됨';
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        return `${days}일 남음`;
    };

    const renderExtraInfo = () => {
        switch (sortOption) {
            case '인기순':
                return `총 ${campaign.donate_count}명 참여함`;
            case '최신순':
                return `${formatDate(campaign.donate_start)}`;
            case '종료임박순':
                return `${getRemainingTime(campaign.donate_end)}`;
            default:
                return '';
        }
    };

    const handleClick = () => {
        navigate(`/donate/campaign/${campaign.c_id}`); // ✅ 상세 페이지 이동
    };

    return (
        <div className="campaign-card" onClick={handleClick} style={{ cursor: 'pointer' }}>
            <img className='campaign-img' src={defaultImage} alt="캠페인 이미지" />
            <p className='campaign-name'>{campaign.c_name}</p>
            <p className='campaign-info'>{renderExtraInfo()}</p>
        </div>
    );
}
