import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CampaignVertical.css';

const CampaignVertical = ({ campaign }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/donate/campaign/${campaign.id}`);
    };

    const progress = (campaign.currentAmount / campaign.goal) * 100;

    return (
        <div className="campaign-vertical-card" onClick={handleClick}>
            <div className="campaign-vertical-image">
                <img src={campaign.imageUrl} alt={campaign.name} />
            </div>
            <div className="campaign-vertical-content">
                <h3 className="campaign-vertical-title">{campaign.name}</h3>
                <p className="campaign-vertical-org">단체명</p>
                <div className="campaign-vertical-progress-container">
                    <div className="campaign-vertical-progress-bar">
                        <div 
                            className="campaign-vertical-progress-fill" 
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="campaign-vertical-progress-info">
                        <span className="campaign-vertical-current-amount">
                            {campaign.currentAmount.toLocaleString()}원
                        </span>
                        <span className="campaign-vertical-percentage">
                            {Math.round(progress)}%
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CampaignVertical; 