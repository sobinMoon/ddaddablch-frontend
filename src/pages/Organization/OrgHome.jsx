import React, { useEffect, useState } from 'react';
import defaultImage from '../../assets/dog.jpg';
import './OrgHome.css';
import CampaignHorizontal from '../../components/CampaignHorizontal';
import { useNavigate } from 'react-router-dom';
import SERVER_URL from '../../hooks/SeverUrl';

export default function OrgHome() {
    const [organization, setOrganization] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchOrganizationData();
    }, []);

    const fetchOrganizationData = async () => {
        try {
            const accessToken = localStorage.getItem('token');
            if (!accessToken) {
                alert('로그인이 필요합니다.');
                navigate('/login');
                return;
            }

            const response = await fetch(`${SERVER_URL}/api/v1/mypage/org`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.isSuccess) {
                    setOrganization(data.result);
                } else {
                    alert(data.message || '단체 정보를 불러오는데 실패했습니다.');
                }
            } else {
                alert('단체 정보를 불러오는데 실패했습니다.');
            }
        } catch (error) {
            console.error('Error fetching organization data:', error);
            alert('단체 정보를 불러오는 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
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

    if (isLoading) {
        return <div></div>;
    }

    if (!organization) {
        return <div>단체 정보를 불러올 수 없습니다.</div>;
    }

    return (
        <div className="orghome-container">
            <div className="orghome-info">
                <div className="orghome-header">
                    <img 
                        src={`${SERVER_URL}/images/${organization.oprofileImage}` || defaultImage} 
                        alt={organization.onName} 
                        className="orghome-img" 
                    />
                    <div className="orghome-title">
                        <span className="orghome-name">{organization.onName}</span>
                        <button className="orghome-edit-btn" onClick={() => navigate('/organization/profile-edit', {state:{organization}})}>수정</button>
                    </div>
                </div>
                <div className="orghome-description">
                    <p>{organization.odescription || '단체 소개가 없습니다.'}</p>
                </div>
            </div>

            <div className="orghome-campaigns">
                <span className="orghome-campaigns-title">모금 중인 캠페인</span>
                <div className="orghome-campaigns-list">
                    {organization.fundraisingCampaigns.length === 0 ? (
                        <div className="orghome-no-campaign">캠페인이 없습니다</div>
                    ) : (
                        organization.fundraisingCampaigns.map((campaign) => (
                            <CampaignHorizontal 
                                key={campaign.campaignId} 
                                campaign={{
                                    id: campaign.campaignId,
                                    name: campaign.campaignName,
                                    imageUrl: campaign.imageUrl,
                                    description: campaign.description,
                                    goal: campaign.goalAmount,
                                    currentAmount: campaign.currentAmount,
                                    statusFlag: campaign.status
                                }}
                            />
                        ))
                    )}
                </div>
                <div className="orghome-campaigns-button">
                    <button className="orghome-campaigns-button-text"
                        onClick={() => navigate('/organization/create-campaign')}
                    >+</button>
                </div>
            </div>

            <div className="orghome-campaigns">
                <span className="orghome-campaigns-title">사업 진행 중인 캠페인</span>
                <div className="orghome-campaigns-list">
                    {organization.activeCampaigns.length === 0 ? (
                        <div className="orghome-no-campaign">캠페인이 없습니다</div>
                    ) : (
                        organization.activeCampaigns.map((campaign) => (
                            <CampaignHorizontal 
                                key={campaign.campaignId} 
                                campaign={{
                                    id: campaign.campaignId,
                                    name: campaign.campaignName,
                                    imageUrl: campaign.imageUrl,
                                    description: campaign.description,
                                    goal: campaign.goalAmount,
                                    currentAmount: campaign.currentAmount,
                                    statusFlag: campaign.status
                                }}
                            />
                        ))
                    )}
                </div>
            </div>

            <div className="orghome-campaigns">
                <span className="orghome-campaigns-title">종료된 캠페인</span>
                <div className="orghome-campaigns-list">
                    {organization.completedCampaigns.length === 0 ? (
                        <div className="orghome-no-campaign">캠페인이 없습니다</div>
                    ) : (
                        organization.completedCampaigns.map((campaign) => (
                            <CampaignHorizontal 
                                key={campaign.campaignId} 
                                campaign={{
                                    id: campaign.campaignId,
                                    name: campaign.campaignName,
                                    imageUrl: campaign.imageUrl,
                                    description: campaign.description,
                                    goal: campaign.goalAmount,
                                    currentAmount: campaign.currentAmount,
                                    statusFlag: campaign.status
                                }}
                            />
                        ))
                    )}
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
