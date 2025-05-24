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
        console.log(result);
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchHomeCampaign();
  }, []);


  const urgentCampaigns = data ? data.popular : [];
  const newCampaigns = data ? data.latest : [];
  const endingSoonCampaign = data ? data.endingSoon : [];
  
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
        <TotalDonation />
        <DonationReviews />
      </div>
    </div>
  )
}
