import React from 'react'
import './Home.css'
import CampaignVertical from '../components/CampaignVertical'
import CampaignHorizontal from '../components/CampaignHorizontal'
import defaultImage from '../assets/dog.jpg'
import UrgentCampaignBanner from '../components/UrgentCampaignBanner'
import TotalDonation from '../components/TotalDonation'
import DonationReviews from '../components/DonationReviews'

export default function Home() {
  // 긴급 캠페인 데이터
  const urgentCampaigns = [
    {
      c_id: 1,
      c_name: "마을 어르신들의 따뜻한 겨울나기",
      c_image_url: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?q=80&w=2070&auto=format&fit=crop",
      c_description: "추운 겨울, 마을 어르신들을 위한 난방비 지원이 시급합니다.",
      c_goal_amount: 10000000,
      c_current_amount: 3500000,
      c_start_date: "2024-01-15",
      c_end_date: "2024-02-15",
      c_status: "진행중",
      c_is_urgent: true
    },
    {
      c_id: 2,
      c_name: "지진 피해 지역 긴급 구호 캠페인",
      c_image_url: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=2070&auto=format&fit=crop",
      c_description: "지진으로 인한 피해 복구와 이재민 지원을 위한 긴급 모금",
      c_goal_amount: 50000000,
      c_current_amount: 12500000,
      c_start_date: "2024-01-20",
      c_end_date: "2024-02-20",
      c_status: "진행중",
      c_is_urgent: true
    },
    {
      c_id: 3,
      c_name: "아동 긴급 의료비 지원 캠페인",
      c_image_url: "https://images.unsplash.com/photo-1708687045030-26702e62fc65?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      c_description: "중증 질환을 앓고 있는 아이들을 위한 의료비 지원",
      c_goal_amount: 30000000,
      c_current_amount: 8000000,
      c_start_date: "2024-01-25",
      c_end_date: "2024-02-25",
      c_status: "진행중",
      c_is_urgent: true
    }
  ];

  const newCampaigns = [
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
    },
    {
      "c_id": 2,
      "o_id": 4478,
      "c_name": "캠페인 2",
      "c_image_url": defaultImage,
      "c_category": "사회",
      "c_description": "이것은 캠페인 2에 대한 설명입니다.",
      "c_goal": 15000,
      "c_current_amount": 5000,
      "donate_count": 5,
      "donate_start": "2025-03-06T12:14:18",
      "donate_end": "2025-04-10T12:14:18",
      "business_start": "2025-04-20T12:14:18",
      "business_end": "2025-07-19T12:14:18",
      "c_status_flag": "ACTIVE"
    },
    {
      "c_id": 3,
      "o_id": 4478,
      "c_name": "캠페인 3",
      "c_image_url": defaultImage,
      "c_category": "사회",
      "c_description": "이것은 캠페인 3에 대한 설명입니다.",
      "c_goal": 20000,
      "c_current_amount": 10000,
      "donate_count": 8,
      "donate_start": "2025-03-06T12:14:18",
      "donate_end": "2025-04-10T12:14:18",
      "business_start": "2025-04-20T12:14:18",
      "business_end": "2025-07-19T12:14:18",
      "c_status_flag": "ACTIVE"
    }
  ];

  const endingSoonCampaign = {
    "c_id": 4,
    "o_id": 4478,
    "c_name": "종료 임박 캠페인",
    "c_image_url": defaultImage,
    "c_category": "사회",
    "c_description": "이것은 종료 임박 캠페인에 대한 설명입니다.이것은 종료 임박 캠페인에 대한 설명입니다.이것은 종료 임박 캠페인에 대한 설명입니다.이것은 종료 임박 캠페인에 대한 설명입니다.이것은 종료 임박 캠페인에 대한 설명입니다.이것은 종료 임박 캠페인에 대한 설명입니다.이것은 종료 임박 캠페인에 대한 설명입니다.이것은 종료 임박 캠페인에 대한 설명입니다.이것은 종료 임박 캠페인에 대한 설명입니다.이것은 종료 임박 캠페인에 대한 설명입니다.이것은 종료 임박 캠페인에 대한 설명입니다.이것은 종료 임박 캠페인에 대한 설명입니다.",
    "c_goal": 30000,
    "c_current_amount": 25000,
    "donate_count": 15,
    "donate_start": "2025-03-06T12:14:18",
    "donate_end": "2025-04-10T12:14:18",
    "business_start": "2025-04-20T12:14:18",
    "business_end": "2025-07-19T12:14:18",
    "c_status_flag": "ACTIVE"
  };

  return (
    <div className="home-wrap">
      <div className="home-left">
        <UrgentCampaignBanner campaigns={urgentCampaigns}/>
        <div className="new-campaigns-section">
          <h2 className="new-campaigns-title">새로 등록된 캠페인이에요</h2>
          <div className="new-campaigns-list">
            {newCampaigns.map((campaign) => (
              <CampaignVertical key={campaign.c_id} campaign={campaign} />
            ))}
          </div>
        </div>
        <div className="ending-soon-section">
          <h2 className="ending-soon-title">종료가 임박한 캠페인이에요!</h2>
          <div className="ending-soon-list">
            <CampaignHorizontal campaign={endingSoonCampaign} />
          </div>
        </div>
      </div>
      <div className="home-right">
        <TotalDonation />
        <DonationReviews />
      </div>
    </div>
  )
}
