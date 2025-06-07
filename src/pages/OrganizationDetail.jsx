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
    const [studentId, setStudentId] = useState(null);
    const [subscribing, setSubscribing] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [statusLoading, setStatusLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchOrganizationData();
        fetchStudentId();
    }, [orgId]);

    // 구독 상태 확인
    useEffect(() => {
        const fetchSubscriptionStatus = async (studentId, orgId) => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(
                    `${SERVER_URL}/api/organizations/subscriptions/status/${studentId}/${orgId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (res.ok) {
                    const data = await res.json();
                    setIsSubscribed(data.isSubscribed);
                }
            } catch (e) {
                // 에러 처리
            }
            setStatusLoading(false);
        };
        if (studentId && orgId) {
            setStatusLoading(true);
            fetchSubscriptionStatus(studentId, orgId);
        }
    }, [studentId, orgId]);

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

    const fetchStudentId = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${SERVER_URL}/auth/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();

                if (data.role === 'ROLE_STUDENT') {
                    setStudentId(data.id);
                }
                
            }
        } catch (e) {
            // 인증 실패 등 처리
        }
    };

    const handleSubscribe = async () => {
        if (!studentId) {
            alert('학생 로그인이 필요한 서비스입니다.');
            return;
        }
        setSubscribing(true);
        try {
            const token = localStorage.getItem('token');
            if (isSubscribed) {
                // 구독 취소
                const res = await fetch(
                    `${SERVER_URL}/api/organizations/subscriptions/unsubscribe/${studentId}/${orgId}`,
                    {
                        method: 'DELETE',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (res.ok) {
                    alert('구독이 취소되었습니다.');
                    setIsSubscribed(false);
                } else {
                    alert('구독 취소에 실패했습니다.');
                }
            } else {
                // 구독
                const res = await fetch(
                    `${SERVER_URL}/api/organizations/subscriptions/subscribe/${studentId}`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            organizationId: orgId,
                            notificationEnabled: true,
                        }),
                    }
                );
                if (res.ok) {
                    alert('구독이 완료되었습니다!');
                    setIsSubscribed(true);
                } else {
                    alert('구독에 실패했습니다.');
                }
            }
        } catch (e) {
            alert('처리 중 오류가 발생했습니다.');
        }
        setSubscribing(false);
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
                        <button 
                            className="orgdetail-subscribe-btn" 
                            onClick={handleSubscribe}
                            disabled={subscribing}
                        >
                            {isSubscribed ? '구독중' : '구독'}
                        </button>
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