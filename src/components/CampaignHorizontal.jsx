import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CampaignHorizontal.css';
import SERVER_URL from '../hooks/SeverUrl';

const CampaignHorizontal = ({ campaign }) => {
    const navigate = useNavigate();
    //console.log("캠페인 정보", campaign);
    const handleClick = () => {
        navigate(`/donate/campaign/${campaign.id}`);
    };

    const progress = (campaign.currentAmount / campaign.goal) * 100;

    return (
        <div className="campaign-horizontal-card" onClick={handleClick}>
            <div className="campaign-horizontal-image">
                <div className="campaign-horizontal-image-wrapper">
                    <img src={`${SERVER_URL}/images/${campaign.imageUrl}`} alt={campaign.name} />
                </div>
            </div>

            <div className="campaign-horizontal-content">
                <div className="campaign-horizontal-info">
                    <h3 className="campaign-horizontal-title">{campaign.name}</h3>
                    <p className="campaign-horizontal-description">{campaign.description}</p>
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
                            {campaign.currentAmount.toLocaleString()}ETH
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