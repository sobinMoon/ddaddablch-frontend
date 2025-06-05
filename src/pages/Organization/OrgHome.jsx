import React from 'react';
import defaultImage from '../../assets/dog.jpg';
import './OrgHome.css';
import CampaignHorizontal from '../../components/CampaignHorizontal';
import { useNavigate } from 'react-router-dom';
import SERVER_URL from '../../hooks/SeverUrl';

export default function OrgHome() {
    const navigate = useNavigate();
    const organization = {
        id: 1,
        name: "사단 법인 위액트",
        description: "동물구조단체 사단법인 위액트는 기획재정부가 승인한 지정 기부금 단체로 신뢰성과 투명성을 기반으로 위기에 놓인 동물을 위하여 활동하며 공익 법인의 의무를 다합니다. 위액트는 봉사와 재능기부, 최소한의 유급 인력으로 운영되어 위기 동물 구조와 구조 동물의 식주, 치료 및 재활에 주력하여 후원금을 운용합니다.",
        image: defaultImage,
        activeCampaigns: [
            {
                "id": 1,
                "name": "캠페인 1",
                "imageUrl": defaultImage,
                "category": "사회",
                "description": "이것은 캠페인 1에 대한 설명입니다.",
                "goal": 10000,
                "currentAmount": 2000,
                "donateCount": 2,
                "donateStart": "2025-03-06T12:14:18",
                "donateEnd": "2025-04-10T12:14:18",
                "businessStart": "2025-04-20T12:14:18",
                "businessEnd": "2025-07-19T12:14:18",
                "statusFlag": "ACTIVE"
              }, {
                "id": 2,
                "name": "캠페인 2",
                "imageUrl": defaultImage,
                "category": "사회",
                "description": "이것은 캠페인 2에 대한 설명입니다.",
                "goal": 10000,
                "currentAmount": 2000,
                "donateCount": 2,
                "donateStart": "2025-03-06T12:14:18",
                "donateEnd": "2025-04-10T12:14:18",
                "businessStart": "2025-04-20T12:14:18",
                "businessEnd": "2025-07-19T12:14:18",
                "statusFlag": "ACTIVE"
              }
        ],
        completedCampaigns: [
            {
                "id": 1,
                "name": "캠페인 1",
                "imageUrl": defaultImage,
                "category": "사회",
                "description": "이것은 캠페인 1에 대한 설명입니다.",
                "goal": 10000,   
                "currentAmount": 2000,
                "donateCount": 2,
                "donateStart": "2025-03-06T12:14:18",
                "donateEnd": "2025-04-10T12:14:18",
                "businessStart": "2025-04-20T12:14:18",
                "businessEnd": "2025-07-19T12:14:18",
                "statusFlag": "ENDED"
            }
        ]
    };

    const handleLogout = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            
            if (!refreshToken) {
                alert('로그인 정보가 없습니다.');
                return;
            }

            const response = await fetch(`${SERVER_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken })
            });

            const data = await response.json();

            if (response.ok) {
                // 로컬 스토리지의 토큰들 제거
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
            
                navigate('/login');
            } else {
                alert(data.message || '로그아웃 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('로그아웃 중 오류:', error);
            alert('로그아웃 중 오류가 발생했습니다.');
        }
    };
    return (
        <div className="orghome-container">
            <div className="orghome-info">
                <div className="orghome-header">
                    <img src={organization.image} alt={organization.name} className="orghome-img" />
                    <div className="orghome-title">
                        <span className="orghome-name">{organization.name}</span>
                        <button className="orghome-edit-btn">수정</button>
                    </div>
                </div>
                <div className="orghome-description">
                    <p>{organization.description}</p>
                </div>
            </div>

            <div className="orghome-campaigns">
                <span className="orghome-campaigns-title">진행중인 캠페인</span>
                <div className="orghome-campaigns-list">
                    {organization.activeCampaigns.map((campaign) => (
                        <CampaignHorizontal key={campaign.id} campaign={campaign} />
                    ))}
                </div>
                <div className="orghome-campaigns-button">
                    <button className="orghome-campaigns-button-text"
                        onClick={() => navigate('/organization/create-campaign')}
                    >+</button>
                </div>
            </div>

            <div className="orghome-campaigns">
                <span className="orghome-campaigns-title">종료된 캠페인</span>
                <div className="orghome-campaigns-list">
                    {organization.completedCampaigns.map((campaign) => (
                        <CampaignHorizontal key={campaign.id} campaign={campaign} />
                    ))}
                </div>
            </div>
            <div className="orghome-footer">
                <button className="logout-btn" onClick={handleLogout}>
                    로그아웃
                </button>
            </div>
        </div>
    );
}
