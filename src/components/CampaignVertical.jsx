import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CampaignVertical.css';

const CampaignVertical = ({ campaign }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/donate/campaign/${campaign.c_id}`);
    };

    const progress = (campaign.c_current_amount / campaign.c_goal) * 100;

    return (
        <div className="campaign-vertical-card" onClick={handleClick}>
            <div className="campaign-vertical-image">
                <img src={campaign.c_image_url} alt={campaign.c_name} />
            </div>
            <div className="campaign-vertical-content">
                <h3 className="campaign-vertical-title">{campaign.c_name}</h3>
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
                            {campaign.c_current_amount.toLocaleString()}원
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