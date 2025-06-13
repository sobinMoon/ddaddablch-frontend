import React, { useState, useEffect } from 'react'
import './Home.css'
import CampaignVertical from '../components/CampaignVertical'
import CampaignHorizontal from '../components/CampaignHorizontal'
import defaultImage from '../assets/dog.jpg'
import UrgentCampaignBanner from '../components/UrgentCampaignBanner'
import TotalDonation from '../components/TotalDonation'
import DonationReviews from '../components/DonationReviews'
import SERVER_URL from '../hooks/SeverUrl';

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchHomeCampaign() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${SERVER_URL}/api/v1/campaigns/home`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        // console.log(result);
        
        if (result.isSuccess && result.result) {
          setData(result.result);
        } else {
          throw new Error('데이터 형식이 올바르지 않습니다.');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchHomeCampaign();
  }, []);

  if (loading) return <div></div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div></div>;

  const urgentCampaigns = data.popular || [];
  const newCampaigns = data.latest || [];
  const endingSoonCampaign = data.endingSoon || [];
  
  return (
    <div className="home-wrap">
      <div className="home-left">
        <UrgentCampaignBanner campaigns={urgentCampaigns}/>
        <div className="new-campaigns-section">
          <h2 className="new-campaigns-title">새로 등록된 캠페인이에요</h2>
          <div className="new-campaigns-list">
            {newCampaigns.map((campaign) => (
              <CampaignVertical key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </div>
        <div className="ending-soon-section">
          <h2 className="ending-soon-title">종료가 임박한 캠페인이에요!</h2>
          <div className="ending-soon-list">
            {endingSoonCampaign.map((campaign) => (
              <CampaignHorizontal key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </div>
      </div>

      <div className="home-right">
        <TotalDonation totalDonation={data.totalDonation} />
        <DonationReviews recentUpdates={data.recentUpdates} />
      </div>
    </div>
  )
}
