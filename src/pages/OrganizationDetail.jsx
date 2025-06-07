import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './OrganizationDetail.css';
import defaultImage from '../assets/dog.jpg';
import CampaignHorizontal from '../components/CampaignHorizontal';
import SERVER_URL from '../hooks/SeverUrl';

export default function OrganizationDetail() {
    const { orgId } = useParams();
    const [organization, setOrganization] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchOrganizationData();
    }, [orgId]);

    const fetchOrganizationData = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/api/v1/mypage/org/${orgId}`);
            const data = await response.json();
            console.log('data:', data);
            
            if (data.isSuccess) {
                setOrganization(data.result);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('데이터를 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div></div>;
    if (error) return <div>에러: {error}</div>;
    if (!organization) return <div>단체 정보를 찾을 수 없습니다.</div>;

    return (
        <div className="orgdetail-container">
            <div className="orgdetail-info">
                <div className="orgdetail-header">
                    <img 
                        src={organization.oprofileImage || defaultImage} 
                        alt={organization.onName} 
                        className="orgdetail-img" 
                    />
                    <div className="orgdetail-title">
                        <span className="orgdetail-name">{organization.onName}</span>
                        <button className="orgdetail-subscribe-btn">구독</button>
                    </div>
                </div>
                <div className="orgdetail-description">
                    <p>{organization.odescription || '단체 소개가 없습니다.'}</p>
                </div>
            </div>

            <div className="orgdetail-campaigns">
                <span className="orgdetail-campaigns-title">모금 중인 캠페인</span>
                <div className="orgdetail-campaigns-list">
                    {organization.fundraisingCampaigns.length === 0 ? (
                        <div className="orgdetail-no-campaign">캠페인이 없습니다</div>
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
            </div>

            <div className="orgdetail-campaigns">
                <span className="orgdetail-campaigns-title">사업 진행 중인 캠페인</span>
                <div className="orgdetail-campaigns-list">
                    {organization.activeCampaigns.length === 0 ? (
                        <div className="orgdetail-no-campaign">캠페인이 없습니다</div>
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

            <div className="orgdetail-campaigns">
                <span className="orgdetail-campaigns-title">종료된 캠페인</span>
                <div className="orgdetail-campaigns-list">
                    {organization.completedCampaigns.length === 0 ? (
                        <div className="orgdetail-no-campaign">캠페인이 없습니다</div>
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
        </div>
    );
} 