import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CampaignHorizontal.css';

const CampaignHorizontal = ({ campaign }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/donate/campaign/${campaign.c_id}`);
    };

    const progress = (campaign.c_current_amount / campaign.c_goal) * 100;

    return (
        <div className="campaign-horizontal-card" onClick={handleClick}>
            <div className="campaign-horizontal-image">
                <img src={campaign.c_image_url} alt={campaign.c_name} />
            </div>
            <div className="campaign-horizontal-content">
                <div className="campaign-horizontal-info">
                    <h3 className="campaign-horizontal-title">{campaign.c_name}</h3>
                    <p className="campaign-horizontal-org">단체명</p>
                    <p className="campaign-horizontal-description">{campaign.c_description}</p>
                </div>
                <div className="campaign-horizontal-progress-container">
                    <div className="campaign-horizontal-progress-bar">
                        <div 
                            className="campaign-horizontal-progress-fill" 
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="campaign-horizontal-progress-info">
                        <span className="campaign-horizontal-current-amount">
                            {campaign.c_current_amount.toLocaleString()}원
                        </span>
                        <span className="campaign-horizontal-percentage">
                            {Math.round(progress)}%
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CampaignHorizontal; 