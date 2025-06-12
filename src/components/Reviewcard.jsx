import React from 'react';
import { useNavigate } from 'react-router-dom';
import defaultImage from '../assets/dog.jpg';
import './Reviewcard.css';

export default function Reviewcard({ campaign }) {
    const navigate = useNavigate();

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const year = String(date.getFullYear()).slice(2); // 'YY'
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}.${month}.${day}`;
    };

    const handleClick = () => {
        navigate(`/donate/campaign/${campaign.id}/news`);
    };

    return (
        <div className="review-card" onClick={handleClick} style={{ cursor: 'pointer' }}>
            <img className='review-img' src={campaign.imageUrl} alt="캠페인 이미지" />
            <p className='review-name'>{campaign.name}</p>
            <p className='review-period'>
                {formatDate(campaign.donateStart)} ~ {formatDate(campaign.donateEnd)}
            </p>
        </div>
    );
}
