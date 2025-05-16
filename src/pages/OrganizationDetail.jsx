import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './OrganizationDetail.css';
import defaultImage from '../assets/dog.jpg';
import CampaignHorizontal from '../components/CampaignHorizontal';

export default function OrganizationDetail() {
    const { orgId } = useParams();

    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);

    // TODO: Replace with actual data fetching from backend
    const organization = {
        id: orgId,
        name: "사단 법인 위액트",
        description: "동물구조단체 사단법인 위액트는 기획재정부가 승인한 지정 기부금 단체로 신뢰성과 투명성을 기반으로 위기에 놓인 동물을 위하여 활동하며 공익 법인의 의무를 다합니다. 위액트는 봉사와 재능기부, 최소한의 유급 인력으로 운영되어 위기 동물 구조와 구조 동물의 식주, 치료 및 재활에 주력하여 후원금을 운용합니다.",
        image: defaultImage,
        activeCampaigns: [
            {
                "c_id": 1,
                "o_id": 4478,
                "c_name": "캠페인 1",
                "c_image_url": defaultImage,
                "c_category": "사회",
                "c_description": "이것은 캠페인 1에 대한 설명입니다.",
                "c_goal": 10000,
                "c_current_amount": 2000,
                "donate_count": 2,
                "donate_start": "2025-03-06T12:14:18",
                "donate_end": "2025-04-10T12:14:18",
                "business_start": "2025-04-20T12:14:18",
                "business_end": "2025-07-19T12:14:18",
                "c_status_flag": "ACTIVE"
              },
        ],
        completedCampaigns: [
            {
                "c_id": 1,
                "o_id": 4478,
                "c_name": "캠페인 1",
                "c_image_url": defaultImage,
                "c_category": "사회",
                "c_description": "이것은 캠페인 1에 대한 설명입니다.",
                "c_goal": 10000,   
                "c_current_amount": 2000,
                "donate_count": 2,
                "donate_start": "2025-03-06T12:14:18",
                "donate_end": "2025-04-10T12:14:18",
                "business_start": "2025-04-20T12:14:18",
                "business_end": "2025-07-19T12:14:18",
                "c_status_flag": "ENDED"
            }
        ]
    };

    return (
        <div className="organization-detail">
            <div className="orgdetail-info">
                <div className="orgdetail-header">
                    <img src={organization.image} alt={organization.name} className="orgdetail-img" />
                    <div className="orgdetail-title">
                        <span className="orgdetail-name">{organization.name}</span>
                        <button className="orgdetail-subscribe-btn">구독</button>
                    </div>
                </div>
                <div className="orgdetail-description">
                    <p>{organization.description}</p>
                </div>
            </div>

            <div className="orgdetail-active-campaigns">
                <span className="orgdetail-active-campaigns-title">진행 중인 캠페인</span>
                <div className="orgdetail-campaigns-list">
                    {organization.activeCampaigns.map(campaign => (
                        <CampaignHorizontal campaign={campaign} />
                    ))}
                </div>
            </div>

            <div className="orgdetail-completed-campaigns">
                <span className="orgdetail-completed-campaigns-title">종료된 캠페인</span>
                <div className="orgdetail-campaigns-list">
                    {organization.completedCampaigns.map(campaign => (
                        <CampaignHorizontal campaign={campaign} />
                    ))}
                </div>
            </div>

        </div>
    );
} 